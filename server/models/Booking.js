const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    pickupLocation: { type: String, required: true, trim: true },
    dropoffLocation: { type: String, required: true, trim: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    totalDays: { type: Number, required: true, min: 1 },
    pricePerDay: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    bookingStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

bookingSchema.index({ carId: 1, pickupDate: 1, returnDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
