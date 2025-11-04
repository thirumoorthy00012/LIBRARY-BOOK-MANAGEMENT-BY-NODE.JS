import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import QRCode from 'qrcode';
import { sendBookingConfirmation } from '../utils/emailService.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { eventId, seats, paymentMethod, paymentIntentId } = req.body;

  // Debug logging
  console.log('=== BOOKING REQUEST DEBUG ===');
  console.log('req.body:', JSON.stringify(req.body, null, 2));
  console.log('seats type:', typeof seats);
  console.log('seats value:', seats);
  console.log('seats is Array:', Array.isArray(seats));
  console.log('============================');

  // Validate input
  if (!eventId || !seats || seats.length === 0) {
    res.status(400);
    throw new Error('Please provide event and seats information');
  }

  // Get event
  const event = await Event.findById(eventId);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Verify all seats are available and locked by this user
  const seatIds = seats.map((s) => s.seatId);
  const eventSeats = event.seats.filter((s) => seatIds.includes(s._id.toString()));

  for (const seat of eventSeats) {
    if (seat.status === 'booked') {
      res.status(400);
      throw new Error(`Seat ${seat.seatNumber} is already booked`);
    }
    if (seat.status === 'locked' && seat.lockedBy.toString() !== req.user._id.toString()) {
      res.status(400);
      throw new Error(`Seat ${seat.seatNumber} is locked by another user`);
    }
  }

  // Calculate amounts
  const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);
  const bookingFee = totalAmount * 0.05; // 5% booking fee
  const tax = totalAmount * 0.1; // 10% tax
  const finalAmount = totalAmount + bookingFee + tax;

  // Create booking
  const booking = await Booking.create({
    user: req.user._id,
    event: eventId,
    seats: seats,
    totalAmount,
    bookingFee,
    tax,
    finalAmount,
    paymentMethod,
    paymentDetails: {
      paymentIntentId,
      paymentTime: new Date(),
    },
    userDetails: {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  // Update seat status to booked
  for (const seatId of seatIds) {
    const seat = event.seats.id(seatId);
    if (seat) {
      seat.status = 'booked';
      seat.lockedBy = undefined;
      seat.lockedUntil = undefined;
    }
  }

  // Update event statistics
  event.totalBookings += 1;
  event.totalRevenue += finalAmount;
  await event.save();

  // Add booking to user
  await User.findByIdAndUpdate(req.user._id, {
    $push: { bookings: booking._id },
  });

  // Generate QR code
  const qrData = JSON.stringify({
    bookingId: booking._id,
    bookingReference: booking.bookingReference,
    eventId: eventId,
    userId: req.user._id,
  });

  const qrCode = await QRCode.toDataURL(qrData);
  booking.qrCode = qrCode;
  await booking.save();

  // Send confirmation email
  try {
    await sendBookingConfirmation(booking, event, req.user);
  } catch (error) {
    console.error('Email sending failed:', error);
  }

  // Emit socket event
  const io = req.app.get('io');
  io.to(`event-${eventId}`).emit('booking-created', {
    seatIds,
    bookingId: booking._id,
  });

  // Populate booking before sending response
  await booking.populate('event');

  res.status(201).json({
    success: true,
    data: booking,
  });
});

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
export const getUserBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = { user: req.user._id };

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  const total = await Booking.countDocuments(query);
  const bookings = await Booking.find(query)
    .populate('event')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  res.json({
    success: true,
    count: bookings.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: bookings,
  });
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('event')
    .populate('user', 'name email phone');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user owns this booking or is admin
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  res.json({
    success: true,
    data: booking,
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check ownership
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  if (booking.status === 'cancelled') {
    res.status(400);
    throw new Error('Booking is already cancelled');
  }

  // Update booking status
  booking.status = 'cancelled';
  booking.cancellationReason = req.body.reason || 'Cancelled by user';
  booking.cancelledAt = new Date();

  // Calculate refund (80% of final amount if cancelled 48 hours before event)
  const event = await Event.findById(booking.event);
  const hoursUntilEvent = (new Date(event.date) - new Date()) / (1000 * 60 * 60);

  if (hoursUntilEvent >= 48) {
    booking.refundAmount = booking.finalAmount * 0.8;
    booking.paymentStatus = 'refunded';
    booking.refundedAt = new Date();
  }

  await booking.save();

  // Release seats
  const seatIds = booking.seats.map((s) => s.seatId);
  for (const seatId of seatIds) {
    const seat = event.seats.id(seatId);
    if (seat) {
      seat.status = 'available';
    }
  }

  // Update event statistics
  event.totalBookings -= 1;
  event.totalRevenue -= booking.finalAmount;
  await event.save();

  // Emit socket event
  const io = req.app.get('io');
  io.to(`event-${booking.event}`).emit('booking-cancelled', {
    seatIds,
    bookingId: booking._id,
  });

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: booking,
  });
});

// @desc    Verify booking QR code
// @route   POST /api/bookings/verify
// @access  Private
export const verifyBooking = asyncHandler(async (req, res) => {
  const { bookingReference } = req.body;

  const booking = await Booking.findOne({ bookingReference })
    .populate('event')
    .populate('user', 'name email');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.status !== 'confirmed') {
    res.status(400);
    throw new Error('Booking is not confirmed');
  }

  if (booking.checkedIn) {
    res.status(400);
    throw new Error('Booking already checked in');
  }

  // Mark as checked in
  booking.checkedIn = true;
  booking.checkedInAt = new Date();
  await booking.save();

  res.json({
    success: true,
    message: 'Booking verified successfully',
    data: booking,
  });
});

// @desc    Confirm payment
// @route   PUT /api/bookings/:id/confirm-payment
// @access  Private
export const confirmPayment = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  booking.status = 'confirmed';
  booking.paymentStatus = 'paid';
  booking.paymentDetails.transactionId = req.body.transactionId;

  await booking.save();

  res.json({
    success: true,
    data: booking,
  });
});
