import mongoose from 'mongoose';

const journeyDetailsSchema = new mongoose.Schema({
  pickupLocation: String,
  dropoffLocation: String,
  time: Date,
  noOfPersons: Number
});

const driverDetailsSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DriversInfo'
  },
  name: String,
  phone: String,
  profilePhoto: String
});

const vehicleDetailsSchema = new mongoose.Schema({
  brand: String,
  model: String,
  doors: Number
});

const paymentSummarySchema = new mongoose.Schema({
  startedAt: Date,
  endedAt: Date,
  timeUsed: Number, // in hours
  pricePerHour: Number,
  totalPrice: Number,
  tax: Number,
  tip: {
    type: Number,
    default: 0
  },
  totalPayment: Number
});

const ridesInfoSchema = new mongoose.Schema({
  rating:{
    type:Number,
    default:0
  },
  journeyDetails: journeyDetailsSchema,
  driverDetails: driverDetailsSchema,
  vehicleDetails: vehicleDetailsSchema,
  paymentSummary: paymentSummarySchema
});



const RidesInfo = mongoose.model('RidesInfo', ridesInfoSchema);

export default RidesInfo;
