// middleware/upload.js
const cloudinary = require("../config/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "users", // Folder name in Cloudinary where images will be stored
    allowed_formats: ["jpg", "png", "jpeg", "svg"], // Allowed image formats
  },
});

// Initialize multer with cloudinary storage
const upload = multer({ storage });

module.exports = upload;
