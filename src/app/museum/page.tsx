"use client";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/pieces")
      .then((r) => r.json())
      .then((data) => {
        const filtered = (data || []).filter((p: Piece) => p.category === "PAINTING");
        setPaintings(filtered);
      });
  }, []);

  const navigate = useCallback((dir: "forward" | "backward") => {
    if (isWalking || paintings.length === 0) return;
    
    setDirection(dir);
    setIsWalking(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => {
        if (dir === "forward") {
          return (prev + 1) % paintings.length;
        } else {
          return (prev - 1 + paintings.length) % paintings.length;
        }
      });
      setIsWalking(false);
    }, 1200);
  }, [isWalking, paintings.length]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigate("forward");
      if (e.key === "ArrowLeft") navigate("backward");
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [navigate]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const halfWidth = rect.width / 2;
    
    if (clickX < halfWidth) {
      navigate("backward");
    } else {
      navigate("forward");
    }
  }, [navigate]);

  const current = paintings[currentIndex];
  const getPaintingAtIndex = (index: number) => {
    if (paintings.length === 0) return null;
    return paintings[(index % paintings.length + paintings.length) % paintings.length];
  };

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
    <div className="min-h-screen overflow-hidden cursor-pointer relative" ref={containerRef} onClick={handleClick}
      style={{
        background: 'linear-gradient(to bottom, #2d1810 0%, #4a2d1f 50%, #2d1810 100%)'
      }}>
      {/* Museum Wall Texture */}
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.1) 2px, rgba(0,0,0,.1) 3px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 3px)
          `
        }}></div>

      {/* Crown Molding - Top */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-amber-900/40 to-transparent border-b border-amber-700/30 z-10"></div>
      
      {/* Baseboard - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-amber-950/60 to-transparent border-t border-amber-800/40 z-10"></div>

      <TopNav />
      
      {/* Museum Title */}
      <div className="text-center pt-20 pb-6 relative z-20">
        <h1 className="text-5xl font-bold text-amber-200 mb-2 drop-shadow-lg">The Museum</h1>
        <p className="text-amber-100/70 italic">Click left or right to walk through the gallery</p>
      </div>

      {/* Museum Hallway Container */}
      <div className="relative h-[600px] overflow-hidden">
        {/* Animated Background - Museum Elements */}
        <div className={`absolute inset-0 transition-transform duration-1200 ease-in-out ${
          isWalking 
            ? direction === "forward" 
              ? "museum-hallway-forward" 
              : "museum-hallway-backward"
            : ""
        }`}>
          {/* Marble Floor */}
          <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-stone-300/20 via-stone-200/10 to-transparent">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, 
                  transparent, transparent 100px, 
                  rgba(255, 255, 255, 0.08) 100px, 
                  rgba(255, 255, 255, 0.08) 101px,
                  transparent 101px, transparent 200px
                ),
                repeating-linear-gradient(0deg,
                  transparent, transparent 150px,
                  rgba(255, 255, 255, 0.05) 150px,
                  rgba(255, 255, 255, 0.05) 151px,
                  transparent 151px, transparent 300px
                )
              `,
              transform: isWalking ? (direction === "forward" ? 'translateX(-100px)' : 'translateX(100px)') : 'translateX(0)',
              transition: 'transform 1.2s ease-in-out'
            }}></div>
          </div>

          {/* Ambient Museum Lighting from ceiling */}
          <div className="absolute top-0 left-1/4 right-1/4 h-32 bg-amber-200/5 blur-3xl"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-48 bg-amber-100/10 blur-2xl rounded-full"></div>

          {/* Side Wall Shadows */}
          <div className="absolute left-0 top-0 bottom-0 w-1/5 bg-gradient-to-r from-black/40 to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1/5 bg-gradient-to-l from-black/40 to-transparent"></div>
        </div>

        {/* Paintings on the walls */}
        <div className="relative h-full flex items-center justify-center">
          {/* Show current painting (left) and next ones (to the right) */}
          {[0, 1, 2, 3, 4].map((offset) => {
            const painting = getPaintingAtIndex(currentIndex + offset);
            if (!painting?.images?.[0]) return null;

            const isMain = offset === 0;
            const distance = offset;

            return (
              <div
                key={`${painting.id}-${offset}`}
                className={`absolute transition-all duration-1200 ease-in-out`}
                style={{
                  left: isMain ? '15%' : `${15 + offset * 18}%`,
                  transform: isMain 
                    ? 'translateY(-50%) scale(1)' 
                    : `translateY(-50%) scale(${1 - offset * 0.15}) perspective(1000px) rotateY(-${offset * 8}deg)`,
                  top: '50%',
                  opacity: isMain ? 1 : Math.max(0.4, 1 - offset * 0.15),
                  zIndex: 20 - offset,
                  filter: isMain ? 'none' : `blur(${offset * 0.5}px)`,
                }}
              >
                <div className="museum-frame" style={{
                  width: isMain ? '500px' : `${500 - offset * 60}px`,
                  height: isMain ? '400px' : `${400 - offset * 48}px`,
                }}>
                  <img
                    src={painting.images[0]}
                    alt={painting.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23334155" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2394a3b8" font-size="16"%3EImage not available%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Painting Info */}
        {current && (
          <div className="absolute bottom-8 left-[15%] text-left max-w-md px-4 z-30">
            <h2 className="text-3xl font-bold text-slate-100 mb-2">{current.title}</h2>
            <p className="text-slate-400 text-sm">{current.description}</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center mt-8 pb-8">
        <p className="text-slate-500 text-sm">
          Click left or right side to walk through the gallery • Use arrow keys
        </p>
        <p className="text-slate-600 text-xs mt-2">
          {currentIndex + 1} of {paintings.length}
        </p>
      </div>

      <style jsx>{`
        .museum-frame {
          padding: 20px;
          background: linear-gradient(145deg, #2a2520, #1a1510);
          box-shadow: 
            inset 0 2px 4px rgba(255, 255, 255, 0.1),
            0 20px 60px rgba(0, 0, 0, 0.7),
            0 0 100px rgba(251, 191, 36, 0.1);
          border: 3px solid #4a3f2f;
          position: relative;
          transition: all 1.2s ease-in-out;
        }

        @keyframes hallwayForward {
          0% { transform: translateZ(0); }
          100% { transform: translateZ(-100px); }
        }

        @keyframes hallwayBackward {
          0% { transform: translateZ(0); }
          100% { transform: translateZ(100px); }
        }

        .museum-hallway-forward {
          animation: hallwayForward 1.2s ease-in-out;
        }

        .museum-hallway-backward {
          animation: hallwayBackward 1.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
