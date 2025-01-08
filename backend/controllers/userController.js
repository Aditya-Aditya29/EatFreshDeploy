const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants.js');
const crypto = require('crypto');
// const sendEmail = require('../utils/sendEmail');
const mongoose = require('mongoose');

exports.signup = async (req, res) => {
  try {
    
    const { name, email, password, phone, address = "", image = ""} = req.body;
    
    // if (password !== confirmPassword){
    //     return res.status(400).json({ message: 'Passwords do not match' });
    // }

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phone, address, image });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

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
};

exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
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
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // console.log(user);
    if (!user) {
      return res.status(404).json({ message: '404 Error' });
    }
    res.status(200).json({ user, message: 'User Found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};




exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
   

    const user = await User.findById(id);
    console.log("User found for editing:", user);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update only the fields that are provided in the request body
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        user[key] = req.body[key];
      }
    });

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser.toObject()
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};




exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User found' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};





