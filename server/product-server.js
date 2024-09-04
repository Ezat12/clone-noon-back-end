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
const { uploadImage } = require("../utils/cloudinaryCofig");

const uploadProductImage = uploadImageMix("imgCover", "images");

const resizeImageProducts = asyncErrorHandler(async (req, res, next) => {
  if (req.files) {
    if (req.files.imgCover) {
      const imgCoverFileName = `product-${uuidv4()}-${Date.now()}.jpeg`;
      const tempFile = `/tmp/${imgCoverFileName}`;
      await sharp(req.files.imgCover[0].buffer).toFile(`/${tempFile}`);

      const result = await uploadImage(tempFile);

      req.body.imgCover = result.url;
    }
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (img) => {
          const imagesFileName = `product-${uuidv4()}-${Date.now()}.jpeg`;
          const tempFile = `/tmp/${imagesFileName}`;
          await sharp(img.buffer).toFile(`${tempFile}`);

          const result = await uploadImage(tempFile);
          req.body.images.push(result.url);
        })
      );
    }
  }
  next();
});

const checkGetProductWithCategory = (req, res, next) => {
  if (req.params.productCategoryId) {
    // console.log(req.body.category);

    req.queryId = {
      category: req.params.productCategoryId,
    };
  }
  next();
};
const checkGetProductWithSubCategory = (req, res, next) => {
  if (req.params.productSubCategoryId) {
    req.queryId = {
      subCategory: [req.params.productSubCategoryId],
    };
  }
  next();
};

const createProduct = createOne(Product);

const getAllProduct = getAll(Product, "Product");

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
  checkGetProductWithCategory,
  checkGetProductWithSubCategory,
};
