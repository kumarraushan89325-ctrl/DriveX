const Booking = require('../models/Booking');

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const calculatePricing = (pickupDate, returnDate, pricePerDay) => {
  const pickup = startOfDay(pickupDate);
  const ret = startOfDay(returnDate);
  const totalDays = Math.round((ret - pickup) / MS_PER_DAY);
  const taxRate = Number(process.env.TAX_RATE || 0.18);
  const subtotal = totalDays * pricePerDay;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const totalAmount = Math.round((subtotal + tax) * 100) / 100;
  return { totalDays, subtotal, tax, totalAmount, taxRate };
};

const hasDateOverlap = (existingStart, existingEnd, nextStart, nextEnd) =>
  startOfDay(existingStart) < startOfDay(nextEnd) && startOfDay(nextStart) < startOfDay(existingEnd);

const findOverlappingBooking = async (carId, pickupDate, returnDate, excludeBookingId) => {
  const query = {
    carId,
    bookingStatus: { $in: ['Pending', 'Confirmed'] },
    pickupDate: { $lt: startOfDay(returnDate) },
    returnDate: { $gt: startOfDay(pickupDate) },
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };
  return Booking.findOne(query);
};

module.exports = {
  startOfDay,
  calculatePricing,
  hasDateOverlap,
  findOverlappingBooking,
};
