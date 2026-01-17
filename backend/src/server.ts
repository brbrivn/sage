import dotenv from 'dotenv';
dotenv.config();

import app from './app';

import sequelize from './config/database';
import syncDatabase from './models/index';

import { createServer } from 'http';
import { Server } from 'socket.io';
import { setIo } from './services/notificationService';

const PORT = process.env.PORT || 5001;
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*', // For dev, refine for prod
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Allow client to join a room based on userId for targeted notifications
    socket.on('join', (userId: string) => {
        socket.join(`user_${userId}`);
        console.log(`Socket ${socket.id} joined user_${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

setIo(io);

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        await syncDatabase();

        httpServer.listen(PORT, () => {
            console.log(`Sage Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();
