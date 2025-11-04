import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Event from './models/Event.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to database
connectDB();

// Sample events data
const sampleEvents = [
  {
    title: 'Summer Music Festival 2025',
    description: 'Join us for an unforgettable summer music festival featuring top artists from around the world. Experience amazing performances, delicious food, and great vibes!',
    category: 'Concert',
    venue: {
      name: 'Central Park Amphitheater',
      address: '123 Park Avenue',
      city: 'Karur',
      state: 'Tamil Nadu',
      country: 'India',
      zipCode: '639001',
    },
    date: new Date('2025-07-15'),
    startTime: '18:00',
    endTime: '23:00',
    duration: 300,
    coverImage: {
      url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    },
    capacity: 100,
    pricing: {
      VIP: 150,
      Premium: 100,
      Standard: 75,
      Economy: 50,
    },
    status: 'published',
    featured: true,
    tags: ['music', 'festival', 'summer', 'outdoor'],
    artists: ['The Weeknd', 'Dua Lipa', 'Ed Sheeran'],
    ageRestriction: 'All Ages',
    bookingOpenDate: new Date(),
    bookingCloseDate: new Date('2025-07-14'),
  },
  {
    title: 'NBA Championship Finals',
    description: 'Watch the most exciting basketball game of the year! Two top teams battle it out for the championship trophy. Don\'t miss this historic moment!',
    category: 'Sports',
    venue: {
      name: 'Madison Square Garden',
      address: '4 Pennsylvania Plaza',
      city: 'Karur',
      state: 'Tamil Nadu',
      country: 'India',
      zipCode: '639001',
    },
    date: new Date('2025-06-20'),
    startTime: '20:00',
    endTime: '22:30',
    duration: 150,
    coverImage: {
      url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    },
    capacity: 150,
    pricing: {
      VIP: 500,
      Premium: 300,
      Standard: 150,
      Economy: 80,
    },
    status: 'published',
    featured: true,
    tags: ['basketball', 'NBA', 'championship', 'sports'],
    ageRestriction: 'All Ages',
    bookingOpenDate: new Date(),
    bookingCloseDate: new Date('2025-06-19'),
  },
  {
    title: 'Broadway: Hamilton',
    description: 'Experience the Tony Award-winning musical that tells the story of American founding father Alexander Hamilton. A must-see theatrical masterpiece!',
    category: 'Theater',
    venue: {
      name: 'Richard Rodgers Theatre',
      address: '226 W 46th St',
      city: 'Karur',
      state: 'Tamil Nadu',
      country: 'India',
      zipCode: '639001',
    },
    date: new Date('2025-08-10'),
    startTime: '19:30',
    endTime: '22:00',
    duration: 150,
    coverImage: {
      url: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    },
    capacity: 80,
    pricing: {
      VIP: 200,
      Premium: 150,
      Standard: 100,
      Economy: 60,
    },
    status: 'published',
    featured: false,
    tags: ['theater', 'musical', 'broadway', 'Hamilton'],
    ageRestriction: '13+',
    bookingOpenDate: new Date(),
    bookingCloseDate: new Date('2025-08-09'),
  },
  {
    title: 'Tech Innovation Conference 2025',
    description: 'Join industry leaders and innovators for a day of inspiring talks, workshops, and networking. Discover the latest trends in AI, blockchain, and more!',
    category: 'Conference',
    venue: {
      name: 'Convention Center',
      address: '655 West 34th Street',
      city: 'Karur',
      state: 'Tamil Nadu',
      country: 'India',
      zipCode: '639001',
    },
    date: new Date('2025-09-05'),
    startTime: '09:00',
    endTime: '18:00',
    duration: 540,
    coverImage: {
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    },
    capacity: 200,
    pricing: {
      VIP: 300,
      Premium: 200,
      Standard: 120,
      Economy: 80,
    },
    status: 'published',
    featured: true,
    tags: ['tech', 'conference', 'innovation', 'AI'],
    ageRestriction: '18+',
    bookingOpenDate: new Date(),
    bookingCloseDate: new Date('2025-09-04'),
  },
  {
    title: 'Comedy Night with Kevin Hart',
    description: 'Get ready to laugh until your sides hurt! Kevin Hart brings his hilarious stand-up comedy tour to town. One night only!',
    category: 'Comedy',
    venue: {
      name: 'Comedy Club Downtown',
      address: '789 Laugh Street',
      city: 'Karur',
      state: 'Tamil Nadu',
      country: 'India',
      zipCode: '639001',
    },
    date: new Date('2025-07-25'),
    startTime: '20:00',
    endTime: '22:00',
    duration: 120,
    coverImage: {
      url: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
    },
    capacity: 120,
    pricing: {
      VIP: 120,
      Premium: 80,
      Standard: 50,
      Economy: 30,
    },
    status: 'published',
    featured: false,
    tags: ['comedy', 'stand-up', 'Kevin Hart', 'entertainment'],
    artists: ['Kevin Hart'],
    ageRestriction: '18+',
    bookingOpenDate: new Date(),
    bookingCloseDate: new Date('2025-07-24'),
  },
  {
    title: 'Jazz & Wine Festival',
    description: 'An elegant evening of smooth jazz music paired with premium wines. Enjoy performances by world-class jazz musicians in a sophisticated atmosphere.',
    category: 'Festival',
    venue: {
      name: 'Riverside Gardens',
      address: '456 River Road',
      city: 'Karur',
      state: 'Tamil Nadu',
      country: 'India',
      zipCode: '639001',
    },
    date: new Date('2025-08-20'),
    startTime: '17:00',
    endTime: '23:00',
    duration: 360,
    coverImage: {
      url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
    },
    capacity: 150,
    pricing: {
      VIP: 180,
      Premium: 120,
      Standard: 80,
      Economy: 50,
    },
    status: 'published',
    featured: true,
    tags: ['jazz', 'festival', 'wine', 'music'],
    ageRestriction: '21+',
    bookingOpenDate: new Date(),
    bookingCloseDate: new Date('2025-08-19'),
  },
];

// Function to generate seats for an event
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

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing events
    await Event.deleteMany({});
    console.log('✓ Cleared existing events');

    // Find or create a default organizer user
    let organizer = await User.findOne({ email: 'admin@eventbooking.com' });
    
    if (!organizer) {
      organizer = await User.create({
        name: 'Event Organizer',
        email: 'admin@eventbooking.com',
        password: 'admin123', // Will be hashed automatically
        phone: '+1234567890',
        role: 'admin',
        isVerified: true,
      });
      console.log('✓ Created default admin user');
      console.log('  Email: admin@eventbooking.com');
      console.log('  Password: admin123');
    }

    // Create events with generated seats
    const eventsWithSeats = sampleEvents.map((event) => ({
      ...event,
      organizer: organizer._id,
      seats: generateSeats(event.capacity, event.pricing),
    }));

    const createdEvents = await Event.insertMany(eventsWithSeats);
    console.log(`✓ Created ${createdEvents.length} sample events`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Events Created:');
    createdEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} - ${event.category} - ${event.availableSeats} seats`);
    });

    console.log('\n👤 Admin Login Credentials:');
    console.log('Email: admin@eventbooking.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
