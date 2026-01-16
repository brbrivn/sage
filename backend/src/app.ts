import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

import authRoutes from './routes/authRoutes';
import meetingRoutes from './routes/meetingRoutes';
import alertRoutes from './routes/alertRoutes';
import webhookRoutes from './routes/webhookRoutes';
import './config/passport';

app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/webhooks', webhookRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'Sage Backend', timestamp: new Date().toISOString() });
});

export default app;
