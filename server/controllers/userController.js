const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const { uploadImageFile } = require('../utils/uploadImages');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const isSelf = req.user._id.toString() === req.params.id;
    if (!isSelf && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You cannot view this profile.' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const isSelf = req.user._id.toString() === req.params.id;
    if (!isSelf && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You cannot update this profile.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const { name, phone, email, password } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Email is already in use.' });
      user.email = email;
    }
    if (password) user.password = password;
    if (req.file) {
      user.profileImage = await uploadImageFile(req.file);
    }

    await user.save();
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete your own account from here.' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    await Booking.deleteMany({ userId: user._id });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

const getDashboardOverview = async (req, res, next) => {
  try {
    const [totalCars, totalUsers, totalBookings, bookings] = await Promise.all([
      Car.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments(),
      Booking.find(),
    ]);
    const totalRevenue = bookings
      .filter((b) => b.bookingStatus !== 'Cancelled')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    res.json({
      totalCars,
      totalUsers,
      totalBookings,
      totalRevenue,
      activeBookings: bookings.filter((b) => ['Pending', 'Confirmed'].includes(b.bookingStatus)).length,
      pendingBookings: bookings.filter((b) => b.bookingStatus === 'Pending').length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser, getDashboardOverview };
