const Brand = require("../models/brandModel");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");
const { uploadImageSingle } = require("../middlewares/uploadImage");
const { asyncErrorHandler } = require("express-error-catcher");

const uploadBrandImage = uploadImageSingle("image");

const resizeImage = asyncErrorHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${fileName}`);
    req.body.image = fileName;
  }
  next();
});

const createBrand = createOne(Brand);

const getAllBrand = getAll(Brand);

const getBrand = getOne(Brand);

const updateBrand = updateOne(Brand);

const deleteDrand = deleteOne(Brand);

module.exports = {
  createBrand,
  getAllBrand,
  getBrand,
  updateBrand,
  deleteDrand,
  uploadBrandImage,
  resizeImage,
};
