import { z } from "zod";

export const DEFAULT_SIZE_CHART = [
  { size: "XS", chestMin: 80, chestMax: 86, waistMin: 66, waistMax: 72 },
  { size: "S", chestMin: 86, chestMax: 94, waistMin: 72, waistMax: 80 },
  { size: "M", chestMin: 94, chestMax: 102, waistMin: 80, waistMax: 88 },
  { size: "L", chestMin: 102, chestMax: 110, waistMin: 88, waistMax: 96 },
  { size: "XL", chestMin: 110, chestMax: 118, waistMin: 96, waistMax: 104 },
  { size: "XXL", chestMin: 118, chestMax: 126, waistMin: 104, waistMax: 112 },
];

const chartSchema = z
.array(
    z.object({
        size: z.string().min(1),
      chestMin: z.number(),
      chestMax: z.number(),
      waistMin: z.number().optional(),
      waistMax: z.number().optional(),
    })
    
).min(1)

export function parseChart(value){
    const result = chartSchema.safeParse(value);
    return result.success ? result.data : null
}