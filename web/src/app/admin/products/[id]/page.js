"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import ProductForm from "@/components/admin/ProductForm";
import VariantManager from "@/components/admin/VariantManager";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api(`/api/admin/products/${id}`)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading product...</p>;

  if (error || !product) {
    return (
      <section>
        <p className="form-error">{error || "Product not found"}</p>
        <Link href="/admin/products">Back to products</Link>
      </section>
    );
  }

  return (
    <section>
      <h1 className="page-title">Edit: {product.name}</h1>
      <div className="admin-stack">
        <ProductForm product={product} onSaved={setProduct} />
        <VariantManager product={product} onChange={setProduct} />
      </div>
    </section>
  );
}