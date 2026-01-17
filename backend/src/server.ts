import dotenv from 'dotenv';
dotenv.config();

import app from './app';

import sequelize from './config/database';
import syncDatabase from './models/index';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        await syncDatabase();

        app.listen(PORT, () => {
            console.log(`Sage Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();
