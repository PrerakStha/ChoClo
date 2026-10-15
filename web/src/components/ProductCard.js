import Link from "next/link";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }) {
  const colors = [...new Set(product.variants.map((v) => v.color))];

  return (
    <Link href={`/products/${product.slug}`}>
      <h2>{product.name}</h2>
      <p>{product.category.name}</p>
      <p>{formatPrice(product.basePrice)}</p>
      <p>Colors: {colors.join(", ")}</p>
    </Link>
  );
}