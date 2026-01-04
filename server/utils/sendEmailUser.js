const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config(); // Load environment variables

const sendEmail = async ({ email, subject, message }) => {
  try {
    // Use verified Gmail sender - ensure it's set in .env
    const senderEmail = process.env.SMTP_SENDER_EMAIL || "eashaop2023@gmail.com";
    
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
          "api-key": process.env.API_KEY || process.env.SMTP_PASSWORD,
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
    
    // If API fails, fallback to SMTP
    if (error.response) {
      console.warn("[Email] Brevo API failed, falling back to SMTP...");
      console.error("API Error:", {
        status: error.response.status,
        data: error.response.data,
        message: error.message,
      });
    }

    // Fallback to SMTP method
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
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
