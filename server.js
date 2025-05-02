// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

//Middleware
app.use(
  cors({
    origin: 'https://sunrise-cafe-ae8267.netlify.app',
    method: ['POST'],
  })
);
app.use(express.json());

app.post('/api/book', async (req, res) => {
  const { name, email, phone, time, guests, requests } = req.body;

  if (!name || !email || !time || !guests) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Cafe Booking Form" <${process.env.SMTP_USER}>`,
    to: process.env.RECEIVE_EMAIL,
    subject: 'New Table Booking Request',
    html: `
      <h2>New Boooking</h2>
      <p><strong>Name: </strong> ${name}</p>
      <p><strong>Email: </strong> ${email}</p>
      <p><strong>Phone: </strong> ${phone || 'N/A'}</p>
      <p><strong>Time: </strong> ${time}</p>
      <p><strong> Guests: </strong> ${guests} </p>
      <p><strong>Special Requests:</strong> ${requests || 'none'} </p>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Email failed to send' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
