import Link from "next/link";
import { SITE } from "@/lib/site";
import NepalClock from "@/components/NepalClock";

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

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr-inner">
        <div>
          <h3>About</h3>
          {/* replace with your own words */}
          <p className="ftr-about">
            Clothing from Nepal. Simple pieces, made with care, delivered to your door.
          </p>
          <div className="ftr-social">
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg {...iconProps}>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
              </svg>
            </a>
            <a href={SITE.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg {...iconProps}>
                <path d="M14 3v10.5a3.5 3.5 0 1 1-3.5-3.5" />
                <path d="M14 3c.3 2.2 1.8 3.8 4 4" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h3>Store</h3>
          <ul>
            <li><Link href="/products">Shop all</Link></li>
            <li><Link href="/orders">My orders</Link></li>
            <li><Link href="/cart">Cart</Link></li>
          </ul>
        </div>

        <div>
          <h3>More info</h3>
          <ul>
            <li><Link href="/shipping">Shipping policy</Link></li>
            <li><Link href="/refunds">Refunds and cancellation</Link></li>
            <li><Link href="/terms">Terms and conditions</Link></li>
            <li><Link href="/privacy">Privacy policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="ftr-bottom">
        <span>© {new Date().getFullYear()} {SITE.name}. Made in Nepal.</span>
        <NepalClock />
      </div>
    </footer>
  );
}