import express from 'express';
import { vehicleController } from './vehicle.controller';
import verifyAdmin from '../../middleware/admin';
import auth from '../../middleware/auth';

const router = express.Router();

// admin only routes
router.post('/', auth('admin'), verifyAdmin, vehicleController.createVehicle);

router.put('/:vehicleId', auth('admin'), verifyAdmin, vehicleController.updateVehicle);
router.delete('/:vehicleId', auth('admin'), verifyAdmin, vehicleController.deleteVehicle);

// public routes
router.get('/', vehicleController.getVehicles);
router.get('/:vehicleId', vehicleController.getSingleVehicle);

export const vehicleRoutes = router;