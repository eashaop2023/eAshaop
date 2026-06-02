const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();
const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
     if (!allowedExtensions.includes(ext)) {
      const message = `Invalid file type: "${ext}". Only ${allowedExtensions.join(", ")} are allowed.`;
      return cb(new Error(message), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
