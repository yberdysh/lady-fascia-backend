// const express = require('express');
// const nodemailer = require('nodemailer');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const transporter = nodemailer.createTransport({
//   service: 'gmail', // Or your preferred email service
//   auth: {
//     user: 'your-email@gmail.com', // Replace with your email
//     pass: 'your-email-password', // Replace with your email password or app-specific password
//   },
// });

// app.post('/send-email', (req, res) => {
//   const { name, email, message } = req.body;

//   const mailOptions = {
//     from: email,
//     to: 'your-email@example.com', // Replace with the email where you want to receive messages
//     subject: `Contact Form Submission from ${name}`,
//     text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).send('Error sending email');
//     }
//     res.status(200).send('Email sent successfully');
//   });
// });

// app.listen(5050, () => {
//   console.log('Server is running on port 5000');
// });

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors()); // Allows frontend to communicate with backend
app.use(bodyParser.json()); // Parses incoming JSON data

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendEmail(name, email, message) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'your-email@myofascialawakening.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: email,
      to: 'your-email@myofascialawakening.com',
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error(error);
  }
}

// Email sending route
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await sendEmail(name, email, message);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending email' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
