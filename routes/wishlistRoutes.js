const express = require("express");
const {
  addWishlistToUser,
  deleteWishlistToUser,
  getLoggerUserWishlist,
} = require("../server/wishlist-server");
const { protectAuth, allowedTo } = require("../server/auth-server");
const {
  validatorAddAndDeleteWishlist,
} = require("../utils/validator/validatorWishlist");

const router = express.Router();

router
  .route("/")
  .post(
    protectAuth,
    allowedTo("user"),
    validatorAddAndDeleteWishlist,
    addWishlistToUser
  )
  .get(protectAuth, allowedTo("user"), getLoggerUserWishlist)
  .delete(
    protectAuth,
    allowedTo("user"),
    validatorAddAndDeleteWishlist,
    deleteWishlistToUser
  );

module.exports = router;
