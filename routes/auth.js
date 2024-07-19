import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import jwt from 'jsonwebtoken';
const router = express.Router();
const accountSid='ACa84ac8b4a3d29ec5a482bf38aabb8924';
const authToken='271ef80782c40cce565e0239412b14c2';
import twilio from "twilio";

const client = twilio(accountSid,authToken);

let user,OTP,mobile;
// Register user with phone, password, and confirm password
router.post('/register', async (req, res) => {
  const { phone, password, confirmPassword } = req.body;
  
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  
  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    mobile=phone;
    const hashedPassword = await bcrypt.hash(password, 12);
    user = new User({ phone, password: hashedPassword });
    let digits="0123456789";
    OTP ="";
    for(let i=0;i<4;i++){
      OTP+=digits[Math.floor(Math.random()*10)];
    }

    await client.verify.v2
    .services("VA5e9d4886701894b7cb5771c6d6925efc")
    .verifications.create({
      channel:"sms",
      to:`${phone}`
    }).then(()=>res.status(200).json({msg:"message sent"}));
    // await client.messages
    //   .create({
    //     body:`your otp is ${OTP}`,
    //     messagingServiceSid:"VA5e9d4886701894b7cb5771c6d6925efc",
    //     from:"+13613145017",
    //     to:"+919647826354"
    //   })
    //   .then(()=>res.status(200).json({msg:"message sent"}));
    //   .done();
    
    //await user.save();
    //res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


router.post('/register/verify',async(req,res)=>{
  try {
    //console.log(req.body);
    const {otp} = req.body;

    await client.verify.v2
    .services("VA5e9d4886701894b7cb5771c6d6925efc")
    .verificationChecks.create({
      code:`${otp}`,
      to:`${mobile}`,
    }).then(()=>res.status(201).json({message: 'User registered successfully', userId: user._id}));
    user=await user.save();
    // if(otp!=OTP){
    //   return res.status(400).json({msg:"incorrect otp"});
    // }
    // user=await user.save();
    // const token=jwt.sign({id:user._id},"passwordkey");
    // res.status(200).json({userId: user._id})
    // OTP="";
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
})

// Update user with personal info
router.post('/personal-info', async (req, res) => {
  const { userId, firstName, lastName, email, zipcode } = req.body;
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.zipcode = zipcode;
    await user.save();
    
    res.status(200).json({ message: 'User info updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not registered' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });


export default router;
