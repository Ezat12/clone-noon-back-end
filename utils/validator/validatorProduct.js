const { check } = require("express-validator");
const validatorError = require("../../middlewares/validatorError");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");
const slugify = require("slugify");

const validatorCreateProduct = [
  check("title")
    .notEmpty()
    .withMessage("title is required")
    .isLength({ min: 2 })
    .withMessage("must be at least 3 chars")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("description")
    .notEmpty()
    .withMessage("description product must be required")
    .isLength({ min: 10 })
    .withMessage("too short description product"),
  check("quantity")
    .notEmpty()
    .withMessage("quantity is required")
    .isNumeric()
    .withMessage("quantity must be numeric"),
  check("sold").optional().isNumeric().withMessage("sold must be numeric"),
  check("price")
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price must be numeric"),
  check("price_discount")
    .optional()
    .isNumeric()
    .withMessage("price discount must be numeric")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price < value) {
        throw new Error("price after discount must be lower than price");
      }
      return true;
    }),
  check("colors").optional().isArray().withMessage("colors must be array"),
  check("category")
    .notEmpty()
    .withMessage("category must be required")
    .isMongoId()
    .withMessage("Invalid id")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        return Promise.reject(
          new Error(
            `no category for this id ${categoryId} for the product to takeing`
          )
        );
      }
    }),
  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid id")
    .custom(async (subCategory) => {
      const subcategoriesIds = await SubCategory.find({
        _id: { $exists: true, $in: subCategory },
      });

      if (subcategoriesIds.length !== subCategory.length) {
        throw new Error("Invalid subCategories ids");
      }
    })
    .custom(async (subCategories, { req }) => {
      const subCategoryAll = await SubCategory.find({
        category: req.body.category,
      });
      let subCategoryAllIds = [];
      subCategoryAll.forEach((e) => {
        subCategoryAllIds.push(e._id.toString());
      });

      const checker = subCategories.every((s) => subCategoryAllIds.includes(s));
      if (!checker) {
        throw new Error(
          "subCategory not belong category please check subCategory ids"
        );
      }
    }),
  check("brand").optional().isMongoId().withMessage("Invalid id"),
  check("imgCover")
    .notEmpty()
    .withMessage("img cover product must be required"),
  check("rating_average")
    .optional()
    .isNumeric()
    .withMessage("rating average discount must be numeric")
    .isLength({ min: 1 })
    .withMessage("rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("rating must be below or equal 5.0"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("rating average discount must be numeric"),
  validatorError,
];

const validatorUpdateProduct = [
  check("id").isMongoId().withMessage("Invalid Id"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorError,
];
const validatorGetProduct = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validatorError,
];
const validatordeleteProduct = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validatorError,
];

module.exports = {
  validatorCreateProduct,
  validatorGetProduct,
  validatorUpdateProduct,
  validatordeleteProduct,
};
