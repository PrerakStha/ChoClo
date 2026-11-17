import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { imageUrl } from "@/lib/image";
import { SITE } from "@/lib/site";

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

const MARQUEE = ["Cash on delivery", "Made in Nepal", "Confirmed by phone", "New arrivals"];

const STEPS = [
  { title: "Choose your size", text: "Pick a size and color, then add it to your cart." },
  { title: "Place your order", text: "Enter your delivery details. No card needed." },
  { title: "We confirm by phone", text: "We call or text you to confirm the order and delivery." },
  { title: "Pay on delivery", text: "Pay in cash when your order reaches your door." },
];

const PROMISES = [
  { title: "Pay on delivery", text: "Cash when it reaches you." },
  { title: "We confirm first", text: "By phone or text, before we ship." },
  { title: "Shipped from Nepal", text: "Delivery across Nepal." },
];

function DropTile({ product, index, isNew }) {
  const image = product.images?.[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="drop-tile"
      data-reveal
      style={{ "--i": index }}
    >
      <div className="drop-media">
        {image && (
          <Image
            src={imageUrl(image.url, 700)}
            alt={image.alt || product.name}
            fill
            unoptimized
            className="drop-img"
          />
        )}
        {isNew && <span className="drop-badge">New</span>}
      </div>
      <p className="drop-caption">
        {product.name}
        <br />
        <span>{formatPrice(product.basePrice)}</span>
      </p>
    </Link>
  );
}

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 3);
  const soonCount = Math.max(0, 3 - featured.length);
  const heroImage = products.find((p) => p.images?.length)?.images[0];

  return (
    <main>
      {/* hero */}
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="eyebrow">Made in Nepal · Pay on delivery</span>
          <h1 className="home-hero-title">
            Everyday clothes with a <em>little</em> character.
          </h1>
          <p className="home-hero-sub">
            Simple, well-made pieces designed in Nepal and delivered to your door. Pick your
            size, we confirm by phone, and you pay when it arrives.
          </p>
          <div className="home-hero-actions">
            <Link href="/products" className="btn-solid">Shop the collection</Link>
            <Link href="/#story" className="btn-ghost">Our story</Link>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="arch">
            {heroImage ? (
              <Image
                src={imageUrl(heroImage.url, 1000)}
                alt={heroImage.alt || SITE.name}
                fill
                priority
                unoptimized
                className="arch-img"
              />
            ) : (
              <div className="arch-empty">{SITE.name}</div>
            )}
          </div>

          <div className="sticker" aria-hidden="true">
            <svg viewBox="0 0 120 120" className="sticker-svg">
              <defs>
                <path id="sticker-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
              </defs>
              <text fontSize="11" fontWeight="600" letterSpacing="2" fill="currentColor">
                <textPath href="#sticker-circle" textLength="270" lengthAdjust="spacing">
                  MADE IN NEPAL • MADE IN NEPAL •
                </textPath>
              </text>
              <text x="60" y="68" textAnchor="middle" fontSize="24" fill="currentColor">✦</text>
            </svg>
          </div>
        </div>
      </section>

      {/* marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((n) => (
            <ul key={n}>
              {[...MARQUEE, ...MARQUEE].map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* tiles */}
      <section className="home-drop">
        <div className="home-drop-head" data-reveal>
          <span>New arrivals</span>
          <Link href="/products">Shop all ({products.length})</Link>
        </div>

        <div className="home-drop-grid">
          {featured.map((product, i) => (
            <DropTile key={product.id} product={product} index={i} isNew={i === 0} />
          ))}

          {Array.from({ length: soonCount }).map((_, i) => (
            <div
              key={`soon-${i}`}
              className="drop-tile"
              data-reveal
              style={{ "--i": featured.length + i }}
            >
              <div className="drop-media drop-media--soon">
                <span className="drop-soon-title">Coming soon</span>
              </div>
            </div>
          ))}

          <div className="drop-tile" data-reveal style={{ "--i": 3 }}>
            <div className="drop-media drop-media--cta">
              <p className="drop-cta-title">More is on the way.</p>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Follow us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="how">
        <div className="how-head" data-reveal>
          <h2 className="how-title">
            How <em>ordering</em> works
          </h2>
          <Link href="/products" className="btn-outline">Start shopping</Link>
        </div>

        <div className="how-grid">
          {STEPS.map((step, i) => (
            <div key={step.title} className="how-step" data-reveal style={{ "--i": i }}>
              <span className="how-num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* story: replace this copy with your own */}
      <section id="story" className="story">
        <h2 className="story-title" data-reveal>
          Our <em>story</em>
        </h2>
        <div className="story-copy" data-reveal style={{ "--i": 1 }}>
          <p>
            {SITE.name} is a small clothing label from Nepal. We make simple pieces that are
            comfortable, well made and easy to wear every day.
          </p>
          <p>
            Tell your own story here: where the idea came from, what you make, and why it matters
            to you. Two or three short paragraphs work best.
          </p>
        </div>
      </section>

      {/* promises */}
      <section className="trust">
        {PROMISES.map((item, i) => (
          <div key={item.title} className="trust-cell" data-reveal style={{ "--i": i }}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}