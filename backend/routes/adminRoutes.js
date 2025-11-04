import express from 'express';
import {
  getAnalytics,
  getAllBookings,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require admin access
router.use(protect);
router.use(admin);

router.get('/analytics', getAnalytics);
router.get('/bookings', getAllBookings);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
