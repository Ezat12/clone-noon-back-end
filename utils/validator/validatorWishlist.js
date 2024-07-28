const { check } = require("express-validator");
const validatorError = require("../../middlewares/validatorError");
const Product = require("../../models/productMode");

const validatorAddAndDeleteWishlist = [
  check("product")
    .isMongoId()
    .withMessage("Invalid Id")
    .custom(async (val, { req }) => {
      const product = await Product.findById(val);
      if (!product) {
        throw new Error("this product not correct");
      }
      return true;
    }),
  validatorError,
];

module.exports = {
  validatorAddAndDeleteWishlist,
};
