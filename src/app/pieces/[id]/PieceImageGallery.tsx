"use client";

import { useEffect, useMemo, useState } from "react";

type PieceImageGalleryProps = {
  images: string[];
  title: string;
};

export default function PieceImageGallery({ images, title }: PieceImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");

  const hasImages = images && images.length > 0;
  const hasMany = images && images.length > 1;
  const safeImages = useMemo(() => images ?? [], [images]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key === "ArrowLeft") handlePrev();
      if (event.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const handlePrev = () => {
    setDirection("rtl");
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    setAnimationKey((prev) => prev + 1);
  };

  const handleNext = () => {
    setDirection("ltr");
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
    setAnimationKey((prev) => prev + 1);
  };

  const handleOpen = () => {
    if (!hasMany) return;
    setCurrentIndex(0);
    setDirection("ltr");
    setAnimationKey((prev) => prev + 1);
    setIsOpen(true);
  };

  if (!hasImages) {
    return <div className="rounded bg-slate-800 p-6 text-slate-300">No images</div>;
  }

  return (
    <>
      <div className="mb-6">
        {safeImages.length === 1 ? (
          <div className="flex justify-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={safeImages[0]}
              alt={`${title} image 1`}
              className="h-64 w-auto rounded object-cover"
            />
          </div>
        ) : (
          <div className="flex gap-4">
            {/* Main Image - Left */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={safeImages[0]}
              alt={`${title} main image`}
              onClick={handleOpen}
              className="h-64 w-auto flex-shrink-0 cursor-pointer rounded object-cover ring-1 ring-slate-700 transition hover:ring-amber-500"
            />
            
            {/* Secondary Images - Right (thumbnails) */}
            <div className="flex flex-col gap-2">
              {safeImages.slice(1).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i + 1}
                  src={src}
                  alt={`${title} image ${i + 2}`}
                  onClick={handleOpen}
                  className="h-20 w-20 cursor-pointer rounded object-cover ring-1 ring-slate-700 transition hover:ring-amber-500"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-3xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 text-slate-200 hover:text-white"
              aria-label="Close gallery"
            >
              ✕
            </button>

            <div className="relative overflow-hidden rounded-xl bg-slate-900 p-4 shadow-2xl">
              <div className="relative flex items-center justify-center">
                <div
                  key={`${safeImages[currentIndex]}-${animationKey}`}
                  className={`slide-cycle ${direction}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={safeImages[currentIndex]}
                    alt={`${title} image ${currentIndex + 1}`}
                    className="max-h-[60vh] w-auto max-w-full object-contain"
                  />
                </div>
              </div>

              {safeImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-700/80 px-3 py-2 text-xl text-slate-100 hover:bg-slate-600"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-700/80 px-3 py-2 text-xl text-slate-100 hover:bg-slate-600"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>
          <style jsx>{`
            .slide-cycle.ltr {
              animation: slideInLtr 0.5s ease-in-out both;
            }
            .slide-cycle.rtl {
              animation: slideInRtl 0.5s ease-in-out both;
            }
            @keyframes slideInLtr {
              0% { opacity: 0; transform: translateX(-48px); }
              100% { opacity: 1; transform: translateX(0); }
            }
            @keyframes slideInRtl {
              0% { opacity: 0; transform: translateX(48px); }
              100% { opacity: 1; transform: translateX(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
