import { getCart, addItem, removeItem, updateItem } from "../services/cart.service.js";
import { handleError } from "../utils/handleError.js";

export async function getMyCart(req, res) {
    try {
        const cart = await getCart(req.user.id);
        res.status(200).json(cart)
    }
    catch (err) {
        handleError(err, res)
    }
}

export async function addItemToCart(req, res) {
    try {
        const item = await addItem(req.user.id, req.body);
        res.status(201).json(item)
    }
    catch (err) {
        handleError(err, res)
    }
}

export async function updateCartItem(req, res) {
    try {
        const itemId = Number(req.params.id);
        if (!Number.isInteger(itemId) || itemId < 1) {
            return res.status(400).json({ message: "Invalid item id" })
        }
        const cart = await updateItem(req.user.id, itemId, req.body.quantity)
        res.status(200).json(cart)
    }
    catch (err) {
        handleError(err, res)
    }
}

export async function removeCartItem(req, res) {
    try {
        const itemId = Number(req.params.id)
        if (!Number.isInteger(itemId) || itemId < 1) {
            return res.status(400).json({ message: "Invalid item id" })
        }
        const cart = await removeItem(req.user.id, itemId)
        return res.status(200).json(cart)
    }
    catch (err) {
        handleError(err, res)
    }
}