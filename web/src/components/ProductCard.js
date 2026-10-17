import Link from "next/link";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }) {
  const colors = [...new Set(product.variants.map((v) => v.color))];

  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <div className="image-placeholder">No image</div>
      <div className="product-card-body">
        <h2>{product.name}</h2>
        <p className="category">{product.category.name}</p>
        <p className="price">{formatPrice(product.basePrice)}</p>
        <div className="chips">
          {colors.map((color) => (
            <span key={color} className="chip">{color}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}