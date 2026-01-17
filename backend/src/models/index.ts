import User from './User';
import Meeting from './Meeting';
import VIPAlert from './VIPAlert';
import ConnectedAccount from './ConnectedAccount';
import ActivityLog from './ActivityLog';

// Associations
User.hasMany(Meeting, { foreignKey: 'userId' });
Meeting.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(VIPAlert, { foreignKey: 'userId' });
VIPAlert.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ConnectedAccount, { foreignKey: 'userId' });
ConnectedAccount.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ActivityLog, { foreignKey: 'userId' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

Meeting.hasMany(VIPAlert, { foreignKey: 'meetingId' });
VIPAlert.belongsTo(Meeting, { foreignKey: 'meetingId' });

Meeting.hasMany(ActivityLog, { foreignKey: 'meetingId' });
ActivityLog.belongsTo(Meeting, { foreignKey: 'meetingId' });

const syncDatabase = async () => {
    try {
        // Sync models
        await User.sync({ alter: true });
        await ConnectedAccount.sync({ alter: true });
        await Meeting.sync({ alter: true });
        await VIPAlert.sync({ alter: true });
        await ActivityLog.sync({ alter: true });

        console.log('Database synced successfully');
    } catch (error) {
        console.error('Unable to sync database:', error);
    }
};

export default syncDatabase;
