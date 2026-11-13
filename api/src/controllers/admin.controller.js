import * as admin from "../services/admin.service.js";
import { httpError } from "../utils/httpError.js";
import { handleError } from "../utils/handleError.js";

function handler(fn) {
  return async (req, res) => {
    try {
      await fn(req,res);
    } catch (error) {
      handleError(error, res);
    }
  };
}

function idParams(req){
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id<1){
        throw httpError(400, "Invalid id");
    }
    return id;
}

export const listProducts = handler(async(req,res)=>{
res.json(await admin.listProducts());
})

export const getProduct = handler(async(req,res)=>{
    res.json(await admin.getProductById(idParams(req)));
})

export const createProduct = handler(async(req,res)=>{
    res.status(201).json(await admin.createProduct(req.body) )
})

export const createProdcut = createProduct;

export const updateProduct = handler(async(req,res)=>{
    res.json(await admin.updateProduct(idParams(req),req.body));
})

export const deleteProduct = handler(async(req,res)=>{
    res.json(await admin.deleteProduct(idParams(req)))
})

export const listCategories = handler(async(req,res)=>{
    res.json(await admin.listCategories())
})

export const createCategory = handler(async(req,res)=>{
    res.status(201).json(await admin.createCategory(req.body))
})

export const updateVariant = handler(async(req,res)=>{
    res.json(await admin.updateVariantStock(idParams(req), req.body.stock))
})

export const addVariant = handler(async(req,res)=>{
    res.status(201).json(await admin.addVariant(idParams(req),req.body))
})

export const deleteVariant = handler(async(req,res)=>{
    res.json(await admin.deleteVariant(idParams(req)))
})

export const listOrders = handler(async(req,res)=>{
    res.json(await admin.listAllOrders())
})

export const updateOrderStatus = handler(async(req,res)=>{
    res.json(await admin.updateOrderStatus(idParams(req), req.body.status))
})