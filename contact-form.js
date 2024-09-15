const nodemailer = require('nodemailer');
const querystring = require('querystring');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.handler = async (event, context) => {
  try {
    let body;
    
    // Check the content type and parse the body accordingly
    if (event.headers['content-type'] === 'application/x-www-form-urlencoded') {
      body = querystring.parse(event.body);
    } else if (event.headers['content-type'] === 'application/json') {
      body = JSON.parse(event.body);
    } else {
      throw new Error('Unsupported content type');
    }
    
    const { name, email, message } = body;

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: 'Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email', error: error.message }),
    };
  }
};
