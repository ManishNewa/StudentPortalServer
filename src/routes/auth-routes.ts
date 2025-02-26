import express from 'express';

import AuthController from '../controllers/auth-controller';

const router = express.Router();

// Register a new user
router.post('/register', AuthController.register);

// Login a user
router.post('/login', AuthController.login);

// Verify a user
router.get('/verify/:userId', AuthController.verifyUser);

router.post('/google', AuthController.googleLogin);
router.post('/facebook', AuthController.facebookLogin);

// Send and verify OTP
router.post('/sendOtp', AuthController.sendOtp);
router.post('/verifyOtp', AuthController.verifyOtp);

export default router;
