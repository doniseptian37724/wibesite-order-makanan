const { error } = require("../utils/response");

/**
 * Centralized Error Handler Middleware
 */
const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  // Validation error
  if (err.name === "ValidationError") {
    return error(res, "Validation failed", 400, err.errors);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return error(res, "Token tidak valid", 401);
  }
  if (err.name === "TokenExpiredError") {
    return error(res, "Token sudah expired", 401);
  }

  // Custom error with status
  if (err.statusCode) {
    return error(res, err.message, err.statusCode);
  }

  // Default 500
  return error(
    res,
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message,
    500,
  );
};

/**
 * 404 Handler
 */
const notFoundHandler = (req, res) => {
  return error(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
};

module.exports = { errorHandler, notFoundHandler };
