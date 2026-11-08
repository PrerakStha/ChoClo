import { z } from "zod";

export const createOrderSchema = z.object({
  shippingAddress: z
    .string("shipping address is required.")
    .trim()
    .min(2, "Shipping address must be at least 2 letters.")
    .max(50, "Shipping address must not be more than 50 letters."),

  shippingName : z
    .string("shipping name is required.")
    .trim()
    .min(2, "Shipping name must be at least 2 letters.")
    .max(50, "Shipping name must not be more than 50 letters."),

  shippingCity : z
    .string("shipping city is required.")
    .trim()
    .min(2, "Shipping city must be at least 2 letters.")
    .max(50, "Shipping city must not be more than 50 letters."),

    shippingPhone : z
    .string("Please enter a valid number")
    .trim()
    .regex(/^9[78]\d{8}$/, "Enter a valid 10-digit Nepali mobile number"),
});
