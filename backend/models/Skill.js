const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Skill name cannot exceed 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Skill category is required'],
    enum: ['Programming Languages', 'Tools & Technologies', 'Specializations', 'Frameworks', 'Databases', 'Other'],
    default: 'Other'
  },
  proficiency: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0
  },
  certified: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true,
    default: '#7C3AED'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  }
}, {
  timestamps: true
});

// Index for efficient queries
skillSchema.index({ category: 1, order: 1 });
skillSchema.index({ isActive: 1 });
skillSchema.index({ proficiency: -1 });

module.exports = mongoose.model('Skill', skillSchema);
