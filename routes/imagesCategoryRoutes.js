const express = require("express");
const {
  uploadImagesCategory,
  resizeImage,
  createImageCategory,
  getAllImagesCategory,
  updateImageCategory,
  getImagesCategory,
  deleteImagesCategory,
  checkImagesParams,
} = require("../server/imagesCategory-server");

const { protectAuth, allowedTo } = require("../server/auth-server");
const {
  validatorCreateImagesCategory,
  validatorUpdateImagesCategory,
} = require("../utils/validator/validatorImagesCategory");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protectAuth,
    allowedTo("admin", "manger"),
    uploadImagesCategory,
    resizeImage,
    validatorCreateImagesCategory,
    createImageCategory
  )
  .get(checkImagesParams, getAllImagesCategory);

router
  .route("/:id")
  .put(
    protectAuth,
    allowedTo("admin", "manger"),
    uploadImagesCategory,
    resizeImage,
    validatorUpdateImagesCategory,
    updateImageCategory
  )
  .get(getImagesCategory)
  .delete(protectAuth, allowedTo("admin", "manger"), deleteImagesCategory);

module.exports = router;
