"use client";

import { createContext, useEffect, useState, useContext } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext(null);

const Empty_Cart = { items: [], itemCount: 0, subTotal: 0 };

export function CartProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;

  const [cart, setCart] = useState(Empty_Cart);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setCart(Empty_Cart);
      return;
    }
    let cancelled = false;
    setLoading(true);

    api("/api/cart")
      .then((data) => {
        if (!cancelled) setCart(data);
      })
      .catch(() => {
        if (!cancelled) setCart(Empty_Cart);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function addToCart(variantId,quantity=1){
    const updated = await api("/api/cart/items",{
        method:"POST",
        body: {variantId, quantity},
    });
    setCart(updated)
  }

  async function updateQuantity(itemId, quantity){
    const updated = await api(`/api/cart/items/${itemId}`,{
        method: "PATCH",
        body: {quantity},
    })
    setCart(updated)
  }

  async function removeItem(itemId){
    const updated = await api(`/api/cart/items/${itemId}`,{
        method: "DELETE",
    })
    setCart(updated);
  }

  return(
    <CartContext.Provider value = {{cart,loading, addToCart,updateQuantity,removeItem }}>
        {children}
    </CartContext.Provider>
  )
}

export function useCart() {
    const ctx = useContext(CartContext);
    if(!ctx){
        throw new Error("use cart must be used inside <CartProvider>")
    }
    return ctx;
}