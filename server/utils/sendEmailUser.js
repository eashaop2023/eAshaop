// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE, 
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `Easha OP <${process.env.SMTP_MAIL}>`,
      to: email,
      subject,
      html: message,
    });

    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Email not sent:", error.message);
    throw new Error("Email could not be sent");
  }
};

module.exports = { sendEmail };