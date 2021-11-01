// class ErrorException extends Error{
class ErrorException {
  constructor(message, statusCode) {
    // super(message);
    this.message = message;
    this.statusCode = statusCode;
    // Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorException;