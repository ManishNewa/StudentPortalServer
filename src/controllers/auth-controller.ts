import { Request, Response } from 'express';
import '../types/session-types';

import AuthService from '../services/auth-service';

import { SocialLoginRequest, OtpRequest } from '../types/auth-types';
import {
    validateRequestParams,
    handleResponse,
    handleError,
} from '../utils/response-handler';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../utils/constants';

class AuthController {
    async register(req: Request, res: Response) {
        try {
            validateRequestParams(req.body, ['email', 'password']);
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
            handleResponse(
                res,
                HTTP_STATUS.CREATED,
                SUCCESS_MESSAGES.REGISTER_SUCCESS,
                { user },
            );
        } catch (error: any) {
            handleError(res, error);
        }
    }

    async resendUserVerification(req: Request, res: Response) {
        try {
            validateRequestParams(req.body, ['email']);
            const { email } = req.body;

            await AuthService.resendRegistrationVerification(email);

            handleResponse(
                res,
                HTTP_STATUS.OK,
                SUCCESS_MESSAGES.VERIFICATION_RESENT,
            );
        } catch (error: any) {
            handleError(res, error);
        }
    }

    async login(req: Request, res: Response) {
        try {
            validateRequestParams(req.body, ['email', 'password']);
            const { email, password } = req.body;
            const { user, token } = await AuthService.login(email, password);

            if (process.env.NODE_ENV !== 'test') {
                req.session.user = user;
                req.session.token = token;
            }
            handleResponse(
                res,
                HTTP_STATUS.OK,
                SUCCESS_MESSAGES.LOGIN_SUCCESS,
                {
                    user,
                    token,
                },
            );
        } catch (error: any) {
            handleError(res, error);
        }
    }

    async logout(req: Request, res: Response) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    handleError(res, err);
                }
                res.clearCookie('connect.sid');
                handleResponse(
                    res,
                    HTTP_STATUS.OK,
                    SUCCESS_MESSAGES.LOGOUT_SUCCESS,
                );
            });
        } catch (error: any) {
            handleError(res, error);
        }
    }

    async verifyUser(req: Request, res: Response) {
        try {
            validateRequestParams(req.params, ['token']);
            const { token } = req.params;

            const user = await AuthService.verifyUser(token);
            handleResponse(
                res,
                HTTP_STATUS.OK,
                SUCCESS_MESSAGES.USER_VERIFIED,
                { user },
            );
        } catch (error: any) {
            handleError(res, error);
        }
    }

    // Google login/register
    async googleLogin(req: Request, res: Response) {
        try {
            validateRequestParams(req.body, ['idToken']);
            const { idToken } = req.body as SocialLoginRequest;

            const { user, token } = await AuthService.googleLogin(idToken);

            handleResponse(
                res,
                HTTP_STATUS.OK,
                SUCCESS_MESSAGES.SOCIAL_LOGIN('Google'),
                { user, token },
            );
        } catch (error: any) {
            handleError(res, error);
        }
    }

    // Facebook login/register
    async facebookLogin(req: Request, res: Response) {
        try {
            validateRequestParams(req.body, ['accessToken']);
            const { accessToken } = req.body as SocialLoginRequest;

            const { user, token } = await AuthService.facebookLogin(
                accessToken,
            );
            handleResponse(
                res,
                HTTP_STATUS.OK,
                SUCCESS_MESSAGES.SOCIAL_LOGIN('Facebook'),
                { user, token },
            );
        } catch (error: any) {
            handleError(res, error);
        }
    }

    // Send OTP via email
    async sendOtp(req: Request, res: Response) {
        try {
            validateRequestParams(req.body, ['email']);
            const { email } = req.body as OtpRequest;

            const otp = await AuthService.sendOtp(email);
            handleResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.OTP_SENT, {
                otp,
            });
        } catch (error: any) {
            handleError(res, error);
        }
    }

    // Verify OTP and login/register
    async verifyOtp(req: Request, res: Response) {
        try {
            validateRequestParams(req.body, ['email', 'otp']);
            const { email, otp } = req.body as OtpRequest;

            const { user, token } = await AuthService.verifyOtp(email, otp!);
            handleResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.OTP_VERIFIED, {
                user,
                token,
            });
        } catch (error: any) {
            handleError(res, error);
        }
    }
}

export default new AuthController();
