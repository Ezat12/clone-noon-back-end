const fs = require("fs");
const Product = require("../../models/productMode");
const connectDB = require("../../config/connect-db");
const dotenv = require("dotenv");

dotenv.config({ path: "../../config.env" });

// connect data base
connectDB()

// read file product.json
const product = JSON.parse(fs.readFileSync("./product.json"));

// insert products 
const insertProduct =async () => {
  try {
    await Product.create(product)
    console.log("Success Insert Data");
    process.exit(1);
  } catch (error) {
    console.log(error);
  }
}

const deleteData =async () => {
  try {
    await Product.deleteMany()
    console.log("Success deleted Data");
    process.exit(1);
  } catch (error) {
    console.log(error);
  }
}

if (process.argv[2] === '-i') {
  insertProduct();
}
else if (process.argv[2] === '-d') {
  deleteData();
}