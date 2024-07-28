const mongoose = require("mongoose");
const Product = require("./productMode");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      required: [true, "rating must be required"],
      min: [1, " min rating value is 1.0"],
      max: [5, " max rating value is 5.0"],
      required: [true, "Review Reating must be required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to Product"],
    },
  },
  {
    Timestamp: true,
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.static("getRatingAvg_RatingQun", async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        ratingAvg: { $avg: "$ratings" },
        ratingSum: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    rating_average: result[0].ratingAvg,
    ratingQuantity: result[0].ratingSum,
  });
});

reviewSchema.post("save", async function () {
  await this.constructor.getRatingAvg_RatingQun(this.product);
});

reviewSchema.post(
  "remove",
  // { document: false, query: true },
  async function () {
    await this.constructor.getRatingAvg_RatingQun(this.product);
  }
);

module.exports = mongoose.model("Review", reviewSchema);
