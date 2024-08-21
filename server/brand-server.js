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
const { uploadImage } = require("../utils/cloudinaryCofig");

const uploadBrandImage = uploadImageSingle("image");

const resizeImage = asyncErrorHandler(async (req, res, next) => {
  const type = req.file.mimetype.split("/")[1];
  const fileName = `brand-${uuidv4()}-${Date.now()}.${type}`;

  const tempFilePath = `/tmp/${fileName}`;

  if (req.file) {
    await sharp(req.file.buffer).toFile(tempFilePath);

    const result = await uploadImage(`${tempFilePath}`);

    req.body.image = result.url;
  }
  next();
});

const createBrand = createOne(Brand);

const getAllBrand = getAll(Brand);

const getBrand = getOne(Brand);

const updateBrand = updateOne(Brand);

const deleteBrand = deleteOne(Brand);

module.exports = {
  createBrand,
  getAllBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
};
