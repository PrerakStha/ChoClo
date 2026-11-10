import { placeOrder, getOrder, listOrders } from "../services/order.service.js";
import { handleError } from "../utils/handleError.js";

export async function createOrder(req, res) {
  try {
    const { shippingName, shippingAddress, shippingCity, shippingPhone } =
      req.body;
    const order = await placeOrder(req.user.id, {
      shippingAddress,
      shippingName,
      shippingPhone,
      shippingCity,
    });
    res.status(201).json(order);
  } catch (error) {
    handleError(error, res);
  }
}

export async function getMyOrders(req, res) {
  try {
    const orders = await listOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    handleError(error, res);
  }
}

export async function getMyOrder(req, res) {
  try {
    const orderId = Number(req.params.id);
   if (!Number.isInteger(orderId) || orderId < 1){
      return res.status(400).json({ message: "Invalid order id" });
    }
    const order = await getOrder(req.user.id, orderId);
    res.json(order);
  } catch (error) {
    handleError(error, res);
  }
}
