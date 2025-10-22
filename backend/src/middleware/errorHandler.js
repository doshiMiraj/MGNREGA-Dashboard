const logger = require("../utils/logger");
const { HTTP_STATUS } = require("../config/constants");

// Custom error class
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  // Log error
  logger.error({
    message: error.message,
    statusCode: error.statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Sequelize Validation Error
  if (err.name === "SequelizeValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    error = new AppError(message, HTTP_STATUS.BAD_REQUEST);
  }

  // Sequelize Unique Constraint Error
  if (err.name === "SequelizeUniqueConstraintError") {
    const message = "Duplicate field value entered";
    error = new AppError(message, HTTP_STATUS.BAD_REQUEST);
  }

  // Sequelize Foreign Key Constraint Error
  if (err.name === "SequelizeForeignKeyConstraintError") {
    const message = "Invalid reference to another resource";
    error = new AppError(message, HTTP_STATUS.BAD_REQUEST);
  }

  // Sequelize Database Error
  if (err.name === "SequelizeDatabaseError") {
    const message = "Database operation failed";
    error = new AppError(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  // Axios Error (API calls)
  if (err.isAxiosError) {
    const message = err.response?.data?.message || "External API error";
    error = new AppError(
      message,
      err.response?.status || HTTP_STATUS.SERVICE_UNAVAILABLE
    );
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    status: error.status,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && {
      error: err,
      stack: err.stack,
    }),
  });
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 Not Found handler
const notFound = (req, res, next) => {
  const error = new AppError(
    `Route not found: ${req.originalUrl}`,
    HTTP_STATUS.NOT_FOUND
  );
  next(error);
};

module.exports = {
  AppError,
  errorHandler,
  asyncHandler,
  notFound,
};
