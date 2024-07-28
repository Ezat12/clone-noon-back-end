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

//
router.use("/:categoryId/subcategory", subCategoryRoute);
// router.use("/:categoryId/subcategory", subCategoryRoute);

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
