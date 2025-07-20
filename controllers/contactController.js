const Contact = require('../models/contact');
const nodemailer = require('nodemailer');
const config = require('../config/config');

// Submit contact form
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save to database
    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport(config.EMAIL_CONFIG);
    
    const mailOptions = {
      from: `"LifeLinkHealthHub" <${config.EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: 'Thank you for contacting us',
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to LifeLinkHealthHub. We have received your message and will respond shortly.</p>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
        <p>Best regards,<br>LifeLinkHealthHub Team</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Also send notification to admin
    const adminMailOptions = {
      from: `"LifeLinkHealthHub" <${config.EMAIL_CONFIG.auth.user}>`,
      to: config.EMAIL_CONFIG.auth.user,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <p>You have a new contact form submission:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(adminMailOptions);

    res.status(200).json({ 
      success: true,
      message: 'Your message has been sent successfully!'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Error submitting your message. Please try again later.'
    });
  }
};

// Get all contact messages (for admin)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// Update message status (for admin)
exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const message = await Contact.findByIdAndUpdate(
      id,
      { status, respondedAt: status === 'responded' ? Date.now() : null },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Error updating message status' });
  }
};