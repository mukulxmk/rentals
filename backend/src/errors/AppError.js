class AppError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;