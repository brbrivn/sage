
import { Sequelize } from 'sequelize';
import Meeting from './src/models/Meeting';
import ConnectedAccount from './src/models/ConnectedAccount';
import VIPAlert from './src/models/VIPAlert';
import dotenv from 'dotenv';
dotenv.config();

// Setup minimal sequelize instance to query
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/sage_db', {
    dialect: 'postgres',
    logging: false
});

// Init models manually for this script
Meeting.init(Meeting.getAttributes(), { sequelize, tableName: 'meetings' });
VIPAlert.init(VIPAlert.getAttributes(), { sequelize, tableName: 'vip_alerts' });

async function check() {
    try {
        const meetings = await Meeting.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        console.log('--- LATEST MEETINGS ---');
        meetings.forEach(m => {
            console.log(`ID: ${m.id}`);
            console.log(`Title: ${m.title}`);
            console.log(`Platform ID (.meetingId): ${m.meetingId}`);
            console.log(`Google ID (.googleEventId): ${m.googleEventId}`);
            console.log(`Platform: ${m.platform}`);
            console.log(`Participants: ${m.participants?.length}`);
            console.log(`Alerts: ${(m as any).VIPAlerts?.length}`);
            console.log('-------------------------');
        });
    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

check();
