import * as productService from "../services/product.service.js";

export async function listProducts(req, res) {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong." });
    }
}

export async function getProduct(req,res){
    try{
        const products = await productService.getProductBySlug(req.params.slug);
        if (!products) return res.status(404).json({error: "product not found"});
        res.json(products);
    }
    catch(error){
        console.log(err);
        res.status(500).json({error: "Error fetching the products."});
    }
}