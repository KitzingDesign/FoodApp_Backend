// Middleware to extract public ID from Cloudinary URL
const extractPublicImgId = (url) => {
  const image_url = url; // Assuming the URL is coming from the request body

  if (!image_url) {
    return null;
  }

  const baseUrl = "https://res.cloudinary.com/dovl9flzb/image/upload/";
  const urlWithoutBase = image_url.replace(baseUrl, "");

  // Remove the file extension
  const publicIdWithExtension = urlWithoutBase.split("/").slice(1).join("/"); // Remove version
  const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ""); // Remove extension

  return publicId;
};

module.exports = extractPublicImgId;
