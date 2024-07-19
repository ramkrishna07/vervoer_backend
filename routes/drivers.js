import express from 'express';
import DriversInfo from '../models/DriversInfo.js';
import { sendOTP, verifyOTP } from '../utils/otp.js';

const router = express.Router();

// Request OTP for registration
router.post('/request-otp', async (req, res) => {
  const { phone } = req.body;

  try {
    const existingDriver = await DriversInfo.findOne({ phone });
    if (existingDriver) {
      return res.status(400).json({ message: 'Driver already exists' });
    }

    const status = await sendOTP(phone);
    res.status(200).json({ message: 'OTP sent successfully', status });
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

    const driver = new DriversInfo({ phone, isVerified: true });
    await driver.save();
    res.status(201).json({ message: 'Driver registered successfully', driverId: driver._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update vehicle info
router.post('/update-vehicle-info', async (req, res) => {
  const { driverId, vehicleInfo } = req.body;

  try {
    const driver = await DriversInfo.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.vehicleInfo = vehicleInfo;
    await driver.save();
    res.status(200).json({ message: 'Vehicle info updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update personal info
router.post('/update-personal-info', async (req, res) => {
  const { driverId, personalInfo } = req.body;

  try {
    const driver = await DriversInfo.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.personalInfo = personalInfo;
    await driver.save();
    res.status(200).json({ message: 'Personal info updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update credit card info
router.post('/update-credit-card-info', async (req, res) => {
  const { driverId, creditCardInfo } = req.body;

  try {
    const driver = await DriversInfo.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.creditCardInfo = creditCardInfo;
    await driver.save();
    res.status(200).json({ message: 'Credit card info updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update profile photo
router.post('/update-profile-photo', async (req, res) => {
  const { driverId, profilePhoto } = req.body;

  try {
    const driver = await DriversInfo.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.personalInfo.profilePhoto = profilePhoto;
    await driver.save();
    res.status(200).json({ message: 'Profile photo updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
