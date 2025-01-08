const mongoose=require('mongoose');

const UserPointsSchema=new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    points:{type:Number,default:0},
    updatedAt:{type:Date,default:Date.now}
});

const UserPoints=mongoose.model('UserPoints',UserPointsSchema);

module.exports=UserPoints;