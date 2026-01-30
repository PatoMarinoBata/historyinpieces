"use client";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetch("/api/pieces")
      .then((r) => r.json())
      .then((data) => {
        setPieces(data || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (pieces.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pieces.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [pieces.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + pieces.length) % pieces.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pieces.length);
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
        <div className="text-center pt-12 pb-8">
          <h1 className="text-5xl font-bold text-slate-100 mb-2 drop-shadow-lg">
            History in Pieces
          </h1>
          <p className="text-lg text-slate-400">Explore the world's most storied collectibles</p>
        </div>

      {/* Carousel Container - Instagram Stories Style */}
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="h-96 flex items-center justify-center text-slate-400">
            <p>Loading featured pieces...</p>
          </div>
        ) : (
          <>
            {/* Carousel Images - 3 Items Layout */}
            <div className="relative h-[440px] flex items-center justify-center gap-4 mb-6 overflow-hidden">
              {/* Previous Item (Left, smaller) */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-28 opacity-55 scale-75 transition-all duration-300 z-0">
                <div className="w-full h-full bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                  {prev?.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={prev.images[0]}
                      alt={prev.title}
                      className="w-full h-full object-contain bg-slate-900"
                    />
                  )}
                </div>
              </div>

              {/* Current Item (Center, large) */}
              <div className="relative z-10 w-80 transition-all duration-300">
                <div className="w-full bg-slate-800 rounded-xl overflow-hidden border-2 border-amber-600 shadow-2xl">
                  <div className="relative bg-slate-900 flex items-center justify-center p-4">
                    {current?.images?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={current.images[0]}
                        alt={current.title}
                        className="w-auto h-auto max-w-full max-h-80 object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* Progress indicator below image */}
                <div className="mt-4 flex gap-1 justify-center">
                  {pieces.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 transition-all ${
                        idx === currentIndex
                          ? "w-8 bg-amber-500"
                          : "w-2 bg-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Next Item (Right, smaller) */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-28 opacity-55 scale-75 transition-all duration-300 z-0">
                <div className="w-full h-full bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                  {next?.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={next.images[0]}
                      alt={next.title}
                      className="w-full h-full object-contain bg-slate-900"
                    />
                  )}
                </div>
              </div>

              {/* Navigation Arrows */}
              {pieces.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-full w-12 h-12 flex items-center justify-center transition z-20 text-xl font-bold"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-full w-12 h-12 flex items-center justify-center transition z-20 text-xl font-bold"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Info Section */}
            <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-8 shadow-lg">
              <div className="mb-3">
                <span className="inline-block bg-slate-700 text-amber-200 px-3 py-1 rounded-full text-sm font-semibold">
                  {current?.category || "OTHER"}
                </span>
              </div>

              <h2 className="text-4xl font-bold mb-4 text-slate-100">
                {current?.title}
              </h2>

              <p className="text-slate-300 mb-6 text-lg leading-relaxed max-h-24 overflow-y-auto">
                {current?.description}
              </p>

              {current?.lastSoldPrice && (
                <div className="mb-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <p className="text-slate-400 text-sm">Last Sale Price</p>
                  <p className="text-2xl font-bold text-amber-300">
                    ${current.lastSoldPrice.toLocaleString()}
                  </p>
                </div>
              )}

              <p className="text-slate-400 text-sm mb-6 max-h-20 overflow-y-auto leading-relaxed">
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
      </div>
    </div>
  );
}