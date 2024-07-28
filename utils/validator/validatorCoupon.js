const { check } = require("express-validator");
const Coupon = require("../../models/couponModel.js");

const validatorError = require("../../middlewares/validatorError");

const validatorCreateCoupon = [
  check("name")
    .notEmpty()
    .withMessage("coupon name required")
    .custom(async (val, { req }) => {
      const coupon = await Coupon.findOne({ name: req.body.name });
      if (coupon) {
        throw new Error("the coupon is already exist before");
      }
      return true;
    }),
  check("expire").notEmpty().withMessage("time expire to coupon required"),

  check("discount").notEmpty().withMessage("coupon discount value required"),

  validatorError,
];

module.exports = { validatorCreateCoupon };
