const { validationResult } = require('express-validator');
const User = require('../models/User');
const { signToken, cookieOptions } = require('../middleware/authMiddleware');

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  profileImage: user.profileImage,
  createdAt: user.createdAt,
});

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, phone, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, phone, password, role: 'user' });
    const token = signToken(user._id);
    res.cookie('token', token, cookieOptions);
    res.status(201).json({ user: sanitizeUser(user), token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user._id);
    res.cookie('token', token, cookieOptions);
    res.json({ user: sanitizeUser(user), token });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie('token', { ...cookieOptions, maxAge: undefined });
  res.json({ message: 'Logged out successfully.' });
};

const getMe = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};

module.exports = { register, login, logout, getMe };
