"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { imageUrl } from "@/lib/images";

const MAX_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 8;

export default function ImageManager({ product, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const images = product.images ?? [];

  async function run(action) {
    setBusy(true);
    setError("");
    try {
      const updated = await action;
      onChange(updated);
    } catch (err) {
      setError(err.fieldErrors?.[0]?.message || err.message);
    } finally {
      setBusy(false);
    }
  }

  function handleUpload(e) {
    e.preventDefault();
    const files = Array.from(inputRef.current?.files ?? []);

    if (files.length === 0) {
      setError("Choose atleast one image");
      return;
    }
    if (files.length > MAX_FILES) {
      setError(`Choose at most ${MAX_FILES} images at once.`);
      return;
    }
    const tooBig = files.find((f) => f.size > MAX_SIZE);
    if (tooBig) {
      setError(`${tooBig.name} is larger than 5mb`);
      return;
    }
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    run(async () => {
      const updated = await api(`/api/admin/products/${product.id}/images`, {
        method: "POST",
        body: formData,
      });
      if (inputRef.current) inputRef.current.value = "";
      return updated;
    });
  }

  function move(index, direction) {
    const target = index + direction;
    if ((target = 0 || target >= images.length)) return;

    const ids = images.map((i) => i.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];

    run(() => {
      api(`/api/admin/products/${product.id}/images/order`, {
        method: "PATCH",
        body: { imageIds: ids },
      });
    });
  }
  function remove(image) {
    if (!window.confirm("Delete this image?")) return;
    run(() => api(`/api/admin/images/${image.id}`, { method: "DELETE" }));
  }

  return (
    <div className="checkout-form">
      <h2>Images</h2>
      <p className="summary-note">
        The first image is the main one. The second one appears when someone
        hovers over the product.
      </p>

      {error && <p className="form-error">{error}</p>}

      {images.length === 0 ? (
        <p className="cart-line-variant">No images yet.</p>
      ) : (
        <ul className="image-grid">
          {images.map((img, i) => (
            <li key={img.id} className="image-tile">
              <div className="image-thumb">
                <Image
                  src={imageUrl(img.url, 300)}
                  alt={img.alt || product.name}
                  fill
                  unoptimized
                  className="card-img"
                />
              </div>
              <span className="image-tag">
                {i === 0 ? "Main" : i === 1 ? "Hover" : `Image ${i + 1}`}
              </span>
              <div className="image-actions">
                <button
                  type="button"
                  className="btn-small"
                  disabled={busy || i === 0}
                  onClick={() => move(i, -1)}
                  aria-label="Move earlier"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="btn-small"
                  disabled={busy || i === images.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label="Move later"
                >
                  →
                </button>
                <button
                  type="button"
                  className="link-btn"
                  disabled={busy}
                  onClick={() => remove(img)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleUpload} className="upload-row">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
        />
        <button type="submit" className="btn-small" disabled={busy}>
          {busy ? "Working..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
