import express from 'express';
import { bookingController } from './booking.controller';
import isCustomer from '../../middleware/customer';

const router = express.Router();

// customer or admin routes
router.post('/', isCustomer('customer'), bookingController.createBooking);

// role based routes
router.get('/', bookingController.getBookings);
router.put('/:bookingId', bookingController.updateBooking);

export const bookingRoutes = router;