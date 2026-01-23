const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config(); // Load environment variables

const sendEmail = async ({ email, subject, message }) => {
  try {
    // Use verified Gmail sender - ensure it's set in .env
    const senderEmail = process.env.SMTP_SENDER_EMAIL || "eashaop2023@gmail.com";
    
    // Get API key - check multiple possible environment variable names
    const apiKey = process.env.API_KEY || process.env.BREVO_API_KEY || process.env.SMTP_PASSWORD;
    
    // Validate API key exists
    if (!apiKey) {
      console.error("[Email] Brevo API key not found. Check your .env file for API_KEY, BREVO_API_KEY, or SMTP_PASSWORD");
      throw new Error("Email service not configured. Please check API key in environment variables.");
    }
    
    console.log(`[Email] Using Brevo API to send email`);
    console.log(`[Email] From: ${senderEmail}`);
    console.log(`[Email] To: ${email}`);
    console.log(`[Email] Subject: ${subject}`);

    // Use Brevo Transactional Email API with optimized settings for better deliverability
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Easha OP",
          email: senderEmail, // Use verified Gmail sender
        },
        to: [
          {
            email: email,
          },
        ],
        subject: subject,
        htmlContent: message,
        // Add headers for better deliverability
        headers: {
          "X-Mailer": "Easha-OP-System",
          "X-Priority": "1", // High priority for OTP emails
        },
        // Tags for tracking
        tags: ["otp", "verification"],
      },
      {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`[Email] Email sent successfully via Brevo API`);
    console.log(`[Email] Message ID: ${response.data.messageId}`);
    
    return {
      messageId: response.data.messageId,
      accepted: [email],
      rejected: [],
    };
  } catch (error) {
    console.error("Failed to send email - Full error:", error);
    
    // If API fails, provide specific error messages
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      console.error("[Email] Brevo API Error:", {
        status: status,
        data: errorData,
        message: error.message,
      });
      
      // Provide specific error messages for common issues
      if (status === 401) {
        console.error("[Email] Authentication failed. Check your Brevo API key in .env file.");
        console.error("[Email] Make sure you have API_KEY, BREVO_API_KEY, or SMTP_PASSWORD set correctly.");
        // Don't fallback to SMTP if API key is wrong - it will likely fail too
        throw new Error("Email authentication failed. Please check your Brevo API key in .env file (API_KEY, BREVO_API_KEY, or SMTP_PASSWORD).");
      } else if (status === 400) {
        console.warn("[Email] Bad request - falling back to SMTP...");
      } else {
        console.warn("[Email] Brevo API failed, falling back to SMTP...");
      }
    }
    
    // Try SMTP fallback for other errors
    try {
      if (!process.env.SMTP_HOST || !process.env.SMTP_MAIL || !process.env.SMTP_PASSWORD) {
        throw new Error("SMTP configuration incomplete. Please check SMTP_HOST, SMTP_MAIL, and SMTP_PASSWORD in .env file.");
      }
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const senderEmail = process.env.SMTP_SENDER_EMAIL || process.env.SMTP_MAIL;
      const info = await transporter.sendMail({
        from: `"Easha OP" <${senderEmail}>`,
        to: email,
        subject: subject,
        html: message,
      });

      console.log(`[Email] Email sent successfully via SMTP fallback`);
      return info;
    } catch (smtpError) {
      console.error("SMTP fallback also failed:", smtpError);
      throw new Error(`Email could not be sent: ${error.message || smtpError.message}`);
    }
  }
};

module.exports = { sendEmail };
