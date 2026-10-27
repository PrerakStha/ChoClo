import { getMyCart, updateCartItem, removeCartItem, addItemToCart } from "../controllers/cart.controller.js";
import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { addItemToCartSchema, updateCartItemSchema } from "../validators/cart.validator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router()
router.use(requireAuth)

router.get("/" , getMyCart);
router.post("/items", validate(addItemToCartSchema), addItemToCart);
router.patch("/items/:id", validate(updateCartItemSchema), updateCartItem);
router.delete("/items/:id" ,removeCartItem);

export default router;