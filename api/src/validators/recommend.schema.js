import { z } from "zod";

export const sizeSchema = z.object({
  productId: z.number("Product is required").int().positive(),
  chest: z.number("Enter your chest measurement in cm").min(60, "Chest must be at least 60 cm").max(160, "Chest must be at most 160 cm"),
  waist: z.number().min(40, "Waist must be at least 40 cm").max(160, "Waist must be at most 160 cm").optional(),
  fit: z.enum(["fitted", "regular", "loose"]).default("regular"),
});

// the style endpoint is multipart, so every field arrives as text
export const styleSchema = z.object({
  description: z
    .string()
    .trim()
    .max(600, "Please keep your description under 600 characters")
    .optional(),
  consent: z.string().optional(),
});