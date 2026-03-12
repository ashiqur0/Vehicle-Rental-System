import express from 'express';
import { bookingController } from './booking.controller';

const router = express.Router();

router.post('/', bookingController.createBooking);

export const bookingRoutes = router;