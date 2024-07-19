import express from 'express';
import { sendOTP, verifyOTP } from '../utils/otp.js';

const router = express.Router();

// Request OTP for registration
router.post('/request-otp', async (req, res) => {
  const { phone } = req.body;

  try {

    const status = await sendOTP(phone);
   
    res.status(200).json({ message: 'OTP sent successfully',status });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Verify OTP and register driver
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const isValidOTP = await verifyOTP(phone, otp);
    if (!isValidOTP) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    res.status(201).json({ message: 'otp verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
