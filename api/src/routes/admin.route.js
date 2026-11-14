import express from "express";
import * as c from "../controllers/admin.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";
import { uploadImage } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  createProductSchema,
  updateProductSchema,
  variantSchema,
  updateVariantSchema,
  categorySchema,
  orderStatusSchema,
  orderImagesSchema,
} from "../validators/admin.validator.js";


const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/products", c.listProducts);
router.post("/products", validate(createProductSchema),c.createProdcut)
router.get("/products/:id", c.getProduct)
router.put("/products/:id", validate(updateProductSchema), c.updateProduct)
router.delete("/products/:id", c.deleteProduct);

router.post("/products/:id/variants", validate(variantSchema), c.addVariant);
router.patch("/variants/:id", validate(updateVariantSchema), c.updateVariant);
router.delete("/variants/:id", c.deleteVariant);

router.get("/categories", c.listCategories);
router.post("/categories", validate(categorySchema), c.createCategory);

router.get("/orders", c.listOrders);
router.patch("/orders/:id/status", validate(orderStatusSchema), c.updateOrderStatus);

router.post("/products/:id/images", uploadImage, c.addImages)
router.patch("/products/:id/images/order", validate(orderImagesSchema), c.reorderImages )
router.delete("/images/:id", c.deleteImage)


export default router;