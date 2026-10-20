"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const {user,loading,logout}=useAuth();
  const router = useRouter();


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