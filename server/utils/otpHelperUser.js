const twilio = require("twilio");
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const { sendEmail } = require("./sendEmailUser");
const { generateEmailTemplate } = require("./generateEmailTemplateUser");

// Generate a 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 5000);

const sendOTP = async ({ verifyBy, mobile, email, otp }) => {
  try {
    if (verifyBy === "phone") {
      // Send OTP via SMS
      await client.messages.create({
        body: `Your OTP is ${otp}`,
        to: mobile,
        from: process.env.TWILIO_PHONE,
      });
    } else if (verifyBy === "email") {
      // Send OTP via Email
      const htmlMessage = generateEmailTemplate(otp);
      await sendEmail({
        email,
        subject: "Your OTP Code",
        message: htmlMessage, // Use html if your sendEmail supports it
      });
    } else {
      throw new Error("Invalid verifyBy value. Use 'phone' or 'email'.");
    }
  } catch (error) {
    console.error("Failed to send OTP:", error);
    throw error;
  }
};

module.exports = { generateOTP, sendOTP };
