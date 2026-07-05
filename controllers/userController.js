const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get user by email
 * @route   GET /api/users/:email
 * @access  Public
 */
const getUserByEmail = asyncHandler(async (req, res) => {
  const email = req.params.email?.toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

module.exports = {
  getUserByEmail
};