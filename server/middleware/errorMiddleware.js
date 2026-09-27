const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const isMongo = err.name === 'ValidationError' || err.name === 'CastError' || err.code === 11000;

  let message = 'Something went wrong. Please try again.';
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.code === 11000) {
    message = 'An account with this email already exists.';
  } else if (err.name === 'CastError') {
    message = 'Invalid ID provided.';
  } else if (status < 500 && err.message) {
    message = err.message;
  }

  res.status(isMongo && status === 500 ? 400 : status).json({ message });
};

module.exports = { notFound, errorHandler };
