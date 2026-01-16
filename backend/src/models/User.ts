import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
    id: number;
    email: string;
    password?: string; // Optional for OAuth users
    phoneNumber?: string;
    zoomToken?: string;
    googleToken?: string;
    lastLogin?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public password!: string;
    public phoneNumber!: string;
    public zoomToken!: string;
    public googleToken!: string;
    public lastLogin!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true, // Nullable for OAuth
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            // In a real app, this would be encrypted before saving
        },
        zoomToken: {
            type: DataTypes.TEXT,
            allowNull: true,
            // Encrypted
        },
        googleToken: {
            type: DataTypes.TEXT,
            allowNull: true,
            // Encrypted
        },
        lastLogin: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'users',
    }
);

export default User;
