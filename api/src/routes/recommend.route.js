import express from "express";
import { recommendSize, recommendStyle } from "../controllers/recommend.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { uploadPhoto } from "../middleware/uploadphoto.middleware.js";
import { sizeSchema, styleSchema } from "../validators/recommend.schema.js";

const router = express.Router();

router.post("/size", validate(sizeSchema), recommendSize);
router.post("/style", requireAuth, uploadPhoto, validate(styleSchema), recommendStyle);

export default router;