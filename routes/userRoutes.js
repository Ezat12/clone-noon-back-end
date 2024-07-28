const express = require("express");

const {
  protectAuth,
  allowedTo,
  getloggedUserData,
  updateLoggedPasswordUser,
  updateUserData,
  deleteLoggerUser,
  activeUser,
} = require("../server/auth-server");

const {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  updateUserPassword,
} = require("../server/user-server");

const {
  validatorGetUser,
  validatorCreateUser,
  validatorUpdateUser,
  validatorDeleteUser,
  validatorChangePassword,
} = require("../utils/validator/validatorUser");

const router = express.Router();

router
  .route("/change-password/:id")
  .put(protectAuth, validatorChangePassword, updateUserPassword);

router.get("/getDataUser", protectAuth, getloggedUserData, getUser);

router.put(
  "/updatePasswordUser",
  protectAuth,
  getloggedUserData,
  validatorChangePassword,
  updateLoggedPasswordUser
);

router.put(
  "/updateUserData",
  protectAuth,
  getloggedUserData,
  validatorUpdateUser,
  updateUserData
);

router.delete("/deleteLoggerUser", protectAuth, deleteLoggerUser);

router.put("/activeUser", activeUser);

router
  .route("/")
  .post(
    protectAuth,
    allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    validatorCreateUser,
    createUser
  )
  .get(protectAuth, allowedTo("admin", "manager"), getAllUser);

router
  .route("/:id")
  .get(protectAuth, allowedTo("admin"), validatorGetUser, getUser)
  .put(protectAuth, allowedTo("admin"), validatorUpdateUser, updateUser)
  .delete(protectAuth, allowedTo("admin"), validatorDeleteUser, deleteUser);

module.exports = router;
