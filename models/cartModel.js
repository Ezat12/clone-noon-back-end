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

module.exports = mongoose.model("Cart", cartSchema);
