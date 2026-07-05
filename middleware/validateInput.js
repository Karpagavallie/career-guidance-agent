/**
 * Middleware to validate the career guidance form submission before
 * it reaches the controller/AI agent.
 */
const validateCareerInput = (req, res, next) => {
  const { name, email, education, department, careerGoal } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long.');
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('A valid email address is required.');
  }

  if (!education || education.trim().length === 0) {
    errors.push('Education is required.');
  }

  if (!department || department.trim().length === 0) {
    errors.push('Department is required.');
  }

  if (!careerGoal || careerGoal.trim().length === 0) {
    errors.push('Career goal is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

module.exports = { validateCareerInput };
