import express from 'express';
import { bookingController } from './booking.controller';
import isCustomer from '../../middleware/customer';

const router = express.Router();

router.post('/', isCustomer('customer'), bookingController.createBooking);
router.get('/', bookingController.getBookings);
router.put('/:bookingId', bookingController.updateBooking);

export const bookingRoutes = router;