/**
 * Wraps an async route handler so that any rejected promise / thrown error
 * is automatically passed to Express's next() for centralized error handling,
 * avoiding repetitive try/catch blocks in controllers.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
