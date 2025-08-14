const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Certificate title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Certificate description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  issuer: {
    type: String,
    required: [true, 'Certificate issuer is required'],
    trim: true,
    maxlength: [100, 'Issuer cannot exceed 100 characters']
  },
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required']
  },
  expiryDate: {
    type: Date,
    default: null
  },
  certificateId: {
    type: String,
    trim: true,
    maxlength: [100, 'Certificate ID cannot exceed 100 characters']
  },
  imageUrl: {
    type: String,
    trim: true
  },
  certificateUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  skills: [{
    type: String,
    trim: true,
    maxlength: [30, 'Skill name cannot exceed 30 characters']
  }],
  category: {
    type: String,
    enum: ['Technical', 'Academic', 'Professional', 'Achievement', 'Other'],
    default: 'Technical'
  },
  verified: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
certificateSchema.index({ featured: -1, order: 1 });
certificateSchema.index({ issueDate: -1 });
certificateSchema.index({ category: 1 });
certificateSchema.index({ isActive: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
