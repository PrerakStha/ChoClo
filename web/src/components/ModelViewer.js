"use client";

import { useState, useEffect, useRef } from "react";

export default function ModelViewer({src, alt}){
    const viewerRef = useRef(null); 
    const [status, setStatus] = useState("loading");
    const [autoRotate, setAutoRotate] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setAutoRotate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches); 

        import("@google/model-viewer").catch(()=>{
            if(!cancelled){
                setStatus("error"); 
            }

        });

        return ()=>{
            cancelled = true;
        };
    }, []);

    useEffect(()=>{
        const el = viewerRef.current; 
        if(!el) return;

        setStatus("loading");
        const onLoad = () => setStatus("loaded"); 
        const onError = () => setStatus("error");

        el.addEventListener("load", onLoad);
        el.addEventListener("error", onError);
        return ()=>{
            el.removeEventListener("load", onLoad);
            el.removeEventListener("error", onError);
        };
    }, [src]);

    return (
        <div className="model-wrap">
      <model-viewer
        ref={viewerRef}
        src={src}
        alt={alt}
        camera-controls=""
        touch-action="pan-y"
        auto-rotate={autoRotate ? "" : undefined}
        shadow-intensity="1"
        ar=""
        ar-modes="webxr scene-viewer quick-look"
      />

      {status === "loading" && <div className="model-status">Loading 3D model...</div>}
      {status === "error" && (
        <div className="model-status">
          Sorry, the 3D model could not be loaded. The photos are still available.
        </div>
      )}
      {status === "ready" && <p className="model-hint">Drag to rotate · pinch or scroll to zoom</p>}
    </div>
  );

}