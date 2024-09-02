const asyncHandler = require("express-async-handlr");
const ApiError = require("../utils/apiError");
const { Model } = require("mongoose");
const apiFeatures = require("../utils/apiFeatures");
const { asyncErrorHandler } = require("express-error-catcher");

const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const deletedDocumnent = await Model.findByIdAndDelete(id);

    if (!deletedDocumnent) {
      return next(new ApiError(`no found ${Model} for you id ${id}`, 404));
    }
    if (Model.modelName === "Review") {
      const productId = deletedDocumnent.product;

      await Model.getRatingAvg_RatingQun(productId);
    }

    res.status(200).json({ msg: "success deleted" });
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!document) {
      return next(new ApiError(`no found document for you id ${id}`, 404));
    }
    document.save();
    res.status(200).json({ data: document });
  });

const createOne = (Model) =>
  asyncErrorHandler(async (req, res) => {
    const document = new Model(req.body);

    await document.save();
    res.status(201).json({ data: document });
  });

const getOne = (Model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // let document = [];
    // console.log(Model);
    // if (Model === "Product" || "SubCategory") {
    //   document = await Model.findById(id).populate({
    //     path: "category",
    //     select: "name -_id",
    //   });
    // }
    const query = Model.findById(id);
    if (populateOpt) {
      query.populate(populateOpt);
    }
    const document = await query;
    if (!document) {
      return next(new ApiError(`no found document for you id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

const getAll = (Model, name) =>
  asyncErrorHandler(async (req, res) => {
    const countDocuments = await Model.countDocuments();
    let queryId = {};

    if (req.queryId) {
      queryId = req.queryId;
    }

    const allModel = new apiFeatures(Model.find(queryId), req.query)
      .fields()
      .sort()
      .filtraing()
      .search(name)
      .pagination(countDocuments);

    const { paginationResult, mongooseQuery } = allModel;
    const getModel = await mongooseQuery;

    // console.log(getModel);
    // console.log(paginationResult);
    // console.log(getModel.length);
    res.status(200).json({
      result: getModel.length,
      paginationResult,
      data: getModel,
    });
  });

module.exports = {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
};
