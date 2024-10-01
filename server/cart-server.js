const { asyncErrorHandler } = require("express-error-catcher");
const Cart = require("../models/cartModel");
const Product = require("../models/productMode");
const Coupon = require("../models/couponModel");
const ApiError = require("../utils/apiError");

const getTotalPrice = (cart) => {
  let totalPrice = 0;

  cart.cartItem.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });

  cart.totalCardPriceAfterDiscount = undefined;

  return totalPrice;
};

const addToCart = asyncErrorHandler(async (req, res, next) => {
  const { product, color } = req.body;

  const productGetPrice = await Product.findById(product);
  let price;

  if (productGetPrice.price_discount) {
    price = productGetPrice.price_discount;
  } else {
    price = productGetPrice.price;
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItem: [{ product, color, price }],
    });
  } else {
    const cartItemIndex = cart.cartItem.findIndex(
      (item) => item.product._id.toString() === product && item.color === color
    );

    if (cartItemIndex > -1) {
      let cartItem = cart.cartItem[cartItemIndex];
      cartItem.quantity += 1;

      cart.cartItem[cartItemIndex] = cartItem;
    } else {
      cart.cartItem.push({ product, color, price });
    }
  }

  const totalPrice = getTotalPrice(cart);

  cart.totalCardPrice = totalPrice;

  await cart.save();

  res.status(201).json({ data: cart });
});

const getCartUser = asyncErrorHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  // if (!cart) {
  //   return next(new ApiError("not found cart with user", 400));
  // }
  res.status(200).json({
    status: "success",
    // numCartItem: cart.cartItem.length || 0,
    data: cart,
  });
});

const deleteItem = asyncErrorHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItem: { _id: req.params.cartItemId } },
    },
    { new: true }
  );

  const totalPrice = getTotalPrice(cart);

  cart.totalCardPrice = totalPrice;

  await cart.save();

  res.status(201).json({ status: "success", data: cart });
});

const clearAllCart = asyncErrorHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $set: { cartItem: [], totalCardPrice: 0 },
    },
    { new: true }
  );
  //  const totalPrice = getTotalPrice(cart);

  // cart.totalCardPrice = totalPrice;

  await cart.save();

  res.status(201).json({ status: "success", data: cart });
});

const updateCartItemQuantity = asyncErrorHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  const cartItemIndex = cart.cartItem.findIndex(
    (item) => item._id.toString() === req.params.cartItemId
  );

  if (cartItemIndex > -1) {
    const cartItem = cart.cartItem[cartItemIndex];
    cartItem.quantity = quantity;
    cart.cartItem[cartItemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`not found cart item to id => ${req.params.cartItemId}`)
    );
  }

  const totalPrice = getTotalPrice(cart);
  cart.totalCardPrice = totalPrice;

  await cart.save();

  res.status(201).json({ msg: "success update quantity", data: cart });
});

const getTotalPriceAfDiscount = asyncErrorHandler(async (req, res, next) => {
  const { discount } = req.body;
  const checkCoupon = await Coupon.findOne({
    name: discount,
    expire: { $gt: Date.now() },
  });

  if (!checkCoupon) {
    return next(new ApiError("Invalid Coupon name"));
  }

  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCardPrice;
  cart.totalCardPriceAfterDiscount = (
    totalPrice -
    totalPrice * (checkCoupon.discount / 100)
  ).toFixed(2);

  await cart.save();

  res.status(201).json({ msg: "success add discount", data: cart });
});

module.exports = {
  addToCart,
  getCartUser,
  deleteItem,
  clearAllCart,
  updateCartItemQuantity,
  getTotalPriceAfDiscount,
};
