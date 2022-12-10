const nodemailer = require('nodemailer');
require('dotenv').config();

const { EMAIL, EMAIL_PASS, PORT } = process.env;
const BASE_URL = `http://localhost:${PORT}`;

const config = {
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async (email, verifyToken) => {
  const verifyLink = `${BASE_URL}/api/auth/verify/${verifyToken}`;
  const emailOptions = {
    to: email,
    from: EMAIL,
    subject: 'Confirm your email',
    html: `<h4>Click on this link to confirm registration <a href="${verifyLink}">Verify your email</a> </h4>`,
  };
  try {
    await transporter.sendMail(emailOptions);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = sendEmail;
