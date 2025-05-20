const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const status = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(status).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, AppError }; 