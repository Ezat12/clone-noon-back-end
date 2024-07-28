// const { TokenExpiredError } = require("jsonwebtoken");
const ApiError = require("../utils/apiError");

const errorHandling = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    envDev(err, res);
  } else {
    envprod(err, res);
  }
};

const envDev = (err, res) => {
  res.status(400).json({
    status: err.statusCode,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const envprod = (err, res) => {
  if ((err.name = "JsonWebTokenError")) err = invalidSignature();
  if ((err.name = "TokenExpiredError")) err = tokenExpired();
  res.status(400).json({
    status: err.statusCode,
    message: err.message,
  });
};

const invalidSignature = () =>
  new ApiError("Invalid Token , Please login again...", 401);

const tokenExpired = () =>
  new ApiError("token expired, Please login again...", 401);

module.exports = errorHandling;
