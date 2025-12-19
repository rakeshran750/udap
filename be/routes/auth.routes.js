import express from 'express';
import {
  sendSignupOtp,
  verifySignupOtp,
  completeSignup,
  resetPassword,
  sendResetOtp,
  login
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup/send-otp', sendSignupOtp);
router.post('/signup/verify-otp', verifySignupOtp);
router.post('/signup/complete', completeSignup);
router.post('/reset-password/send-otp', sendResetOtp);
router.post('/reset-password', resetPassword);
router.post('/login', login);

export default router;