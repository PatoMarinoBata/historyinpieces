import { prisma } from "@/lib/prisma";
import PieceImageGallery from "./PieceImageGallery";

export default async function PublicPieceDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const piece = await prisma.piece.findUnique({ where: { id: resolvedParams.id } });
  if (!piece) {
    return <div className="min-h-screen bg-slate-900 p-8 text-slate-100">Not found</div>;
  }
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{piece.title}</h1>
          <span className="rounded bg-slate-700 px-2 py-1 text-xs uppercase">{(piece as any).category ?? 'OTHER'}</span>
        </div>
        <PieceImageGallery images={piece.images ?? []} title={piece.title} />
        {piece.description && <p className="mb-6 text-slate-300">{piece.description}</p>}
        {piece.history && (
          <div>
            <h2 className="mb-2 text-2xl font-semibold">History</h2>
            <p className="whitespace-pre-wrap text-slate-300">{piece.history}</p>
          </div>
        )}
        {piece.transactionHistory && Array.isArray(piece.transactionHistory) && (
          <div className="mt-6">
            <h2 className="mb-2 text-2xl font-semibold">Ownership / Transactions</h2>
            <div className="space-y-2">
              {(piece.transactionHistory as any[]).map((t, idx) => (
                <div key={idx} className="rounded border border-slate-700 bg-slate-800 p-3">
                  <div className="text-sm text-slate-400">{t.date ? new Date(t.date).toLocaleDateString() : ""}</div>
                  <div className="font-medium">Owner: {t.owner ?? "Unknown"}</div>
                  {t.price && <div>Price: ${t.price}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
