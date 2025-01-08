const express=require('express');
const router = express.Router();
const rewardsController = require('../controllers/rewardsController');
// const auth = require('../middleware/auth');


router.post('/myRewards', rewardsController.myRewards);
router.get('/availableCoupons',rewardsController.getAvailableCoupons);

router.get('/test', (req, res) => {
    res.send('Router is working!');
  });
  


module.exports = router;