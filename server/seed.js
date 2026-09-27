require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Car = require('./models/Car');
const Booking = require('./models/Booking');

const sampleCars = [
  {
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    pricePerDay: 4200,
    category: 'Sedan',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    mileage: '16 km/l',
    location: 'Mumbai',
    images: [
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'A refined mid-size sedan with a quiet cabin, strong safety ratings and excellent highway comfort. Ideal for city commutes and airport transfers.',
    features: [
      'Air Conditioning',
      'Bluetooth',
      'GPS',
      'USB',
      'Rear Camera',
      'Cruise Control',
    ],
    isAvailable: true,
    rating: 4.7,
    bookingsCount: 18,
  },

  {
    brand: 'Honda',
    model: 'City',
    year: 2024,
    pricePerDay: 3100,
    category: 'Sedan',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    mileage: '18 km/l',
    location: 'Delhi',
    images: [
      'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Compact, fuel-efficient and easy to park. The Honda City is a reliable daily driver with a spacious rear seat and modern infotainment.',
    features: [
      'Air Conditioning',
      'Bluetooth',
      'USB',
      'Parking Sensors',
      'Touchscreen',
    ],
    isAvailable: true,
    rating: 4.5,
    bookingsCount: 24,
  },

  {
    brand: 'Hyundai',
    model: 'Creta',
    year: 2024,
    pricePerDay: 3900,
    category: 'SUV',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seats: 5,
    mileage: '19 km/l',
    location: 'Bangalore',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'A best-selling compact SUV with a commanding driving position, generous ground clearance and a feature-rich cabin.',
    features: [
      'Air Conditioning',
      'GPS',
      'Sunroof',
      'Bluetooth',
      'USB',
      'Parking Sensors',
    ],
    isAvailable: true,
    rating: 4.8,
    bookingsCount: 31,
  },

  {
    brand: 'Mahindra',
    model: 'Thar',
    year: 2023,
    pricePerDay: 4500,
    category: 'SUV',
    fuelType: 'Diesel',
    transmission: 'Manual',
    seats: 4,
    mileage: '15 km/l',
    location: 'Pune',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Built for adventure. The Thar offers rugged off-road capability, removable roof panels and unmistakable road presence.',
    features: [
      '4x4',
      'Air Conditioning',
      'Bluetooth',
      'USB',
      'Hill Descent Control',
    ],
    isAvailable: true,
    rating: 4.6,
    bookingsCount: 22,
  },

  {
    brand: 'Tata',
    model: 'Nexon',
    year: 2024,
    pricePerDay: 2800,
    category: 'SUV',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seats: 5,
    mileage: '17 km/l',
    location: 'Hyderabad',
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'A 5-star safety compact SUV with a punchy engine, high seating and a well-built cabin. Perfect for families and weekend trips.',
    features: [
      'Air Conditioning',
      'Bluetooth',
      'USB',
      'Parking Sensors',
      'ABS',
    ],
    isAvailable: true,
    rating: 4.4,
    bookingsCount: 16,
  },

  {
    brand: 'BMW',
    model: '3 Series',
    year: 2023,
    pricePerDay: 9800,
    category: 'Luxury',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    mileage: '14 km/l',
    location: 'Mumbai',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'The benchmark sports sedan. Precise steering, a premium interior and effortless performance for business travel or special occasions.',
    features: [
      'Air Conditioning',
      'Automatic Climate Control',
      'GPS',
      'Bluetooth',
      'Leather Seats',
      'Sunroof',
    ],
    isAvailable: true,
    rating: 4.9,
    bookingsCount: 12,
  },

  {
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2024,
    pricePerDay: 11200,
    category: 'Luxury',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    mileage: '13 km/l',
    location: 'Delhi',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d6?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c22870f3b?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Quiet luxury with a sculpted cabin, ambient lighting and a smooth ride. Arrive in style for meetings, weddings or airport pickups.',
    features: [
      'Air Conditioning',
      'Automatic Climate Control',
      'GPS',
      'Leather Seats',
      'Parking Sensors',
      'USB',
    ],
    isAvailable: true,
    rating: 4.9,
    bookingsCount: 9,
  },

  {
    brand: 'Audi',
    model: 'A4',
    year: 2023,
    pricePerDay: 10500,
    category: 'Luxury',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    mileage: '14 km/l',
    location: 'Bangalore',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Understated German luxury with Quattro-inspired handling, a virtual cockpit and a whisper-quiet cabin.',
    features: [
      'Air Conditioning',
      'GPS',
      'Bluetooth',
      'Leather Seats',
      'USB',
      'Parking Sensors',
    ],
    isAvailable: true,
    rating: 4.8,
    bookingsCount: 11,
  },
];

const seed = async () => {
  await connectDB();

  // Clear old data
  await Booking.deleteMany({});
  await Car.deleteMany({});
  await User.deleteMany({});

  // Create Admin
  const admin = await User.create({
    name: 'DriveNow Admin',
    email: process.env.ADMIN_EMAIL || 'admin@drivenow.com',
    phone: '9876543210',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    role: 'admin',
  });

  // Create Customer
  const customer = await User.create({
    name: 'Aarav Mehta',
    email: 'customer@drivenow.com',
    phone: '9123456780',
    password: 'Customer@123',
    role: 'user',
  });

  // Insert cars
  const cars = await Car.insertMany(sampleCars);

  // Create sample booking
  const pickup = new Date();
  pickup.setDate(pickup.getDate() + 3);
  pickup.setHours(0, 0, 0, 0);

  const ret = new Date(pickup);
  ret.setDate(ret.getDate() + 3);

  const pricePerDay = cars[0].pricePerDay;
  const totalDays = 3;

  const subtotal = totalDays * pricePerDay;

  const tax = Math.round(subtotal * 0.18 * 100) / 100;

  await Booking.create({
    userId: customer._id,
    carId: cars[0]._id,
    pickupLocation: 'Mumbai',
    dropoffLocation: 'Mumbai',
    pickupDate: pickup,
    returnDate: ret,
    totalDays,
    pricePerDay,
    subtotal,
    tax,
    totalAmount: subtotal + tax,
    bookingStatus: 'Confirmed',
    paymentStatus: 'Paid',
  });

  console.log('Seed complete.');
  console.log(
    'Admin login:   ',
    admin.email,
    '/',
    process.env.ADMIN_PASSWORD || 'Admin@123'
  );

  console.log(
    'Customer login:',
    customer.email,
    '/ Customer@123'
  );

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});