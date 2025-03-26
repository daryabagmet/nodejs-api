const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  console.log(err.stack);

  if (err.name === 'CastError') {
    error = new ErrorResponse(`Record id: ${err.value} not found`, 404);
  }

  if (err.name === 'ValidationError') {
    error = new ErrorResponse('Validation error', 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error',
  });
};

module.exports = errorHandler;
