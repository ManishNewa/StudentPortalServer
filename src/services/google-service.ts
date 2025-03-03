import { OAuth2Client } from 'google-auth-library';
import User from '@/models/User';
import AuthService from '@/services/auth-service';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class GoogleService {
    // Verify Google ID token
    async verifyIdToken(idToken: string) {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) throw new Error('Invalid Google token');
        return payload;
    }

    // Login or register using Google
    async googleLogin(idToken: string) {
        const payload = await this.verifyIdToken(idToken);

        // Check if user already exists
        let user = await User.findOne({
            where: { providerId: payload.sub, authProvider: 'GOOGLE' },
        });

        if (!user) {
            // Register new user
            user = await User.create({
                email: payload.email,
                authProvider: 'GOOGLE',
                providerId: payload.sub,
                verified: true, // Google users are automatically verified
            });
        }

        // Generate JWT token
        const token = AuthService.generateToken(user);
        return { user, token };
    }
}

export default new GoogleService();
