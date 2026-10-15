import { formatPrice } from "../../lib/format.js";
import ProductCard from "../../components/ProductCard.js";


export default async function ProductsPage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }
    const products = await res.json();

    return (
        <main className="container">
            <h1 className="page-title">All Products</h1>
            <p className="page-subtitle">{products.length} items</p>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="product-grid">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </main>
    );
}
