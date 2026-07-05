const express = require('express');
const router = express.Router();
const {
  generateCareerReport,
  getCareerHistory,
  getCareerReportById,
} = require('../controllers/careerController');
const { validateCareerInput } = require('../middleware/validateInput');

// POST /api/career/generate - Runs the AI agent and generates a new report
router.post('/generate', validateCareerInput, generateCareerReport);

// GET /api/career/history - Returns all previously generated reports
router.get('/history', getCareerHistory);

// GET /api/career/report/:id - Returns a single report by ID
router.get('/report/:id', getCareerReportById);

module.exports = router;
