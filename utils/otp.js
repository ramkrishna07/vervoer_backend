import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const serviceId = process.env.TWILO_SERVICE_SID; // Twilio Verify Service SID

export const sendOTP = async (phone) => {
  try {
    await client.verify.v2
      .services(serviceId)
      .verifications.create({
        channel: "sms",
        to: `${phone}`
      });
    return 'pending';
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP...');
  }
};

export const verifyOTP = async (phone, otp) => {
  try {
    const verificationCheck = await client.verify.v2
      .services(serviceId)
      .verificationChecks.create({
        code: `${otp}`,
        to: `${phone}`
      });
    return verificationCheck.status === 'approved';
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Failed to verify OTP');
  }
};
