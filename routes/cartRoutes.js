const express = require("express");
const router = express.Router();

const { protectAuth, allowedTo } = require("../server/auth-server");
const {
  addToCart,
  getCartUser,
  deleteItem,
  clearAllCart,
  updateCartItemQuantity,
  getTotalPriceAfDiscount,
} = require("../server/cart-server");

router.use(protectAuth, allowedTo("user", "admin"));

router
  .route("/")
  .post(addToCart)
  .get(getCartUser)
  .delete(clearAllCart)
  .put(getTotalPriceAfDiscount);

router.route("/:cartItemId").put(updateCartItemQuantity).delete(deleteItem);
module.exports = router;
