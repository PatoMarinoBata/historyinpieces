"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isActive("/")
                  ? "bg-amber-600 text-slate-900"
                  : "text-slate-300 hover:text-amber-400 hover:bg-slate-800"
              }`}
            >
              Home
            </Link>
            <Link
              href="/paintings"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isActive("/paintings")
                  ? "bg-amber-600 text-slate-900"
                  : "text-slate-300 hover:text-amber-400 hover:bg-slate-800"
              }`}
            >
              Paintings
            </Link>
            <Link
              href="/museum"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isActive("/museum")
                  ? "bg-amber-600 text-slate-900"
                  : "text-slate-300 hover:text-amber-400 hover:bg-slate-800"
              }`}
            >
              Museum
            </Link>
            <Link
              href="/cars"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isActive("/cars")
                  ? "bg-amber-600 text-slate-900"
                  : "text-slate-300 hover:text-amber-400 hover:bg-slate-800"
              }`}
            >
              Cars
            </Link>
            <Link
              href="/statues"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isActive("/statues")
                  ? "bg-amber-600 text-slate-900"
                  : "text-slate-300 hover:text-amber-400 hover:bg-slate-800"
              }`}
            >
              Statues
            </Link>
            <Link
              href="/collectibles"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isActive("/collectibles")
                  ? "bg-amber-600 text-slate-900"
                  : "text-slate-300 hover:text-amber-400 hover:bg-slate-800"
              }`}
            >
              Collectibles
            </Link>
            <Link
              href="/documents"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isActive("/documents")
                  ? "bg-amber-600 text-slate-900"
                  : "text-slate-300 hover:text-amber-400 hover:bg-slate-800"
              }`}
            >
              Documents
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
