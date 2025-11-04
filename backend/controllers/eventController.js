import Event from '../models/Event.js';
import asyncHandler from 'express-async-handler';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Build query
  const queryObj = { status: 'published' };

  // Filter by category
  if (req.query.category && req.query.category !== 'all') {
    queryObj.category = req.query.category;
  }

  // Filter by city
  if (req.query.city) {
    queryObj['venue.city'] = new RegExp(req.query.city, 'i');
  }

  // Filter by date range
  if (req.query.startDate || req.query.endDate) {
    queryObj.date = {};
    if (req.query.startDate) {
      queryObj.date.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      queryObj.date.$lte = new Date(req.query.endDate);
    }
  }

  // Search by text
  if (req.query.search) {
    queryObj.$text = { $search: req.query.search };
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    queryObj['pricing.Standard'] = {};
    if (req.query.minPrice) {
      queryObj['pricing.Standard'].$gte = parseFloat(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      queryObj['pricing.Standard'].$lte = parseFloat(req.query.maxPrice);
    }
  }

  // Featured filter
  if (req.query.featured === 'true') {
    queryObj.featured = true;
  }

  // Sort
  let sortBy = { date: 1 };
  if (req.query.sortBy) {
    const sortFields = {
      date: { date: 1 },
      '-date': { date: -1 },
      price: { 'pricing.Standard': 1 },
      '-price': { 'pricing.Standard': -1 },
      rating: { rating: -1 },
    };
    sortBy = sortFields[req.query.sortBy] || sortBy;
  }

  const total = await Event.countDocuments(queryObj);
  const events = await Event.find(queryObj)
    .populate('organizer', 'name email')
    .sort(sortBy)
    .limit(limit)
    .skip(skip);

  res.json({
    success: true,
    count: events.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: events,
  });
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('organizer', 'name email phone')
    .populate('reviews.user', 'name avatar');

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  res.json({
    success: true,
    data: event,
  });
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer/Admin)
export const createEvent = asyncHandler(async (req, res) => {
  const eventData = {
    ...req.body,
    organizer: req.user._id,
  };

  // Generate seats if not provided
  if (!eventData.seats && eventData.capacity) {
    eventData.seats = generateSeats(eventData.capacity, eventData.pricing);
  }

  const event = await Event.create(eventData);

  res.status(201).json({
    success: true,
    data: event,
  });
});

// Helper function to generate seats
const generateSeats = (capacity, pricing) => {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = Math.ceil(capacity / rows.length);

  let seatCounter = 0;

  for (let i = 0; i < rows.length && seatCounter < capacity; i++) {
    const row = rows[i];
    let seatType = 'Standard';

    if (i < 2) seatType = 'VIP';
    else if (i < 4) seatType = 'Premium';
    else if (i > 7) seatType = 'Economy';

    for (let j = 1; j <= seatsPerRow && seatCounter < capacity; j++) {
      seats.push({
        seatNumber: `${row}${j}`,
        row: row,
        section: i < 5 ? 'Front' : 'Back',
        type: seatType,
        price: pricing[seatType] || pricing.Standard || 100,
        status: 'available',
      });
      seatCounter++;
    }
  }

  return seats;
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer/Admin)
export const updateEvent = asyncHandler(async (req, res) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check ownership
  if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this event');
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: event,
  });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer/Admin)
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check ownership
  if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this event');
  }

  // Delete associated images from Cloudinary
  if (event.images && event.images.length > 0) {
    for (const image of event.images) {
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }
  }

  await event.deleteOne();

  res.json({
    success: true,
    message: 'Event deleted successfully',
  });
});

// @desc    Add review to event
// @route   POST /api/events/:id/reviews
// @access  Private
export const addEventReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if already reviewed
  const alreadyReviewed = event.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Event already reviewed');
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  event.reviews.push(review);
  event.numReviews = event.reviews.length;
  event.rating =
    event.reviews.reduce((acc, item) => item.rating + acc, 0) / event.reviews.length;

  await event.save();

  res.status(201).json({
    success: true,
    message: 'Review added',
  });
});

// @desc    Get event seat map
// @route   GET /api/events/:id/seats
// @access  Public
export const getEventSeats = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).select('seats');

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  res.json({
    success: true,
    data: event.seats,
  });
});

// @desc    Update seat status
// @route   PUT /api/events/:id/seats/:seatId
// @access  Private
export const updateSeatStatus = asyncHandler(async (req, res) => {
  const { status, lockedUntil } = req.body;
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const seat = event.seats.id(req.params.seatId);

  if (!seat) {
    res.status(404);
    throw new Error('Seat not found');
  }

  seat.status = status;
  if (status === 'locked') {
    seat.lockedBy = req.user._id;
    seat.lockedUntil = lockedUntil || new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  } else if (status === 'available') {
    seat.lockedBy = undefined;
    seat.lockedUntil = undefined;
  }

  await event.save();

  // Emit socket event for real-time update
  const io = req.app.get('io');
  io.to(`event-${req.params.id}`).emit('seat-updated', {
    seatId: req.params.seatId,
    status,
  });

  res.json({
    success: true,
    data: seat,
  });
});
