import express from 'express';
import { userController } from './user.controller';

const router = express.Router();

router.get('/', userController.getUsers);
router.put('/:userId', userController.updateUser);

export const userRoutes = router;