import express from 'express';
import passport from 'passport';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import ConnectedAccount from '../models/ConnectedAccount';
import User from '../models/User';

const router = Router();

// Initiate Google Auth
router.get(
    '/google',
    (req, res, next) => {
        const state = req.query.state as string;
        passport.authenticate('google', {
            scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.readonly'],
            state: state
        })(req, res, next);
    }
);

// Google Auth Callback
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    async (req: any, res) => {
        const profile = req.user as any;

        const state = req.query.state as string;
        // State might be 'web' or 'web:userId'
        const [mode, userIdStr] = (state || '').split(':');

        // If we have a userId in state, it means we are linking
        if (userIdStr) {
            const userId = parseInt(userIdStr);
            await ConnectedAccount.findOrCreate({
                where: { userId, email: profile.email, provider: 'google' },
                defaults: {
                    userId,
                    email: profile.email,
                    provider: 'google',
                    accessToken: profile.accessToken,
                    refreshToken: profile.refreshToken,
                }
            });
            // Redirect back to settings
            return res.redirect('http://localhost:5173/settings?linked=true');
        }

        // Standard Login logic...
        let user = await User.findOne({ where: { email: profile.email } });
        if (!user) {
            user = await User.create({ email: profile.email });
        }

        // Also save this as a connected account if it's the first time
        await ConnectedAccount.findOrCreate({
            where: { userId: user.id, email: user.email, provider: 'google' },
            defaults: {
                userId: user.id,
                email: user.email,
                provider: 'google',
                accessToken: profile.accessToken || '',
                refreshToken: profile.refreshToken || '',
            }
        });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'dev_secret',
            { expiresIn: '7d' }
        );

        if (mode === 'desktop') {
            res.redirect(`sage-app://auth/callback?token=${token}`);
        } else {
            res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
        }
    }
);

// Zoom Auth
router.get(
    '/zoom',
    passport.authenticate('zoom') // scope can be added if needed, e.g., ['meeting:read']
);

router.get(
    '/zoom/callback',
    passport.authenticate('zoom', { session: false, failureRedirect: '/login' }),
    async (req, res) => {
        const data = req.user as any;
        res.json({
            message: 'Zoom connected successfully',
            zoomData: data
        });
    }
);

// Get linked accounts
router.get('/accounts', authenticateJWT, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const accounts = await ConnectedAccount.findAll({
            where: { userId }
        });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching accounts' });
    }
});

export default router;
