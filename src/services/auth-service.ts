import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class AuthService {
    async createUser(userData: any) {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        return await User.create(userData);
    }

    async findUserByEmail(email: string) {
        return await User.findOne({ where: { email } });
    }

    async validatePassword(user: User, password: string) {
        return await bcrypt.compare(password, user.password);
    }

    generateToken(user: User) {
        return jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET!,
            {
                expiresIn: '1h',
            },
        );
    }
}

export default new AuthService();
