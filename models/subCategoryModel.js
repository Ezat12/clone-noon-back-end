const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trime: true,
      unique: [true, "SubCate must be unique"],
      minLength: [2, "to short subCategory name"],
      maxLength: [30, "to long subCategory name"],
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
    image: {
      type: String,
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("subCategory", subCategorySchema);
