import express from 'express';
import passport from 'passport';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

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
    (req, res) => {
        const user = req.user as any;

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'dev_secret',
            { expiresIn: '7d' }
        );

        const state = req.query.state as string;

        if (state === 'desktop') {
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
        // Here we would typically link the Zoom account to the user
        // For MVP, we'll just acknowledge success
        // In a real app, we need to pass a state parameter or JWT in header to link to existing user

        const data = req.user as any;

        // Return JSON with tokens
        res.json({
            message: 'Zoom connected successfully',
            zoomData: data
        });
    }
);

export default router;
