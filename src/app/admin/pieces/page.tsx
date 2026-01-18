import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPiecesPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if ((session.user as any)?.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <p className="text-3xl font-bold text-slate-100">Acceso denegado — Solo administradores</p>
      </div>
    );
  }

  const pieces = await prisma.piece.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pieces</h1>
        <Link href="/admin/pieces/new" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">New Piece</Link>
      </div>

      <div className="overflow-x-auto rounded border border-slate-700">
        <table className="min-w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Updated</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pieces.map((p) => (
              <tr key={p.id} className="border-t border-slate-800">
                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{new Date(p.updatedAt).toLocaleString()}</td>
                <td className="p-3 space-x-2">
                  <Link href={`/admin/pieces/${p.id}`} className="rounded bg-slate-700 px-3 py-1 hover:bg-slate-600">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
