import * as productService from "../services/product.service.js";
import { handleError } from "../utils/handleError.js";
import { parseProductQuery } from "../validators/product.query.js";

export async function listProducts(req, res) {
  try {
    const result = await productService.listProducts(parseProductQuery(req.query));
    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
}

export async function listCategories(req, res) {
  try {
    res.json(await productService.listCategories());
  } catch (err) {
    handleError(err, res);
  }
}

export async function getProduct(req,res){
    try{
        const products = await productService.getProductBySlug(req.params.slug);
        if (!products) return res.status(404).json({error: "product not found"});
        res.json(products);
    }
    catch(err){
        handleError(err,res)
    }
}