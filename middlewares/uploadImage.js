const multer = require("multer");
const ApiError = require("../utils/apiError");

const uploadImageSingle = (fileName) => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Allow Image", 400), false);
    }
  };

  const upload = multer({ storage: storage, fileFilter });
  return upload.single(fileName);
};

const uploadImageMix = (img, images) => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Allow Image", 400), false);
    }
  };

  const upload = multer({ storage: storage, fileFilter });

  return (uploadProductImage = upload.fields([
    {
      name: img,
      maxCount: 1,
    },
    {
      name: images,
      maxCount: 20,
    },
  ]));
};

module.exports = {
  uploadImageSingle,
  uploadImageMix,
};
