const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (adjust the path as needed)
app.use(express.static('public'));

// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Using environment variables
    pass: process.env.EMAIL_PASS  // Using environment variables
  }
});

// Handle form submission
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, // Your recipient email address
    subject: 'Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}` // Corrected to use template literals
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
      res.status(500).send('Failed to send message.');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Message sent successfully.');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`); // Corrected to use template literals
});
