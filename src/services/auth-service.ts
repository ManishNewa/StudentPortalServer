import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import GoogleService from './google-service';
import FacebookService from './facebook-service';
import OtpService from './otp-service';
import EmailService from '../utils/email';

import { generateVerificationToken } from '../utils';

class AuthService {
    // Register a new user
    async register(
        email: string,
        password: string,
        phone: string,
        role: string,
        authProvider: string,
        providerId?: string,
    ) {
        const hashedPassword = password
            ? await bcrypt.hash(password, 10)
            : null;
        // Generate a verification token
        const verificationToken = generateVerificationToken();
        const user = await User.create({
            email,
            password: hashedPassword,
            phone,
            role,
            authProvider,
            providerId,
            verified: false, // Default to false
            verificationToken,
        });

        // Send Verification Email
        const verificationUrl = `${process.env.API_URL}/api/auth/verifyUser?token=${verificationToken}`;

        await EmailService.sendEmail({
            to: email,
            subject: 'Verify your Email',
            text: `Click the link to verify your email: ${verificationUrl}`,
        });

        return user;
    }

    // Login a user
    async login(email: string, password: string) {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }
        const token = this.generateToken(user);
        return { user, token };
    }
    // Google login/register
    async googleLogin(idToken: string) {
        return await GoogleService.googleLogin(idToken);
    }

    // Facebook login/register
    async facebookLogin(accessToken: string) {
        return await FacebookService.facebookLogin(accessToken);
    }

    // Send OTP via email
    async sendOtp(email: string) {
        return await OtpService.sendOtp(email);
    }

    // Verify OTP and login/register
    async verifyOtp(email: string, otp: string) {
        return await OtpService.verifyOtp(email, otp);
    }

    // Generate JWT token
    generateToken(user: User) {
        return jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET!,
            {
                expiresIn: '1h',
            },
        );
    }

    // Find user by email
    async findUserByEmail(email: string) {
        return await User.findOne({ where: { email } });
    }

    // Verify user (mark as verified)
    async verifyUser(userId: number) {
        const user = await User.findByPk(userId);
        if (user) {
            user.verified = true;
            await user.save();
        }
        return user;
    }
}

export default new AuthService();
