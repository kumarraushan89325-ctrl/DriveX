const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardOverview,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/overview', protect, adminOnly, getDashboardOverview);
router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, upload.single('profileImage'), updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
