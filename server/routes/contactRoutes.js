const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, number, message, role } = req.body;

  if (!name || !number || !message || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, 
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Contact Form" <${process.env.SMTP_MAIL}>`,
      to: process.env.SMTP_MAIL, 
      subject: `New Contact Form Submission from ${role}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Number:</strong> +91${number}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;
