const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItem: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        color: String,
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    totalCardPrice: Number,
    totalCardPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({ path: "cartItem.product" });
  next();
});

cartSchema.post("save", async function (doc) {
  await doc.populate({ path: "cartItem.product" });
});

cartSchema.pre("save", function (next) {
  this.populate({ path: "cartItem.product" });
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
