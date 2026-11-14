"use client";

import { useState } from "react";
import Image from "next/image";
import { imageUrl } from "@/lib/image";

export default function ProductGallery({ images, name }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="image-placeholder">No images found...</div>;
  }
  const current = images[Math.min(index, images.length - 1)];

  return (
    <div className="gallery">
      <div className="gallery-main">
        <Image
          src={imageUrl(current.url, 1000)}
          alt={current.alt || name}
          fill
          unoptimized
          loading="eager"
          className="card-img"
        />
      </div>

      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              className={i === index ? "thumb selected" : "thumb"}
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === index}
            >
              <Image
                src={imageUrl(img.url, 160)}
                alt=""
                fill
                unoptimized
                className="card-img"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
