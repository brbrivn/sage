import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Meeting extends Model {
    public id!: number;
    public userId!: number;
    public title!: string;
    public startTime!: Date;
    public endTime!: Date;
    public platform!: 'zoom' | 'meet' | 'teams' | 'other';
    public meetingUrl!: string;
    public meetingId!: string; // Platform specific ID
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
        },
        participants: {
            type: DataTypes.JSON, // Using JSON for MVP
            defaultValue: [],
        },
    },
    {
        sequelize,
        tableName: 'meetings',
    }
);

export default Meeting;
