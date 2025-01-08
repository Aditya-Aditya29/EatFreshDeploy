const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Order must include userId and at least one item' });
    }

    const totalPrice = items.reduce((acc, item) => acc + item.total, 0);
    
    const newOrder = new Order({
      user: userId,
      items: items,
      totalPrice: totalPrice
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error during order creation' });
  }
};


exports.getUserOrders = async (req, res) => {
  try {
    // Find orders by userId and include all item details
    const orders = await Order.find({ user: req.params.userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    // Enhance the response with additional item details
    const enhancedOrders = orders.map(order => ({
      ...order._doc, // Spread original order data
      items: order.items.map(item => ({
        product: item.product,
        name: item.name,
        restaurantName: item.restaurantName,
        restaurantImage: item.restaurantImage,
        toppings: item.toppings || [],
        sauces: item.sauces || [],
        addOns: item.addOns || [],
        recommendedItems: item.recommendedItems || [],
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
    }));

    res.json({ orders: enhancedOrders });
  } catch (error) {
    // console.error('Fetch orders error:', error);
    res.status(500).json({ message: 'Server error during fetching orders' });
  }
};


// Fetch a single order by order ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const enhancedOrder = {
      // Exclude orders with payment status 'pending'
      ...order._doc,
      items: order.items.map(item => ({
        product: item.product,
        name: item.name,
        restaurantName: item.restaurantName,
        restaurantImage: item.restaurantImage,
        toppings: item.toppings || [],
        sauces: item.sauces || [],
        addOns: item.addOns || [],
        recommendedItems: item.recommendedItems || [],
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
    };

    res.json({ order: enhancedOrder });
  } catch (error) {
    console.error('Fetch order by ID error:', error);
    res.status(500).json({ message: 'Server error during fetching order' });
  }
};
