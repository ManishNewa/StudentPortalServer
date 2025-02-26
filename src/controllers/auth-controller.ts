import { Request, Response } from 'express';
import AuthService from '../services/auth-service';

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { email, password, phone, role, authProvider, providerId } =
                req.body;
            const user = await AuthService.register(
                email,
                password,
                phone,
                role,
                authProvider,
                providerId,
            );
            res.status(201).json({
                message:
                    'User registered successfully. Please check your email to verify your account',
                user,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async resendUserVerification(req: Request, res: Response) {
        try {
            const { email } = req.body;

            await AuthService.resendRegistrationVerification(email);

            res.status(200).json({
                message: 'User verification resent. Please check your email.',
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const { user, token } = await AuthService.login(email, password);
            res.json({ message: 'Login successful', user, token });
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    async verifyUser(req: Request, res: Response) {
        try {
            const { token } = req.params;
            const user = await AuthService.verifyUser(token as string);
            if (user) {
                res.json({ message: 'User verified successfully', user });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    } // Google login/register
    async googleLogin(req: Request, res: Response) {
        try {
            const { idToken } = req.body;
            const { user, token } = await AuthService.googleLogin(idToken);
            res.json({ message: 'Google login successful', user, token });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Facebook login/register
    async facebookLogin(req: Request, res: Response) {
        try {
            const { accessToken } = req.body;
            const { user, token } = await AuthService.facebookLogin(
                accessToken,
            );
            res.json({ message: 'Facebook login successful', user, token });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Send OTP via email
    async sendOtp(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const otp = await AuthService.sendOtp(email);
            res.json({ message: 'OTP sent successfully', otp });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Verify OTP and login/register
    async verifyOtp(req: Request, res: Response) {
        try {
            const { email, otp } = req.body;
            const { user, token } = await AuthService.verifyOtp(email, otp);
            res.json({ message: 'OTP verified successfully', user, token });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new AuthController();
