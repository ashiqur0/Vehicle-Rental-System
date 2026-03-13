import express from 'express';
import { vehicleController } from './vehicle.controller';

const router = express.Router();

// admin only routes
router.post('/', vehicleController.createVehicle);
router.put('/:vehicleId', vehicleController.updateVehicle);
router.delete('/:vehicleId', vehicleController.deleteVehicle);

// public routes
router.get('/', vehicleController.getVehicles);
router.get('/:vehicleId', vehicleController.getSingleVehicle);

export const vehicleRoutes = router;