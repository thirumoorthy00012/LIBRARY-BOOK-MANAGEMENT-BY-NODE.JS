import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  verifyBooking,
  confirmPayment,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getUserBookings)
  .post(protect, createBooking);

router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/confirm-payment', protect, confirmPayment);
router.post('/verify', protect, verifyBooking);

export default router;
