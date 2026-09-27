const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Convertible', 'Pickup'],
      required: true,
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
      required: true,
    },
    transmission: { type: String, enum: ['Automatic', 'Manual'], required: true },
    seats: { type: Number, required: true, min: 2 },
    mileage: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 4.6, min: 0, max: 5 },
    bookingsCount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

carSchema.index({ brand: 'text', model: 'text', location: 'text' });

module.exports = mongoose.model('Car', carSchema);
