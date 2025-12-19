import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { sendEmail } from '../utils/sendEmail.js';
import { generateToken } from '../config/jwtConfig.js';
import {getOTPEmailTemplate } from '../utils/templateProvider.js'


const generateOTP = () =>Math.floor(100000 + Math.random() * 900000).toString();

export const sendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const alreadyUser = await User.findOne({ email, isVerified: true });
    if (alreadyUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = generateOTP();

    await User.findOneAndUpdate(
      { email },
      {
        email,
        otp,
        otpExpiry: Date.now() + 10 * 60 * 1000 // 10 min
      },
      { upsert: true, new: true }
    );


    const emailTpl = getOTPEmailTemplate({ otp });

    // await sendEmail({
    //   to: email,
    //   subject: 'Signup OTP',
    //   text: `Your OTP is ${otp}`,
    //   html: `<h3>Your OTP is ${otp}</h3><p>Valid for 10 minutes</p>`
    // });

    await sendEmail({
      to: email,
      subject: emailTpl.subject,
      text: emailTpl.text,
      html: emailTpl.html,
    });

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP' , err:err });
  }
};

export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed' });
  }
};


export const completeSignup = async (req, res) => {
  try {
    const { email, name, phone, password } = req.body;

    const user = await User.findOne({ email, isVerified: true });

    if (!user) {
      return res.status(400).json({ message: 'Email not verified' });
    }

    if (user.password) {
      return res.status(400).json({ message: 'Signup already completed' });
    }

    // Save user details
    user.name = name;
    user.phone = phone;
    user.password = await bcrypt.hash(password, 10);

    await user.save();

    // Generate JWT (auto-login)
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
};

export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ User must exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2️⃣ Generate OTP
    const otp = generateOTP();

    // 3️⃣ Save OTP
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // 4️⃣ Send email
    await sendEmail({
      to: email,
      subject: 'Reset Password OTP',
      text: `Your password reset OTP is ${otp}`,
      html: `<h3>Your OTP is ${otp}</h3><p>Valid for 10 minutes</p>`
    });

    res.json({ message: 'Reset OTP sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send reset OTP' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2️⃣ Validate OTP
    if (
      user.otp !== otp ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // 3️⃣ Hash new password
    user.password = await bcrypt.hash(newPassword, 10);

    // 4️⃣ Clear OTP data
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Password reset failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};