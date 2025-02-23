import { Request, Response } from 'express';
import AuthService from '../services/auth-service';

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const user = await AuthService.createUser(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({
                error: error.errors[0]?.message ?? error.message,
            });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await AuthService.findUserByEmail(email);
            if (
                !user ||
                !(await AuthService.validatePassword(user, password))
            ) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = AuthService.generateToken(user);
            res.json({ token });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new AuthController();
