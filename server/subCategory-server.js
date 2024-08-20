const SubCategory = require("../models/subCategoryModel");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");
const { uploadImageSingle } = require("../middlewares/uploadImage");
const { uploadImage } = require("../utils/cloudinaryCofig");

const categoryIdToParams = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
    next();
  }
  next();
};

const checkCategoryId = (req, res, next) => {
  if (req.params.categoryId) {
    req.queryId = { category: req.params.categoryId };
  }
  next();
};

const uploadSubCategoryImage = uploadImageSingle("image");

const resizeImage = async (req, res, next) => {
  if (req.file) {
    const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
    const tempFilePath = `/tmp/${fileName}`;

    await sharp(req.file.buffer)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(tempFilePath);

    const result = await uploadImage(`${tempFilePath}`);
    req.body.image = result;
  }
  next();
};

const createSubCategory = createOne(SubCategory);
const getAllSubCategory = getAll(SubCategory);

const getSubCategory = getOne(SubCategory);
const updateSubCategory = updateOne(SubCategory);
const deleteSubCategory = deleteOne(SubCategory);

module.exports = {
  createSubCategory,
  getAllSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  categoryIdToParams,
  checkCategoryId,
  uploadSubCategoryImage,
  resizeImage,
};
