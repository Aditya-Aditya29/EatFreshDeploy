const mongoose = require('mongoose');


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

        name: { type: String,
           required: true 
          },

        restaurantName: { 
          type: String
         },

        restaurantImage:
         { 
          type: String
        },

        toppings:
         [{
           type: String
           }],
           
        sauces:
         [{ 
          type: String
         }],

        addOns:
         [{ 
          type: String
         }],

        recommendedItems:
         [{ 
          type: String
         }],

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



  const Order = mongoose.model('Order', orderSchema);
  
  module.exports =Order ;