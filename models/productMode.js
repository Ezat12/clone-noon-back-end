const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "too short product title"],
      maxlength: [100, "too long product title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "product description is required"],
      minlength: [15, "too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "product Quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    price_discount: {
      type: Number,
    },
    colors: [String],
    imgCover: {
      type: String,
      required: [true, "img cover product is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      required: [true, "product must be belong category"],
      ref: "Category",
    },
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    rating_average: {
      type: Number,
      min: [0, "Rating must be above or equal 0.0"],
      max: [5, "Rating must be below or equal 5.0"],
      default: 1,
      // required: [false],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name -_id" });
  next();
});

// const checkImage = (doc) => {
//   if (doc.imgCover) {
//     const imgURL = `${process.env.BASE_URL}/products/${doc.imgCover}`;
//     doc.imgCover = imgURL;
//   }
//   if (doc.images) {
//     let imagesURL = [];
//     doc.images.map((img, i) => {
//       const imgURL = `${process.env.BASE_URL}/products/${doc.images[i]}`;
//       imagesURL.push(imgURL);
//     });
//     doc.images = imagesURL;
//   }
// };

// productSchema.post("init", (doc) => {
//   checkImage(doc);
// });
// productSchema.post("save", (doc) => {
//   checkImage(doc);
// });

// productSchema.plugin(searchable);

module.exports = mongoose.model("Product", productSchema);
