// middleware/upload.js
const cloudinary = require("../config/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: `recipes/${req.user_id}`, // Folder name in Cloudinary where images will be stored
      allowed_formats: ["jpg", "png", "jpeg", "svg", "heic"], // Allow HEIC uploads
      resource_type: "image", // Explicitly set the resource type to 'image'
      transformation: [{ fetch_format: "jpg" }], // Transform any uploaded image to JPG format
    };
  },
});

// Initialize multer with cloudinary storage
const upload = multer({ storage });

module.exports = upload;
