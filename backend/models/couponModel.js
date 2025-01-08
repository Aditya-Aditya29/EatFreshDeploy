const mongoose = require('mongoose');


const couponSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  couponCode: { type: String, required: true, unique: true },
  points: { type: Number, required: true },
  image: { type: String, required: true },
});

// Create the Coupon model
const Coupon = mongoose.model('Coupon', couponSchema, 'availableCoupons');

// Export the model
module.exports = Coupon;
