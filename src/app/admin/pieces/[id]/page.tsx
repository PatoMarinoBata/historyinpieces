import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditForm from "./EditForm";

export default async function EditPiecePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if ((session.user as any)?.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <p className="text-3xl font-bold text-slate-100">Acceso denegado — Solo administradores</p>
      </div>
    );
  }

  const resolvedParams = await params;
  const piece = await prisma.piece.findUnique({ where: { id: resolvedParams.id } });
  if (!piece) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 text-slate-100">
        <p>Piece not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Piece</h1>
      {/* @ts-expect-error Server/Client boundary */}
      <EditForm piece={piece} />
    </div>
  );
}
