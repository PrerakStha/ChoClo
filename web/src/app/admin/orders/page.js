"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatDate, formatPrice, formatStatus } from "@/lib/format";

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    api("/api/admin/orders")
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function changeStatus(order, status){
    if(status === order.status) return;
    if(status === "CANCELLED" && !window.confirm("Cancel this order? The stock will be returned to the shop!")){
        return;
  }

  setBusyId(order.id);
  setError("");

  try{
    const updated = await api(`/api/admin/orders/${order.id}/status`, {method: "PATCH", body: {status}})
    setOrders((list) => list.map((item) => item.id === updated.id ? updated : item));
  }
  catch(err){
    setError(err.fieldErrors?.[0]?.message || err.message)
  }
  finally{
    setBusyId(null)
  }
}

if(loading){
    return <p>Loading your orders...</p>;
}

return(  <section>
      <h1 className="page-title">Orders</h1>

      {error && <p className="form-error">{error}</p>}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="cart-lines">
          {orders.map((order) => {
            const locked = order.status === "CANCELLED" || order.status === "DELIVERED";

            return (
              <li key={order.id} className="admin-order">
                <div className="admin-order-head">
                  <div>
                    <strong>Order #{order.id}</strong>
                    <p className="cart-line-variant">
                      {formatDate(order.createdAt)} · {order.user.name} ({order.user.email})
                    </p>
                  </div>
                  <select
                    value={order.status}
                    disabled={locked || busyId === order.id}
                    onChange={(e) => changeStatus(order, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatStatus(s)}</option>
                    ))}
                  </select>
                </div>

                <p className="cart-line-variant">
                  {order.shippingName}, {order.shippingAddress}, {order.shippingCity} · {order.shippingPhone}
                </p>

                <ul className="admin-order-items">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.productName} ({item.color} / {item.size}) × {item.quantity}
                      <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                    </li>
                  ))}
                </ul>

                <p className="admin-order-total">
                  Total: <strong>{formatPrice(order.total)}</strong> · Cash on delivery ·{" "}
                  {order.paymentStatus.toLowerCase()}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
    )
}
