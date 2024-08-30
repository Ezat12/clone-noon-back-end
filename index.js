const path = require("path");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

const dbConnection = require("./config/connect-db");
const categoryRoute = require("./routes/categoryRoutes");
const subCategoryRoute = require("./routes/subCategoryRoutes");
const brandRoute = require("./routes/brandRoutes");
const productRoute = require("./routes/productRoutes");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const reviewsRoute = require("./routes/reviewRoutes");
const wishlistRoute = require("./routes/wishlistRoutes");
const addressRoute = require("./routes/addressesRoutes");
const couponRoute = require("./routes/couponRoutes");
const cartRoute = require("./routes/cartRoutes");
const orderRoute = require("./routes/orderRoutes");
const imagesCategory = require("./routes/imagesCategoryRoutes");
const ApiError = require("./utils/apiError");
const errorHandling = require("./middlewares/errorHandling");

const { webhookCheckout } = require("./server/order-server");

dotenv.config({ path: "config.env" });

// Connect database
dbConnection();

// middleware

app.use(cors());
app.options("*", cors());
app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// checkout Webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// app.use(express.json({ limit: "20kb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "uploads")));

// Routes

app.use("/api/v1/categories", categoryRoute);

app.use("/api/v1/subcategories", subCategoryRoute);

app.use("/api/v1/brands", brandRoute);

app.use("/api/v1/product", productRoute);

app.use("/api/v1/user", userRoute);

app.use("/api/v1/", authRoute);

app.use("/api/v1/reviews", reviewsRoute);

app.use("/api/v1/wishlist", wishlistRoute);

app.use("/api/v1/addresses", addressRoute);

app.use("/api/v1/coupons", couponRoute);

app.use("/api/v1/cart", cartRoute);

app.use("/api/v1/orders", orderRoute);

app.use("/api/v1/imagesCategory", imagesCategory);

// Error Route
app.all("*", (req, res, next) => {
  next(new ApiError(`the route is not success ${req.originalUrl}`, 400));
});

// Globel Error Handling middleware for express
app.use(errorHandling);

// listen port
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`app running on port ${process.env.PORT}`);
});

// Handling Error outsite express
// process.on("unhandledRejection", (err) => {
//   console.error(`UnhandleedRejection Error ${err}`);
//   server.close(() => {
//     console.log("Shutting down...");
//     process.exit(1);
//   });
// });
