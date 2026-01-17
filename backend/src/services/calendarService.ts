import { google } from 'googleapis';
import User from '../models/User';
import Meeting from '../models/Meeting';

export const syncCalendar = async (userId: number) => {
    try {
        const user = await User.findByPk(userId);
        if (!user || !user.googleToken) {
            throw new Error('User not found or not connected to Google');
        }

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: user.googleToken });

        const calendar = google.calendar({ version: 'v3', auth });

        // Fetch today's events
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: now.toISOString(),
            timeMax: endOfDay.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        console.log(`[Calendar] Found ${response.data.items?.length || 0} events from Google.`);
        const events = response.data.items || [];

        for (const event of events) {
            // Basic logic to detect if it's a meeting (has a link)
            // In MVP, we just look for common patterns in location or description
            const meetingLink = extractMeetingLink(event);

            if (meetingLink) {
                // Save or update meeting
                await Meeting.findOrCreate({
                    where: {
                        userId,
                        meetingId: event.id || 'unknown'
                    },
                    defaults: {
                        userId,
                        title: event.summary || 'Untitled Meeting',
                        startTime: new Date(event.start?.dateTime || event.start?.date || Date.now()),
                        endTime: new Date(event.end?.dateTime || event.end?.date || Date.now()),
                        platform: detectPlatform(meetingLink),
                        meetingUrl: meetingLink,
                        meetingId: event.id || 'unknown',
                        participants: event.attendees?.map(a => a.email).filter(Boolean) as string[],
                    }
                });
            }
        }

        return events.length;

    } catch (error) {
        console.error('Error syncing calendar:', error);
        throw error;
    }
};

const extractMeetingLink = (event: any): string | null => {
    // Check conferenceData, location, description for links
    // 1. Google Meet often has conferenceData
    if (event.conferenceData?.entryPoints) {
        for (const point of event.conferenceData.entryPoints) {
            if (point.entryPointType === 'video') return point.uri;
        }
    }

    const textToSearch = (event.location || '') + ' ' + (event.description || '');
    const zoomMatch = textToSearch.match(/https:\/\/[a-z0-9-]+\.zoom\.us\/j\/[0-9]+/);
    if (zoomMatch) return zoomMatch[0];

    return null;
}

const detectPlatform = (url: string): 'zoom' | 'meet' | 'teams' | 'other' => {
    if (url.includes('zoom.us')) return 'zoom';
    if (url.includes('meet.google.com')) return 'meet';
    if (url.includes('teams.microsoft.com')) return 'teams';
    return 'other';
}
