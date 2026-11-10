"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { formatPrice, formatStatus, formatDate } from "@/lib/format";

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id;

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!userId) {
      router.replace("/login");
      return;
    }

    let cancelled = false;
    api("/api/orders")
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, userId, router]);

  if (authLoading || loading) {
    return (
      <main className="container">
        <p>Loading your orders...</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1 className="page-title">My orders</h1>

      {error && <p className="form-error">{error}</p>}

      {orders.length === 0 && !error ? (
        <div className="cart-empty">
          <p>You have not placed any orders yet.</p>
          <Link href="/products" className="btn">Browse products</Link>
        </div>
      ) : (
        <ul className="cart-lines">
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`/orders/${order.id}`} className="cart-line order-row">
                <div>
                  <p className="cart-line-name">Order #{order.id}</p>
                  <p className="cart-line-variant">
                    {formatDate(order.createdAt)} · {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <span className="status-pill">{formatStatus(order.status)}</span>
                <strong>{formatPrice(order.total)}</strong>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}