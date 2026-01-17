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

export default router;
