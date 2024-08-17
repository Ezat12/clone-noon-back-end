const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handlr");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");
const ApiError = require("../utils/apiError");
const { uploadImageSingle } = require("../middlewares/uploadImage");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/categories");
//   },
//   filename: (req, file, cb) => {
//     console.log(file);
//     const ext = file.mimetype.split("/")[1];
//     const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, fileName);
//   },
// });

const uploadCategoryImage = uploadImageSingle("image");

const resizeImage = async (req, res, next) => {
  if (req.file) {
    const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
    const tempFilePath = `/tmp/${fileName}`;
    console.log(fileName);

    await sharp(req.file.buffer)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(tempFilePath);
    req.body.image = tempFilePath;
  }
  next();
};

const createCategory = createOne(Category);

const getAllCategory = getAll(Category);
const getCategory = getOne(Category);

const updateCategory = updateOne(Category);

const deleteCategory = deleteOne(Category);

module.exports = {
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
};
