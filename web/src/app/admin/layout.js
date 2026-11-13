"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext.js";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathName = usePathname();
  const {user, loading} = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (!isAdmin) router.replace("/");
  }, [loading, user, isAdmin, router]);

  if (loading) {
    return (
      <main className="container">
        <p>Checking access...</p>
      </main>
    );
  }

  

  return(
    <div className="container">
      <nav className="admin-nav">
        <Link href="/admin/products" className={pathName.startsWith("/admin/products") ? "active" : ""}>
          Products
        </Link>
        <Link href="/admin/orders" className={pathName.startsWith("/admin/orders") ? "active" : ""}>
          Orders
        </Link>
      </nav>
      {children}
    </div>
  );
}
