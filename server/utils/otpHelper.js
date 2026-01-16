// utils/otpHelper.js
const twilio = require("twilio");
// Initialize Twilio client only if credentials are available
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log("✅ Twilio client initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Twilio client:", error);
  }
} else {
  console.warn("⚠️  Twilio credentials not found. SMS OTP will not work.");
}
const { sendEmail } = require("./sendEmailUser"); // Brevo email sender
const { generateEmailTemplate } = require("./generateEmailTemplateUser");
const OTPModel = require("../models/otpModel"); // MongoDB model

// Generate 4-digit OTP as string (handles leading zeros)
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Send OTP with rate-limit and expiry
const sendOTP = async ({ verifyBy, mobile, email, otp: providedOtp }) => {
  try {
    const method = verifyBy?.toLowerCase();
    const identifier = method === "email" ? email : mobile;

    if (!identifier) throw new Error(`${method} is required for OTP verification`);
    if (!["phone", "mobile", "email"].includes(method)) {
      throw new Error("Invalid verifyBy value. Use 'phone', 'mobile', or 'email'.");
    }

    // Use provided OTP or generate new one
    const otp = providedOtp || generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    // Rate-limit: prevent sending OTP within 30 seconds
    const existing = await OTPModel.findOne({ identifier, method });
    if (existing && existing.createdAt > new Date(Date.now() - 30 * 1000)) {
      throw new Error("OTP already sent. Please wait 30 seconds before requesting again.");
    }

    // Save OTP to MongoDB (store as string)
    await OTPModel.findOneAndUpdate(
      { identifier, method },
      { otp, expiresAt, method, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send SMS via Twilio
    if (method === "phone" || method === "mobile") {
      // Check if Twilio credentials are configured
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
        const errorMsg = "Twilio credentials not configured. Please check your .env file for TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER";
        console.error(`❌ ${errorMsg}`);
        throw new Error(errorMsg);
      }

      // Check if Twilio client is initialized
      if (!client) {
        const errorMsg = "Twilio client not initialized. Please check your Twilio credentials in .env file.";
        console.error(`❌ ${errorMsg}`);
        throw new Error(errorMsg);
      }

      // Format phone number (ensure it starts with + and country code)
      let formattedMobile = mobile.trim();
      if (!formattedMobile.startsWith('+')) {
        // If it starts with 0, replace with country code (assuming India +91)
        if (formattedMobile.startsWith('0')) {
          formattedMobile = '+91' + formattedMobile.substring(1);
        } else if (formattedMobile.length === 10) {
          formattedMobile = '+91' + formattedMobile;
        } else {
          formattedMobile = '+' + formattedMobile;
        }
      }

      try {
        console.log(`📱 Attempting to send SMS to: ${formattedMobile}`);
        console.log(`📞 From number: ${process.env.TWILIO_PHONE_NUMBER}`);
        console.log(`🔑 OTP: ${otp}`);
        
      const message = await client.messages.create({
        body: `Your eAshaOP OTP is ${otp}`,
          to: formattedMobile, // must be verified in Twilio trial
        from: process.env.TWILIO_PHONE_NUMBER,
      });
        
        console.log(`✅ Twilio message created - SID: ${message.sid}, Status: ${message.status}`);
        console.log(`📱 OTP: ${otp} sent to ${formattedMobile}`);
        
        // Check message status - if it's queued/failed, log warning
        if (message.status === 'failed' || message.status === 'undelivered') {
          console.error(`⚠️  WARNING: Message status is ${message.status}. SMS may not be delivered.`);
          console.error(`   Error Code: ${message.errorCode}, Error Message: ${message.errorMessage}`);
          throw new Error(`SMS delivery failed: ${message.errorMessage || message.status}`);
        }
        
        // For trial accounts, check if number needs verification
        if (message.status === 'queued') {
          console.log(`ℹ️  Message queued. Check Twilio console for delivery status.`);
        }
        
      } catch (twilioError) {
        console.error("❌ Twilio SMS Error Details:");
        console.error("   Code:", twilioError.code);
        console.error("   Message:", twilioError.message);
        console.error("   Status:", twilioError.status);
        if (twilioError.moreInfo) {
          console.error("   More Info:", twilioError.moreInfo);
        }
        
        // Provide helpful error messages
        if (twilioError.code === 21211) {
          throw new Error("Invalid phone number format. Please use format: +91XXXXXXXXXX");
        } else if (twilioError.code === 21608 || twilioError.code === 21610) {
          throw new Error(`Phone number not verified in Twilio. For trial accounts, verify the number at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified. Error: ${twilioError.message}`);
        } else if (twilioError.code === 21614) {
          throw new Error("Twilio account not verified. Please verify your Twilio account.");
        } else if (twilioError.code === 20003) {
          throw new Error("Twilio authentication failed. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env file.");
        } else {
          throw new Error(`Twilio SMS error (${twilioError.code || 'Unknown'}): ${twilioError.message || "Failed to send SMS"}`);
        }
      }
    }

    // Send Email via Brevo
    if (method === "email") {
      const htmlMessage = generateEmailTemplate(otp);
      await sendEmail({
        email,
        subject: "Your OTP Code",
        message: htmlMessage,
      });
      console.log(`OTP sent via Email to ${email}, OTP: ${otp}`);
    }

    return otp; // Return OTP for optional logging/testing
  } catch (error) {
    console.error("Failed to send OTP:", error);
    throw error;
  }
};

// Verify OTP with expiry check
const verifyOTP = async ({ identifier, otp, method }) => {
  const record = await OTPModel.findOne({ identifier, method });
  if (!record) throw new Error("OTP not found");

  // Check expiry
  if (record.expiresAt < new Date()) throw new Error("OTP expired");

  // Compare OTPs as strings and trim user input
  if (record.otp.toString() !== otp.toString().trim()) throw new Error("Invalid OTP");

  // Delete OTP after successful verification
  await OTPModel.deleteOne({ _id: record._id });

  return true;
};

module.exports = { generateOTP, sendOTP, verifyOTP };
