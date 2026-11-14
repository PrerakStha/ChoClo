import multer from "multer";
import { httpError } from "../utils/httpError.js";
import { handleError } from "../utils/handleError.js";

const MAX_FILES = 8;
const MAX_SIZE = 5 * 1024 * 1024; // 5mb
const ALLOWED_TYPES = ["image/webp", "image/jpeg", "image/png"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE, files: MAX_FILES },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(httpError(400, "Only Webp, JPEG and PNG format is allowed."));
    }
    cb(null, true);
  },
});

const MULTER_MESSAGES = {
  LIMIT_FILE_SIZE: "Each image must be 5 MB or smaller",
  LIMIT_FILE_COUNT: `You can upload at most ${MAX_FILES} images at a time`,
  LIMIT_UNEXPECTED_FILE: 'Send the files in a field named "images"',
};

export function uploadImage(req, res, next){
    upload.array("images", MAX_FILES)(req, res, (err) =>{
        if(!err) return next();
        if(err instanceof multer.MulterError){
            return handleError(httpError(400, MULTER_MESSAGES[err.code] || err.message), res);
        }
        handleError(err,res)
    }) 

}
