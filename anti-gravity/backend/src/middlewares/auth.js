const jwt = require("jsonwebtoken");
const config = require("../config/env");
const { error } = require("../utils/response");

/**
 * JWT Authentication Middleware
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(
      res,
      "Token tidak ditemukan. Silahkan login terlebih dahulu.",
      401,
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Optional Auth - sets user if token exists, but doesn't block
 */
const optionalAuth = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      req.user = jwt.verify(token, config.jwtSecret);
    } catch {
      // Ignore invalid token for optional auth
    }
  }
  next();
};

module.exports = { authenticate, optionalAuth };
