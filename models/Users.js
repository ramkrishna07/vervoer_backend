import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false,
    unique: true
  },
  zipcode: {
    type: String,
    required: false
  }
});

const User =new  mongoose.model('User', UserSchema);

export default User;
