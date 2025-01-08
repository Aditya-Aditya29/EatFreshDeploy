const Coupon = require('../models/couponModel');  // Import the Coupon model





exports.getAvailableCoupons = async (req, res) => {
  try {
    console.log("Fetching available coupons...");  // Debugging log
    const availableCoupons = await Coupon.find();  // Fetch all coupons from availableCoupons collection

    if (!availableCoupons || availableCoupons.length === 0) {
      console.log("No available coupons found.");  // Debugging log
      return res.status(404).json({ message: 'No available coupons found' });
    }

    res.status(200).json(availableCoupons);  // Send the coupons as a response
  } catch (err) {
    console.error('Error fetching coupons:', err);  // Log the error
    res.status(500).json({ message: 'Server Error' });  // Handle any errors
  }
};





exports.myRewards = async (req, res) => {
  try {
     const { userId } = req.params;
  
      // Fetch user points
      const userPoints = await UserPoints.findOne({ userId });
      if (!userPoints) {
        return res.status(404).json({ message: 'No points found for this user.' });
      }
  
      // Fetch user's redeemed coupons
      const redeemedCoupons = await MyCoupon.find({ userId });
  
      res.status(200).json({
        points: userPoints.points,
        updatedAt: userPoints.updatedAt,
        coupons: redeemedCoupons.map(coupon => ({
          id: coupon._id,
          couponCode: coupon.couponCode,
          pointsUsed: coupon.pointsUsed,
          redeemedAt: coupon.redemeedAt,
        })),
      });
    } catch (err) {
      console.error('Error in fetching rewards:', err);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  