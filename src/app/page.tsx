"use client";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";

type Piece = {
  id: string;
  title: string;
  description: string | null;
  history: string | null;
  images: string[];
  category: string;
  lastSoldPrice?: number;
};

export default function Home() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"ltr" | "rtl">("ltr");
  const [slideMode, setSlideMode] = useState<"auto" | "manual">("auto");
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const hasSwiped = useRef(false);

  useEffect(() => {
    fetch("/api/pieces")
      .then((r) => r.json())
      .then((data) => {
        setPieces(data || []);
        setLoading(false);
      });
  }, []);

  const advance = useCallback(
    (direction: 1 | -1, animation: "ltr" | "rtl", mode: "auto" | "manual") => {
      if (pieces.length === 0) return;
      setSlideDirection(animation);
      setSlideMode(mode);
      setCurrentIndex((prev) => (prev + direction + pieces.length) % pieces.length);
      setAnimationKey((prev) => prev + 1);
    },
    [pieces.length]
  );

  useEffect(() => {
    if (pieces.length === 0) return;
    const timeout = setTimeout(() => {
      advance(1, "ltr", "auto");
    }, 8000);
    return () => clearTimeout(timeout);
  }, [pieces.length, currentIndex, advance]);

  const handlePrev = () => {
    advance(-1, "rtl", "manual");
  };

  const handleNext = () => {
    advance(1, "ltr", "manual");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (pieces.length <= 1) return;
    // Ignore if clicking on a button
    if ((event.target as HTMLElement).tagName === 'BUTTON') return;
    isDragging.current = true;
    hasSwiped.current = false;
    dragStartX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || dragStartX.current === null || hasSwiped.current) return;
    const deltaX = event.clientX - dragStartX.current;
    const threshold = 40;
    if (Math.abs(deltaX) >= threshold) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      hasSwiped.current = true;
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    dragStartX.current = null;
    hasSwiped.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    dragStartX.current = null;
    hasSwiped.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const getPieceAtIndex = (index: number) => pieces[index % pieces.length];
  const current = getPieceAtIndex(currentIndex);
  const prev = getPieceAtIndex(currentIndex - 1);
  const next = getPieceAtIndex(currentIndex + 1);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 opacity-40"
      >
        <source src="/images/grok-video-6df44c25-8f8e-40e8-98c2-e25e588563a0.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div className="fixed inset-0 bg-black/50 z-0"></div>

      {/* Content layer */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center pt-6 pb-3">
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-100 mb-1 drop-shadow-lg font-serif tracking-wide">
            History in Pieces
          </h1>
          <p className="text-sm md:text-base text-slate-400 italic">Explore the world's most storied collectibles</p>
        </div>

      {/* Carousel Container - Instagram Stories Style */}
      <div className="relative max-w-6xl mx-auto px-4 py-4">
        {loading ? (
          <div className="h-80 flex items-center justify-center text-slate-400">
            <p>Loading featured pieces...</p>
          </div>
        ) : (
          <>
            {/* Carousel Images - 3 Items Layout */}
            <div
              className="relative h-[320px] flex items-center justify-center gap-2 mb-3 overflow-hidden touch-pan-y"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              onPointerCancel={handlePointerLeave}
            >
              {/* Previous Item (Left, smaller) */}
              <div className="absolute left-[35%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-36 h-32 opacity-60 scale-90 transition-all duration-500 ease-in-out z-0">
                <div className="w-full h-full bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                  {prev?.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={prev.images[0]}
                      alt={prev.title}
                      className="w-full h-full object-contain bg-slate-900 transition-opacity duration-500"
                    />
                  )}
                </div>
              </div>

              {/* Current Item (Center, large) */}
              <div key={`${current?.id ?? currentIndex}-${animationKey}`} className={`relative z-10 w-72 slide-cycle ${slideDirection} ${slideMode}`}>
                <div className="w-full bg-slate-800 rounded-xl overflow-hidden shadow-2xl">
                  <div className="relative bg-slate-900 flex items-center justify-center p-4">
                    {current?.images?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={current.images[0]}
                        alt={current.title}
                        className="w-auto h-auto max-w-full max-h-64 object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Next Item (Right, smaller) */}
              <div className="absolute right-[35%] top-1/2 -translate-y-1/2 translate-x-1/2 w-36 h-32 opacity-60 scale-90 transition-all duration-500 ease-in-out z-0">
                <div className="w-full h-full bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                  {next?.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={next.images[0]}
                      alt={next.title}
                      className="w-full h-full object-contain bg-slate-900 transition-opacity duration-500"
                    />
                  )}
                </div>
              </div>

              {/* Navigation Arrows */}
              {pieces.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-100 hover:text-amber-400 transition z-30 text-5xl font-light"
                    aria-label="Previous"
                  >
                    ←
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-100 hover:text-amber-400 transition z-30 text-5xl font-light"
                    aria-label="Next"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {/* Info Section */}
            <div className="max-w-xl mx-auto bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-4 shadow-lg transition-all duration-500">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-100">
                {current?.title}
              </h2>

              <p className="text-slate-300 mb-4 text-sm md:text-base leading-relaxed max-h-20 overflow-y-auto">
                {current?.description}
              </p>

              {current?.lastSoldPrice && (
                <div className="mb-4 p-3 bg-slate-700 rounded-lg border border-slate-600">
                  <p className="text-slate-400 text-xs">Last Sale Price</p>
                  <p className="text-xl font-bold text-amber-300">
                    ${current.lastSoldPrice.toLocaleString()}
                  </p>
                </div>
              )}

              <p className="text-slate-400 text-xs md:text-sm mb-4 max-h-16 overflow-y-auto leading-relaxed">
                <strong className="text-slate-300">History:</strong> {current?.history}
              </p>

              <Link
                href={`/pieces/${current?.id}`}
                className="inline-block bg-amber-600 hover:bg-amber-500 text-slate-900 px-6 py-3 rounded-lg font-semibold transition"
              >
                View Full Details
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="text-center py-12">
        <div className="flex items-center justify-center gap-6">
          <Link
            href="/pieces"
            className="inline-block bg-slate-700 hover:bg-slate-600 text-slate-100 px-8 py-3 rounded-lg font-semibold transition border border-slate-600"
          >
            Browse Full Collection
          </Link>
          <Link
            href="/admin"
            className="inline-block bg-blue-700 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition border border-blue-600"
          >
            Admin Panel
          </Link>
        </div>
      </div>
      <style jsx>{`
        .slide-cycle.ltr.manual {
          animation: slideInLtr 0.6s ease-in-out both;
        }
        .slide-cycle.rtl.manual {
          animation: slideInRtl 0.6s ease-in-out both;
        }
        .slide-cycle.ltr.auto {
          animation: slideCycleLtr 8s ease-in-out both;
        }
        @keyframes slideInLtr {
          0% { opacity: 0; transform: translateX(-48px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRtl {
          0% { opacity: 0; transform: translateX(48px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideCycleLtr {
          0% { opacity: 0; transform: translateX(-48px); }
          18% { opacity: 1; transform: translateX(0); }
          72% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(48px); }
        }
      `}</style>
      </div>
    </div>
  );
}