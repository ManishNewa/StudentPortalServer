import express from 'express';

import AuthController from '../controllers/auth-controller';

const router = express.Router();

// Register a new user
router.post('/register', AuthController.register);

// Login a user
router.post('/login', AuthController.login);

// Verify a user
router.get('/verify/:userId', AuthController.verify);

router.post('/google', AuthController.googleLogin);
router.post('/facebook', AuthController.facebookLogin);

export default router;
