const { check } = require("express-validator");
const validatorError = require("../../middlewares/validatorError");
const slugify = require("slugify");
const SubCategory = require("../../models/subCategoryModel");

const validatorCreateSubCategory = [
  check("name")
    .notEmpty()
    .withMessage("The name is required")
    .isLength({ min: 2, max: 30 })
    .withMessage(
      "the SubCategory name should be min length 2 and max length 30"
    )
    .custom(async (val, { req }) => {
      req.body.slug = slugify(val);
      const checkSubCategory = await SubCategory.findOne({ name: val });

      if (checkSubCategory) throw new Error("The name is already exist");
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be belong to category")
    .isMongoId()
    .withMessage("Invalid id"),
  validatorError,
];

const validatorGetSubCategory = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validatorError,
];

const validatorUpdateSubCategory = [
  check("id").isMongoId().withMessage("Invalid Id"),
  check("name" || "title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorError,
];
const validatorDeleteSubCategory = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validatorError,
];

module.exports = {
  validatorCreateSubCategory,
  validatorGetSubCategory,
  validatorUpdateSubCategory,
  validatorDeleteSubCategory,
};
