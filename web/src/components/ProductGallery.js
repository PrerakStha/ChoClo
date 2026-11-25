"use client";

import { useState } from "react";
import Image from "next/image";
import { imageUrl } from "@/lib/image";
import ModelViewer from "@/components/ModelViewer";

export default function ProductGallery({ images = [], name, modelUrl }) {
  const hasModel = Boolean(modelUrl);
  const [index, setIndex] = useState(0);
  // a product with a model but no photos opens straight in 3D
  const [showModel, setShowModel] = useState(images.length === 0 && hasModel);

  if (images.length === 0 && !hasModel) {
    return <div className="image-placeholder">No image yet</div>;
  }

  const current = images[Math.min(index, images.length - 1)];
  const thumbCount = images.length + (hasModel ? 1 : 0);

  return (
    <div className="gallery">
      <div className="gallery-main">
        {showModel && hasModel ? (
          <ModelViewer src={modelUrl} alt={`${name} in 3D`} />
        ) : (
          current && (
            <Image
              src={imageUrl(current.url, 1000)}
              alt={current.alt || name}
              fill
              unoptimized
              loading="eager"
              className="card-img"
            />
          )
        )}
      </div>

      {thumbCount > 1 && (
        <div className="gallery-thumbs">
          {images.map((img, i) => {
            const selected = !showModel && i === index;
            return (
              <button
                key={img.id}
                type="button"
                className={selected ? "thumb selected" : "thumb"}
                onClick={() => {
                  setShowModel(false);
                  setIndex(i);
                }}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={selected}
              >
                <Image src={imageUrl(img.url, 160)} alt="" fill unoptimized className="card-img" />
              </button>
            );
          })}

          {hasModel && (
            <button
              type="button"
              className={showModel ? "thumb thumb-3d selected" : "thumb thumb-3d"}
              onClick={() => setShowModel(true)}
              aria-label="View in 3D"
              aria-current={showModel}
            >
              3D
            </button>
          )}
        </div>
      )}
    </div>
  );
}