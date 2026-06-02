const nodemailer = require("nodemailer");
require("dotenv").config(); // Load .env variables

// Create transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // smtp-relay.brevo.com
  port: Number(process.env.SMTP_PORT),     // 587
  secure: false,                     // true for 465, false for 587
  auth: {
    user: process.env.SMTP_MAIL,     // Your Brevo email
    pass: process.env.SMTP_PASSWORD, // Your Brevo SMTP/API key
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter (optional, helps debug)
transporter.verify((err, success) => {
  if (err) {
    console.log("Error configuring email transporter:", err);
  } else {
    console.log("Email transporter is ready to send messages");
  }
});

module.exports = transporter;
