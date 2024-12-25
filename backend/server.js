const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'habhcb345323rfvcx4tfvdyr54x';

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/EatFresh', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
});

// Order Schema
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User schema
    required: true
  },
  items: [
    {
      product: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      },
      total: {
        type: Number,
        required: true
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'shipped'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone,address =""} = req.body;

    // Validate input
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword, phone, address });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// test\
// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Token Verification Route
app.get('/verify-token', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ valid: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ valid: false });
    }

    res.json({ 
      valid: true,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

app.get("/users/:id",async (req,res)=>{
  const user = await User.findById(req.params.id);
  if(!user){
    res.status(404).json({
      "message":"404 Error"
    })
  }else{
    res.status(200).json({
      user:user,
      message: "user Found"
    })
  }

})


app.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body; // Assuming the updated data is sent in the request body
  console.log(userId, updateData);
  try {
    // Validate the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "user not found" });
    }
    // Update the user data
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Return the updated user object
      runValidators: true, // Ensure data validation is performed
    });

    return res.status(200).json({
      success: true,
      message: "user updated successfully",
      user: updatedUser.toObject ? updatedUser.toObject() : updatedUser, // Ensure a plain object
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});




// Create Order Route
app.post('/Orders', async (req, res) => {
  try {
    const { userId, items } = req.body;

    // Validate input
    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Order must include userId and at least one item' });
    }

    // Calculate total price
    const totalPrice = items.reduce((acc, item) => acc + item.total, 0);
    console.log('Total Price:', totalPrice);
    
    // Create new order
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
});

// Fetch Orders by User ID Route
app.get('/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId }).populate('items.product');

    if (!orders) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.json({ orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ message: 'Server error during fetching orders' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
