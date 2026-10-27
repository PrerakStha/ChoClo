
import prisma from "../config/db.js";
import { httpError } from "../utils/httpError.js";

const cartInclude = {
    items: {
        orderBy: { createdAt: "asc" },
        include: {
            variant: {
                include: {
                    product: {
                        select: { id: true, name: true, slug: true, basePrice: true }
                    }
                }
            }
        }
    }
};

function shapeCart(cart) {
    if (!cart) {
        return ({ items: [], itemCount: 0, subTotal: 0 });
    }

    const items = cart.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        lineTotal: item.quantity * item.variant.product.basePrice,
        variant: {
            id: item.variant.id,
            size: item.variant.size,
            color: item.variant.color,
            stock: item.variant.stock
        },
        product: item.variant.product,
    }));

    return {
        items,
        itemCount: items.reduce((sum, item) => { sum + item.quantity }, 0),
        subTotal: items.reduce((sum, item) => { sum + item.lineTotal }, 0)
    }
};



export async function getCart(userId) {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: cartInclude,
    });
    return shapeCart(cart);
}

export async function addItem(userId, { variantId, quantity }) {
    const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
    });
    if (!variant) {
        throw httpError(404, "This option does not exist")
    }
    if (variant.stock < 1) {
        throw httpError(409, "Out of stock")
    }

    const cart = await prisma.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
    });

    const existing = await prisma.createItem.findUnique({
        where: { cartId_variantId: { cartId: cart.id, variantId } },
    })

    const alreadyInCart = existing ? existing.quantity > 0 : 0
    if (alreadyInCart + quantity > variant.stock) {
        const left = variant.stock - alreadyInCart

        throw httpError(
            409, left > 0 ? `Only ${left} more available` : `You already have all ${variant.stock} in your cart`
        )

    }
    await prisma.cartItem.upsert({
        where: { cartId_variantId: { cartId: cart.id, variantId } },
        update: { quantity: { increment: quantity } },
        create: { cartId: cart.id, variantId, quantity },
    })
    return getCart(userId)
};

export async function updateItem(userId, itemId, quantity){
    const item = await prisma.cartItem.findFirst(
        {where: {id: itemId, cart: {userId : userId}},
        include: {variant:true}
    }
    )
    if(!item){
        throw httpError(404,"This item does not exist!")
    }
    if(quantity>item.variant.stock){
        throw httpError(404,`Only ${item.variant.stock} left`)
    }
    await prisma.cartItem.update({where: {id: itemId}, data: {quantity}})
    return getCart(userId)
};

export async function removeItem(userId, itemId){
    const item = await prisma.cartItem.findFirst({
        where:{id: itemId, cart: {userId: userId}},
    })
    if(!item){
        throw httpError(404,"Item not found")
    }
    await prisma.cartItem.delete({where: {id: itemId}})
    return getCart(userId)
}