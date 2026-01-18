import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// Temporarily disabled next-admin to avoid memory crash
// Use `npx prisma studio` for database UI instead
export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  if ((session.user as any).role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-3xl font-bold">Acceso denegado — Solo administradores</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-8 text-slate-100">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-4xl font-bold">Admin Panel</h1>
        <p className="text-slate-400">next-admin is temporarily disabled.</p>
        <p className="text-slate-400">Use Prisma Studio for database management:</p>
        <code className="block rounded bg-slate-800 p-4 text-left text-sm font-mono text-slate-300 border border-slate-700">npx prisma studio</code>
        <div className="pt-4">
          <a href="/admin/pieces" className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-700">Manage Pieces</a>
        </div>
      </div>
    </div>
  );
}