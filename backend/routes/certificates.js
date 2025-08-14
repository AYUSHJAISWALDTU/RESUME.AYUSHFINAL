const express = require('express');
const { body, validationResult } = require('express-validator');
const Certificate = require('../models/Certificate');

const router = express.Router();

// @route   GET /api/certificates
// @desc    Get all certificates
// @access  Public
router.get('/', async (req, res) => {
  try {
    const featured = req.query.featured === 'true';
    const category = req.query.category;
    const active = req.query.active !== 'false'; // default to true
    const limit = parseInt(req.query.limit) || 0;

    // Build filter
    const filter = {};
    if (featured) {
      filter.featured = true;
    }
    if (category) {
      filter.category = category;
    }
    if (active) {
      filter.isActive = true;
    }

    let query = Certificate.find(filter).sort({ featured: -1, order: 1, issueDate: -1 });
    
    if (limit > 0) {
      query = query.limit(limit);
    }

    const certificates = await query;

    res.json({
      success: true,
      count: certificates.length,
      data: certificates
    });

  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({
      error: 'Failed to fetch certificates',
      message: 'Something went wrong'
    });
  }
});

// @route   GET /api/certificates/categories
// @desc    Get all certificate categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Certificate.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get certificate categories error:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: 'Something went wrong'
    });
  }
});

// @route   GET /api/certificates/:id
// @desc    Get single certificate
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        error: 'Certificate not found',
        message: 'The specified certificate does not exist'
      });
    }

    res.json({
      success: true,
      data: certificate
    });

  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({
      error: 'Failed to fetch certificate',
      message: 'Something went wrong'
    });
  }
});

// Validation rules for certificate creation/update
const certificateValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Description must be between 5 and 200 characters'),
  
  body('issuer')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Issuer must be between 2 and 100 characters'),
  
  body('issueDate')
    .isISO8601()
    .withMessage('Issue date must be a valid date'),
  
  body('category')
    .isIn(['Technical', 'Academic', 'Professional', 'Achievement', 'Other'])
    .withMessage('Invalid category'),
  
  body('certificateUrl')
    .optional()
    .isURL()
    .withMessage('Certificate URL must be a valid URL')
];

// @route   POST /api/certificates
// @desc    Create new certificate
// @access  Private (Admin)
router.post('/', certificateValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const certificate = new Certificate(req.body);
    await certificate.save();

    res.status(201).json({
      success: true,
      message: 'Certificate created successfully',
      data: certificate
    });

  } catch (error) {
    console.error('Create certificate error:', error);
    res.status(500).json({
      error: 'Failed to create certificate',
      message: 'Something went wrong'
    });
  }
});

// @route   PUT /api/certificates/:id
// @desc    Update certificate
// @access  Private (Admin)
router.put('/:id', certificateValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!certificate) {
      return res.status(404).json({
        error: 'Certificate not found',
        message: 'The specified certificate does not exist'
      });
    }

    res.json({
      success: true,
      message: 'Certificate updated successfully',
      data: certificate
    });

  } catch (error) {
    console.error('Update certificate error:', error);
    res.status(500).json({
      error: 'Failed to update certificate',
      message: 'Something went wrong'
    });
  }
});

// @route   DELETE /api/certificates/:id
// @desc    Delete certificate
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        error: 'Certificate not found',
        message: 'The specified certificate does not exist'
      });
    }

    res.json({
      success: true,
      message: 'Certificate deleted successfully'
    });

  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({
      error: 'Failed to delete certificate',
      message: 'Something went wrong'
    });
  }
});

// @route   PUT /api/certificates/:id/featured
// @desc    Toggle certificate featured status
// @access  Private (Admin)
router.put('/:id/featured', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        error: 'Certificate not found',
        message: 'The specified certificate does not exist'
      });
    }

    certificate.featured = !certificate.featured;
    await certificate.save();

    res.json({
      success: true,
      message: `Certificate ${certificate.featured ? 'featured' : 'unfeatured'} successfully`,
      data: certificate
    });

  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      error: 'Failed to toggle featured status',
      message: 'Something went wrong'
    });
  }
});

// @route   PUT /api/certificates/:id/verify
// @desc    Toggle certificate verification status
// @access  Private (Admin)
router.put('/:id/verify', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        error: 'Certificate not found',
        message: 'The specified certificate does not exist'
      });
    }

    certificate.verified = !certificate.verified;
    await certificate.save();

    res.json({
      success: true,
      message: `Certificate ${certificate.verified ? 'verified' : 'unverified'} successfully`,
      data: certificate
    });

  } catch (error) {
    console.error('Toggle verification error:', error);
    res.status(500).json({
      error: 'Failed to toggle verification status',
      message: 'Something went wrong'
    });
  }
});

module.exports = router;
