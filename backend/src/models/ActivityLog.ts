import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class ActivityLog extends Model {
    public id!: number;
    public userId!: number;
    public meetingId!: number;
    public vipName!: string;
    public type!: 'desktop' | 'email' | 'call';
    public status!: 'sent' | 'failed';
    public message!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ActivityLog.init(
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
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'sent',
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'activity_logs',
    }
);

export default ActivityLog;
