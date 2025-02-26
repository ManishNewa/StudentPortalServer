import express from 'express';

import AuthController from '../controllers/auth-controller';

const router = express.Router();

// Register a new user
router.post('/register', AuthController.register);
// Resend user verification
router.post('/resend-verification', AuthController.resendUserVerification);

// Login a user
router.post('/login', AuthController.login);

// Verify a user
router.post('/verify/:token', AuthController.verifyUser);

router.post('/google', AuthController.googleLogin);
router.post('/facebook', AuthController.facebookLogin);

// Send and verify OTP
router.post('/send-otp', AuthController.sendOtp);
router.post('/verify-otp', AuthController.verifyOtp);

export default router;
