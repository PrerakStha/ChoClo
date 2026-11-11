import { z } from "zod";

const variantFields = {
  size: z.string("Size is required").trim().min(1, "Size is required").max(20, "Size is too long"),
  color: z.string("Color is required").trim().min(1, "Color is required").max(30, "Color is too long"),
  stock: z
    .number("Stock must be a number")
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(100000, "Stock is too large"),
};

const productFields = {
  name: z.string("Name is required").trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  description: z.string("Description is required").trim().min(2, "Description is required").max(2000, "Description is too long"),
  basePrice: z
    .number("Price must be a number")
    .int("Price must be a whole number")
    .positive("Price must be greater than 0")
    .max(100000000, "Price is too large"),
  categoryId: z.number("Choose a category").int().positive("Choose a category"),
};

export const variantSchema = z.object(variantFields);

export const createProductSchema = z.object({
  ...productFields,
  variants: z
    .array(variantSchema, "Add at least one size and color")
    .min(1, "Add at least one size and color")
    .max(50, "Too many variants")
    .refine(
      (list) =>
        new Set(list.map((v) => `${v.color.toLowerCase()}|${v.size.toLowerCase()}`)).size === list.length,
      "Each color and size combination can only appear once"
    ),
});

export const updateProductSchema = z
  .object(productFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, "Nothing to update");

export const updateVariantSchema = z.object({ stock: variantFields.stock });

export const categorySchema = z.object({
  name: z.string("Category name is required").trim().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"], {
    message: "Invalid status",
  }),
});