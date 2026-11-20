import { Router } from "express";
import { listProducts, getProduct} from "../controllers/product.controller.js";

const router = Router();

router.get("/", listProducts);
router.get("/categories", listCategories); // must come BEFORE "/:slug"
router.get("/:slug", getProduct);

export default router;
