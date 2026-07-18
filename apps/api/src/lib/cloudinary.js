import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB per file

/**
 * `allowed_formats` on CloudinaryStorage is a hint to Cloudinary's own API,
 * not a hard client-facing gate — it doesn't stop a mismatched/renamed file
 * from being sent in the first place, and it enforces no size limit at all.
 * `fileFilter` + `limits` below are the actual gate multer applies BEFORE
 * anything reaches Cloudinary.
 */
const imageFileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error("Format de fichier non autorisé (JPG, PNG, WEBP uniquement)."));
  }
  cb(null, true);
};

const projectStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bsma/projects",
    //allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // No transformation here on purpose — quality/format optimization
    // already happens at delivery time via lib/cloudinary-url.js's
    // cldUrl(). Applying it again at upload was redundant, and on
    // accounts with "Strict Transformations" enabled (default on newer
    // Cloudinary accounts), an incoming transformation param like this
    // can get rejected outright with a 403.
  },
});

const mediaStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bsma/media",
    //allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

export const uploadProjectImage = multer({
  storage: projectStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 20 },
});

export const uploadMedia = multer({
  storage: mediaStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
});

export { cloudinary };
