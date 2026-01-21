const { AppError } = require("../helpers/common");

const notFound = (req, res, next) => {
  const err = new AppError("Not Found", 404);
  next(err);
};

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const payload = {
    message: err.message || "Internal Server Error",
  };
  if (err.meta) payload.meta = err.meta;
  res.status(status).json(payload);
};

module.exports = { notFound, errorHandler };