const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const featured = req.query.featured === 'true';
    const status = req.query.status || 'active';
    const limit = parseInt(req.query.limit) || 0;

    // Build filter
    const filter = { status };
    if (featured) {
      filter.featured = true;
    }

    let query = Project.find(filter).sort({ featured: -1, order: 1, createdAt: -1 });
    
    if (limit > 0) {
      query = query.limit(limit);
    }

    const projects = await query;

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      message: 'Something went wrong'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'The specified project does not exist'
      });
    }

    res.json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      error: 'Failed to fetch project',
      message: 'Something went wrong'
    });
  }
});

// Validation rules for project creation/update
const projectValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('type')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Type must be between 2 and 50 characters'),
  
  body('technologies')
    .isArray({ min: 1 })
    .withMessage('At least one technology is required'),
  
  body('githubUrl')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),
  
  body('demoUrl')
    .optional()
    .isURL()
    .withMessage('Demo URL must be a valid URL')
];

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Admin)
router.post('/', projectValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const project = new Project(req.body);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      error: 'Failed to create project',
      message: 'Something went wrong'
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin)
router.put('/:id', projectValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'The specified project does not exist'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      error: 'Failed to update project',
      message: 'Something went wrong'
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'The specified project does not exist'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      error: 'Failed to delete project',
      message: 'Something went wrong'
    });
  }
});

// @route   PUT /api/projects/:id/featured
// @desc    Toggle project featured status
// @access  Private (Admin)
router.put('/:id/featured', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'The specified project does not exist'
      });
    }

    project.featured = !project.featured;
    await project.save();

    res.json({
      success: true,
      message: `Project ${project.featured ? 'featured' : 'unfeatured'} successfully`,
      data: project
    });

  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      error: 'Failed to toggle featured status',
      message: 'Something went wrong'
    });
  }
});

module.exports = router;
