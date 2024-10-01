// middleware/upload.js
const cloudinary = require("../config/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "recipes", // Folder name in Cloudinary where images will be stored
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed image formats
  },
});

// Initialize multer with cloudinary storage
const upload = multer({ storage });

module.exports = upload;
