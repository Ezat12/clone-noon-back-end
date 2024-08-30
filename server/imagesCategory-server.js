const {
  getOne,
  getAll,
  createOne,
  updateOne,
  deleteOne,
} = require("./handlerFactory");
const ImagesCategory = require("../models/imagesCategoryModel");
const { uploadImageMix } = require("../middlewares/uploadImage");
const { asyncErrorHandler } = require("express-error-catcher");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadImage } = require("../utils/cloudinaryCofig");

const uploadImagesCategory = uploadImageMix("", "images");

const resizeImage = asyncErrorHandler(async (req, res, next) => {
  if (req.files) {
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (img) => {
          const typeImage = img.mimetype.split("/")[1];
          const fileName = `category-${uuidv4()}-${Date.now()}.${typeImage}`;
          const tempFile = `/tmp/${fileName}`;
          await sharp(img.buffer).toFile(tempFile);

          const result = await uploadImage(tempFile);
          req.body.images.push(result.url);
        })
      );
    }
  }
  next();
});

const checkImagesParams = (req, res, next) => {
  if (req.params.imageCategoryId) {
    req.queryId = { category: req.params.imageCategoryId };
  }
  next();
};

const getImagesCategory = getOne(ImagesCategory);

const getAllImagesCategory = getAll(ImagesCategory);

const createImageCategory = createOne(ImagesCategory);

const updateImageCategory = updateOne(ImagesCategory);

const deleteImagesCategory = deleteOne(ImagesCategory);

module.exports = {
  getImagesCategory,
  getAllImagesCategory,
  createImageCategory,
  updateImageCategory,
  deleteImagesCategory,
  uploadImagesCategory,
  resizeImage,
  checkImagesParams,
};
