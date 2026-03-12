import express from 'express';
import { vehicleController } from './vehicle.controller';

const router = express.Router();

router.post('/', vehicleController.createVehicle);

export const vehicleRoutes = router;