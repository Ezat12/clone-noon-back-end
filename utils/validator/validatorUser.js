const { check, param } = require("express-validator");
const slugify = require("slugify");
const User = require("../../models/userModel");
const validatorError = require("../../middlewares/validatorError");
const bcrypt = require("bcryptjs");
const { asyncErrorHandler } = require("express-error-catcher");

const validatorGetUser = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validatorError,
];

const validatorCreateUser = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("too short user name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email invalid address")
    .custom(async (val) => {
      const checkEmail = await User.findOne({ email: val });
      if (checkEmail) {
        throw new Error(`The email is already taken => ${val}`);
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 char")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("password confirm not correct");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirm is required"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("the phone is not correct"),
  validatorError,
];
const validatorUpdateUser = [
  check("id").isMongoId().withMessage("Invalid Id"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email invalid address")
    .custom(async (val) => {
      const checkEmail = await User.findOne({ email: val });
      if (checkEmail) {
        throw new Error(`the email is already taken => ${val}`);
      }
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("the phone is not correct"),
  validatorError,
];
const validatorDeleteUser = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validatorError,
];

const validatorChangePassword = [
  check("currentPassword")
    .notEmpty()
    .withMessage("current password is required"),
  check("password").notEmpty().withMessage(" password is required"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password  is required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("new password not equal confirm password ");
      }
      return true;
    }),
  check("id")
    .notEmpty()
    .withMessage("param id is required")
    .isMongoId()
    .withMessage("Invalid Id")
    .custom(async (val, { req }) => {
      const user = await User.findById(val);
      if (!user) throw new Error("Invalid Param Id");

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      console.log(isCorrectPassword);
      if (!isCorrectPassword) {
        throw new Error("current password not correct");
      }
      return true;
    }),
  validatorError,
];

const validatorLoggedChangePassword = [
  check("currentPassword")
    .notEmpty()
    .withMessage("current password is required"),
  check("password").notEmpty().withMessage(" password is required"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password  is required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("new password not equal confirm password ");
      }
      return true;
    }),
  check("id")
    .notEmpty()
    .withMessage("param id is required")
    .isMongoId()
    .withMessage("Invalid Id")
    .custom(async (val, { req }) => {
      const user = await User.findById(val);
      if (!user) throw new Error("Invalid Param Id");

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      console.log(isCorrectPassword);
      if (!isCorrectPassword) {
        throw new Error("current password not correct");
      }
      return true;
    }),
  validatorError,
];

module.exports = {
  validatorGetUser,
  validatorCreateUser,
  validatorUpdateUser,
  validatorDeleteUser,
  validatorChangePassword,
};
