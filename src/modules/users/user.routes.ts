import express from 'express';
import { userController } from './user.controller';
import auth from '../../middleware/auth';
import verifyAdmin from '../../middleware/admin';

const router = express.Router();

// admin only routes
router.get('/', auth('admin'), verifyAdmin, userController.getUsers);
router.delete('/:userId', auth('admin'), verifyAdmin, userController.deleteUser);

// admin only and owner routes
router.put('/:userId', auth('admin', 'customer'), userController.updateUser);

export const userRoutes = router;