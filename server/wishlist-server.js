const User = require("../models/userModel");
const { asyncErrorHandler } = require("express-error-catcher");
const ApiError = require("../utils/apiError");

const addWishlistToUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.product },
    },
    {
      new: true,
    }
  ).populate("wishlist");

  res.status(200).json({ wishlistUser: user.wishlist });
});

const deleteWishlistToUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.body.product },
    },
    { new: true }
  ).populate("wishlist");

  res.status(201).json({ wishlistUser: user.wishlist });
});

const getLoggerUserWishlist = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({ wishlistUser: user.wishlist });
});

const deleteAll = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { wishlist: [] },
    { new: true }
  );
  res.status(201).json({ data: user.wishlist });
});

module.exports = {
  addWishlistToUser,
  deleteWishlistToUser,
  getLoggerUserWishlist,
  deleteAll,
};
