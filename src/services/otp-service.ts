import { Op } from 'sequelize';

import Otp from '@/models/Otp';
import UserModel from '@/models/User';

import AuthService from '@/services/auth-service';
import EmailService from '@/services/email-service';

import { AuthProvider } from '@/utils/enums';

class OtpService {
    // Generate and send OTP
    async sendOtp(email: string) {
        try {
            // Find or create the user
            let user = await UserModel.findOne({ where: { email } });
            if (!user) {
                user = await UserModel.create({
                    email,
                    authProvider: AuthProvider.LOCAL,
                    verified: false,
                });
            }

            // Generate a 6-digit OTP
            const otpCode = Math.floor(
                100000 + Math.random() * 900000,
            ).toString();

            // Set expiry time to 10 minutes from now
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

            // Save the OTP in the database
            const otp = await Otp.create({
                userId: user.id,
                code: otpCode,
                expiresAt,
                isUsed: false,
            });

            // Send the OTP via email
            await EmailService.sendOtpEmail(email, otpCode);

            return { message: 'OTP sent successfully', otpId: otp.id };
        } catch (error) {
            throw new Error('Failed to send OTP');
        }
    }

    // Verify OTP
    async verifyOtp(email: string, otpCode: string) {
        try {
            // Find the user
            const user = await UserModel.findOne({ where: { email } });
            if (!user) throw new Error('User not found');

            // Find the OTP
            const otp = await Otp.findOne({
                where: {
                    userId: user.id,
                    code: otpCode,
                    isUsed: false,
                    expiresAt: { [Op.gt]: new Date() }, // Check if OTP is not expired
                },
            });

            if (!otp) throw new Error('Invalid or expired OTP');

            // Mark the OTP as used
            otp.isUsed = true;
            await otp.save();

            // Generate JWT token
            const token = AuthService.generateToken(user);
            return { user, token };
        } catch (error) {
            throw new Error('OTP verification failed');
        }
    }
}

export default new OtpService();
