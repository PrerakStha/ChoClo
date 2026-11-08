import express from "express";
import { getMyOrder, getMyOrders, createOrder } from "../controllers/order.controller.js";
import { createOrderSchema } from "../validators/order.validator.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getMyOrders);
router.post("/", validate(createOrderSchema), createOrder);
router.get("/:id", getMyOrder);

export default router;