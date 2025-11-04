import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// @desc    Get admin analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
  }

  // Total users
  const totalUsers = await User.countDocuments();
  
  // Total events
  const totalEvents = await Event.countDocuments();
  const activeEvents = await Event.countDocuments({ status: 'published', date: { $gte: new Date() } });
  
  // Total bookings
  const totalBookings = await Booking.countDocuments(dateFilter);
  const confirmedBookings = await Booking.countDocuments({ ...dateFilter, status: 'confirmed' });
  
  // Revenue
  const revenueData = await Booking.aggregate([
    { $match: { ...dateFilter, paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$finalAmount' } } },
  ]);
  const totalRevenue = revenueData[0]?.total || 0;

  // Bookings by status
  const bookingsByStatus = await Booking.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Popular events
  const popularEvents = await Event.find()
    .sort({ totalBookings: -1 })
    .limit(5)
    .select('title totalBookings totalRevenue');

  // Revenue by event category
  const revenueByCategory = await Event.aggregate([
    { $match: { totalRevenue: { $gt: 0 } } },
    { $group: { _id: '$category', revenue: { $sum: '$totalRevenue' }, count: { $sum: 1 } } },
    { $sort: { revenue: -1 } },
  ]);

  // Monthly bookings trend
  const monthlyBookings = await Booking.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
        revenue: { $sum: '$finalAmount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalEvents,
        activeEvents,
        totalBookings,
        confirmedBookings,
        totalRevenue,
      },
      bookingsByStatus,
      popularEvents,
      revenueByCategory,
      monthlyBookings,
    },
  });
});

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
// @access  Private (Admin)
export const getAllBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.paymentStatus) {
    query.paymentStatus = req.query.paymentStatus;
  }

  const total = await Booking.countDocuments(query);
  const bookings = await Booking.find(query)
    .populate('user', 'name email phone')
    .populate('event', 'title date venue')
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

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.role) {
    query.role = req.query.role;
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  res.json({
    success: true,
    count: users.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: users,
  });
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});
