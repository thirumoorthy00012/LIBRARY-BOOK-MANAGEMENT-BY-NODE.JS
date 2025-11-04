import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  addEventReview,
  getEventSeats,
  updateSeatStatus,
} from '../controllers/eventController.js';
import { protect, organizer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, organizer, createEvent);

router.route('/:id')
  .get(getEventById)
  .put(protect, organizer, updateEvent)
  .delete(protect, organizer, deleteEvent);

router.post('/:id/reviews', protect, addEventReview);
router.get('/:id/seats', getEventSeats);
router.put('/:id/seats/:seatId', protect, updateSeatStatus);

export default router;
