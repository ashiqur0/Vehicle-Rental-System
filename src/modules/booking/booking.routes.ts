import express from 'express';
import { bookingController } from './booking.controller';
import auth from '../../middleware/auth';

const router = express.Router();

// customer or admin routes
router.post('/', auth('customer', 'admin'), bookingController.createBooking);

// role based routes
router.get('/', auth('customer', 'admin'), bookingController.getBookings);
router.put('/:bookingId', auth('customer', 'admin'), bookingController.updateBooking);

export const bookingRoutes = router;