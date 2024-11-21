import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isDoctor: Boolean,
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
});

export const User = mongoose.model('User', userSchema);
