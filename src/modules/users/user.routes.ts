import express from 'express';
import { userController } from './user.controller';

const router = express.Router();

// admin only routes
router.get('/', userController.getUsers);
router.delete('/:userId', userController.deleteUser);

// admin only and owner routes
router.put('/:userId', userController.updateUser);
router.put('/:userId', userController.updateUserByThemselves);

export const userRoutes = router;