import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";

export const metadata = { title: "Shop | ChoClo" };


const KEYS = ["search", "category", "minPrice", "maxPrice", "sort", "inStock", "page"];
const API = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

async function getJson(path) {
  if (!API) {
    throw new Error("Missing API_URL / NEXT_PUBLIC_API_URL environment variable");
  }

  const url = `${API}${path}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`API error ${res.status} for ${url}:`, body);
    throw new Error(`Failed to load ${path} (${res.status})`);
  }

  return res.json();
}

function pageHref(params, page) {
  const qs = new URLSearchParams(params);
  if (page > 1) qs.set("page", String(page));
  else qs.delete("page");
  const text = qs.toString();
  return text ? `/products?${text}` : "/products";
}

export default async function ProductsPage({ searchParams }) {
  const raw = await searchParams;

  const params = {};
  for (const key of KEYS) {
    const value = raw[key];
    if (typeof value === "string" && value.trim()) params[key] = value.trim();
  }

  const qs = new URLSearchParams(params).toString();
  const [data, categories] = await Promise.all([
    getJson(`/api/products${qs ? `?${qs}` : ""}`),
    getJson("/api/products/categories"),
  ]);

  const { products, total, page, totalPages } = data;
  const filtered = Object.keys(params).some((key) => key !== "page");

  return (
    <main className="container">
      <h1 className="page-title">Shop</h1>
      <p className="page-subtitle">
        {total} {total === 1 ? "product" : "products"}
      </p>

      <ProductFilters params={params} categories={categories} />

      {products.length === 0 ? (
        <div className="cart-empty">
          <p>{filtered ? "No products match your filters." : "No products yet."}</p>
          {filtered && (
            <Link href="/products" className="btn">Clear filters</Link>
          )}
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Pages">
          {page > 1 ? (
            <Link href={pageHref(params, page - 1)}>← Previous</Link>
          ) : (
            <span className="disabled">← Previous</span>
          )}
          <span>Page {page} of {totalPages}</span>
          {page < totalPages ? (
            <Link href={pageHref(params, page + 1)}>Next →</Link>
          ) : (
            <span className="disabled">Next →</span>
          )}
        </nav>
      )}
    </main>
  );
}