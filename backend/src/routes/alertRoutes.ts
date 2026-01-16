import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import VIPAlert from '../models/VIPAlert';

const router = Router();

// Get active alerts
router.get('/active', authenticateJWT, async (req: any, res) => {
    try {
        const alerts = await VIPAlert.findAll({
            where: { userId: req.user.id, status: 'active' }
        });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});

// Create new alert
router.post('/', authenticateJWT, async (req: any, res) => {
    try {
        const { meetingId, vipName, vipEmail } = req.body;
        const alert = await VIPAlert.create({
            userId: req.user.id,
            meetingId,
            vipName,
            vipEmail,
            status: 'active'
        });
        res.json(alert);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create alert' });
    }
});

// Cancel alert
router.delete('/:id', authenticateJWT, async (req: any, res) => {
    try {
        await VIPAlert.update(
            { status: 'cancelled' },
            { where: { id: req.params.id, userId: req.user.id } }
        );
        res.json({ message: 'Alert cancelled' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel alert' });
    }
});

export default router;
