import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  toggleWishlist,
  getWishlist,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/wishlist/:eventId', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);

export default router;
