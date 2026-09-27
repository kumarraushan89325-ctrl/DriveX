const Car = require('../models/Car');
const { findOverlappingBooking } = require('../utils/bookingUtils');
const { uploadImageFiles } = require('../utils/uploadImages');

const getCars = async (req, res, next) => {
  try {
    const {
      search,
      brand,
      fuelType,
      transmission,
      seats,
      category,
      minPrice,
      maxPrice,
      location,
      available,
      pickupDate,
      returnDate,
      sort,
    } = req.query;

    const filter = {};
    if (brand) filter.brand = brand;
    if (fuelType) filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;
    if (category) filter.category = category;
    if (seats) filter.seats = Number(seats);
    if (location) filter.location = location;
    if (available === 'true') filter.isAvailable = true;
    if (available === 'false') filter.isAvailable = false;
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }

    let query = Car.find(filter);
    if (sort === 'price_asc') query = query.sort({ pricePerDay: 1 });
    else if (sort === 'price_desc') query = query.sort({ pricePerDay: -1 });
    else if (sort === 'newest') query = query.sort({ createdAt: -1 });
    else if (sort === 'popular') query = query.sort({ bookingsCount: -1, rating: -1 });
    else query = query.sort({ createdAt: -1 });

    let cars = await query.lean();

    if (pickupDate && returnDate) {
      const availableCars = [];
      for (const car of cars) {
        if (!car.isAvailable) continue;
        const overlap = await findOverlappingBooking(car._id, pickupDate, returnDate);
        if (!overlap) availableCars.push(car);
      }
      cars = availableCars;
    }

    res.json({ cars, count: cars.length });
  } catch (error) {
    next(error);
  }
};

const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found.' });
    res.json({ car });
  } catch (error) {
    next(error);
  }
};

const createCar = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (typeof payload.features === 'string') {
      payload.features = payload.features.split(',').map((f) => f.trim()).filter(Boolean);
    }
    if (req.files?.length) {
      payload.images = await uploadImageFiles(req.files);
    } else if (typeof payload.images === 'string') {
      payload.images = payload.images.split(',').map((i) => i.trim()).filter(Boolean);
    }
    payload.pricePerDay = Number(payload.pricePerDay);
    payload.year = Number(payload.year);
    payload.seats = Number(payload.seats);
    payload.isAvailable = payload.isAvailable === 'false' ? false : true;

    const car = await Car.create(payload);
    res.status(201).json({ car });
  } catch (error) {
    next(error);
  }
};

const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found.' });

    const payload = { ...req.body };
    if (typeof payload.features === 'string') {
      payload.features = payload.features.split(',').map((f) => f.trim()).filter(Boolean);
    }
    if (req.files?.length) {
      const uploaded = await uploadImageFiles(req.files);
      payload.images = [...(car.images || []), ...uploaded];
    } else if (typeof payload.images === 'string') {
      payload.images = payload.images.split(',').map((i) => i.trim()).filter(Boolean);
    }
    if (payload.pricePerDay) payload.pricePerDay = Number(payload.pricePerDay);
    if (payload.year) payload.year = Number(payload.year);
    if (payload.seats) payload.seats = Number(payload.seats);
    if (payload.isAvailable !== undefined) {
      payload.isAvailable = payload.isAvailable === true || payload.isAvailable === 'true';
    }

    const updated = await Car.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    res.json({ car: updated });
  } catch (error) {
    next(error);
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found.' });
    res.json({ message: 'Car deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

const checkAvailability = async (req, res, next) => {
  try {
    const { pickupDate, returnDate } = req.query;
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found.' });
    if (!car.isAvailable) {
      return res.json({ available: false, message: 'This car is currently unavailable.' });
    }
    const overlap = await findOverlappingBooking(car._id, pickupDate, returnDate);
    if (overlap) {
      return res.json({
        available: false,
        message: 'This car is not available for the selected dates.',
      });
    }
    res.json({ available: true, message: 'Car is available for the selected dates.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar, checkAvailability };
