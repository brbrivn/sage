import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Database connection will be initialized here later
        // await sequelize.authenticate();
        // console.log('Database connection has been established successfully.');

        app.listen(PORT, () => {
            console.log(`Sage Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();
