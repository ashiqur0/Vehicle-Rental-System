import express from 'express';
import { userController } from './user.controller';

const router = express.Router();

router.get('/', userController.getUsers);

export const userRoutes = router;