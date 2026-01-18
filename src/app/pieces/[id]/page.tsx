import { prisma } from "@/lib/prisma";

export default async function PublicPieceDetail({ params }: { params: { id: string } }) {
  const piece = await prisma.piece.findUnique({ where: { id: params.id } });
  if (!piece) {
    return <div className="min-h-screen bg-slate-900 p-8 text-slate-100">Not found</div>;
  }
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-3xl font-bold">{piece.title}</h1>
        <div className="mb-6 grid grid-cols-2 gap-3">
          {piece.images && piece.images.length > 0 ? (
            piece.images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt={`${piece.title} image ${i + 1}`} className="h-48 w-full rounded object-cover" />
            ))
          ) : (
            <div className="rounded bg-slate-800 p-6 text-slate-300">No images</div>
          )}
        </div>
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
