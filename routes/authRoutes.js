const express = require("express");
const {
  signUp,
  login,
  forgotPassword,
  verifyPassRestCode,
  restPassword,
} = require("../server/auth-server");
const {
  validatorSignUp,
  validatorLogin,
} = require("../utils/validator/validatorAuth");
const router = express.Router();

router.route("/signup").post(validatorSignUp, signUp);
router.route("/login").post(validatorLogin, login);

router.post("/forgotPassword", forgotPassword);
router.post("/verifyRestCode", verifyPassRestCode);
router.post("/restPassword", restPassword);

module.exports = router;
