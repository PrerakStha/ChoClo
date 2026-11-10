"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { formatPrice, formatStatus, formatDate } from "@/lib/format";

export default function OrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id;

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    let cancelled = false;
    api(`/api/orders/${id}`)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch((error) => {
        if (!cancelled) setError(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authLoading, user, id, router]);

   if (authLoading || loading) {
    return (
      <main className="container">
        <p>Loading order...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="container">
        <h1 className="page-title">Order not found</h1>
        <p className="page-subtitle">{error || "We could not find that order."}</p>
        <div>
          <Link href="/orders" className="btn">View my orders</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <h1 className="page-title">Thank you, {order.shippingName}!</h1>
      <p className="page-subtitle">
        Order #{order.id} · {formatDate(order.createdAt)} · {formatStatus(order.status)}
      </p>

      <div className="cart-layout">
        <ul className="cart-lines">
          {order.items.map((item) => (
            <li key={item.id} className="cart-line order-line">
              <div className="cart-line-info">
                <p className="cart-line-name">{item.productName}</p>
                <p className="cart-line-variant">
                  {item.color} / {item.size}
                </p>
                <p className="cart-line-price">
                  {formatPrice(item.unitPrice)} × {item.quantity}
                </p>
              </div>
              <strong>{formatPrice(item.unitPrice * item.quantity)}</strong>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <h2>Delivery</h2>
          <p>{order.shippingName}</p>
          <p>{order.shippingAddress}</p>
          <p>{order.shippingCity}</p>
          <p>{order.shippingPhone}</p>

          <div className="summary-row summary-total order-total">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <p className="summary-note">Payment: cash on delivery</p>
        </aside>
      </div>
    </main>
  );
}
