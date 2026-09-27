const express = require('express');
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  checkAvailability,
} = require('../controllers/carController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getCars);
router.get('/:id/availability', checkAvailability);
router.get('/:id', getCarById);
router.post('/', protect, adminOnly, upload.array('images', 6), createCar);
router.put('/:id', protect, adminOnly, upload.array('images', 6), updateCar);
router.delete('/:id', protect, adminOnly, deleteCar);

module.exports = router;
