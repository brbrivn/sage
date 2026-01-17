import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class ConnectedAccount extends Model {
    public id!: number;
    public userId!: number;
    public provider!: 'google' | 'zoom' | 'teams';
    public email!: string;
    public accessToken!: string;
    public refreshToken!: string;
    public isActive!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ConnectedAccount.init(
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
        provider: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        accessToken: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        refreshToken: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: 'connected_accounts',
    }
);

export default ConnectedAccount;
