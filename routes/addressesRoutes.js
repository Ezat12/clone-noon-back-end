const express = require("express");

const {
  addAddress,
  deleteAddress,
  getAddressUser,
} = require("../server/addresses-server");

const { protectAuth, allowedTo } = require("../server/auth-server");

// const {
//   validatorAddAndDeleteWishlist,
// } = require("../utils/validator/validatorWishlist");

const router = express.Router();

router
  .route("/")
  .post(protectAuth, allowedTo("user"), addAddress)
  .get(protectAuth, allowedTo("user"), getAddressUser);

router.route("/:id").delete(protectAuth, allowedTo("user"), deleteAddress);

module.exports = router;
