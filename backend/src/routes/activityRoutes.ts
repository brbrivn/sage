import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import ActivityLog from '../models/ActivityLog';
import Meeting from '../models/Meeting';

const router = Router();

// Get all logs for the current user
router.get('/', authenticateJWT, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const logs = await ActivityLog.findAll({
            where: { userId },
            include: [{ model: Meeting, attributes: ['title'] }],
            order: [['createdAt', 'DESC']],
            limit: 50
        });
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching activity logs' });
    }
});

import { triggerNotification } from '../services/notificationService';
import VIPAlert from '../models/VIPAlert';

// Seed a mock log for testing UI and NOTIFICATIONS
router.post('/mock', authenticateJWT, async (req: any, res) => {
    try {
        const userId = req.user.id;

        // Find any active meeting for this user to make the mock alert look real
        const meeting = await Meeting.findOne({ where: { userId } });
        if (!meeting) {
            return res.status(400).json({ message: 'No meetings found. Create one first.' });
        }

        // Create or find a mock alert
        let alert = await VIPAlert.findOne({ where: { meetingId: meeting.id, userId } });
        if (!alert) {
            alert = await VIPAlert.create({
                userId,
                meetingId: meeting.id,
                vipName: req.body.vipName || 'Mock VIP',
                vipEmail: 'mock@example.com',
                status: 'active',
                notificationMethod: 'desktop'
            });
        } else {
            // Reset status to active if it was triggered
            alert.status = 'active';
            await alert.save();
        }

        // Actually trigger the full notification flow!
        await triggerNotification(alert, meeting);

        res.json({ message: 'Mock notification triggered', alert });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating mock log' });
    }
});

export default router;
