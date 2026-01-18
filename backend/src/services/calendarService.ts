import { google } from 'googleapis';
import User from '../models/User';
import Meeting from '../models/Meeting';
import ConnectedAccount from '../models/ConnectedAccount';

export const syncCalendar = async (userId: number) => {
    try {
        const accounts = await ConnectedAccount.findAll({
            where: { userId, provider: 'google', isActive: true }
        });

        if (accounts.length === 0) {
            console.log(`[Calendar] No connected Google accounts found for user ${userId}`);
            return 0;
        }

        let totalEvents = 0;

        for (const account of accounts) {
            console.log(`[Calendar] Syncing for account: ${account.email}`);

            const auth = new google.auth.OAuth2();
            auth.setCredentials({
                access_token: account.accessToken,
                refresh_token: account.refreshToken
            });

            const calendar = google.calendar({ version: 'v3', auth });

            // Fetch today's events
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            try {
                const response = await calendar.events.list({
                    calendarId: 'primary',
                    timeMin: now.toISOString(),
                    timeMax: endOfDay.toISOString(),
                    singleEvents: true,
                    orderBy: 'startTime',
                });

                const events = response.data.items || [];
                totalEvents += events.length;

                for (const event of events) {
                    const meetingLink = extractMeetingLink(event);

                    if (meetingLink) {
                        const platform = detectPlatform(meetingLink);
                        const platformId = extractPlatformId(meetingLink, platform);

                        await Meeting.upsert({
                            userId,
                            accountId: account.id,
                            title: event.summary || 'Untitled Meeting',
                            startTime: new Date(event.start?.dateTime || event.start?.date || Date.now()),
                            endTime: new Date(event.end?.dateTime || event.end?.date || Date.now()),
                            platform,
                            meetingUrl: meetingLink,
                            meetingId: platformId || 'unknown',
                            googleEventId: event.id || 'unknown',
                            participants: event.attendees?.map(a => a.email).filter(Boolean) as string[],
                        });
                    }
                }
            } catch (err) {
                console.error(`[Calendar] Error syncing account ${account.email}:`, err);
            }
        }

        return totalEvents;

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

const extractPlatformId = (url: string, platform: 'zoom' | 'meet' | 'teams' | 'other'): string | null => {
    try {
        if (platform === 'zoom') {
            // Extracts 123456789 from .../j/123456789...
            const match = url.match(/\/j\/(\d+)/);
            return match ? match[1] : null;
        }
        // Add other platforms if needed (e.g. Teams, Meet codes)
        return null;
    } catch (e) {
        return null;
    }
}
