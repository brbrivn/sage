import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import Meeting from '../models/Meeting';
import VIPAlert from '../models/VIPAlert';
import { syncCalendar } from '../services/calendarService';

const router = Router();

// Get today's meetings
router.get('/today', authenticateJWT, async (req: any, res) => {
    try {
        const userId = req.user.id;

        // Trigger a sync first (MVP approach - in prod, use background job or webhook)
        await syncCalendar(userId);

        const meetings = await Meeting.findAll({
            where: { userId },
            include: [{
                model: VIPAlert,
                required: false,
                where: { status: 'active' }
            }],
            order: [['startTime', 'ASC']]
        });

        res.json(meetings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching meetings' });
    }
});

// Delete a meeting
router.delete('/:id', authenticateJWT, async (req: any, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const meeting = await Meeting.findOne({ where: { id, userId } });
        if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

        await meeting.destroy();
        res.json({ message: 'Meeting removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting meeting' });
    }
});

export default router;
