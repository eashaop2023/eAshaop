const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".pdf"].includes(ext)) {
      return cb(new Error("Only images and PDFs are allowed"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
