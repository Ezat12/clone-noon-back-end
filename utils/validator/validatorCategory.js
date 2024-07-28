const { check } = require("express-validator");
const Category = require("../../models/categoryModel");
const validatorError = require("../../middlewares/validatorError");
const slugify = require("slugify");

const validatorGetCategory = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validatorError,
];

const validatorCreateCategory = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 4, max: 30 })
    .withMessage("the Category name should be min length 4 and max length 30")
    .custom(async (name, { req }) => {
      const categoryName = await Category.find({ name });
      // console.log(categoryName);
      if (categoryName.length) {
        throw new Error(`This name already exists => ${name}`);
      }
      req.body.slug = slugify(name);
      return true;
    }),
  validatorError,
];
const validatorUpdateCategory = [
  check("id").isMongoId().withMessage("Invalid Id"),
  check("name" || "title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorError,
];
const validatorDeleteCategory = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validatorError,
];
module.exports = {
  validatorGetCategory,
  validatorCreateCategory,
  validatorUpdateCategory,
  validatorDeleteCategory,
};
