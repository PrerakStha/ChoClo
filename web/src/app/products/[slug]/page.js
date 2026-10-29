import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import AddToCart from "@/components/AddToCart"

export default async function ProductDetailPage({params}){
const { slug } = await params;


const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`,
    { cache: "no-store"}
);

if (res.status===404){
    notFound();
}

if (!res.ok){
throw new Error("Failed to fetch product");
}

const product = await res.json();

return (
  <main className="container">
    <div className="detail">
      <div className="image-placeholder">No image yet</div>

      <div>
        <p className="category">{product.category.name}</p>
        <h1>{product.name}</h1>
        <p className="price">{formatPrice(product.basePrice)}</p>
        <p className="description">{product.description}</p>

        <AddToCart variants={product.variants} />

      </div>
    </div>
  </main>
);

}