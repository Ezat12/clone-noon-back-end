const express = require("express");
const router = express.Router();

const { protectAuth, allowedTo } = require("../server/auth-server");

const {
  validatorGetCategory,
  validatorCreateCategory,
  validatorUpdateCategory,
  validatorDeleteCategory,
} = require("../utils/validator/validatorCategory");

const {
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../server/category-server");

const subCategoryRoute = require("./subCategoryRoutes");
const imagesCategoryRoute = require("./imagesCategoryRoutes");
const Product = require("./productRoutes");

// Nested Route SubCategory
router.use("/:categoryId/subcategory", subCategoryRoute);
// router.use("/:categoryId/subcategory", subCategoryRoute);

router.use("/:productCategoryId/product", Product);

// Nested Route ImagesCategory
router.use("/:imageCategoryId/imagesCategory", imagesCategoryRoute);

router
  .route("/")
  .post(
    protectAuth,
    allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    validatorCreateCategory,
    createCategory
  )
  .get(getAllCategory);

router
  .route("/:id")
  .get(validatorGetCategory, getCategory)
  .put(
    protectAuth,
    allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    validatorUpdateCategory,
    updateCategory
  )
  .delete(
    protectAuth,
    allowedTo("admin"),
    validatorDeleteCategory,
    deleteCategory
  );

module.exports = router;
