const { check } = require("express-validator");
const slugify = require("slugify");
const User = require("../../models/userModel");
const validatorError = require("../../middlewares/validatorError");

const validatorSignUp = [
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
    .withMessage("email invalid addrees")
    .custom(async (val) => {
      const checkEmail = await User.findOne({ email: val });
      if (checkEmail) {
        throw new Error(`the email is token => ${val}`);
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password is requried")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 char")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("passwod confirm not correct");
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

const validatorLogin = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email invalid addrees"),

  check("password")
    .notEmpty()
    .withMessage("password is requried")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 char"),

  validatorError,
];

module.exports = {
  validatorSignUp,
  validatorLogin,
};
