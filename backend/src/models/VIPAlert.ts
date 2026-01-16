import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class VIPAlert extends Model {
    public id!: number;
    public userId!: number;
    public meetingId!: number;
    public vipName!: string;
    public vipEmail!: string; // Primary method for identification
    public status!: 'active' | 'triggered' | 'cancelled';
    public notificationMethod!: 'call' | 'sms' | 'push';

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

VIPAlert.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        meetingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        vipName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        vipEmail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('active', 'triggered', 'cancelled'),
            defaultValue: 'active',
        },
        notificationMethod: {
            type: DataTypes.ENUM('call', 'sms', 'push'),
            defaultValue: 'call',
        },
    },
    {
        sequelize,
        tableName: 'vip_alerts',
    }
);

export default VIPAlert;
