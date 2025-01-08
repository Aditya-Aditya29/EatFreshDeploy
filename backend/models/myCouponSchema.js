const mongoose = require('mongoose');

const myCouponSchema = new mongoose.Schema({
    userId:{
        type:'mongoose.Schema.Types.ObjectId',
        ref:'User',
        required:'true'
    },

    couponCode:{
        type:String,
        required:true,
        unique:true
    },

    pointsUsed:{
        type:Number,
    },

    redemeedAt:{
        type:Date,
        default:Date.now
    }
    });

const MyCoupon=mongoose.model('MyCoupon',myCouponSchema);

module.exports=MyCoupon;