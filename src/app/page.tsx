"use client";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-100 mb-4">
          Historical Collectibles
        </h1>
        <p className="text-xl text-slate-400 mb-8">
          Discover and manage your collection
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="/pieces" className="inline-block bg-slate-800 text-slate-100 px-6 py-3 rounded-lg border border-slate-700 hover:bg-slate-700 transition">Browse Pieces</a>
          <a href="/admin" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Admin Panel</a>
        </div>
      </div>
    </div>
  );
}