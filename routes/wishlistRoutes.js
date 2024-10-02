const express = require("express");
const {
  addWishlistToUser,
  deleteWishlistToUser,
  getLoggerUserWishlist,
  deleteAll,
} = require("../server/wishlist-server");
const { protectAuth, allowedTo } = require("../server/auth-server");
const {
  validatorAddAndDeleteWishlist,
} = require("../utils/validator/validatorWishlist");

const router = express.Router();

router.use("/delete-all", protectAuth, allowedTo("user"), deleteAll);

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
