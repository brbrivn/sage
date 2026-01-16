import User from './User';
import Meeting from './Meeting';
import VIPAlert from './VIPAlert';

// Associations
User.hasMany(Meeting, { foreignKey: 'userId' });
Meeting.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(VIPAlert, { foreignKey: 'userId' });
VIPAlert.belongsTo(User, { foreignKey: 'userId' });

Meeting.hasMany(VIPAlert, { foreignKey: 'meetingId' });
VIPAlert.belongsTo(Meeting, { foreignKey: 'meetingId' });

const syncDatabase = async () => {
    try {
        // Sync models
        // alter: true updates tables to match models without dropping data (good for dev)
        await User.sync({ alter: true });
        await Meeting.sync({ alter: true });
        await VIPAlert.sync({ alter: true });

        console.log('Database synced successfully');
    } catch (error) {
        console.error('Unable to sync database:', error);
    }
};

export default syncDatabase;
