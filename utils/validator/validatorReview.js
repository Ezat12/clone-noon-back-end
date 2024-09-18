const { check } = require("express-validator");
const validatorError = require("../../middlewares/validatorError");
const User = require("../../models/userModel");
const Review = require("../../models/reviewModel");
const Product = require("../../models/productMode");

const validatorCreateReview = [
  check("ratings")
    .notEmpty()
    .withMessage("rating must be required")
    .isFloat({ min: 1 })
    .withMessage("min rating value is 1.0")
    .isFloat({ max: 5 })
    .withMessage("max rating value is 5.0"),
  check("user")
    .isMongoId()
    .withMessage("Invalid id user")
    .custom(async (val, { req }) => {
      const checkReview = await Review.findOne({
        user: req.user._id,
        product: req.body.product,
      });

      if (checkReview) {
        throw new Error("you already create review before");
      }

      if (req.user.role === "user") {
        if (req.user._id.toString() !== req.body.user.toString()) {
          throw new Error("you are not allow to perform this action");
        }
      }

      return true;
    }),
  check("product")
    .notEmpty()
    .withMessage("Review must belong to product")
    .isMongoId()
    .withMessage("Invalid id product")
    .custom(async (val, { req }) => {
      const product = await Product.findById(val);
      if (!product) {
        throw new Error("no found product ");
      }
      return true;
    }),

  validatorError,
];

const validatorGetOneUser = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validatorError,
];

const validatorUpdateUser = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Id")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      console.log(review);
      if (req.user._id.toString() !== review.user._id.toString()) {
        throw new Error("you are not allow to perform this action");
      }
      return true;
    }),
  check("ratings")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("min rating value is 1.0")
    .isFloat({ max: 5 })
    .withMessage("max rating value is 5.0"),
  check("product").notEmpty().withMessage("Review must be belong to product"),
  validatorError,
];

const ValidatordeleteReview = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Id")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (req.user.role === "user") {
        if (req.user._id.toString() !== review.user._id.toString()) {
          throw new Error("you are not allow to perform this action", 404);
        }
      }
      return true;
    }),
  validatorError,
];

module.exports = {
  validatorCreateReview,
  validatorGetOneUser,
  validatorUpdateUser,
  ValidatordeleteReview,
};
