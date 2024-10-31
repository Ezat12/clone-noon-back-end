const SubCategory = require("../models/subCategoryModel");
const Product = require("../models/productMode");
const Categories = require("../models/categoryModel");
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
const { asyncErrorHandler } = require("express-error-catcher");

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
    console.log(req.file);
    const type = req.file.mimetype.split("/")[1];

    const fileName = `category-${uuidv4()}-${Date.now()}.${type}`;
    const tempFilePath = `/tmp/${fileName}`;

    await sharp(req.file.buffer).toFile(tempFilePath);

    const result = await uploadImage(`${tempFilePath}`);
    req.body.image = result.url;
  }
  next();
};

const createSubCategory = createOne(SubCategory);
const getAllSubCategory = getAll(SubCategory);

const getSubCategory = getOne(SubCategory);
const updateSubCategory = updateOne(SubCategory);
const deleteSubCategory = deleteOne(SubCategory);

const getSubCategoryElectronics = asyncErrorHandler(async (req, res, next) => {
  // const names = ["mobiles", "laptops", "video-games"];
  const categories = await Categories.find({
    $or: [{ slug: "mobiles" }, { slug: "laptops" }, { slug: "video-games" }],
  });

  const subCategory = await SubCategory.aggregate([
    {
      $match: {
        $or: [
          { category: categories[0]._id },
          { category: categories[1]._id },
          { category: categories[2]._id },
        ],
      },
    },
    { $sample: { size: 6 } },
  ]);

  const product = await Product.aggregate([
    {
      $match: {
        $or: [
          { subCategory: [subCategory[0]._id] },
          { subCategory: [subCategory[1]._id] },
          { subCategory: [subCategory[2]._id] },
          { subCategory: [subCategory[3]._id] },
          { subCategory: [subCategory[4]._id] },
        ],
      },
    },
    { $sample: { size: 6 } },
  ]);


  res.status(200).json({ data: subCategory, product });
});

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
  getSubCategoryElectronics,
};
