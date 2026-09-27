const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { calculatePricing, findOverlappingBooking, startOfDay } = require('../utils/bookingUtils');

const createBooking = async (req, res, next) => {
  try {
    const { carId, pickupLocation, dropoffLocation, pickupDate, returnDate } = req.body;
    if (!carId || !pickupLocation || !dropoffLocation || !pickupDate || !returnDate) {
      return res.status(400).json({ message: 'Please complete all booking fields.' });
    }

    const pickup = startOfDay(pickupDate);
    const ret = startOfDay(returnDate);
    const today = startOfDay(new Date());
    if (pickup < today) {
      return res.status(400).json({ message: 'Pickup date cannot be in the past.' });
    }
    if (ret <= pickup) {
      return res.status(400).json({ message: 'Return date must be after pickup date.' });
    }

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found.' });
    if (!car.isAvailable) {
      return res.status(400).json({ message: 'This car is currently unavailable.' });
    }

    const overlap = await findOverlappingBooking(car._id, pickup, ret);
    if (overlap) {
      return res.status(409).json({ message: 'This car is not available for the selected dates.' });
    }

    const { totalDays, subtotal, tax, totalAmount } = calculatePricing(pickup, ret, car.pricePerDay);
    if (totalDays < 1) {
      return res.status(400).json({ message: 'Booking must be at least 1 day.' });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      carId: car._id,
      pickupLocation,
      dropoffLocation,
      pickupDate: pickup,
      returnDate: ret,
      totalDays,
      pricePerDay: car.pricePerDay,
      subtotal,
      tax,
      totalAmount,
      bookingStatus: 'Pending',
      paymentStatus: 'Pending',
    });

    car.bookingsCount += 1;
    await car.save();

    const populated = await booking.populate([
      { path: 'carId' },
      { path: 'userId', select: 'name email phone' },
    ]);
    res.status(201).json({ booking: populated });
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('carId')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('carId')
      .populate('userId', 'name email phone');
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    const isOwner = booking.userId._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You cannot view this booking.' });
    }
    res.json({ booking });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    const isOwner = booking.userId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You cannot cancel this booking.' });
    }
    if (['Cancelled', 'Completed'].includes(booking.bookingStatus)) {
      return res.status(400).json({ message: 'This booking cannot be cancelled.' });
    }

    booking.bookingStatus = 'Cancelled';
    if (booking.paymentStatus === 'Paid') booking.paymentStatus = 'Refunded';
    await booking.save();
    res.json({ booking });
  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('carId')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    if (bookingStatus) {
      if (!['Pending', 'Confirmed', 'Cancelled', 'Completed'].includes(bookingStatus)) {
        return res.status(400).json({ message: 'Invalid booking status.' });
      }
      booking.bookingStatus = bookingStatus;
    }
    if (paymentStatus) {
      if (!['Pending', 'Paid', 'Failed', 'Refunded'].includes(paymentStatus)) {
        return res.status(400).json({ message: 'Invalid payment status.' });
      }
      booking.paymentStatus = paymentStatus;
    }

    await booking.save();
    const populated = await booking.populate([
      { path: 'carId' },
      { path: 'userId', select: 'name email phone' },
    ]);
    res.json({ booking: populated });
  } catch (error) {
    next(error);
  }
};

const getBookingStats = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('carId').populate('userId', 'name email');
    const now = new Date();
    const monthly = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        label: d.toLocaleString('en-US', { month: 'short' }),
        month: d.getMonth(),
        year: d.getFullYear(),
        bookings: 0,
        revenue: 0,
      };
    });

    let totalRevenue = 0;
    const carCounts = {};
    bookings.forEach((b) => {
      if (['Confirmed', 'Completed'].includes(b.bookingStatus) && b.paymentStatus === 'Paid') {
        totalRevenue += b.totalAmount;
      } else if (['Confirmed', 'Completed'].includes(b.bookingStatus)) {
        totalRevenue += b.totalAmount;
      }
      const created = new Date(b.createdAt);
      monthly.forEach((m) => {
        if (created.getMonth() === m.month && created.getFullYear() === m.year) {
          m.bookings += 1;
          if (b.bookingStatus !== 'Cancelled') m.revenue += b.totalAmount;
        }
      });
      const key = b.carId?._id?.toString();
      if (key) {
        carCounts[key] = carCounts[key] || {
          name: `${b.carId.brand} ${b.carId.model}`,
          count: 0,
        };
        carCounts[key].count += 1;
      }
    });

    const popularCars = Object.values(carCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    res.json({
      totalRevenue,
      monthly,
      popularCars,
      activeBookings: bookings.filter((b) => ['Pending', 'Confirmed'].includes(b.bookingStatus)).length,
      pendingBookings: bookings.filter((b) => b.bookingStatus === 'Pending').length,
      totalBookings: bookings.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingStats,
};
