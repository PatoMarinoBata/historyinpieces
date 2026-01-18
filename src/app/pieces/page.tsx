import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PublicPiecesPage() {
  const pieces = await prisma.piece.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <h1 className="mb-6 text-3xl font-bold">History in Pieces</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pieces.map((p) => (
          <Link key={p.id} href={`/pieces/${p.id}`} className="block rounded border border-slate-700 bg-slate-800 p-4 hover:border-slate-600">
            <div className="mb-3 h-40 w-full overflow-hidden rounded bg-slate-700">
              {p.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-300">No image</div>
              )}
            </div>
            <h2 className="text-xl font-semibold">{p.title}</h2>
            {p.description && <p className="mt-1 text-sm text-slate-400 line-clamp-2">{p.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
