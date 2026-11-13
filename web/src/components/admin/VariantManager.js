"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function VariantManager({ product, onChange }) {
  const [stocks, setStocks] = useState({});
  const [newVariant, setNewVariant] = useState({
    size: "",
    color: "",
    stock: "0",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(action) {
    setBusy(true);
    setError("");
    try {
      const updated = await action();
      onChange(updated);
    } catch (err) {
      setError(err.fieldErrors?.[0]?.message || err.message);
    } finally {
      setBusy(false);
    }
  }
  function saveStock(variant) {
    const value = stocks[variant.id];
    if (value === undefined) return;
    run(async () => {
      const updated = await api(`/api/admin/variants/${variant.id}`, {
        method: "PATCH",
        body: { stock: Number(value) },
      });
      setStocks((s) => {
        const copy = { ...s };
        delete copy[variant.id];
        return copy;
      });
      return updated;
    });
  }
  function removeVariant(variant) {
    if (!window.confirm(`Remove ${variant.color} / ${variant.size}?`)) return;
    run(() => api(`/api/admin/variants/${variant.id}`, { method: "DELETE" }));
  }

  function addVariant(e) {
    e.preventDefault();
    run(async () => {
      const updated = await api(`/api/admin/products/${product.id}/variants`, {
        method: "POST",
        body: {
          size: newVariant.size,
          color: newVariant.color,
          stock: Number(newVariant.stock),
        },
      });
      setNewVariant({ size: "", color: "", stock: "0" });
      return updated;
    });
  }

  return (
    <div className="checkout-form variant-manager">
      <h2>Sizes, colors and stock</h2>

      {error && <p className="form-error">{error}</p>}

      <ul className="cart-lines">
        {product.variants.map((v) => {
          const value = stocks[v.id] ?? String(v.stock);
          const changed = stocks[v.id] !== undefined;

          return (
            <li key={v.id} className="variant-row">
              <span>
                {v.color} / {v.size}
              </span>
              <input
                type="number"
                min="0"
                value={value}
                onChange={(e) =>
                  setStocks({ ...stocks, [v.id]: e.target.value })
                }
              />
              <button
                type="button"
                className="btn-small"
                disabled={busy || !changed}
                onClick={() => saveStock(v)}
              >
                Save
              </button>
              <button
                type="button"
                className="link-btn"
                disabled={busy}
                onClick={() => removeVariant(v)}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>

      <form onSubmit={addVariant} noValidate>
        <h3>Add a size/color</h3>
        <div className="variant-row">
          <input
            placeholder="Size"
            value={newVariant.size}
            onChange={(e) =>
              setNewVariant({ ...newVariant, size: e.target.value })
            }
          />
          <input
            placeholder="Color"
            value={newVariant.color}
            onChange={(e) =>
              setNewVariant({ ...newVariant, color: e.target.value })
            }
          />
          <input
            type="number"
            min="0"
            placeholder="Stock"
            value={newVariant.stock}
            onChange={(e) =>
              setNewVariant({ ...newVariant, stock: e.target.value })
            }
          />
          <button type="submit" className="btn-small" disabled={busy}>
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
