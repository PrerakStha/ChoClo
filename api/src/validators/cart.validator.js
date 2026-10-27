import { z } from "zod";

const MAX_QUANTITY = 10;

const quantity = z 
.number("quantity must be a number")
.int("Must be a whole number")
.min(1, " Atleast 1 quantity ")
.max(MAX_QUANTITY, `At most ${MAX_QUANTITY} quantity `)

export const addItemToCartSchema = z.object({
    variantId: z
    .number("VariantID must be a number")
    .int("VariantID must be a whole number")
    .positive("VariantID is invalid"),
    quantity,
});

export const updateCartItemSchema = z.object({
    quantity,
});