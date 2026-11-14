import Link from "next/link";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import { imageUrl } from "@/lib/image";

export default function ProductCard({ product }) {
  const colors = [...new Set(product.variants.map((v) => v.color))];
  const [ main, hover ] = product.images ?? [];

  return (
    <Link href={`/products/${product.slug}`} className="product-card">
         {main ? (
        <div className="card-image">
          <Image
            src={imageUrl(main.url, 600)}
            alt={main.alt || product.name}
            fill
            unoptimized
            className="card-img"
          />
          {hover && (
            <Image
              src={imageUrl(hover.url, 600)}
              alt=""
              aria-hidden="true"
              fill
              unoptimized
              className="card-img card-img-hover"
            />
          )}
        </div>
      ) : (
        <div className="image-placeholder">No image yet</div>
      )}

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