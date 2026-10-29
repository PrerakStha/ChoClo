"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function AddToCart({ variants }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

  const [selectedId, setSelectedId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selected = variants.find((v) => v.id === selectedId);

  function handleSelected(id) {
    setSelectedId(id);
    setMessage("");
    setError("");
  }

  async function handleAdd() {
    setMessage("");
    setError("");

    if (!user) {
      router.push("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(selected.id, 1);
      setMessage("added to cart.");
    } catch (error) {
      setError(error.fieldErrors?.[0]?.message || error.message);
    } finally {
      setAdding(false);
    }
  }

  let buttonLabel = "Add to cart";
  if (!selected) buttonLabel = "Select an option";
  else if (adding) buttonLabel = "Adding...";

  return (
    <div>
      <h2>Choose an option</h2>

      <div className="options">
        {variants.map((variant) => {
          const soldOut = variant.stock < 1;
          const isSelected = variant.id === selectedId;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={soldOut}
              onClick={() => handleSelected(variant.id)}
              className={isSelected ? "option selected" : "option"}
            >
              {variant.color} / {variant.size}
              {soldOut && <span className="option-stock">Sold Out!</span>}
            </button>
          );
        })}
      </div>
      {selected && (
        <p className="option-stock">
          {selected.stock <= 5
            ? `Only ${selected.stock} left`
            : `${selected.stock} in stock`}
        </p>
      )}

      <button
        type="button"
        className="btn"
        onClick={handleAdd}
        disabled={!selected || adding || authLoading}
      >
        {buttonLabel}
      </button>

      {message && <p className="cart-message">{message}</p>}
      {error && <p className="cart-error">{error}</p>}
    </div>
  );
}
