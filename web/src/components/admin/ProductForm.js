"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api.js";

const EMPTY_VARIANT = { size: "", color: "", stock: "0" };

export default function ProductForm({ product, onSaved }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product ? String(product.basePrice / 100) : "",
    categoryId: product ? String(product.categoryId) : "",
  });

  const [variants, setVariants] = useState([{ ...EMPTY_VARIANT }]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api("/api/admin/categories")
      .then(setCategories)
      .catch((err) => {
        setError(err.message);
      });
  },[]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  }

  function updateVariantRow(index, key, value) {
    setVariants((list) =>
      list.map((v, i) => (i === index ? { ...v, [key]: value } : v)),
    );
  }

  function addVariantRow() {
    setVariants((list) => 
      [...list, { ...EMPTY_VARIANT }],
    );
  }

  function removeVariantRow(index) {
    setVariants((list) =>
      list.length > 1 ? list.filter((_, i) => i !== index) : list,
    );
  }

  async function addCategory() {
    const name = newCategory.trim();
    if (!name) return;
    try {
      const created = await api("/api/admin/categories", {
        method: "POST",
        body: { name },
      });
      setCategories((list) =>
        [...list, created].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setForm((f) => ({ ...f, categoryId: String(created.id) }));
      setNewCategory("");
    } catch (err) {
      setError(err.fieldErrors?.[0]?.message || err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setFieldErrors([]);
    setSaving(true);

    const body = {
      name: form.name,
      description: form.description,
      basePrice: Math.round(Number(form.price) * 100),
      categoryId: Number(form.categoryId),
    };

    if (!isEdit) {
      body.variants = variants.map((v) => ({
        size: v.size,
        color: v.color,
        stock: Number(v.stock),
      }));
    }
    try {
      if (isEdit) {
        const saved = await api(`/api/admin/products/${product.id}`, {
          method: "PUT",
          body,
        });
        setMessage("Saved");
        onSaved?.(saved);
      } else {
        await api("/api/admin/products", { method: "POST", body });
        router.push("/admin/products");
      }
    } catch (err) {
      if (err.fieldErrors?.length > 0) setFieldErrors(err.fieldErrors);
      else setError(err.message);
    } finally {
      setSaving(false);
    }
  }
  const errorFor = (name) => fieldErrors.find((e) => e.field === name)?.message;
  const variantErrors = fieldErrors.filter((e) => e.field.startsWith("variants"));
  return (
    <form onSubmit={handleSubmit} noValidate className="checkout-form">
      <h2>{isEdit ? "Product details" : "New product"}</h2>

      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        {errorFor("name") && <p className="field-error">{errorFor("name")}</p>}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        {errorFor("description") && (
          <p className="field-error">{errorFor("description")}</p>
        )}
      </div>

      <div className="field">
        <label htmlFor="price">Price (NPR)</label>
        <input
          id="price"
          name="price"
          inputMode="decimal"
          placeholder="1299"
          value={form.price}
          onChange={handleChange}
        />
        {errorFor("basePrice") && (
          <p className="field-error">{errorFor("basePrice")}</p>
        )}
      </div>

      <div className="field">
        <label htmlFor="categoryId">Category</label>
        <select
          id="categoryId"
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
        >
          <option value="">Choose a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errorFor("categoryId") && (
          <p className="field-error">{errorFor("categoryId")}</p>
        )}

        <div className="inline-add">
          <input
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button type="button" className="btn-small" onClick={addCategory}>
            Add category
          </button>
        </div>
      </div>

      {!isEdit && (
        <div className="field">
          <label>Sizes and colors</label>
          <div className="variant-rows">
            {variants.map((v, i) => (
              <div key={i} className="variant-row">
                <input
                  placeholder="Size (M)"
                  value={v.size}
                  onChange={(e) => updateVariantRow(i, "size", e.target.value)}
                />
                <input
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) => updateVariantRow(i, "color", e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => updateVariantRow(i, "stock", e.target.value)}
                />
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => removeVariantRow(i)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="btn-small" onClick={addVariantRow}>
            Add another size/color
          </button>
          {variantErrors.map((e, i) => (
            <p key={i} className="field-error">
              {e.message}
            </p>
          ))}
        </div>
      )}

      {error && <p className="form-error">{error}</p>}
      {message && <p className="cart-message">{message}</p>}

      <button type="submit" className="btn" disabled={saving}>
        {saving ? "Saving..." : isEdit ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
