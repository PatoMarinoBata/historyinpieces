"use client";
import { useCallback, useEffect, useState } from "react";
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

export default function MuseumPage() {
  const [paintings, setPaintings] = useState<Piece[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  useEffect(() => {
    fetch("/api/pieces")
      .then((r) => r.json())
      .then((data) => {
        const filtered = (data || []).filter((p: Piece) => p.category === "PAINTING");
        setPaintings(filtered);
      });
  }, []);

  const navigate = useCallback((dir: "forward" | "backward") => {
    if (isTransitioning || paintings.length === 0) return;
    
    setDirection(dir);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => {
        if (dir === "forward") {
          return (prev + 1) % paintings.length;
        } else {
          return (prev - 1 + paintings.length) % paintings.length;
        }
      });
      setIsTransitioning(false);
    }, 800);
  }, [isTransitioning, paintings.length]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigate("forward");
      if (e.key === "ArrowLeft") navigate("backward");
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [navigate]);

  const current = paintings[currentIndex];
  const next = paintings[(currentIndex + 1) % paintings.length];
  const prev = paintings[(currentIndex - 1 + paintings.length) % paintings.length];

  if (paintings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <TopNav />
        <div className="flex items-center justify-center h-screen text-slate-400">
          Loading museum...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <TopNav />
      
      {/* Museum Title */}
      <div className="text-center pt-20 pb-8">
        <h1 className="text-5xl font-bold text-amber-400 mb-2">The Museum</h1>
        <p className="text-slate-400 italic">Walk through the gallery of masterpieces</p>
      </div>

      {/* Museum Gallery Container */}
      <div className="relative h-[600px] perspective-[2000px]">
        {/* Museum Floor */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent opacity-50"></div>

        {/* Gallery Wall */}
        <div className="relative h-full flex items-center justify-center">
          {/* Walking Animation Container */}
          <div className={`relative w-full h-full transition-all duration-800 ease-in-out ${
            isTransitioning 
              ? direction === "forward" 
                ? "museum-walk-forward" 
                : "museum-walk-backward"
              : ""
          }`}>
            
            {/* Previous Painting (Left wall, distant) */}
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-800 ${
              isTransitioning && direction === "backward" ? "museum-approach-left" : "museum-distant-left"
            }`}>
              {prev?.images?.[0] && (
                <div className="museum-frame-small">
                  <img
                    src={prev.images[0]}
                    alt={prev.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Current Painting (Center, prominent) */}
            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-800 ${
              isTransitioning 
                ? direction === "forward"
                  ? "museum-recede"
                  : "museum-recede-backward"
                : "museum-center"
            }`}>
              {current?.images?.[0] && (
                <div className="museum-frame">
                  <img
                    src={current.images[0]}
                    alt={current.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute -bottom-20 left-0 right-0 text-center">
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">{current.title}</h2>
                    <p className="text-sm text-slate-400 max-w-md mx-auto">{current.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Next Painting (Right wall, distant) */}
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-800 ${
              isTransitioning && direction === "forward" ? "museum-approach-right" : "museum-distant-right"
            }`}>
              {next?.images?.[0] && (
                <div className="museum-frame-small">
                  <img
                    src={next.images[0]}
                    alt={next.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <button
          onClick={() => navigate("backward")}
          disabled={isTransitioning}
          className="absolute left-8 top-1/2 -translate-y-1/2 text-6xl text-slate-300 hover:text-amber-400 transition disabled:opacity-30 disabled:cursor-not-allowed z-50"
          aria-label="Previous painting"
        >
          ←
        </button>
        <button
          onClick={() => navigate("forward")}
          disabled={isTransitioning}
          className="absolute right-8 top-1/2 -translate-y-1/2 text-6xl text-slate-300 hover:text-amber-400 transition disabled:opacity-30 disabled:cursor-not-allowed z-50"
          aria-label="Next painting"
        >
          →
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center mt-12 pb-8">
        <p className="text-slate-500 text-sm">
          Use arrow keys or click the arrows to walk through the gallery
        </p>
        <p className="text-slate-600 text-xs mt-2">
          {currentIndex + 1} of {paintings.length}
        </p>
      </div>

      <style jsx>{`
        .perspective-\[2000px\] {
          perspective: 2000px;
        }

        /* Museum Frames */
        .museum-frame {
          width: 500px;
          height: 400px;
          padding: 20px;
          background: linear-gradient(145deg, #2a2520, #1a1510);
          box-shadow: 
            inset 0 2px 4px rgba(255, 255, 255, 0.1),
            0 20px 60px rgba(0, 0, 0, 0.7),
            0 0 100px rgba(251, 191, 36, 0.1);
          border: 3px solid #4a3f2f;
          position: relative;
        }

        .museum-frame-small {
          width: 200px;
          height: 160px;
          padding: 10px;
          background: linear-gradient(145deg, #2a2520, #1a1510);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          border: 2px solid #4a3f2f;
          opacity: 0.4;
        }

        /* Center position */
        .museum-center {
          transform: translate(-50%, -50%) scale(1) translateZ(0);
          opacity: 1;
          z-index: 10;
        }

        /* Distant side positions */
        .museum-distant-left {
          transform: translateY(-50%) scale(0.4) translateZ(-500px) rotateY(25deg);
          opacity: 0.3;
          z-index: 1;
        }

        .museum-distant-right {
          transform: translateY(-50%) scale(0.4) translateZ(-500px) rotateY(-25deg);
          opacity: 0.3;
          z-index: 1;
        }

        /* Approaching from sides */
        .museum-approach-right {
          transform: translateY(-50%) translate(-50%, 0) scale(1) translateZ(0) rotateY(0deg);
          opacity: 1;
          z-index: 10;
        }

        .museum-approach-left {
          transform: translateY(-50%) translate(50%, 0) scale(1) translateZ(0) rotateY(0deg);
          opacity: 1;
          z-index: 10;
        }

        /* Receding to sides */
        .museum-recede {
          transform: translate(-150%, -50%) scale(0.4) translateZ(-500px) rotateY(25deg);
          opacity: 0.3;
          z-index: 1;
        }

        .museum-recede-backward {
          transform: translate(50%, -50%) scale(0.4) translateZ(-500px) rotateY(-25deg);
          opacity: 0.3;
          z-index: 1;
        }

        /* Walking animations */
        @keyframes walkForward {
          0% { transform: translateZ(0); }
          100% { transform: translateZ(-200px); }
        }

        @keyframes walkBackward {
          0% { transform: translateZ(0); }
          100% { transform: translateZ(-200px); }
        }

        .museum-walk-forward {
          animation: walkForward 0.8s ease-in-out;
        }

        .museum-walk-backward {
          animation: walkBackward 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
}
