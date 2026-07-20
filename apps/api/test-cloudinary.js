// apps/api/test-cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Config check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret_length: process.env.CLOUDINARY_API_SECRET?.length, // never print the real secret
});

cloudinary.uploader.upload("./test-image.jpg", { folder: "bsma/projects" })
  .then((res) => console.log("SUCCESS:", res.secure_url))
  .catch((err) => console.error("FAILED:", err));