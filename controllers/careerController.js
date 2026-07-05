const User = require('../models/User');
const CareerReport = require('../models/CareerReport');
const { runCareerAgent } = require('../services/careerAgentService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Generate a career guidance report using the AI Agent, and save
 *          both the user profile and the generated report to MongoDB.
 * @route   POST /api/career/generate
 * @access  Public
 */
const generateCareerReport = asyncHandler(async (req, res) => {
  const { name, email, education, department, currentSkills, interests, careerGoal } = req.body;

  // Normalize comma-separated strings or arrays into clean arrays
  const toArray = (value) => {
    if (Array.isArray(value)) return value.map((v) => v.trim()).filter(Boolean);
    if (typeof value === 'string') return value.split(',').map((v) => v.trim()).filter(Boolean);
    return [];
  };

  const profile = {
    name,
    email,
    education,
    department,
    currentSkills: toArray(currentSkills),
    interests: toArray(interests),
    careerGoal,
  };

  // Find existing user by email, or create a new one
  let user = await User.findOne({ email: profile.email });
  if (user) {
    user.name = profile.name;
    user.education = profile.education;
    user.department = profile.department;
    user.currentSkills = profile.currentSkills;
    user.interests = profile.interests;
    user.careerGoal = profile.careerGoal;
    await user.save();
  } else {
    user = await User.create(profile);
  }

  // Run the AI Agent - orchestrates all modules and returns the combined report
  const reportData = await runCareerAgent(profile);

  // Save the generated report linked to the user
  const careerReport = await CareerReport.create({
    user: user._id,
    ...reportData,
  });

  res.status(201).json({
    success: true,
    data: careerReport,
  });
});

/**
 * @desc    Get all previously generated career reports (history), most recent first.
 * @route   GET /api/career/history
 * @access  Public
 */
const getCareerHistory = asyncHandler(async (req, res) => {
  const reports = await CareerReport.find()
    .populate('user', 'name email education department careerGoal')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports,
  });
});

/**
 * @desc    Get a single career report by its ID.
 * @route   GET /api/career/report/:id
 * @access  Public
 */
const getCareerReportById = asyncHandler(async (req, res) => {
  const report = await CareerReport.findById(req.params.id).populate(
    'user',
    'name email education department careerGoal'
  );

  if (!report) {
    res.status(404);
    throw new Error('Career report not found.');
  }

  res.status(200).json({
    success: true,
    data: report,
  });
});

module.exports = { generateCareerReport, getCareerHistory, getCareerReportById };
