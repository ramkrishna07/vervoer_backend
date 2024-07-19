import express from 'express';
import RidesInfo from '../models/RidesInfo.js';
import DriversInfo from '../models/DriversInfo.js';

const router = express.Router();

// Step 1: Enter journey details
router.post('/journey-details', async (req, res) => {
  const { pickupLocation, dropoffLocation, time, noOfPersons } = req.body;

  try {
    const journeyDetails = {
      pickupLocation,
      dropoffLocation,
      time,
      noOfPersons
    };

    // Temporarily save the journey details
    const tempRide = new RidesInfo({ journeyDetails });
    await tempRide.save();

    res.status(201).json({ message: 'Journey details saved', rideId: tempRide._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Step 2: Get available drivers
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await DriversInfo.find({}, 'personalInfo vehicleInfo');
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Step 3: Select driver and save ride info
router.post('/select-driver', async (req, res) => {
  const { rideId, driverId } = req.body;

  try {
    const ride = await RidesInfo.findById(rideId);
    const driver = await DriversInfo.findById(driverId);

    if (!ride || !driver) {
      return res.status(404).json({ message: 'Ride or Driver not found' });
    }

    const { firstName, lastName, phone, profilePhoto } = driver.personalInfo;
    const { brand, model, doors } = driver.vehicleInfo;

    ride.driverDetails = {
      driverId: driver._id,
      name: `${firstName} ${lastName}`,
      phone,
      profilePhoto
    };

    ride.vehicleDetails = {
      brand,
      model,
      doors
    };

    await ride.save();

    res.status(200).json({ message: 'Ride info updated successfully', ride });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// Step 4: Cancel ride
router.delete('/cancel-ride', async (req, res) => {
  const { rideId, reason } = req.body;

  try {
    const ride = await RidesInfo.findByIdAndDelete(rideId);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Log the cancellation reason if needed
    console.log(`Ride with ID ${rideId} was cancelled. Reason: ${reason}`);

    res.status(200).json({ message: 'Ride cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Step 5: Store payment summary
router.post('/payment-summary', async (req, res) => {
  const { rideId, endedAt, pricePerHour, tax, tip } = req.body;

  try {
    const ride = await RidesInfo.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    const startedAt = ride.journeyDetails.time;
    const timeUsed = (new Date(endedAt) - new Date(startedAt)) / 3600000; // time used in hours
    const totalPrice = timeUsed * pricePerHour;
    const totalPayment = totalPrice + tax + (tip || 0);

    ride.paymentSummary = {
      startedAt,
      endedAt,
      timeUsed,
      pricePerHour,
      totalPrice,
      tax,
      tip,
      totalPayment
    };

    await ride.save();

    res.status(200).json({ message: 'Payment summary saved successfully', ride });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Step 6: Rate ride
router.post('/rate-ride', async (req, res) => {
  const { rideId, rating } = req.body;

  if (rating < 0 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 0 and 5' });
  }

  try {
    const ride = await RidesInfo.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    ride.rating = rating;
    await ride.save();

    res.status(200).json({ message: 'Rating updated successfully', ride });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
