const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

const router = express.Router();

// Rate limiting for contact form (stricter than global)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 contact submissions per windowMs
  message: {
    error: 'Too many contact submissions',
    message: 'Please wait 15 minutes before submitting another message.'
  }
});

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Validation rules for contact form
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
];

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', contactLimiter, contactValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, email, message } = req.body;

    // Create contact record
    const contact = new Contact({
      name,
      email,
      message,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Save to database
    await contact.save();

    // Send email notification
    try {
      const transporter = createTransporter();
      
      // Email to Ayush
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_USER,
        subject: `New Portfolio Contact: ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0B1F3A;">New Contact Form Submission</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #7C3AED;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <div style="color: #6c757d; font-size: 14px;">
              <p>Submitted: ${new Date().toLocaleString()}</p>
              <p>IP: ${req.ip}</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

      // Auto-reply to sender
      const autoReplyOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Thank you for contacting Ayush Jaiswal',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0B1F3A;">Thank You for Your Message!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for reaching out through my portfolio website. I've received your message and will get back to you as soon as possible.</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your message:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #7C3AED;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p>Best regards,<br>Ayush Jaiswal</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px;">
              <p>This is an automated response. Please do not reply to this email.</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(autoReplyOptions);

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.',
      data: {
        id: contact._id,
        timestamp: contact.createdAt
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      error: 'Failed to send message',
      message: 'Something went wrong. Please try again later.'
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages (admin only)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (status && ['new', 'read', 'replied'].includes(status)) {
      filter.status = status;
    }

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-ipAddress -userAgent'); // Exclude sensitive data

    const total = await Contact.countDocuments(filter);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      error: 'Failed to fetch contacts',
      message: 'Something went wrong'
    });
  }
});

// @route   PUT /api/contact/:id/status
// @desc    Update contact status
// @access  Private
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be: new, read, or replied'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        error: 'Contact not found',
        message: 'The specified contact does not exist'
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated',
      data: contact
    });

  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      error: 'Failed to update status',
      message: 'Something went wrong'
    });
  }
});

module.exports = router;
