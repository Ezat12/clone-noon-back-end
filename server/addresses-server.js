const User = require("../models/userModel");
const { asyncErrorHandler } = require("express-error-catcher");

const addAddress = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    {
      new: true,
    }
  );

  res.status(200).json({ data: user });
});

const deleteAddress = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.id } },
    },
    { new: true }
  );

  res.status(201).json({ data: user });
});

const getAddressUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({ data: user.addresses });
});

module.exports = {
  addAddress,
  deleteAddress,
  getAddressUser,
};
