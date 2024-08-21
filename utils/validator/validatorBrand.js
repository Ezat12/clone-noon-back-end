const { check } = require("express-validator");
const slugify = require("slugify");
const Brand = require("../../models/brandModel");

const validatorError = require("../../middlewares/validatorError");

const validatorGetBrand = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validatorError,
];

const validatorCreateBrand = [
  check("name")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 2, max: 30 })
    .withMessage("the Brand name should be min length 2 and max length 30")
    .custom(async (val, { req }) => {
      req.body.slug = slugify(val);
      const checkBrand = await Brand.findOne({ name: val });
      if (checkBrand) {
        throw new Error("The name Brand is already exist")
      }
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
