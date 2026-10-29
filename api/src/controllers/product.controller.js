import * as productService from "../services/product.service.js";
import { handleError } from "../utils/handleError.js";


export async function listProducts(req, res) {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    }
    catch (err) {
        handleError(err,res)
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