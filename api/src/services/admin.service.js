import prisma from "../config/db.js";
import { httpError } from "../utils/httpError.js";
import cloudinary from "../config/cloudinary.js";

const MAX_IMAGES_PER_PRODUCT = 10;

const productInclude = {
  category: true,
  variants: { orderBy: { id: "asc" } },
  images: { orderBy: { position: "asc" } },
};
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

  await Promise.allSettled(
    product.images.map((img) => cloudinary.uploader.destroy(img.publicId)),
  );
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

export async function listCategories() {
  const category = await prisma.category.findMany({ orderBy: { name: "asc" } });
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

export async function listAllOrders() {
  const order = await prisma.order.findMany({
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
  return order;
}

export async function updateOrderStatus(orderId, status) {
  return prisma.$transaction(
    async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: orderInclude,
      });
      if (!order) throw httpError(404, "order not found.");

      if (order.status === "CANCELLED" || order.status === "DELIVERED") {
        throw httpError(
          409,
          `The order has been ${order.status.toLowerCase()}`,
        );
      }
      if (status === order.status) {
        return order;
      }
      if (status === "CANCELLED") {
        for (const item of order.items) {
          if (item.variantId) {
            await tx.productVariant.updateMany({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
      }
      const data = { status };
      if (status === "DELIVERED" && order.paymentMethod === "COD") {
        data.paymentStatus = "PAID";
      }
      return tx.order.update({
        where: { id: orderId },
        data,
        include: orderInclude,
      });
    },
    { maxWait: 10000, timeout: 20000 },
  );
}

// images

function uploadBuffer(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });
}

export async function addProductImages(productId, files) {
  const product = await getProductById(productId);

  if (!files || files.length === 0) {
    throw httpError(400, "Choose atleast one image!");
  }
  if (product.images.length + files.length > MAX_IMAGES_PER_PRODUCT) {
    throw httpError(
      409,
      `A product can have at most ${MAX_IMAGES_PER_PRODUCT} images (it has ${product.images.length})`,
    );
  }
  const uploaded = [];
  try {
    for (const file of files) {
      const result = await uploadBuffer(file.buffer, "choclo/products");
      uploaded.push({ url: result.secure_url, publicId: result.public_id });
    }

    const start = product.images.length
      ? Math.max(...product.images.map((img) => img.position)) + 1
      : 0;

    await prisma.productImage.createMany({
      data: uploaded.map((img, i) => ({
        productId,
        url: img.url,
        publicId: img.publicId,
        position: start + i,
        alt: product.name,
      })),
    });
  } catch (err) {
    await Promise.allSettled(
      uploaded.map((img) => cloudinary.uploader.destroy(img.publicId)),
    );
    throw err;
  }

  return getProductById(productId);
}

export async function deleteImage(imageId) {
  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
  });
  if (!image) {
    throw httpError(404, "Image not found!");
  }

  await prisma.productImage.delete({ where: { id: imageId } });

  try {
    await cloudinary.uploader.destroy(image.publicId);
  } catch (err) {
    console.error("Could not delete the file from Cloudinary:", err);
  }

  const rest = await prisma.productImage.findMany({
    where: { productId: image.productId },
    orderBy: { position: "asc" },
  });

  await prisma.$transaction(
    rest.map((img, index) =>
      prisma.productImage.update({
        where: { id: img.id },
        data: { position: index },
      }),
    ),
  );

  return getProductById(image.productId);
}

export async function reorderImages(productId, imageIds) {
  await getProductById(productId);

  const images = await prisma.productImage.findMany({
    where: { id: productId  },
  });
  const current = images.map((img) => img.id).sort((a, b) => a - b);
  const given = [...imageIds].sort((a, b) => a - b);

  const sameSet =
    current.length === given.length &&
    current.every((id, i) => id === given[i]);
  if (!sameSet) {
    throw httpError(
      400,
      "The list must contain every image of this product exactly once",
    );
  }

  await prisma.$transaction(
    imageIds.map((id, index) =>
      prisma.productImage.update({ where: { id }, data: { position: index } }),
    ),
  );

  return getProductById(productId);
}
