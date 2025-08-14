const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Simple in-memory admin user (in production, use database)
const ADMIN_USER = {
  email: process.env.ADMIN_EMAIL || 'ayushjaiswa00004@gmail.com',
  password: process.env.ADMIN_PASSWORD || 'admin123'
};

// Middleware to verify JWT token
const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Invalid token',
      message: 'Please login again'
    });
  }
};

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check credentials
    if (email !== ADMIN_USER.email || password !== ADMIN_USER.password) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email: ADMIN_USER.email,
        role: 'admin'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        email: ADMIN_USER.email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Something went wrong'
    });
  }
});

// @route   POST /api/admin/verify
// @desc    Verify admin token
// @access  Private
router.post('/verify', authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    admin: req.admin
  });
});

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const Project = require('../models/Project');
    const Skill = require('../models/Skill');
    const Certificate = require('../models/Certificate');

    // Get counts
    const stats = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Project.countDocuments({ status: 'active' }),
      Skill.countDocuments({ isActive: true }),
      Certificate.countDocuments({ isActive: true })
    ]);

    // Get recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email message createdAt status');

    // Get featured items
    const featuredProjects = await Project.countDocuments({ featured: true });
    const featuredCertificates = await Certificate.countDocuments({ featured: true });

    res.json({
      success: true,
      data: {
        overview: {
          totalContacts: stats[0],
          newContacts: stats[1],
          activeProjects: stats[2],
          totalSkills: stats[3],
          totalCertificates: stats[4],
          featuredProjects,
          featuredCertificates
        },
        recentContacts,
        systemInfo: {
          nodeVersion: process.version,
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          environment: process.env.NODE_ENV || 'development'
        }
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      error: 'Failed to load dashboard',
      message: 'Something went wrong'
    });
  }
});

// @route   GET /api/admin/contacts
// @desc    Get all contacts for admin
// @access  Private
router.get('/contacts', authenticateAdmin, async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
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
      .limit(limit);

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
    console.error('Get admin contacts error:', error);
    res.status(500).json({
      error: 'Failed to fetch contacts',
      message: 'Something went wrong'
    });
  }
});

// @route   PUT /api/admin/contacts/:id
// @desc    Update contact status
// @access  Private
router.put('/contacts/:id', authenticateAdmin, async (req, res) => {
  try {
    const Contact = require('../models/Contact');
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

// @route   DELETE /api/admin/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete('/contacts/:id', authenticateAdmin, async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        error: 'Contact not found',
        message: 'The specified contact does not exist'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      error: 'Failed to delete contact',
      message: 'Something went wrong'
    });
  }
});

module.exports = router;
