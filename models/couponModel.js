const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "coupon name required"],
      trim: true,
    },
    expire: {
      type: Date,
      required: [true, "time expire to coupon required"],
    },
    discount: {
      type: Number,
      required: [true, "coupon discount required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
