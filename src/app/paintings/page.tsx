"use client";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import TopNav from "../components/TopNav";

type Piece = {
  id: string;
  title: string;
  description: string | null;
  history: string | null;
  images: string[];
  category: string;
  lastSoldPrice?: number;
};

export default function PaintingsPage() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"ltr" | "rtl">("ltr");
  const [slideMode, setSlideMode] = useState<"auto" | "manual">("auto");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const hasSwiped = useRef(false);

  useEffect(() => {
    fetch("/api/pieces")
      .then((r) => r.json())
      .then((data) => {
        const filtered = (data || []).filter((p: Piece) => p.category === "PAINTING");
        setPieces(filtered);
        setLoading(false);
      });
  }, []);

  const advance = useCallback(
    (direction: 1 | -1, animation: "ltr" | "rtl", mode: "auto" | "manual") => {
      if (pieces.length === 0) return;
      setPreviousIndex(currentIndex);
      setSlideDirection(animation);
      setSlideMode(mode);
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + direction + pieces.length) % pieces.length);
      setAnimationKey((prev) => prev + 1);
      setTimeout(() => setIsTransitioning(false), mode === "manual" ? 600 : 8000);
    },
    [pieces.length, currentIndex]
  );

  useEffect(() => {
    if (pieces.length === 0) return;
    const timeout = setTimeout(() => {
      advance(1, "ltr", "auto");
    }, 8000);
    return () => clearTimeout(timeout);
  }, [currentIndex, pieces.length, advance]);

  const handlePrev = useCallback(() => advance(-1, "rtl", "manual"), [advance]);
  const handleNext = useCallback(() => advance(1, "ltr", "manual"), [advance]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).tagName === "BUTTON") return;
    isDragging.current = true;
    dragStartX.current = event.clientX;
    hasSwiped.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || dragStartX.current === null || hasSwiped.current) return;
    const diff = event.clientX - dragStartX.current;
    if (Math.abs(diff) > 40) {
      hasSwiped.current = true;
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const deltaX = dragStartX.current ? event.clientX - dragStartX.current : 0;
    // If not a swipe (small movement), treat as click
    if (Math.abs(deltaX) < 5) {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const halfWidth = rect.width / 2;
      if (clickX < halfWidth) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    isDragging.current = false;
    dragStartX.current = null;
    hasSwiped.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const getPieceAtIndex = (index: number) => {
    if (pieces.length === 0) return null;
    return pieces[(index % pieces.length + pieces.length) % pieces.length];
  };
  const current = getPieceAtIndex(currentIndex);
  const prev = getPieceAtIndex(currentIndex - 1);
  const next = getPieceAtIndex(currentIndex + 1);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <TopNav />
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
      <div className="relative z-10 pt-16">
        {/* Header */}
        <div className="text-center pt-6 pb-3">
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-100 mb-1 drop-shadow-lg font-serif tracking-wide">
            Paintings
          </h1>
          <p className="text-sm md:text-base text-slate-400 italic">Masterpieces from art history</p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto px-4 py-4">
          {loading || pieces.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-slate-400">
              <p>{loading ? "Loading paintings..." : "No paintings found."}</p>
            </div>
          ) : (
            <>
              {/* Carousel Images - 3 Items Layout */}
              <div
                className="relative h-[320px] flex items-center justify-center gap-2 mb-3 overflow-hidden touch-pan-y"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                {/* Previous Item (Left, smaller) */}
                <div className="absolute left-[35%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-36 h-32 opacity-60 scale-90 transition-all duration-500 ease-in-out z-0">
                  {prev?.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={prev.images[0]}
                      alt={prev.title}
                      className="w-full h-full object-contain transition-opacity duration-500 drop-shadow-2xl"
                    />
                  )}
                </div>

                {/* Current Item (Center, large) */}
                <div className="relative z-10 w-72">
                  {/* Exit animation layer - outgoing item */}
                  {isTransitioning && slideMode === "manual" && (
                    <div
                      key={`exit-${previousIndex}`}
                      className={`absolute inset-0 slide-exit ${slideDirection}`}
                    >
                      <div className="w-full h-64 flex items-center justify-center p-4">
                        {getPieceAtIndex(previousIndex)?.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={getPieceAtIndex(previousIndex).images[0]}
                            alt={getPieceAtIndex(previousIndex).title}
                            className="w-auto h-auto max-w-full max-h-64 object-contain drop-shadow-2xl"
                          />
                        )}
                      </div>
                    </div>
                  )}
                  {/* Enter animation layer - incoming item */}
                  <div
                    key={`${current?.id ?? currentIndex}-${animationKey}`}
                    className={`slide-cycle ${slideDirection} ${slideMode}`}
                  >
                    <div className="w-full h-64 flex items-center justify-center p-4">
                      {current?.images?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={current.images[0]}
                          alt={current.title}
                          className="w-auto h-auto max-w-full max-h-64 object-contain drop-shadow-2xl"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Next Item (Right, smaller) */}
                <div className="absolute right-[35%] top-1/2 -translate-y-1/2 translate-x-1/2 w-36 h-32 opacity-60 scale-90 transition-all duration-500 ease-in-out z-0">
                  {next?.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={next.images[0]}
                      alt={next.title}
                      className="w-full h-full object-contain transition-opacity duration-500 drop-shadow-2xl"
                    />
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="relative max-w-xl mx-auto">
                {/* Exit animation layer for description */}
                {isTransitioning && slideMode === "manual" && (
                  <div
                    key={`desc-exit-${previousIndex}`}
                    className={`absolute inset-0 desc-exit ${slideDirection}`}
                  >
                    <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-4 shadow-lg">
                      <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-100">
                        {getPieceAtIndex(previousIndex)?.title}
                      </h2>
                      <p className="text-slate-300 mb-4 text-sm md:text-base leading-relaxed max-h-20 overflow-y-auto">
                        {getPieceAtIndex(previousIndex)?.description}
                      </p>
                      <p className="text-slate-400 text-xs md:text-sm mb-4 max-h-16 overflow-y-auto leading-relaxed">
                        <strong className="text-slate-300">History:</strong> {getPieceAtIndex(previousIndex)?.history}
                      </p>
                    </div>
                  </div>
                )}
                {/* Enter animation layer for description */}
                <div
                  key={`desc-${current?.id ?? currentIndex}-${animationKey}`}
                  className={`desc-transition ${slideDirection} ${slideMode}`}
                >
                  <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-4 shadow-lg">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-100">
                      {current?.title}
                    </h2>
                    <p className="text-slate-300 mb-4 text-sm md:text-base leading-relaxed max-h-20 overflow-y-auto">
                      {current?.description}
                    </p>
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
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="text-center py-12">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="inline-block bg-slate-700 hover:bg-slate-600 text-slate-100 px-6 py-2 rounded-lg font-semibold transition border border-slate-600">
              Home
            </Link>
            <Link href="/cars" className="inline-block bg-slate-700 hover:bg-slate-600 text-slate-100 px-6 py-2 rounded-lg font-semibold transition border border-slate-600">
              Cars
            </Link>
            <Link href="/statues" className="inline-block bg-slate-700 hover:bg-slate-600 text-slate-100 px-6 py-2 rounded-lg font-semibold transition border border-slate-600">
              Statues
            </Link>
            <Link href="/collectibles" className="inline-block bg-slate-700 hover:bg-slate-600 text-slate-100 px-6 py-2 rounded-lg font-semibold transition border border-slate-600">
              Collectibles
            </Link>
            <Link href="/documents" className="inline-block bg-slate-700 hover:bg-slate-600 text-slate-100 px-6 py-2 rounded-lg font-semibold transition border border-slate-600">
              Documents
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
          .slide-exit.ltr {
            animation: slideExitLtr 0.6s ease-in-out both;
          }
          .slide-exit.rtl {
            animation: slideExitRtl 0.6s ease-in-out both;
          }
          .desc-transition.ltr.manual {
            animation: descInLtr 0.6s ease-in-out both;
          }
          .desc-transition.rtl.manual {
            animation: descInRtl 0.6s ease-in-out both;
          }
          .desc-exit.ltr {
            animation: descExitLtr 0.6s ease-in-out both;
          }
          .desc-exit.rtl {
            animation: descExitRtl 0.6s ease-in-out both;
          }
          @keyframes slideInLtr {
            0% { opacity: 0; transform: translateX(-48px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInRtl {
            0% { opacity: 0; transform: translateX(48px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideExitLtr {
            0% { opacity: 1; transform: translateX(0); }
            100% { opacity: 0; transform: translateX(48px); }
          }
          @keyframes slideExitRtl {
            0% { opacity: 1; transform: translateX(0); }
            100% { opacity: 0; transform: translateX(-48px); }
          }
          @keyframes descInLtr {
            0% { opacity: 0; filter: blur(8px); transform: translateX(-24px); }
            100% { opacity: 1; filter: blur(0px); transform: translateX(0); }
          }
          @keyframes descInRtl {
            0% { opacity: 0; filter: blur(8px); transform: translateX(24px); }
            100% { opacity: 1; filter: blur(0px); transform: translateX(0); }
          }
          @keyframes descExitLtr {
            0% { opacity: 1; filter: blur(0px); transform: translateX(0); }
            100% { opacity: 0; filter: blur(8px); transform: translateX(24px); }
          }
          @keyframes descExitRtl {
            0% { opacity: 1; filter: blur(0px); transform: translateX(0); }
            100% { opacity: 0; filter: blur(8px); transform: translateX(-24px); }
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
