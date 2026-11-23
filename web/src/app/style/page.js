"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

const SAMPLES = [
  "I have a warm skin tone and brown eyes, and I like relaxed everyday clothes in earthy colors.",
  "Cool undertone, dark hair. I like clean, simple outfits and don't like anything too bright.",
];

const MAX_PHOTO = 3 * 1024 * 1024;

export default function StylePage() {
  const { user, loading: authLoading } = useAuth();
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handlePhoto(e) {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_PHOTO) {
      setError("Your photo must be 3 MB or smaller");
      e.target.value = "";
      setPhoto(null);
      return;
    }
    setError("");
    setPhoto(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!description.trim() && !photo) {
      setError("Describe yourself or add a photo");
      return;
    }
    if (photo && !consent) {
      setError("Please confirm you are happy for us to analyse your photo");
      return;
    }

    const formData = new FormData();
    if (description.trim()) formData.append("description", description.trim());
    if (photo) {
      formData.append("photo", photo);
      formData.append("consent", "true");
    }

    setLoading(true);
    try {
      setResult(await api("/api/recommend/style", { method: "POST", body: formData }));
    } catch (err) {
      setError(err.fieldErrors?.[0]?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <main className="container">
        <p>Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container">
        <h1 className="page-title">Style assistant</h1>
        <div className="cart-empty">
          <p>Log in to get color suggestions that suit you.</p>
          <Link href="/login" className="btn">Log in</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <h1 className="page-title">Style assistant</h1>
      <p className="page-subtitle">Colors picked for you from what is in stock</p>

      <form onSubmit={handleSubmit} noValidate className="checkout-form style-form">
        <div className="field">
          <label htmlFor="description">Tell us about yourself</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={600}
            placeholder="Skin tone, hair and eye color, colors you like or avoid..."
          />
          <div className="sample-row">
            {SAMPLES.map((text, i) => (
              <button key={i} type="button" className="btn-small" onClick={() => setDescription(text)}>
                Try sample {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="photo">Photo (optional)</label>
          <input id="photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} />
          <p className="summary-note">
            Use natural light. Your photo is sent to an AI service to read your coloring, is not saved by us, and the
            service provider may handle it under its own terms. Only upload a photo you are comfortable sharing.
          </p>
        </div>

        {photo && (
          <label className="consent">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            I am happy for my photo to be analysed
          </label>
        )}

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Thinking..." : "Suggest colors"}
        </button>
      </form>

      {result && (
        <section className="style-results" aria-live="polite">
          {result.summary && <p className="policy-intro">{result.summary}</p>}

          {result.colors.length > 0 ? (
            <ul className="style-colors">
              {result.colors.map((c) => (
                <li key={c.name}>
                  <strong>{c.name}</strong>
                  {c.reason && <span>{c.reason}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p>We could not match any of our colors this time. Try adding a little more detail.</p>
          )}

          {result.avoid.length > 0 && (
            <p className="summary-note">Less flattering: {result.avoid.join(", ")}</p>
          )}

          {result.products.length > 0 && (
            <>
              <h2 className="style-heading">Picked for you</h2>
              <div className="product-grid">
                {result.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}