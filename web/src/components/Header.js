import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="logo">🍫 ChoClo</Link>
        <nav className="nav">
          <Link href="/products">Shop</Link>
        </nav>
      </div>
      <div className="drip" aria-hidden="true" />
    </header>
  );
}