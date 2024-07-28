const express = require("express");
const router = express.Router();

const { protectAuth, allowedTo } = require("../server/auth-server");
const { validatorCreateCoupon } = require("../utils/validator/validatorCoupon");

const {
  createCoupon,
  getAllCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../server/coupon-server");

router.use(protectAuth, allowedTo("admin", "manager"));

router.route("/").post(validatorCreateCoupon, createCoupon).get(getAllCoupon);

router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
