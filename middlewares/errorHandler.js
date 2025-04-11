const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  console.error(`[ERROR] ${statusCode} - ${message}`);
  console.error(err.stack);

  if (!err.isOperational) {
    message = "Internal Server Error";
  }

  if (process.env.NODE_ENV === "production") {
    return res.status(statusCode).json({
      success: false,
      error: message,
    });
  } else {
    return res.status(statusCode).json({
      success: false,
      error: message,
      stack: err.stack,
    });
  }
};

export default errorHandler;
