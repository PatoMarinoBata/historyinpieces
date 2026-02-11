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

  const getPaintingAtIndex = (index: number) => {
    if (paintings.length === 0) return null;
    return paintings[(index % paintings.length + paintings.length) % paintings.length];
  };
  
  const current = getPaintingAtIndex(currentIndex);

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
        background: 'linear-gradient(to bottom, #1c1917 0%, #292524 50%, #1c1917 100%)'
      }}>
      {/* Subtle Wall Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.15) 2px, rgba(0,0,0,.15) 3px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.08) 2px, rgba(0,0,0,.08) 3px)
          `
        }}></div>

      {/* Ornate Crown Molding - Top */}
      <div className="absolute top-0 left-0 right-0 h-16 z-10 border-b-2 border-amber-900/50"
        style={{
          background: 'linear-gradient(to bottom, rgba(101, 67, 33, 0.4) 0%, rgba(139, 92, 46, 0.3) 50%, transparent 100%)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
        }}>
        <div className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(251, 191, 36, 0.2) 40px, rgba(251, 191, 36, 0.2) 42px)'
          }}></div>
      </div>
      
      {/* Wainscoting Panel Design - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 border-t-2 border-amber-900/50"
        style={{
          background: 'linear-gradient(to top, rgba(58, 38, 19, 0.6) 0%, rgba(101, 67, 33, 0.4) 60%, transparent 100%)'
        }}>
        <div className="absolute top-2 left-0 right-0 h-1 bg-amber-800/30"></div>
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(139, 92, 46, 0.3) 120px, rgba(139, 92, 46, 0.3) 122px, transparent 122px, transparent 240px, rgba(139, 92, 46, 0.3) 240px)'
          }}></div>
      </div>

      <TopNav />
      
      {/* Museum Title */}
      <div className="text-center pt-20 pb-6 relative z-20">
        <h1 className="text-5xl font-bold text-stone-300 mb-2 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>The Museum</h1>
        <p className="text-stone-400 italic">Click left or right to walk through the gallery</p>
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
          {/* Polished Wood Floor with Parquet Pattern */}
          <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-amber-950/30 via-amber-900/20 to-transparent">
            <div className="absolute inset-0 opacity-40" style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, 
                  rgba(101, 67, 33, 0.3), rgba(101, 67, 33, 0.3) 8px,
                  rgba(139, 92, 46, 0.3) 8px, rgba(139, 92, 46, 0.3) 16px,
                  rgba(101, 67, 33, 0.3) 16px, rgba(101, 67, 33, 0.3) 24px,
                  rgba(139, 92, 46, 0.3) 24px, rgba(139, 92, 46, 0.3) 32px
                ),
                repeating-linear-gradient(0deg,
                  transparent, transparent 60px,
                  rgba(58, 38, 19, 0.3) 60px, rgba(58, 38, 19, 0.3) 61px
                )
              `,
              transform: isWalking ? (direction === "forward" ? 'translateX(-32px)' : 'translateX(32px)') : 'translateX(0)',
              transition: 'transform 1.2s ease-in-out'
            }}></div>
          </div>

          {/* Spotlight Effects */}
          <div className="absolute top-20 left-1/4 w-48 h-96 bg-amber-200/5 blur-3xl rotate-12"></div>
          <div className="absolute top-20 right-1/4 w-48 h-96 bg-amber-200/5 blur-3xl -rotate-12"></div>

          {/* Vignette Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-gradient-to-r from-black/50 to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-black/50 to-transparent"></div>
        </div>

        {/* Paintings on the walls */}
        <div className="relative h-full flex items-center justify-center">
          {/* Show current painting (left) and next ones (to the right) */}
          {[0, 1, 2].map((offset) => {
            const painting = getPaintingAtIndex(currentIndex + offset);
            if (!painting?.images?.[0]) return null;

            const isMain = offset === 0;
            const distance = offset;
            
            // Tilt: perspective from left side of hall - left side of each painting appears bigger
            // Tilt increases as paintings get further away
            const getTilt = () => {
              if (offset === 0) return 'rotateY(30deg)';   // Closest painting
              if (offset === 1) return 'rotateY(40deg)';  // Middle distance
              return 'rotateY(50deg)';                     // Furthest away
            };

            // Custom positioning: 2nd painting closer to 3rd
            const getLeftPosition = () => {
              if (offset === 0) return '12%';
              if (offset === 1) return '48%';  // Further from 1st
              return '72%';                    // Closer to 2nd
            };

            return (
              <div
                key={`${painting.id}-${offset}`}
                className={`absolute transition-all duration-1200 ease-in-out`}
                style={{
                  left: getLeftPosition(),
                  top: '50%',
                  transform: `translate(0, -50%) scale(${1 - offset * 0.25}) perspective(1200px) ${getTilt()}`,
                  transformOrigin: 'center center',
                  opacity: isMain ? 1 : Math.max(0.25, 1 - offset * 0.35),
                  zIndex: 20 - offset,
                  filter: isMain ? 'none' : `blur(${offset * 1.2}px) brightness(${1 - offset * 0.3})`,
                }}
              >
                <img
                  src={painting.images[0]}
                  alt={painting.title}
                  className="object-contain"
                  style={{
                    maxWidth: isMain ? '420px' : `${420 - offset * 90}px`,
                    maxHeight: isMain ? '380px' : `${380 - offset * 85}px`,
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23334155" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%2394a3b8" font-size="16"%3EImage not available%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Current Painting Info */}
        {current && (
          <div className="absolute bottom-8 left-[12%] text-left max-w-md px-4 z-30">
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
