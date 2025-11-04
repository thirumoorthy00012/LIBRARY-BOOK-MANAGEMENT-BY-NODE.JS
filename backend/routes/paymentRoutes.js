import express from 'express';
import {
  createPaymentIntent,
  stripeWebhook,
  getPaymentMethods,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.get('/methods', protect, getPaymentMethods);

export default router;
