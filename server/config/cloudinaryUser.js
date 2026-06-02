const cloudinary = require("cloudinary").v2;
const CloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to determine resource type
const getResourceType = (mimetype) => {
  const docTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  return docTypes.includes(mimetype) ? "raw" : "image";
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "user_documents",
    resource_type: getResourceType(file.mimetype),
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "bmp", "tiff", "pdf", "doc", "docx"],
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
  })
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|bmp|tiff|webp|pdf|doc|docx/;
  const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) return cb(null, true);
  cb(new Error("File type not supported"), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter
});

module.exports = { cloudinary, upload, getResourceType };
