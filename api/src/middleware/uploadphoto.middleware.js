import multer from "multer";
import { httpError } from "../utils/httpError.js";
import { handleError } from "../utils/handleError.js";

const MAX_SIZE = 3 * 1024 * 1024; // 3 MB, which also stays under host request limits
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(), // kept in memory, never written to disk
  limits: { fileSize: MAX_SIZE, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED.includes(file.mimetype)) {
      return cb(httpError(400, "Please upload a JPEG, PNG or WebP photo"));
    }
    cb(null, true);
  },
});

export function uploadPhoto(req, res, next) {
  upload.single("photo")(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE" ? "Your photo must be 3 MB or smaller" : 'Send the photo in a field named "photo"';
      return handleError(httpError(400, message), res);
    }
    handleError(err, res);
  });
}