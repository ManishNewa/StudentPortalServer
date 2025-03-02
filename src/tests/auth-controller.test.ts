import express, { Request, Response } from 'express';
import AuthController from '../controllers/auth-controller';

// Mock the AuthService
jest.mock('../services/auth-service');

const app = express();
app.use(express.json());

// Bind the AuthController methods to routes
app.post('/register', AuthController.register);

describe('AuthController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
});
