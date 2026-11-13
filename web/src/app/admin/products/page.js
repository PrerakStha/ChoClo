"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/products")
      .then(setProducts)
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(product){
    const ok = window.confirm(
        `Delete ${product.name}? It will be remove from all carts.`
    );
    if(!ok) return;

    setError("");
    try{
        await api(`/api/admin/products/${product.id}`,{ method:"DELETE" });
        setProducts((list) => list.filter((p) => p.id !== product.id));
    }
    catch(err){
        setError(err.message);
    }
  }
  if(loading) return <p>Loading products....</p>;
  return(
    <section>
      <div className="admin-head">
        <h1 className="page-title">Products</h1>
        <Link href="/admin/products/new" className="btn">Add product</Link>
      </div>

      {error && <p className="form-error">{error}</p>}

      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Variants</th>
                <th>Total stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/products/${p.slug}`}>{p.name}</Link>
                  </td>
                  <td>{p.category.name}</td>
                  <td>{formatPrice(p.basePrice)}</td>
                  <td>{p.variants.length}</td>
                  <td>{p.variants.reduce((sum, v) => sum + v.stock, 0)}</td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/products/${p.id}`}>Edit</Link>
                      <button type="button" className="link-btn" onClick={() => handleDelete(p)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
