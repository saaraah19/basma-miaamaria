import multer from "multer";

/**
 * multer's own errors (wrong mimetype from our fileFilter, file too large,
 * too many files) throw inside the upload call itself — if you just do
 * `router.post("/x", uploadMedia.single("file"), handler)`, a rejected
 * upload becomes an unhandled error and Express 5 surfaces a bare 500.
 * This wraps it so the person uploading gets an actual reason.
 */
export const handleUpload = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const messages = {
        LIMIT_FILE_SIZE: "Fichier trop volumineux (8 Mo maximum).",
        LIMIT_FILE_COUNT: "Trop de fichiers envoyés en une seule fois.",
      };
      return res.status(400).json({ error: messages[err.code] ?? err.message });
    }
    if (err) {
      // Our custom fileFilter error (wrong mimetype)
      console.error("Upload error:", err); 
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};
