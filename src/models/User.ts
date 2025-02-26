import { DataTypes, Model } from 'sequelize';

import sequelize from '../config/db';
import { UserRole, AuthProvider } from '../utils/enums';

class User extends Model {
    public id!: number;
    public email!: string;
    public password!: string;
    public phone!: string;
    public role!: UserRole;
    public authProvider!: AuthProvider;
    public providerId!: string;
    public verified!: boolean;
    public verificationToken!: string;

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
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM(...Object.values(UserRole)),
            defaultValue: UserRole.GUEST,
        },
        authProvider: {
            type: DataTypes.ENUM(...Object.values(AuthProvider)),
            defaultValue: AuthProvider.LOCAL,
        },
        providerId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        verificationToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'User',
    },
);

export default User;
