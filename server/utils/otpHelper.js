// utils/otpHelper.js
const twilio = require("twilio");
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const { sendEmail } = require("./sendEmail");
const { generateEmailTemplate } = require("./generateEmailTemplate");
const generateOTP = () => Math.floor(1000 + Math.random() * 5000);

const sendOTP = async ({ verifyBy, mobile, email, otp }) => {
  if (verifyBy === "phone") {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      to: mobile,
      from: process.env.TWILIO_PHONE,
    });
  } else {
    const htmlMessage = generateEmailTemplate(otp);
    await sendEmail({
      email,
      subject: "Your OTP Code",
      message:htmlMessage,
    });
  }
};

module.exports = { generateOTP, sendOTP };
