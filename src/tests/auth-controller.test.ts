import express from 'express';
import request from 'supertest';
import AuthController from '../controllers/auth-controller';
import EmailService from '../services/email-service';
import AuthService from '../services/auth-service';
import User from '../models/User';

import { HTTP_STATUS, SUCCESS_MESSAGES } from '../utils/constants';
import { UserRole, AuthProvider } from '../utils/enums';
// Mock the AuthService
jest.mock('../services/auth-service');

const app = express();
app.use(express.json());

// Bind the AuthController methods to routes
app.post('/register', AuthController.register);
app.post('/resend-verification', AuthController.resendUserVerification);

describe('AuthController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /register', () => {
        let sendEmailMock: jest.SpyInstance;

        beforeAll(() => {
            sendEmailMock = jest
                .spyOn(EmailService, 'sendEmail')
                .mockResolvedValue({ message: 'Email sent successfully' });
        });

        afterAll(() => {
            sendEmailMock.mockRestore(); // Cleanup after tests
        });

        it('should return 201 status when a new user with unique email registers', async () => {
            const response = await request(app).post('/register').send({
                email: 'test@example.com',
                password: 'test-example',
                phone: null,
                role: UserRole.GUEST,
                authProvider: AuthProvider.LOCAL,
                providerId: null,
            });
            expect(response.status).toBe(HTTP_STATUS.CREATED);
            expect(response.body.message).toBe(
                SUCCESS_MESSAGES.REGISTER_SUCCESS,
            );
            expect(sendEmailMock).toHaveBeenCalledTimes(0);
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/register')
                .send({ email: 'test@example.com' });
            expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });

    describe('POST /resend-verification', () => {
        it('should resend verification email and return 200 status', async () => {
            (
                AuthService.resendRegistrationVerification as jest.Mock
            ).mockResolvedValue(true);

            const response = await request(app)
                .post('/resend-verification')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(response.body.message).toBe(
                SUCCESS_MESSAGES.VERIFICATION_RESENT,
            );
        });

        it('should return 400 if email is missing', async () => {
            const response = await request(app)
                .post('/resend-verification')
                .send({});

            expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });
});
