const crypto = require("node:crypto");

const sendEmail = require("../utils/sendEmail");
const slugify = require("slugify");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handlr");
const { asyncErrorHandler } = require("express-error-catcher");

function getToken(payload) {
  return jwt.sign({ userId: payload }, process.env.SECRET_KET, {
    expiresIn: process.env.EXPRIES_TIME,
  });
}

const signUp = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    email: req.body.email,
    password: req.body.password,
  });

  const token = getToken(user._id);

  res.status(201).json({ data: user, token });
});

const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  // const checkPassword = await bcrypt.compare(req.body.password, user.password);

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("incorrect email or password", 401));
  }

  const token = getToken(user._id);

  res.status(201).json({ data: user, token });
});

const protectAuth = asyncErrorHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "you are not login , please login to get access to route",
        401
      )
    );
  }

  // verift token
  const decoded = jwt.verify(token, process.env.SECRET_KET);

  // check if not user
  const currentUser = await User.findById(decoded.userId);

  if (!currentUser) {
    return next(new ApiError("the user exist"));
  }

  if (!currentUser.active) {
    return next(new ApiError("The Email is not active", 400));
  }
  // check change password
  if (currentUser.passwordAt) {
    const userTimeStamp = parseInt(currentUser.passwordAt.getTime() / 1000);
    if (userTimeStamp > decoded.iat) {
      return next(
        new ApiError("user change password , please login again", 401)
      );
    }
  }
  req.user = currentUser;
  next();
});

const allowedTo = (...roles) =>
  asyncErrorHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("you cant not allow to access this route", 403));
    }
    next();
  });

const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  // get user with email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ApiError(`not found user with email => ${req.body.email}`, 401)
    );
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedRestCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordRestCode = hashedRestCode;
  user.passwordRestExpires = Date.now() + 10 * 60 * 1000;
  user.passwordRestVerified = false;

  await user.save();

  await sendEmail({
    email: user.email,
    subject: "You Password Rest Code (Valid For 10 min)",
    message: `rest code is => ${resetCode}`,
  });

  res.statue(200).json({ msg: "We sent you a reset code , check your email" });
});

const verifyPassRestCode = asyncErrorHandler(async (req, res, next) => {
  const hashedRestCode = crypto
    .createHash("sha256")
    .update(req.body.restCode)
    .digest("hex");

  const user = await User.findOne({ passwordRestCode: hashedRestCode });
  if (!user) {
    return next(new ApiError("Rest Code Invalid"));
  }

  if (user.passwordRestExpires < Date.now()) {
    return next(new ApiError("Rest Code Expires"));
  }

  user.passwordRestVerified = true;
  await user.save();

  res.status(200).json(user);
});

const restPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new Error("The Email is not Correct", 404));
  }

  if (!user.passwordRestVerified) {
    return next(new Error("Rest Code is not Verify", 404));
  }

  user.password = req.body.newPassword;
  user.passwordRestCode = undefined;
  user.passwordRestExpires = undefined;
  user.passwordRestVerified = false;

  await user.save();

  const token = getToken(user._id);

  res.status(200).json({ token });
});

const getloggedUserData = asyncErrorHandler((req, res, next) => {
  req.params.id = req.user._id;
  // console.log(req.params.id);
  next();
});

const updateLoggedPasswordUser = asyncErrorHandler(async (req, res, next) => {
  // req.param.id = req.user._id;
  const { id } = req.params;
  // console.log(id);
  // req.params = { id: req.user._id };
  const document = await User.findByIdAndUpdate(
    id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`no found user for you id ${id}`, 404));
  }

  const token = getToken(req.user._id);

  res.status(200).json({ token });
});

const updateUserData = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      birthday: req.body.birthday,
      gender: req.body.gender,
      // profileImg: req.body.image,
    },
    { new: true }
  );

  res.status(200).json({ data: user });
});

const deleteLoggerUser = asyncErrorHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false }, { new: true });

  res.status(200).json("success");
});

const activeUser = asyncErrorHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const findUser = await User.findOne({ email });

  if (!findUser || !(await bcrypt.compare(password, findUser.password))) {
    return next(new ApiError("The Email or Password is not Correct", 404));
  }

  if (findUser.active) {
    return next(new ApiError("the email is already active"));
  }

  findUser.active = true;
  findUser.password = req.body.password;
  await findUser.save();

  res.status(200).json({ data: findUser });
});

module.exports = {
  signUp,
  login,
  protectAuth,
  allowedTo,
  forgotPassword,
  verifyPassRestCode,
  restPassword,
  getloggedUserData,
  updateLoggedPasswordUser,
  updateUserData,
  deleteLoggerUser,
  activeUser,
};
