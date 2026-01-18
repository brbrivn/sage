import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Meeting extends Model {
    public id!: number;
    public userId!: number;
    public accountId!: number | null;
    public title!: string;
    public startTime!: Date;
    public endTime!: Date;
    public platform!: 'zoom' | 'meet' | 'teams' | 'other';
    public meetingUrl!: string;
    public meetingId!: string; // Platform specific ID (e.g. 123456789)
    public googleEventId!: string; // Google Event ID
    public participants!: string[]; // JSON array of emails if available

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Meeting.init(
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
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: true, // For backward compatibility or general meetings
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        platform: {
            type: DataTypes.STRING,
            defaultValue: 'other',
        },
        meetingUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        meetingId: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Platform specific ID (e.g. Zoom ID: 123456789)'
        },
        googleEventId: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Google Calendar Event ID'
        },
        participants: {
            type: DataTypes.JSON, // Using JSON for MVP
            defaultValue: [],
        },
    },
    {
        sequelize,
        tableName: 'meetings',
        indexes: [
            {
                unique: true,
                fields: ['userId', 'googleEventId']
            },
            {
                fields: ['meetingId'] // Index for webhook lookups
            }
        ]
    }
);

export default Meeting;
