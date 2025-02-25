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
                message: 'User registered successfully',
                user,
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

    async verify(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            console.log(userId);
            const user = await AuthService.verifyUser(Number(userId));
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
}

export default new AuthController();
