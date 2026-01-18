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
        <a
          href="/admin"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Access Admin Panel
        </a>
      </div>
    </div>
  );
}