import express from 'express';
import { vehicleController } from './vehicle.controller';

const router = express.Router();

router.post('/', vehicleController.createVehicle);
router.get('/', vehicleController.getVehicles);
router.get('/:vehicleId', vehicleController.getSingleVehicle);
router.put('/:vehicleId', vehicleController.updateVehicle);

export const vehicleRoutes = router;