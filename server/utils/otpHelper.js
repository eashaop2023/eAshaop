// utils/otpHelper.js
const twilio = require("twilio");
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const { sendEmail } = require("./sendEmailUser"); // Use fixed Brevo email
const { generateEmailTemplate } = require("./generateEmailTemplate");

const generateOTP = () => Math.floor(1000 + Math.random() * 5000);

const sendOTP = async ({ verifyBy, mobile, email, otp }) => {
  try {
    // Normalize verifyBy to handle both "phone" and "mobile"
    const method = verifyBy?.toLowerCase();
    
    // Validate verifyBy value
    if (method !== "phone" && method !== "mobile" && method !== "email") {
      throw new Error("Invalid verifyBy value. Use 'phone', 'mobile', or 'email'.");
    }

    if (method === "phone" || method === "mobile") {
      // Send OTP via SMS
      if (!mobile) {
        throw new Error("Mobile number is required for phone verification");
      }
      await client.messages.create({
        body: `Your OTP is ${otp}`,
        to: mobile,
        from: process.env.TWILIO_PHONE,
      });
    } else if (method === "email") {
      // Send OTP via Email
      if (!email) {
        throw new Error("Email is required for email verification");
      }
      // Ensure OTP is a string for email template
      const otpString = String(otp);
      console.log(`Attempting to send OTP email to: ${email}, OTP: ${otpString}`);
      const htmlMessage = generateEmailTemplate(otpString);
      await sendEmail({
        email,
        subject: "Your OTP Code",
        message: htmlMessage,
      });
      console.log(`OTP email sent successfully to: ${email}`);
    }
  } catch (error) {
    console.error("Failed to send OTP:", error);
    throw error;
  }
};

module.exports = { generateOTP, sendOTP };
