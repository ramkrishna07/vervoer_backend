import mongoose from 'mongoose';

const personalInfoSchema = new mongoose.Schema({
//   email: String,
//   phone: String,
  firstName: String,
  middleName: String,
  lastName: String,
  dob: Date,
  profilePhoto: String,
  socialSecurityNo: String,
  driversLicenceCardNo: String,
  licenceExpiryDate: Date,
  driversLicencePhoto: String,
  driversAvailability: String,
  backgroundCheck: String,
  rideshareCompanyName: String,
  residentialInfo: {
    address1: String,
    address2: String,
    city: String,
    state: String,
    zipcode: Number
  }
});

const vehicleInfoSchema = new mongoose.Schema({
  year: Number,
  brand: String,
  model: String,
  doors: Number,
  color: String,
  seats: String,
  seatsno:Number,
  boosterSeats: Number,
  vin: String,
  registrationNo: String,
  vehicleInspectionPhoto: String,
  driversInsurancePhoto: String,
  localCertificationPhoto: String,
  insuranceInfo: {
    provider: String,
    insuranceNumber: String
  }
});

const creditCardInfoSchema = new mongoose.Schema({
  creditCardPhoto: String,
  bankName: String,
  routingNumber: String,
  accountNumber: String,
  accountHolderName: String
});

const driverSchema = new mongoose.Schema({
  phone: String,
  email: String,
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  otp: String,
  personalInfo: personalInfoSchema,
  vehicleInfo: vehicleInfoSchema,
  creditCardInfo: creditCardInfoSchema
});

const DriversInfo = mongoose.model('DriversInfo', driverSchema);

export default DriversInfo;
