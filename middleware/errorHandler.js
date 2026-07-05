/**
 * Global error-handling middleware.
 * Catches errors passed via next(err) or thrown in async route handlers
 * (when wrapped with the asyncHandler utility) and returns a clean JSON response.
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = { errorHandler };
