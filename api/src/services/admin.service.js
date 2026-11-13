import prisma from "../config/db.js";
import { httpError } from "../utils/httpError.js";

const productInclude = { category: true, variants: { orderBy: { id: "asc" } } };
const orderInclude = {
  items: true,
  user: { select: { name: true, email: true } },
};

function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uniqueSlug(delegate, text, fallback) {
  const base = slugify(text) || fallback;
  let slug = base;
  let n = 2;
  while (await delegate.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

function makeSku(slug, { color, size }) {
  return `${slug}-${color}-${size}`
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function listProducts() {
  return prisma.product.findMany({
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
  if (!product) throw httpError(404, "Product not found!");
  return product;
}

export async function createProduct(data) {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });
  if (!category) throw httpError(404, "Category not found!");

  const slug = await uniqueSlug(prisma.product, data.name, "product");

  try {
    return await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        basePrice: data.basePrice,
        categoryId: data.categoryId,
        variants: {
          create: data.variants.map((v) => ({ ...v, sku: makeSku(slug, v) })),
        },
      },
      include: productInclude,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw httpError(
        409,
        "A product or variant with these details already exists",
      );
    }
    throw error;
  }
}

export async function updateProduct(id, data) {
  await getProductById(id);

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw httpError(404, "Category not found!");
  }
  return prisma.product.update({
    where: { id },
    data,
    include: productInclude,
  });
}

export async function deleteProduct(id) {
  const product = await getProductById(id);
  const variantIds = product.variants.map((variant) => variant.id);
  const orderedVariantCount = await prisma.orderItem.count({
    where: { variantId: { in: variantIds } },
  });
  if (orderedVariantCount > 0) {
    throw httpError(409, "Products with order history cannot be deleted");
  }

  await prisma.$transaction([
    prisma.productVariant.deleteMany({ where: { productId: id } }),
    prisma.product.delete({ where: { id } }),
  ]);
}

export async function addVariant(productId, data) {
  const product = await getProductById(productId);

  try {
     await prisma.productVariant.create({
      data: { ...data, productId, sku: makeSku(product.slug, data) },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw httpError(
        409,
        "A product or variant with these details already exists",
      );
    }
    throw error;
  }
  return getProductById(productId);
}

export async function deleteVariant(variantId) {
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  });
  if (!variant) throw httpError(404, "Variant not found");

  const count = await prisma.productVariant.count({
    where: { productId: variant.productId },
  });
  if (count <= 1) {
    throw httpError(409, "A product needs at least one variant");
  }

  const orderItemCount = await prisma.orderItem.count({
    where: { variantId },
  });
  if (orderItemCount > 0) {
    throw httpError(409, "Variants with order history cannot be deleted");
  }

  await prisma.productVariant.delete({ where: { id: variantId } });
  return getProductById(variant.productId);
}

export async function updateVariantStock(variantId, stock) {
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  });
  if (!variant) throw httpError(404, "Variant not found.");
  await prisma.productVariant.update({
    where: { id: variantId },
    data: { stock },
  });
  return getProductById(variant.productId);
}

export async function listCategories(){
    const category = await prisma.category.findMany({orderBy: {name: "asc"}})
    return category;
}

export async function createCategory({ name }) {
    const slug = await uniqueSlug(prisma.category, name, "category");
    try {
        return await prisma.category.create({ data: { name, slug } });
    } catch (error) {
        if (error.code === "P2002") {
            throw httpError(409, "Category already exists");
        }
        throw error;
    }
}

export async function listAllOrders(){
    const order = await prisma.order.findMany({ include : orderInclude, orderBy: {createdAt: "desc"}});
    return order;
}

export async function updateOrderStatus(orderId, status){
    return prisma.$transaction(
        async(tx)=>{
            const order = await tx.order.findUnique({where: {id : orderId}, include: orderInclude})
            if(!order) throw httpError(404, "order not found.");

            if(order.status === "CANCELLED" || order.status === "DELIVERED"){
                throw httpError(409, `The order has been ${order.status.toLowerCase()}`)
            }
            if(status === order.status){
                return order
            }
            if(status === "CANCELLED"){
                for(const item of order.items){
                    if(item.variantId){
                        await tx.productVariant.updateMany({
                            where : {id: item.variantId},
                            data: {stock : { increment: item.quantity}}
                        })
                    }
                }
            }
            const data = { status };
            if(status === "DELIVERED" && order.paymentMethod === "COD"){
                data.paymentStatus = "PAID";
            }
            return tx.order.update({where: {id: orderId}, data, include: orderInclude});
        },
        { maxWait: 10000, timeout: 20000}
    );

}