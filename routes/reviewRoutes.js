const express = require("express");
const router = express.Router({ mergeParams: true });

const { protectAuth, allowedTo } = require("../server/auth-server");

const {
  validatorCreateReview,
  validatorGetOneUser,
  validatorUpdateUser,
  ValidatordeleteReview,
} = require("../utils/validator/validatorReview");

const {
  createReview,
  getAllReview,
  getOneReview,
  updateRevire,
  deleteReview,
  checkParamsProductId,
  checkProductId,
} = require("../server/review-server");

router
  .route("/")
  .post(
    protectAuth,
    allowedTo("user", "admin"),
    checkParamsProductId,
    validatorCreateReview,
    createReview
  )
  .get(checkProductId, checkParamsProductId, getAllReview);

router
  .route("/:id")
  .get(validatorGetOneUser, getOneReview)
  .put(protectAuth, allowedTo("user"), validatorUpdateUser, updateRevire)
  .delete(
    protectAuth,
    allowedTo("user", "admin", "manager"),
    ValidatordeleteReview,
    deleteReview
  );

module.exports = router;
