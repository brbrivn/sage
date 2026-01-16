import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || 'mock_client_id',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock_client_secret',
            callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(new Error('No email found from Google provider'));
                }

                // Find or create user
                const [user] = await User.findOrCreate({
                    where: { email },
                    defaults: {
                        email,
                        // In a real app, we might store the googleToken encrypted
                        googleToken: accessToken,
                        lastLogin: new Date(),
                    },
                });

                // If user existed, update their last login and token
                if (user) {
                    user.lastLogin = new Date();
                    user.googleToken = accessToken;
                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error as Error);
            }
        }
    )
)


import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || 'dev_secret',
        },
        async (payload, done) => {
            try {
                const user = await User.findByPk(payload.id);
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

// Zoom OAuth Strategy
passport.use(
    'zoom',
    new OAuth2Strategy(
        {
            authorizationURL: 'https://zoom.us/oauth/authorize',
            tokenURL: 'https://zoom.us/oauth/token',
            clientID: process.env.ZOOM_CLIENT_ID || 'mock_zoom_id',
            clientSecret: process.env.ZOOM_CLIENT_SECRET || 'mock_zoom_secret',
            callbackURL: '/api/auth/zoom/callback',
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
            try {
                // In a real flow, we would associate this Zoom token with the CURRENTLY LOGGED IN user
                // However, Passport Strategies often handle "Login" or "Connect".
                // Since user must be logged in to connect Zoom, we might handle this differently in the route
                // For now, let's just return the tokens and let the route handle linking
                return done(null, { accessToken, refreshToken, profile });
            } catch (error) {
                return done(error as Error);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
