const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/:userId', auth, orderController.getUserOrders);
router.get('/order/:orderId', auth, orderController.getOrderById);

module.exports = router;