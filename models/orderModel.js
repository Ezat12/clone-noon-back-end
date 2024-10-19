const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "order must be belong to user"],
    },
    cartItem: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        color: String,
        quantity: Number,
        price: Number,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingAddress: {
      alias: String,
      details: String,
      phone: String,
      city: String,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalPriceOrder: {
      type: Number,
    },
    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name email" }).populate({
    path: "cartItem.product",
    select: "title description imgCover",
  });
  next();
});

module.exports = mongoose.model("Order", orderSchema);
