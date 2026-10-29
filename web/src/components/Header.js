"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const {user,loading,logout}=useAuth();
  const router = useRouter();
  const cart = useCart();


  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="logo">ChoClo.</Link>
        <nav className="nav">
          <Link href="/products">Shop</Link>
          {!loading && (user ? (
            <>
              <span className="nav-user">Hi, {user.name}</span>
              <Link href="/cart">Cart{cart.itemCount>0 && <span className="cart-badge">{cart.itemCount}</span>}</Link>
              <button className="nav-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          ))}
        </nav>
      </div>
    </header>
  );
}