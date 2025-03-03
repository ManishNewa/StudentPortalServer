import { DataTypes, Model } from 'sequelize';
import sequelize from '@/config/db';

import User from '@/models/User';

class Otp extends Model {
    public id!: number;
    public userId!: number;
    public code!: string;
    public expiresAt!: Date;
    public isUsed!: boolean;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Otp.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        isUsed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Otp',
        timestamps: true,
    },
);

// Relationships
User.hasMany(Otp, { foreignKey: 'userId' });
Otp.belongsTo(User, { foreignKey: 'userId' });

export default Otp;
