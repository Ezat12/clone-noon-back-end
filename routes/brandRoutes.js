const express = require("express");
const router = express.Router();

const { protectAuth, allowedTo } = require("../server/auth-server");

const {
  createBrand,
  getAllBrand,
  getBrand,
  updateBrand,
  deleteDrand,
  uploadBrandImage,
  resizeImage,
} = require("../server/brand-server");
const {
  validatorGetBrand,
  validatorCreateBrand,
  validatorUpdateBrand,
  validatorDeleteBrand,
} = require("../utils/validator/validatorBrand");

router
  .route("/")
  .post(
    protectAuth,
    allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    validatorCreateBrand,
    createBrand
  )
  .get(getAllBrand);

router
  .route("/:id")
  .get(validatorGetBrand, getBrand)
  .put(
    protectAuth,
    allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    validatorUpdateBrand,
    updateBrand
  )
  .delete(protectAuth, allowedTo("admin"), validatorDeleteBrand, deleteDrand);

module.exports = router;
