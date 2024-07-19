import express from 'express';
import Rides from '../models/Rides.js';
import User from '../models/Users.js';

const router = express.Router();

// Create a new booking
router.post('/new-ride', async (req, res) => {
  const { userId, pickupLocation, dropoffLocation, dateTime, numberOfPersons } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const rides = new Rides({
      user: user._id,
      pickupLocation,
      dropoffLocation,
      dateTime,
      numberOfPersons
    });

    await rides.save();

    res.status(201).json({ message: 'Booking created successfully', rides });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
