// const stripe = require("stripe")(process.env.STRIPE_SECRET);
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET);

const ApiError = require("../utils/apiError");
const { asyncErrorHandler } = require("express-error-catcher");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productMode");
const User = require("../models/userModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

const checkRole = (req, res, next) => {
  if (req.user.role === "user") req.queryId = { user: req.user._id };
  next();
};

const createCashOrder = asyncErrorHandler(async (req, res, next) => {
  const texPrice = 0;
  const shippingPrice = 0;

  // get cart with cartId
  const cart = await Cart.findById(req.params.cartId);

  if (!cart) {
    return next(new ApiError(`not found cart with id => ${req.params.cartId}`));
  }

  // get order price depend cart price (check if coupon apply)
  const cartPrice = cart.totalCardPriceAfterDiscount
    ? cart.totalCardPriceAfterDiscount
    : cart.totalCardPrice;

  const totalPriceOrder = cartPrice + texPrice + shippingPrice;

  // create order with default (cah)
  const order = await Order.create({
    user: req.user._id,
    cartItem: cart.cartItem,
    shippingAddress: req.body.shippingAddress,
    totalPriceOrder,
  });

  // update quantity , sold to product

  const bulkWrite = cart.cartItem.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
    },
  }));

  await Product.bulkWrite(bulkWrite, {});
  await Cart.findByIdAndUpdate(cartId, { cartItem: [] }, { new: true });

  res.status(200).json({ status: "success", data: order });
});

const getAllOrders = getAll(Order);

const getOrder = getOne(Order);

const updatePaid = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ApiError(`not found order with id: ${req.params.id}`));
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updateOrder = await order.save();

  res.status(200).json({ status: "success", data: updateOrder });
});

const updateDelivered = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ApiError(`not found order with id: ${req.params.id}`));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updateOrder = await order.save();

  res.status(200).json({ status: "success", data: updateOrder });
});

const checkOutSession = asyncErrorHandler(async (req, res, next) => {
  const texPrice = 0;
  const shippingPrice = 0;

  const cart = await Cart.findById(req.params.cartId);

  if (!cart) {
    return next(new ApiError(`not found cart with id => ${req.params.cartId}`));
  }

  const cartPrice = cart.totalCardPriceAfterDiscount
    ? cart.totalCardPriceAfterDiscount
    : cart.totalCardPrice;

  const totalPriceOrder = cartPrice + texPrice + shippingPrice;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalPriceOrder * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/product`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    // metadata: req,
  });

  console.log(`${req.protocol}://${req.get("host")}/api/v1/orders`);

  res.status(200).json({ status: "success", session });
});

const createOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const priceOrder = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.find({ email: session.customer_email });

  const order = await Order.create({
    user: user._id,
    cartItem: cart.cartItem,
    shippingAddress,
    totalPriceOrder: priceOrder,
    paymentMethodType: "card",
    isPaid: true,
    paidAt: Date.now(),
  });

  if (order) {
    const bulkWrite = cart.cartItem.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkWrite, {});

    await Cart.findByIdAndUpdate(cartId, { cartItem: [] }, { new: true });

    res.status(200).json({ status: "success", order, cart });
  }
};

const webhookCheckout = asyncErrorHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  // try {
  event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  console.log("check", event.type);
  // } catch (err) {
  //   res.status(400).send(`Webhook Error: ${err.message}`);
  //   return;
  // }
  if (event.type === "checkout.session.completed") {
    createOrder(session);
  }
});

module.exports = {
  createCashOrder,
  getAllOrders,
  getOrder,
  checkRole,
  updatePaid,
  updateDelivered,
  checkOutSession,
  webhookCheckout,
};
