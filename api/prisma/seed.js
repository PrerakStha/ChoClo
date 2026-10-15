import prisma from "../src/config/db.js";

async function main() {
  // clear old data so you can re-run the seed safely
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  await prisma.category.create({
    data: {
      name: "T-Shirts",
      slug: "t-shirts",
      products: {
        create: [
          {
            name: "Classic Cotton Tee",
            slug: "classic-cotton-tee",
            description: "Soft everyday cotton t-shirt.",
            basePrice: 99900, // price in paisa (NPR 999.00)
            variants: {
              create: [
                { size: "M", color: "Black", stock: 10, sku: "CCT-M-BLK" },
                { size: "L", color: "Black", stock: 5, sku: "CCT-L-BLK" },
                { size: "M", color: "White", stock: 8, sku: "CCT-M-WHT" },
              ],
            },
          },
          {
            name: "Graphic Print Tee",
            slug: "graphic-print-tee",
            description: "Relaxed fit tee with a printed design.",
            basePrice: 129900,
            variants: {
              create: [
                { size: "S", color: "Navy", stock: 6, sku: "GPT-S-NVY" },
                { size: "M", color: "Navy", stock: 12, sku: "GPT-M-NVY" },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .then(() => console.log("Seeded!"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());