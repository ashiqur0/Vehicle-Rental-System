import express from 'express';
import { userController } from './user.controller';

const router = express.Router();

router.get('/', userController.getUsers);
router.put('/:userId', userController.updateUser);
router.put('/:userId', userController.updateUserByThemselves);
router.delete('/:userId', userController.deleteUser);

export const userRoutes = router;