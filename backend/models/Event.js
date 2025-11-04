import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  row: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    default: 'General',
  },
  type: {
    type: String,
    enum: ['VIP', 'Premium', 'Standard', 'Economy'],
    default: 'Standard',
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'selected', 'booked', 'locked'],
    default: 'available',
  },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  lockedUntil: {
    type: Date,
  },
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an event title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Concert',
        'Sports',
        'Theater',
        'Conference',
        'Workshop',
        'Festival',
        'Comedy',
        'Exhibition',
        'Other',
      ],
    },
    venue: {
      name: {
        type: String,
        required: [true, 'Please add a venue name'],
      },
      address: {
        type: String,
        required: [true, 'Please add an address'],
      },
      city: {
        type: String,
        required: [true, 'Please add a city'],
      },
      state: String,
      country: {
        type: String,
        required: [true, 'Please add a country'],
      },
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    date: {
      type: Date,
      required: [true, 'Please add an event date'],
    },
    startTime: {
      type: String,
      required: [true, 'Please add a start time'],
    },
    endTime: {
      type: String,
    },
    duration: {
      type: Number, // in minutes
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    coverImage: {
      url: {
        type: String,
        default: 'https://via.placeholder.com/800x400?text=Event+Image',
      },
      public_id: String,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seats: [seatSchema],
    capacity: {
      type: Number,
      required: [true, 'Please add event capacity'],
    },
    availableSeats: {
      type: Number,
    },
    pricing: {
      VIP: {
        type: Number,
        default: 0,
      },
      Premium: {
        type: Number,
        default: 0,
      },
      Standard: {
        type: Number,
        default: 0,
      },
      Economy: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled', 'completed'],
      default: 'draft',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    artists: [String],
    ageRestriction: {
      type: String,
      enum: ['All Ages', '13+', '16+', '18+', '21+'],
      default: 'All Ages',
    },
    rules: [String],
    maxBookingPerUser: {
      type: Number,
      default: 10,
    },
    bookingOpenDate: {
      type: Date,
    },
    bookingCloseDate: {
      type: Date,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: String,
        rating: Number,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Calculate available seats before saving
eventSchema.pre('save', function (next) {
  if (this.seats && this.seats.length > 0) {
    this.availableSeats = this.seats.filter(
      (seat) => seat.status === 'available'
    ).length;
  }
  next();
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
