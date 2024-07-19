import mongoose from 'mongoose';

const rideShareSchema = new mongoose.Schema({
  pickupLocation: {
    type: String,
    required: true
  },
  dropoffLocation: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  numberOfPersons: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Rides = mongoose.model('Rides', rideShareSchema);

export default Rides;
