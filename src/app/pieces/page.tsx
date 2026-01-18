"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Piece = {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  category: string;
};

export default function PublicPiecesPage() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pieces")
      .then((r) => r.json())
      .then((data) => {
        setPieces(data);
        setLoading(false);
      });
  }, []);

  const filtered = filter === "ALL" ? pieces : pieces.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">History in Pieces</h1>
        <div className="flex gap-2">
          <button onClick={() => setFilter("ALL")} className={`rounded px-3 py-1 text-sm ${filter === "ALL" ? "bg-blue-600" : "bg-slate-700 hover:bg-slate-600"}`}>All</button>
          <button onClick={() => setFilter("PAINTING")} className={`rounded px-3 py-1 text-sm ${filter === "PAINTING" ? "bg-blue-600" : "bg-slate-700 hover:bg-slate-600"}`}>Painting</button>
          <button onClick={() => setFilter("CAR")} className={`rounded px-3 py-1 text-sm ${filter === "CAR" ? "bg-blue-600" : "bg-slate-700 hover:bg-slate-600"}`}>Car</button>
          <button onClick={() => setFilter("STATUE")} className={`rounded px-3 py-1 text-sm ${filter === "STATUE" ? "bg-blue-600" : "bg-slate-700 hover:bg-slate-600"}`}>Statue</button>
          <button onClick={() => setFilter("COLLECTIBLE")} className={`rounded px-3 py-1 text-sm ${filter === "COLLECTIBLE" ? "bg-blue-600" : "bg-slate-700 hover:bg-slate-600"}`}>Collectible</button>
          <button onClick={() => setFilter("DOCUMENT")} className={`rounded px-3 py-1 text-sm ${filter === "DOCUMENT" ? "bg-blue-600" : "bg-slate-700 hover:bg-slate-600"}`}>Document</button>
          <button onClick={() => setFilter("OTHER")} className={`rounded px-3 py-1 text-sm ${filter === "OTHER" ? "bg-blue-600" : "bg-slate-700 hover:bg-slate-600"}`}>Other</button>
        </div>
      </div>
      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link key={p.id} href={`/pieces/${p.id}`} className="block rounded border border-slate-700 bg-slate-800 p-4 hover:border-slate-600">
              <div className="mb-3 h-40 w-full overflow-hidden rounded bg-slate-700">
                {p.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">No image</div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{p.title}</h2>
                <span className="rounded bg-slate-700 px-2 py-1 text-xs uppercase">{p.category ?? "OTHER"}</span>
              </div>
              {p.description && <p className="mt-1 text-sm text-slate-400 line-clamp-2">{p.description}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
