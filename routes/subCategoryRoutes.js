const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const upload = multer();

const { protectAuth, allowedTo } = require("../server/auth-server");

const {
  createSubCategory,
  getAllSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  categoryIdToParams,
  checkCategoryId,
  uploadSubCategoryImage,
  resizeImage,
} = require("../server/subCategory-server");

const {
  validatorCreateSubCategory,
  validatorGetSubCategory,
  validatorUpdateSubCategory,
  validatorDeleteSubCategory,
} = require("../utils/validator/validatorSubCategory");

router
  .route("/")
  .post(
    upload.single("image"),
    protectAuth,
    allowedTo("admin", "manager"),
    // uploadSubCategoryImage,
    categoryIdToParams,
    resizeImage,
    validatorCreateSubCategory,
    createSubCategory
  )
  .get(checkCategoryId, getAllSubCategory);

router
  .route("/:id")
  .get(validatorGetSubCategory, getSubCategory)
  .put(
    protectAuth,
    allowedTo("admin", "manager"),
    validatorUpdateSubCategory,
    updateSubCategory
  )
  .delete(
    protectAuth,
    allowedTo("admin"),
    validatorDeleteSubCategory,
    deleteSubCategory
  );

module.exports = router;
