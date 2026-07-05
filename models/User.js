const mongoose = require('mongoose');

/**
 * User Schema
 * Stores the profile information submitted through the career guidance form.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    education: {
      type: String,
      required: [true, 'Education is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    currentSkills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    careerGoal: {
      type: String,
      required: [true, 'Career goal is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
