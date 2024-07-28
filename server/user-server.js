const { uploadImageSingle } = require("../middlewares/uploadImage");
const asyncHandler = require("express-async-handlr");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");

const uploadUserImage = uploadImageSingle("profileImg");

const resizeImage = async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(100, 100)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);

    req.body.profileImg = fileName;
  }
  next();
};

const createUser = createOne(User);

const getAllUser = getAll(User);

const getUser = getOne(User);

const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`no found user for you id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});

const updateUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await User.findByIdAndUpdate(
    id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`no found user for you id ${id}`, 404));
  }
  res.status(200).json({ data: document });
});

const deleteUser = deleteOne(User);

module.exports = {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  uploadUserImage,
  resizeImage,
};
