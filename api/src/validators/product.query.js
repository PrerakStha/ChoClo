import { z } from "zod";

// empty strings from forms become "not set"; anything invalid falls back quietly
const optionalInt = (min, max) =>
  z
    .preprocess(
      (v) => (v === "" || v === undefined ? undefined : v),
      z.coerce.number().int().min(min).max(max).optional()
    )
    .catch(undefined);

export const productQuerySchema = z.object({
  search: z.string().trim().max(60).catch(""),
  category: z.string().trim().max(60).catch(""),
  minPrice: optionalInt(0, 10000000), // in rupees
  maxPrice: optionalInt(0, 10000000), // in rupees
  inStock: z.enum(["1"]).optional().catch(undefined),
  sort: z.enum(["newest", "price-asc", "price-desc", "name-asc"]).catch("newest"),
  page: z.coerce.number().int().min(1).max(10000).catch(1),
});

export function parseProductQuery(query) {
  return productQuerySchema.parse(query);
}