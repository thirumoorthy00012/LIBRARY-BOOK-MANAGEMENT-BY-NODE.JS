import Stripe from 'stripe';
import asyncHandler from 'express-async-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create payment intent
// @route   POST /api/payment/create-intent
// @access  Private
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency = 'usd' } = req.body;

  if (!amount) {
    res.status(400);
    throw new Error('Please provide amount');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata: {
      userId: req.user._id.toString(),
    },
  });

  res.json({
    success: true,
    data: {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    },
  });
});

// @desc    Webhook for Stripe events
// @route   POST /api/payment/webhook
// @access  Public
export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      // Update booking payment status
      break;

    case 'payment_intent.payment_failed':
      console.log('PaymentIntent failed:', event.data.object.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// @desc    Get payment methods
// @route   GET /api/payment/methods
// @access  Private
export const getPaymentMethods = asyncHandler(async (req, res) => {
  // Return available payment methods
  res.json({
    success: true,
    data: {
      methods: [
        { id: 'card', name: 'Credit/Debit Card', enabled: true },
        { id: 'wallet', name: 'Digital Wallet', enabled: true },
        { id: 'upi', name: 'UPI', enabled: true },
        { id: 'netbanking', name: 'Net Banking', enabled: true },
      ],
    },
  });
});
