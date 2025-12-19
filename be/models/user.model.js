import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: String,

  otp: String,
  otpExpiry: Date,
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
