const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category is required"],
      unique: [true, "category must be unique"],
      minLength: [3, "too short category name"],
      maxLength: [30, "too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// const checkImage = (doc) => {
//   if (doc.image) {
//     const imgURL = `${process.env.BASE_URL}/categories/${doc.image}`;
//     doc.image = imgURL;
//   }
// };

// categorySchema.post("init", (doc) => {
//   checkImage(doc);
// });
// categorySchema.post("save", (doc) => {
//   checkImage(doc);
// });


module.exports = mongoose.model("Category", categorySchema);
