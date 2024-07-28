const { check } = require("express-validator");
const slugify = require("slugify");

const validatorError = require("../../middlewares/validatorError");

const validatorGetBrand = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validatorError,
];

const validatorCreateBrand = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 2, max: 30 })
    .withMessage("the Category name should be min length 4 and max length 30")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorError,
];
const validatorUpdateBrand = [
  check("id").isMongoId().withMessage("Invalid Id"),
  check("name" || "title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorError,
];
const validatorDeleteBrand = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validatorError,
];
module.exports = {
  validatorGetBrand,
  validatorCreateBrand,
  validatorUpdateBrand,
  validatorDeleteBrand,
};
