const { check } = require("express-validator");
const validatorError = require("../../middlewares/validatorError");

const validatorCreateImagesCategory = [
  check("images").notEmpty().withMessage("Images category required"),
  check("category")
    .notEmpty()
    .withMessage("category required")
    .isMongoId()
    .withMessage("Invalid category"),
  validatorError,
];

const validatorUpdateImagesCategory = [
  check("category").isMongoId().withMessage("Invalid category"),
  validatorError,
];

module.exports = {
  validatorCreateImagesCategory,
  validatorUpdateImagesCategory,
};