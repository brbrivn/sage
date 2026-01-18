import { Router } from 'express';
import Meeting from '../models/Meeting';
import VIPAlert from '../models/VIPAlert';
import User from '../models/User';
import { triggerNotification } from '../services/notificationService';

const router = Router();

router.post('/zoom', async (req, res) => {
    // Zoom requires validation on first request
    if (req.body.event === 'endpoint.url_validation') {
        const hash = require('crypto')
            .createHmac('sha256', process.env.ZOOM_VERIFICATION_TOKEN || '')
            .update(req.body.payload.plainToken)
            .digest('hex');

        return res.json({
            plainToken: req.body.payload.plainToken,
            encryptedToken: hash
        });
    }

    // Handle Participant Join Event
    if (req.body.event === 'meeting.participant_joined') {
        const payload = req.body.payload.object;
        const meetingId = payload.id; // Zoom Meeting ID
        const participant = payload.participant;

        console.log(`Participant ${participant.user_name} joined meeting ${meetingId}`);

        try {
            // Find our internal meeting record(s) that match this Zoom meeting ID
            const meetings = await Meeting.findAll({
                where: { meetingId: meetingId.toString() }
            });

            for (const meeting of meetings) {
                // Find active alerts for this meeting
                const alerts = await VIPAlert.findAll({
                    where: {
                        meetingId: meeting.id,
                        status: 'active'
                    }
                });

                for (const alert of alerts) {
                    // Check if participant matches VIP
                    const nameMatch = participant.user_name.toLowerCase().includes(alert.vipName.toLowerCase());
                    const emailMatch = participant.email && participant.email === alert.vipEmail;

                    if (nameMatch || emailMatch) {
                        // TRIGGER ALERT!
                        await triggerNotification(alert, meeting);
                    }
                }
            }

        } catch (error) {
            console.error('Error processing webhook', error);
        }
    }

    res.status(200).send('OK');
});

// Dev-only simulation endpoint
router.post('/simulate', async (req, res) => {
    if (process.env.NODE_ENV === 'production') return res.status(403).send('Dev only');

    const { meetingId, participantName, participantEmail } = req.body;
    console.log(`[Simulate] Webhook for Meeting ${meetingId}, Participant: ${participantName}`);

    try {
        let meetings = await Meeting.findAll({
            where: { meetingId: meetingId.toString() }
        });

        if (meetings.length === 0) {
            // Fallback: try finding by googleEventId or internal ID
            meetings = await Meeting.findAll({
                where: {
                    [process.env.NODE_ENV === 'test' ? 'id' : 'googleEventId']: meetingId.toString() // Fallback logic
                }
            });

            // If still empty, try just checking if the passed ID matches a meeting ID loosely
            if (meetings.length === 0) {
                meetings = await Meeting.findAll({
                    where: { id: meetingId }
                });
            }
        }

        if (meetings.length === 0) {
            return res.json({ status: 'no_meeting_found', message: `No meeting found with Platform ID ${meetingId}` });
        }

        const results = [];

        for (const meeting of meetings) {
            const alerts = await VIPAlert.findAll({
                where: { meetingId: meeting.id, status: 'active' }
            });

            for (const alert of alerts) {
                const nameMatch = participantName.toLowerCase().includes(alert.vipName.toLowerCase());
                const emailMatch = participantEmail && participantEmail === alert.vipEmail;

                if (nameMatch || emailMatch) {
                    await triggerNotification(alert, meeting);
                    results.push({ alertId: alert.id, vip: alert.vipName, status: 'triggered' });
                }
            }
        }

        res.json({ status: 'success', matches: results });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Simulation failed' });
    }
});

export default router;
