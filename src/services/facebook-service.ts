import axios from 'axios';

import UserModel from '@/models/User';
import AuthService from '@/services/auth-service';

class FacebookService {
    // Verify Facebook access token and retrieve user data
    async verifyAccessToken(accessToken: string) {
        try {
            const response = await axios.get(
                `https://graph.facebook.com/v17.0/me`,
                {
                    params: {
                        fields: 'id,email',
                        access_token: accessToken,
                    },
                },
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to verify Facebook access token');
        }
    }

    // Login or register using Facebook
    async facebookLogin(accessToken: string) {
        try {
            const userData = await this.verifyAccessToken(accessToken);
            const { id, email } = userData;

            // Check if user already exists
            let user = await UserModel.findOne({
                where: { providerId: id, authProvider: 'FACEBOOK' },
            });

            if (!user) {
                // Register new user
                user = await UserModel.create({
                    email,
                    authProvider: 'FACEBOOK',
                    providerId: id,
                    verified: true, // Facebook users are automatically verified
                });
            }

            // Generate JWT token
            const token = AuthService.generateToken(user);
            return { user, token };
        } catch (error) {
            throw new Error('Facebook authentication failed');
        }
    }
}

export default new FacebookService();
