import { login, register, me, logout } from "../controllers/auth.controller.js";
import express from "express";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema} from "../validators/auth.validator.js";
import { requireAuth } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", requireAuth,  me);


export default router;