import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import AuthRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import driverRoutes from './routes/drivers.js';
import otpRoutes from './routes/otp.js';
import rideRoutes from './routes/rides.js';

dotenv.config();
const PORT=process.env.PORT || 5000

const app=express();

app.use(bodyParser.json());
app.use(cors())

const connectionParams={
    useNewUrlParser:true,
    useUnifiedTopology:true
}
mongoose.connect(process.env.MONGO_URI,connectionParams)
    .then( ()=> {
        app.listen(PORT);
        console.log(`connected to database at ${PORT}`);
    })
    .catch((error) => {
        console.error(`Error connecting to the database. \n${error}`);
    });

// Routes
app.use('/auth',AuthRoutes);    
app.use('/otp', otpRoutes);
app.use('/bookings', bookingRoutes);
app.use('/drivers', driverRoutes);
app.use('/rides', rideRoutes);