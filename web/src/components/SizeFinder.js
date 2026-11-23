"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function SizeFinder({ productId }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ chest: "", waist: "", fit: "regular" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!form.chest) {
      setError("Enter your chest measurement in cm");
      return;
    }

    setLoading(true);
    try {
      const data = await api("/api/recommend/size", {
        method: "POST",
        body: {
          productId,
          chest: Number(form.chest),
          waist: form.waist ? Number(form.waist) : undefined,
          fit: form.fit,
        },
      });
      setResult(data);
    } catch (err) {
      setError(err.fieldErrors?.[0]?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="size-finder">
      <button type="button" className="link-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {open ? "Hide size finder" : "Not sure about your size?"}
      </button>

      {open && (
        <form onSubmit={handleSubmit} noValidate className="size-form">
          <p className="summary-note">
            Measure around the fullest part of your chest (and waist, if you like) in centimetres.
          </p>

          <div className="size-fields">
            <label>
              Chest (cm)
              <input name="chest" type="number" inputMode="decimal" value={form.chest} onChange={handleChange} />
            </label>
            <label>
              Waist (cm, optional)
              <input name="waist" type="number" inputMode="decimal" value={form.waist} onChange={handleChange} />
            </label>
            <label>
              Fit
              <select name="fit" value={form.fit} onChange={handleChange}>
                <option value="fitted">Fitted</option>
                <option value="regular">Regular</option>
                <option value="loose">Loose</option>
              </select>
            </label>
          </div>

          <button type="submit" className="btn-small" disabled={loading}>
            {loading ? "Checking..." : "Find my size"}
          </button>

          {error && <p className="cart-error">{error}</p>}

          {result && (
            <div className="size-result" aria-live="polite">
              {result.size ? (
                <p>
                  We suggest size <strong>{result.size}</strong>{" "}
                  <span className="chip">{result.confidence} confidence</span>
                </p>
              ) : (
                <p>Every size is sold out right now.</p>
              )}
              {result.notes.map((note, i) => (
                <p key={i} className="summary-note">{note}</p>
              ))}
              {result.alternatives.length > 0 && (
                <p className="summary-note">Other options: {result.alternatives.join(", ")}</p>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}