// utils/sendEmail.js
const nodemailer = require("nodemailer");
const { Resend } = require('resend');
const resend = new Resend(re_YZs1N49t_8bwb4PrxZMmjdLnM9LEK39zi);

resend.domains.create({ name: 'eashaop.com', customReturnPath: 'outbound' });


const sendEmailByResend = async ({ email, subject, message }) => {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'eashaop2023@gmail.com',
      subject,
      html: message,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email send failed:', error.message);
    throw new Error('Email could not be sent');
  }
};


const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: process.env.SMTP_HOST,
      // port: Number(process.env.SMTP_PORT),
      // service: process.env.SMTP_SERVICE, 
      // secure: process.env.SMTP_SERVICE = 465,
      service: "gmail",
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Easha OP" <${process.env.SMTP_MAIL}>`,
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

module.exports = { sendEmail, sendEmailByResend};

