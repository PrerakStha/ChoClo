"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext.js";
import { useCart } from "@/context/CartContext.js";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage(){
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { cart, ready, refreshCart } = useCart();
    const orderPlaced = useRef(false);

    const [ form , setForm ]= useState({
        shippingName: "",
        shippingAddress: "",
        shippingCity: "",
        shippingPhone: "",
    });

    const [fieldErrors, setFieldErrors]= useState([]);
    const [error, setError]= useState("");
    const [submitting, setSubmitting]= useState(false);

    useEffect(()=>{
        if (authLoading) return;
        if (!user){
            router.replace("/login");
            return;
        }
        if(ready && cart.items.length === 0 && !orderPlaced.current){
            router.replace("/cart");
        }
    },[authLoading, user, ready, cart.items.length, router]);

    useEffect(()=>{
        if(user?.name){
            setForm((f)=>(f.shippingName ? f: {...f, shippingName: user.name}));
        }
    }, [user]);
    
    function handleChange(e){
        setForm({...form, [e.target.name]: e.target.value});
    }

    const fieldError = (name) => fieldErrors.find((e)=>e.field === name)?.message

    async function handleSubmit(e){
        e.preventDefault();
        setError("");
        setFieldErrors([]);
        setSubmitting(true);

        try{
            const order = await api("/api/orders", { method : "POST", body: form});
            orderPlaced.current = true;
            await refreshCart();
            router.push(`/orders/${order.id}`);
        }
        catch(err){
            if(err.fieldErrors?.length > 0 ){
                setFieldErrors(err.fieldErrors)
            }
            else{
                setError(err.message);
                if (err.status === 409) refreshCart();
            }

        }
        finally{
            setSubmitting(false);
        }
    }
   console.log({authLoading, user, ready});
    if(authLoading || !user || !ready ){
     
        return (
            <main className = "container">
                <p>Loading content....</p>
            </main>
        )
    }

    if(cart.items.length === 0 && !orderPlaced.current){
        return (
            <main className = "container">
                <p>Redirecting to cart...</p>
            </main>
        )
    }

    return (
        <main className="container">
      <h1 className="page-title">Checkout</h1>

      <div className="cart-layout">
        <form onSubmit={handleSubmit} noValidate className="checkout-form">
          <h2>Shipping details</h2>

          <div className="field">
            <label htmlFor="shippingName">Full name</label>
            <input id="shippingName" name="shippingName" value={form.shippingName} onChange={handleChange} />
            {fieldError("shippingName") && <p className="field-error">{fieldError("shippingName")}</p>}
          </div>

          <div className="field">
            <label htmlFor="shippingAddress">Address</label>
            <input id="shippingAddress" name="shippingAddress" value={form.shippingAddress} onChange={handleChange} />
            {fieldError("shippingAddress") && <p className="field-error">{fieldError("shippingAddress")}</p>}
          </div>

          <div className="field">
            <label htmlFor="shippingCity">City</label>
            <input id="shippingCity" name="shippingCity" value={form.shippingCity} onChange={handleChange} />
            {fieldError("shippingCity") && <p className="field-error">{fieldError("shippingCity")}</p>}
          </div>

          <div className="field">
            <label htmlFor="shippingPhone">Mobile number</label>
            <input
              id="shippingPhone"
              name="shippingPhone"
              inputMode="numeric"
              placeholder="98XXXXXXXX"
              value={form.shippingPhone}
              onChange={handleChange}
            />
            {fieldError("shippingPhone") && <p className="field-error">{fieldError("shippingPhone")}</p>}
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </form>

        <aside className="cart-summary">
          <h2>Order summary</h2>

          <ul className="summary-lines">
            {cart.items.map((item) => (
              <li key={item.id} className="summary-line">
                <span>
                  {item.product.name} ({item.variant.color} / {item.variant.size}) × {item.quantity}
                </span>
                <span>{formatPrice(item.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <div className="summary-row summary-total">
            <span>Subtotal</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </div>
          <p className="summary-note">Payment: cash on delivery</p>
        </aside>
      </div>
    </main>
    )

} 
