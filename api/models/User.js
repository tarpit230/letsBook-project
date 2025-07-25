const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type:String, 
    required: true,
    unique:true,
  },
  password:{
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['guest', 'admin', 'hotelOwner', 'receptionist'],
    default: 'guest',
  },
  isVerified:{
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;