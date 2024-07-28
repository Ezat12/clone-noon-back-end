const Review = require("../models/reviewModel");

const {
  createOne,
  getOne,
  getAll,
  updateOne,
  deleteOne,
} = require("./handlerFactory");

const checkParamsProductId = (req, res, next) => {
  if (req.params.productId) {
    req.body.product = req.params.productId;
  }
  next();
};

const checkProductId = (req, res, next) => {
  if (req.params.categoryId) {
    req.queryId = { product: req.params.productId };
  }
  next();
};

const createReview = createOne(Review);

const getAllReview = getAll(Review);

const getOneReview = getOne(Review);

const updateRevire = updateOne(Review);

const deleteReview = deleteOne(Review);

module.exports = {
  createReview,
  getAllReview,
  getOneReview,
  updateRevire,
  deleteReview,
  checkParamsProductId,
  checkProductId,
};
