const Product = require("../models/productMode");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadImageMix } = require("../middlewares/uploadImage");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");
const { asyncErrorHandler } = require("express-error-catcher");

const uploadProductImage = uploadImageMix("imgCover", "images");

const resizeImageProducts = asyncErrorHandler(async (req, res, next) => {
  if (req.files) {
    if (req.files.imgCover) {
      const imgCoverFileName = `product-${uuidv4()}-${Date.now()}.jpeg`;
      await sharp(req.files.imgCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/products/${imgCoverFileName}`);
      req.body.imgCover = imgCoverFileName;
    }
    if (req.files.images) {
      req.body.images = [];
      Promise.all(
        req.files.images.map(async (img) => {
          const imagesFileName = `product-${uuidv4()}-${Date.now()}.jpeg`;
          await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/products/${imagesFileName}`);
          req.body.images.push(imagesFileName);
        })
      );
    }
  }
  next();
});

const createProduct = createOne(Product);

const getAllProduct = getAll(Product);

const getProduct = getOne(Product, "reviews");
const updateProduct = updateOne(Product);
const deleteProduct = deleteOne(Product);

module.exports = {
  createProduct,
  getAllProduct,

  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeImageProducts,
};
