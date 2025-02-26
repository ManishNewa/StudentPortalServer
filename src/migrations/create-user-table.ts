import { QueryInterface, DataTypes } from 'sequelize';
import { UserRole, AuthProvider } from '../utils/enums';

module.exports = {
    up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
        await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            role: {
                type: Sequelize.ENUM(...Object.values(UserRole)),
                defaultValue: UserRole.GUEST,
            },
            authProvider: {
                type: Sequelize.ENUM(...Object.values(AuthProvider)),
                defaultValue: AuthProvider.LOCAL,
            },
            providerId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            verified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            verificationToken: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },
    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable('Users');
    },
};
