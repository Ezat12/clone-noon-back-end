const express = require("express");

const { protectAuth, allowedTo } = require("../server/auth-server");

const {
  createProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeImageProducts,
  checkGetProductWithCategory,
  checkGetProductWithSubCategory,
  checkGetProductWithBrand,
} = require("../server/product-server");
const {
  validatorCreateProduct,
  validatorGetProduct,
  validatorUpdateProduct,
  validatordeleteProduct,
} = require("../utils/validator/validatorProduct");
const router = express.Router({ mergeParams: true });

const reviewsRoute = require("./reviewRoutes");

router.use("/:productId/reviews", reviewsRoute);

router
  .route("/")
  .post(
    protectAuth,
    allowedTo("admin", "manager"),
    uploadProductImage,
    resizeImageProducts,
    validatorCreateProduct,
    createProduct
  )
  .get(
    checkGetProductWithCategory,
    checkGetProductWithSubCategory,
    checkGetProductWithBrand,
    getAllProduct
  );

router
  .route("/:id")
  .get(validatorGetProduct, getProduct)
  .put(
    protectAuth,
    allowedTo("admin", "manager"),
    uploadProductImage,
    resizeImageProducts,
    validatorUpdateProduct,
    updateProduct
  )
  .delete(
    protectAuth,
    allowedTo("admin"),
    validatordeleteProduct,
    deleteProduct
  );

module.exports = router;
