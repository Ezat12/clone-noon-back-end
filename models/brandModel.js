const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category is required"],
      unique: [true, "category must be unique"],
      minLength: [2, "too short category name"],
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
//     const imgURL = `${process.env.BASE_URL}/brands/${doc.image}`;
//     doc.image = imgURL;
//   }
// };

// brandSchema.post("init", (doc) => {
//   checkImage(doc);
// });
// brandSchema.post("save", (doc) => {
//   checkImage(doc);
// });


module.exports = mongoose.model("Brand", brandSchema);
