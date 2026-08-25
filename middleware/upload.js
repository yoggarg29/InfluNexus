const multer = require("multer");
const path = require("path");

// Save uploaded profile images locally.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "public", "uploads"));
  },
  filename: function (req, file, cb) {
    // Avoid filename collisions.
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

function imageFilter(req, file, cb) {
  const allowed = /jpeg|jpg|png|webp|avif/;
  const isAllowed = allowed.test(path.extname(file.originalname).toLowerCase());
  if (isAllowed) return cb(null, true);
  cb(new Error("Only image files (jpg, png, webp, avif) are allowed."));
}

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
