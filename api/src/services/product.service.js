import prisma from "../config/db.js";
const PAGE_SIZE = 12;

const SORTS = {
  newest: { createdAt: "desc" },
  "price-asc": { basePrice: "asc" },
  "price-desc": { basePrice: "desc" },
  "name-asc": { name: "asc" },
};

export async function listProducts(query) {
  const { search, category, minPrice, maxPrice, inStock, sort, page } = query;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.basePrice = {};
    if (minPrice !== undefined) where.basePrice.gte = minPrice * 100;
    if (maxPrice !== undefined) where.basePrice.lte = maxPrice * 100;
  }

  if (inStock) {
    where.variants = { some: { stock: { gt: 0 } } };
  }

  const [total, products] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      // the id keeps the order stable when two products tie, so pages never repeat items
      orderBy: [SORTS[sort], { id: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: true,
        variants: true,
        images: { orderBy: { position: "asc" }, take: 2 },
      },
    }),
  ]);

  return {
    products,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
}

export function getProductBySlug(slug) {
return prisma.product.findUnique({
    where: {slug}, 
    include: {category:true, variants: true, images: { orderBy: { position: "asc" }}},
});
}