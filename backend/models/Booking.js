import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    seats: [
      {
        seatId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        seatNumber: String,
        row: String,
        section: String,
        type: String,
        price: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingFee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'refunded', 'expired'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'wallet', 'upi', 'netbanking'],
    },
    paymentDetails: {
      transactionId: String,
      paymentIntentId: String,
      paymentTime: Date,
    },
    qrCode: {
      type: String,
    },
    bookingReference: {
      type: String,
      unique: true,
    },
    userDetails: {
      name: String,
      email: String,
      phone: String,
    },
    cancellationReason: String,
    cancelledAt: Date,
    refundAmount: Number,
    refundedAt: Date,
    checkedIn: {
      type: Boolean,
      default: false,
    },
    checkedInAt: Date,
    notes: String,
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate booking reference before saving
bookingSchema.pre('save', async function (next) {
  if (!this.bookingReference) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.bookingReference = `BK-${timestamp}-${random}`;
  }
  next();
});

// Index for faster queries
bookingSchema.index({ user: 1, event: 1 });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
