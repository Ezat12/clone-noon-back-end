const mongoose = require("mongoose");

const imagesCategorySchema = new mongoose.Schema({
  images: [
    {
      type: String,
      unique: [true, "images must be unique"],
      required: [true, "images category required"],
    },
  ],
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "category required"],
  },
});

module.exports = mongoose.model("ImagesCategory", imagesCategorySchema);
