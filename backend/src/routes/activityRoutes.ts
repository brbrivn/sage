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

// Seed a mock log for testing UI if needed
router.post('/mock', authenticateJWT, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const log = await ActivityLog.create({
            userId,
            meetingId: req.body.meetingId || 1,
            vipName: req.body.vipName || 'Mock User',
            type: req.body.type || 'desktop',
            status: 'sent',
            message: `${req.body.vipName || 'Mock User'} joined the meeting.`
        });
        res.json(log);
    } catch (error) {
        res.status(500).json({ message: 'Error creating mock log' });
    }
});

export default router;
