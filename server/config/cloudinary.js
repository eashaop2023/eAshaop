const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "doctors";
    return {
      folder: folder,
      format: file.mimetype.split("/")[1], // jpg, png, pdf etc.
      public_id: Date.now() + "-" + file.originalname.split(".")[0],
    };
  },
});

const upload = multer({ storage });

module.exports = { upload, cloudinary };
