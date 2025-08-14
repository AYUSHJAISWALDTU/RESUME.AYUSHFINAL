const express = require('express');
const { body, validationResult } = require('express-validator');
const Skill = require('../models/Skill');

const router = express.Router();

// @route   GET /api/skills
// @desc    Get all skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    const active = req.query.active !== 'false'; // default to true

    // Build filter
    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (active) {
      filter.isActive = true;
    }

    const skills = await Skill.find(filter).sort({ category: 1, order: 1, name: 1 });

    // Group by category if no specific category requested
    if (!category) {
      const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {});

      return res.json({
        success: true,
        data: groupedSkills,
        count: skills.length
      });
    }

    res.json({
      success: true,
      data: skills,
      count: skills.length
    });

  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      error: 'Failed to fetch skills',
      message: 'Something went wrong'
    });
  }
});

// @route   GET /api/skills/categories
// @desc    Get all skill categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Skill.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: 'Something went wrong'
    });
  }
});

// @route   GET /api/skills/:id
// @desc    Get single skill
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        error: 'Skill not found',
        message: 'The specified skill does not exist'
      });
    }

    res.json({
      success: true,
      data: skill
    });

  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({
      error: 'Failed to fetch skill',
      message: 'Something went wrong'
    });
  }
});

// Validation rules for skill creation/update
const skillValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Skill name must be between 2 and 50 characters'),
  
  body('category')
    .isIn(['Programming Languages', 'Tools & Technologies', 'Specializations', 'Frameworks', 'Databases', 'Other'])
    .withMessage('Invalid category'),
  
  body('proficiency')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Proficiency must be between 1 and 10'),
  
  body('yearsOfExperience')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Years of experience must be a positive number')
];

// @route   POST /api/skills
// @desc    Create new skill
// @access  Private (Admin)
router.post('/', skillValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const skill = new Skill(req.body);
    await skill.save();

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Skill already exists',
        message: 'A skill with this name already exists'
      });
    }

    console.error('Create skill error:', error);
    res.status(500).json({
      error: 'Failed to create skill',
      message: 'Something went wrong'
    });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update skill
// @access  Private (Admin)
router.put('/:id', skillValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({
        error: 'Skill not found',
        message: 'The specified skill does not exist'
      });
    }

    res.json({
      success: true,
      message: 'Skill updated successfully',
      data: skill
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Skill name already exists',
        message: 'A skill with this name already exists'
      });
    }

    console.error('Update skill error:', error);
    res.status(500).json({
      error: 'Failed to update skill',
      message: 'Something went wrong'
    });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete skill
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({
        error: 'Skill not found',
        message: 'The specified skill does not exist'
      });
    }

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });

  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      error: 'Failed to delete skill',
      message: 'Something went wrong'
    });
  }
});

// @route   PUT /api/skills/:id/toggle
// @desc    Toggle skill active status
// @access  Private (Admin)
router.put('/:id/toggle', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        error: 'Skill not found',
        message: 'The specified skill does not exist'
      });
    }

    skill.isActive = !skill.isActive;
    await skill.save();

    res.json({
      success: true,
      message: `Skill ${skill.isActive ? 'activated' : 'deactivated'} successfully`,
      data: skill
    });

  } catch (error) {
    console.error('Toggle skill error:', error);
    res.status(500).json({
      error: 'Failed to toggle skill status',
      message: 'Something went wrong'
    });
  }
});

module.exports = router;
