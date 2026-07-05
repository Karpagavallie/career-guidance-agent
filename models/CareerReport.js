const mongoose = require('mongoose');

/**
 * CareerReport Schema
 * Stores the AI-generated career guidance report linked to a user,
 * along with the date and time it was generated.
 */
const careerReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    profileSummary: {
      type: String,
      required: true,
    },
    recommendedCareer: {
      type: String,
      required: true,
    },
    skillGapAnalysis: {
      existingSkills: { type: [String], default: [] },
      missingSkills: { type: [String], default: [] },
      skillsToLearn: { type: [String], default: [] },
    },
    learningRoadmap: {
      type: String,
      required: true,
    },
    certificationRecommendation: {
      type: String,
      required: true,
    },
    interviewQuestions: {
      technical: { type: [String], default: [] },
      hr: { type: [String], default: [] },
    },
    finalCareerAdvice: {
      type: String,
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CareerReport', careerReportSchema);
