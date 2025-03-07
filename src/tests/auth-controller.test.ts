import express from 'express';
import request from 'supertest';

import AuthController from '@/controllers/auth-controller';
import EmailService from '@/services/email-service';
import AuthService from '@/services/auth-service';

import { HTTP_STATUS, SUCCESS_MESSAGES } from '@/utils/constants';

// Mock the AuthService
jest.mock('@/services/auth-service');

const app = express();
app.use(express.json());

// Bind the AuthController methods to routes
app.post('/register', AuthController.register);
app.post('/resend-verification', AuthController.resendUserVerification);
app.post('/login', AuthController.login);
app.post('/verify/:token', AuthController.verifyUser);
app.post('/google', AuthController.googleLogin);
app.post('/send-otp', AuthController.sendOtp);
app.post('/verify-otp', AuthController.verifyOtp);

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

    describe('POST /login', () => {
        it('should login a user and return 200 status', async () => {
            // Mock user data
            const mockUser = {
                id: 24,
                email: 'test@gmail.com',
            };

            // Mock token
            const mockToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQsImVtYWlsIjoiZ2hhbXBvd2VydGVzdGluZ0BnbWFpbC5jb20iLCJpYXQiOjE3NDA5MzA5NjMsImV4cCI6MTc0MDkzNDU2M30.-i_-pmrPrg4N8RsUs1QXXeOtBPtzq7iSgmABBh8FKSU';

            (AuthService.login as jest.Mock).mockResolvedValue({
                user: mockUser,
                token: mockToken,
            });

            const response = await request(app).post('/login').send({
                email: 'test@gmail.com',
                password: 'testing123',
            });
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(response.body.message).toBe(SUCCESS_MESSAGES.LOGIN_SUCCESS);
            expect(response.body.data.user).toEqual(
                expect.objectContaining({
                    id: mockUser.id,
                    email: mockUser.email,
                    //createdAt and updatedAt could be dynamic so its ignored here
                }),
            );
            expect(response.body.data.token).toBe(mockToken);
        });

        it('should return 400 if email or password is missing', async () => {
            const response = await request(app)
                .post('/login')
                .send({ email: 'test@gmail.com' }); // Missing password

            expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });
    describe('POST /verify/:token', () => {
        it('should verify a user and return 200 status', async () => {
            const mockUser = {
                id: 1,
                email: 'test@gmail.com',
            };
            (AuthService.verifyUser as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app).post(
                '/verify/this_is_randomly_generated_token',
            );
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(response.body.message).toBe(SUCCESS_MESSAGES.USER_VERIFIED);
            expect(response.body.data.user).toEqual(mockUser);
        });

        it('should return 404 if token is missing', async () => {
            const response = await request(app).post('/verify/'); // Missing token

            expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
        });
    });

    describe('POST /google-login', () => {
        it('should login/register with Google and return 200 status', async () => {
            const mockUser = {
                id: 1,
                email: 'test@gmail.com',
            };
            const mockToken = 'mock-token';
            (AuthService.googleLogin as jest.Mock).mockResolvedValue({
                user: mockUser,
                token: mockToken,
            });

            const response = await request(app)
                .post('/google')
                .send({ idToken: 'mock-id-token' });

            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(response.body.message).toBe(
                SUCCESS_MESSAGES.SOCIAL_LOGIN('Google'),
            );
            expect(response.body.data.user).toEqual(mockUser);
            expect(response.body.data.token).toBe(mockToken);
        });

        it('should return 400 if idToken is missing', async () => {
            const response = await request(app).post('/google').send({});

            expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });

    describe('POST /send-otp', () => {
        it('should send OTP and return 200 status', async () => {
            const mockOtp = '123456';
            (AuthService.sendOtp as jest.Mock).mockResolvedValue(mockOtp);

            const response = await request(app)
                .post('/send-otp')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(response.body.message).toBe(SUCCESS_MESSAGES.OTP_SENT);
            expect(response.body.data.otp).toBe(mockOtp);
        });

        it('should return 400 if email is missing', async () => {
            const response = await request(app).post('/send-otp').send({});

            expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });
    describe('POST /verify-otp', () => {
        it('should verify OTP and return 200 status', async () => {
            const mockUser = { id: 1, email: 'test@example.com' };
            const mockToken = 'mock-token';
            (AuthService.verifyOtp as jest.Mock).mockResolvedValue({
                user: mockUser,
                token: mockToken,
            });

            const response = await request(app)
                .post('/verify-otp')
                .send({ email: 'test@example.com', otp: '123456' });

            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(response.body.message).toBe(SUCCESS_MESSAGES.OTP_VERIFIED);
            expect(response.body.data.user).toEqual(mockUser);
            expect(response.body.data.token).toBe(mockToken);
        });

        it('should return 400 if email or OTP is missing', async () => {
            const response = await request(app)
                .post('/verify-otp')
                .send({ email: 'test@example.com' }); // Missing OTP

            expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });
});
