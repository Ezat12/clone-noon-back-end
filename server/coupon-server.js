const { asyncErrorHandler } = require("express-error-catcher");
const Coupon = require("../models/couponModel");
const apiFeatures = require("../utils/apiFeatures");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

const createCoupon = createOne(Coupon);

const getAllCoupon = getAll(Coupon);

const getCoupon = getOne(Coupon);

const updateCoupon = updateOne(Coupon);

const deleteCoupon = deleteOne(Coupon);

module.exports = {
  createCoupon,
  getAllCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
};
