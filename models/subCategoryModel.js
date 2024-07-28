const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trime: true,
      unique: [true, "SubCate must be unique"],
      minLength: [2, "to short suncategory name"],
      maxLength: [30, "to long suncategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "main Category must be required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("subCategory", subCategorySchema);
