import prisma from "../config/db.js";

export function getAllProducts() {
    return prisma.product.findMany({
        include : {category : true, variants: true, images: { orderBy: { position: "asc" }, take: 2 }},
        orderBy: {createdAt: "desc"}
    });
}

export function getProductBySlug(slug) {
return prisma.product.findUnique({
    where: {slug}, 
    include: {category:true, variants: true, images: { orderBy: { position: "asc" }}},
});
}