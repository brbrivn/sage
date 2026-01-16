import { Router } from 'express';
import Meeting from '../models/Meeting';
import VIPAlert from '../models/VIPAlert';
import User from '../models/User';
import { sendCallAlert } from '../services/twilioService';

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
            // Find our internal meeting record that matches this Zoom meeting ID
            // NOTE: multiple users might track the same meeting, logic here needs to be robust
            // For MVP, we find ALL meetings with this ID
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
                    // Simple name check for MVP (email is harder as Zoom doesn't always send email for guests)
                    const nameMatch = participant.user_name.toLowerCase().includes(alert.vipName.toLowerCase());
                    const emailMatch = participant.email && participant.email === alert.vipEmail;

                    if (nameMatch || emailMatch) {
                        // TRIGGER ALERT!
                        const user = await User.findByPk(alert.userId);
                        if (user && user.phoneNumber) {
                            console.log(`Triggering alert for user ${user.email} because ${alert.vipName} joined!`);

                            await sendCallAlert(
                                user.phoneNumber,
                                `${alert.vipName} has joined your meeting: ${meeting.title}. Press 1 to join.`
                            );

                            // Mark triggered
                            alert.status = 'triggered';
                            await alert.save();
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Error processing webhook', error);
        }
    }

    res.status(200).send('OK');
});

export default router;
