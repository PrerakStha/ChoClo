"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { SITE } from "@/lib/site";

const iconProps = {
  viewBox: "0 0 24 24",
  width: 22,
  height: 22,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

function UserIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg {...iconProps}>
      <path d="M5 8h14l-1 13H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <svg {...iconProps}>
      <path d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { cart } = useCart();

  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }

    let ticking = false;

    function update() {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const solid = !isHome || scrolled || menuOpen;
  const isAdmin = user?.role === "admin";

  return (
    <>
      <header className={solid ? "hdr hdr-solid" : "hdr"}>
        <div className="hdr-inner">
          <div className="hdr-left">
            <Link href="/" className="hdr-logo">{SITE.name}</Link>
            <nav className="hdr-nav" aria-label="Main">
              <Link href="/products">Shop</Link>
              <Link href="/#story">Story</Link>
            </nav>
          </div>

          <div className="hdr-right">
            {!loading && isAdmin && (
              <Link href="/admin/products" className="hdr-text-link">Admin</Link>
            )}
            {!loading && (user ? (
              <button type="button" className="hdr-text-btn" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link href="/login" className="hdr-text-link">Login</Link>
            ))}

            <Link
              href={user ? "/orders" : "/login"}
              className="hdr-icon"
              aria-label={user ? "My orders" : "Log in"}
            >
              <UserIcon />
            </Link>

            <Link href="/cart" className="hdr-icon" aria-label="Cart">
              <BagIcon />
              {cart.itemCount > 0 && <span className="hdr-badge">{cart.itemCount}</span>}
            </Link>

            <button
              type="button"
              className="hdr-menu-btn"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="hdr-mobile" aria-label="Mobile">
            <Link href="/products">Shop</Link>
            <Link href="/#story">Story</Link>
            {user && <Link href="/orders">My orders</Link>}
            {isAdmin && <Link href="/admin/products">Admin</Link>}
            {user ? (
              <button type="button" onClick={handleLogout}>Logout</button>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </nav>
        )}
      </header>

      {/* inner pages need space under the fixed header; the home hero starts at the very top */}
      {!isHome && <div className="hdr-spacer" />}
    </>
  );
}