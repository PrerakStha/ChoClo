"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

const MAX_QUANTITY = 10;

export default function CartPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cart, loading: cartLoading, updateQuantity, removeItem } = useCart();

  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  async function run(itemId, action) {
    setBusyId(itemId);
    setError("");
    try {
      await action();
    } catch (err) {
      setError(err.fieldErrors?.[0]?.message || err.message);
    } finally {
      setBusyId(null);
    }
  }

  // 1. Loading State
  if (authLoading || !user || (cartLoading && (!cart?.items || cart.items.length === 0))) {
    return <main className="container">Loading....</main>;
  }

  // 2. Empty Cart State
  if (!cart?.items || cart.items.length === 0) {
    return (
      <main className="container">
        <h1 className="page-title">Your Cart</h1>
        <div>
          <p>Your cart is empty...</p>
          <Link href="/products" className="btn">
            Browse products
          </Link>
        </div>
      </main>
    );
  }

  // 3. Populated Cart State
  return (
    <main className="container">
      <h1 className="page-title">Your Cart</h1>
      <p className="page-subtitle">
        {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}
      </p>
      {error && <p className="form-error">{error}</p>}

      <div className="cart-layout">
        <ul className="cart-lines">
          {cart.items.map((item) => {
            const busy = busyId === item.id;
            const maxForItem = Math.min(item.variant?.stock ?? MAX_QUANTITY, MAX_QUANTITY);

            return (
              <li key={item.id} className="cart-line">
                <div className="cart-line-info">
                  <Link
                    href={`/products/${item.product?.slug}`}
                    className="cart-line-name"
                  >
                    {item.product?.name}
                  </Link>
                  <p className="cart-line-variant">
                    {item.variant?.color} / {item.variant?.size}
                  </p>
                  <p className="cart-line-price">
                    {formatPrice(item.product?.basePrice)} each
                  </p>
                </div>

                <div className="stepper">
                  <button
                    type="button"
                    disabled={busy || item.quantity <= 1}
                    onClick={() => {
                      run(item.id, () =>
                        updateQuantity(item.id, item.quantity - 1)
                      );
                    }}
                    aria-label="Decrease Quantity"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    disabled={busy || item.quantity >= maxForItem}
                    onClick={() => {
                      run(item.id, () =>
                        updateQuantity(item.id, item.quantity + 1)
                      );
                    }}
                    aria-label="Increase Quantity"
                  >
                    +
                  </button>
                </div>

                <div className="cart-line-total">
                  <strong>{formatPrice(item.lineTotal)}</strong>
                  <button
                    type="button"
                    className="link-btn"
                    disabled={busy}
                    onClick={() => {
                      run(item.id, () => removeItem(item.id));
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="cart-summary">
          <h2>Summary</h2>
          <div className="summary-row">
            <span>Items</span>
            <span>{cart.itemCount}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Subtotal</span>
            <span>{formatPrice(cart.subTotal)}</span>
          </div>
          <button type="button" className="btn">
            Checkout
          </button>
        </aside>
      </div>
    </main>
  );
}