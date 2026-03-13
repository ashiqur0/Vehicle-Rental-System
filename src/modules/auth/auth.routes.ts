import express from 'express';
import { authController } from './auth.controller';

const router = express.Router();

// public routes
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

export const authRoutes = router;