// const mongoose = require('mongoose');

// // Define the User schema
// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     trim: true,
//     maxlength: [50, 'Name cannot exceed 50 characters'],
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: [6, 'Password must be at least 6 characters long'],
//   },
//   phone: {
//     type: String,
//     trim: true,
//     match: [/^\d{10}$/, 'Phone number must be 10 digits'],
//   },
//   address: {
//     type: String,
//     trim: true,
//     default: '',
//   },
//   image: {
//     type: String,
//     trim: true,
//     default: '',
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },

// });


// const User = mongoose.model('User', userSchema);

// module.exports = User;



const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits'],
  },
  address: {
    type: String,
    trim: true,
    default: '',
  },
  image: {
    type: String,
    trim: true,
    default: '',
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a pre-save hook to update the `updatedAt` field automatically
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);
  
module.exports = User;
