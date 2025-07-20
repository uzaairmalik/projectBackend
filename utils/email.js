const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport(config.EMAIL_CONFIG);

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"LifeLinkHealthHub" <${config.EMAIL_CONFIG.auth.user}>`,
      to,
      subject,
      html
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};