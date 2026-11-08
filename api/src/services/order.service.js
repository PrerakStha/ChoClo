import { includes } from "zod";
import prisma from "../config/db.js";
import { httpError } from "../utils/httpError.js";

export async function placeOrder(userId, shipping){
    return prisma.$transaction(
        async(tx) =>{
            const cart = await tx.cart.findUnique({
                where : {userId},
                include : {
                    items : {
                        orderBy: {createdAt : "asc"},
                        include : {
                            variant : {
                                include : {
                                    product : {select : {name : true, basePrice: true}},
                                }
                            }
                        }
                    }
                }

            });
            if (!cart || cart.items.length === 0 ){
                throw httpError(400, "Your cart is empty");
            }
            let total = 0;
            const orderItems = [];

            for (const item of cart.items){
                const {variant} = item;

                const result = await tx.productVariant.updateMany({
                    where : {id : variant.id, stock : { gte : item.quantity }},
                    data : {stock : {decrement: item.quantity}}
                });

                if (result.count === 0){
                    throw httpError(
                        409, `${variant.product.name} (${variant.color}/${variant.size}) is no longer available in the quantity you chose.`
                    )
                }

                const unitPrice = variant.product.basePrice;
                total += unitPrice * item.quantity

                orderItems.push({
                    variantId: variant.id,
                    quantity: item.quantity,
                    productName: variant.product.name,
                    size : variant.size,
                    color: variant.color,
                    unitPrice
                });
            }

            const order = await tx.order.create({
                data: {
                    userId,
                    shippingName: shipping.shippingName,
                    shippingAddress: shipping.shippingAddress,
                    shippingCity: shipping.shippingCity,
                    shippingPhone: shipping.shippingPhone,
                    total,
                    items : {create : orderItems},
                },
                include: {items : true},
            });

            await tx.cartItem.deleteMany({where : {cartId: cart.id}});

            return order;
        },
        {maxWait: 10000, timeout: 20000}
    );
}

export async function listOrders(userId){
    return prisma.order.findMany({
        where: {userId: userId},
        orderBy : {createdAt : "desc"},
        include : {items: true},
    })
}

export async function getOrder(userId, orderId){
    const order =  prisma.order.findFirst({
        where: {id : orderId, userId: userId},
        include: {items: true},
    });

    if(!order){
        throw httpError(404, "Order not found!");
    }

    return order;
}

