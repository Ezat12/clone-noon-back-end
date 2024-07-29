const SubCategory = require("../models/subCategoryModel");
const asyncHandlr = require("express-async-handlr");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

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

const createSubCategory = createOne(SubCategory);
const getAllSubCategory = getAll(SubCategory); // async (req, res, next) => {
//   const subCategory = await SubCategory.find({});

//   res.status(200).json({ data: subCategory });
// };

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
};
