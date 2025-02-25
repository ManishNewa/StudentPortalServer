import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import UserModel from '../models/User';
import AuthService from './auth-service';

dotenv.config();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

class EmailService {
    // Send OTP via email
    async sendOtp(email: string) {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your OTP Code',
                text: `Your OTP is: ${otp}`,
            };

            await transporter.sendMail(mailOptions);
            return otp;
        } catch (error) {
            throw new Error('Failed to send OTP via email');
        }
    }

    // Verify OTP and login/register
    async verifyOtp(email: string, otp: string) {
        try {
            // Check if user already exists
            let user = await UserModel.findOne({
                where: { email, authProvider: 'EMAIL' },
            });

            if (!user) {
                // Register new user
                user = await UserModel.create({
                    email,
                    authProvider: 'EMAIL',
                    providerId: email, // Use email as providerId
                    verified: true, // OTP verification confirms the user
                });
            }

            // Generate JWT token
            const token = AuthService.generateToken(user);
            return { user, token };
        } catch (error) {
            throw new Error('OTP verification failed');
        }
    }
}

export default new EmailService();
