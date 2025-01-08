const express = require('express');
const router = express.Router();

// Import routes
const userRoutes = require('./userRoutes');
const orderRoutes = require('./orderRoutes');
const rewardsRoutes = require('./rewardsRoutes');

// Routes
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/coupons', rewardsRoutes);
// new ones

module.exports = router;