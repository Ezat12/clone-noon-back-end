const express = require("express");
const router = express.Router();

const { protectAuth, allowedTo } = require("../server/auth-server");
const {
  createCashOrder,
  getAllOrders,
  checkRole,
  getOrder,
  updatePaid,
  updateDelivered,
  checkOutSession,
} = require("../server/order-server");

router.use(protectAuth);

router.get("/checkout-session/:cartId", allowedTo("user"), checkOutSession);

router
  .route("/")
  .get(allowedTo("user", "admin", "manager"), checkRole, getAllOrders);

router
  .route("/:id")
  .post(allowedTo("user"), createCashOrder)
  .get(allowedTo("user", "admin", "manager"), getOrder);

router.put("/:id/paid", allowedTo("admin", "manager"), updatePaid);
router.put("/:id/delivered", allowedTo("admin", "manager"), updateDelivered);

module.exports = router;
