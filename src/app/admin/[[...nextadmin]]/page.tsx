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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-8">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold text-slate-100">Admin Panel</h1>
        <p className="mb-4 text-slate-400">next-admin is temporarily disabled.</p>
        <p className="mb-6 text-slate-400">Use Prisma Studio for database management:</p>
        <code className="block rounded bg-slate-800 p-4 text-left text-sm font-mono text-slate-300 border border-slate-700">
          npx prisma studio
        </code>
        <p className="mt-6 text-sm text-slate-500">We're working on a stable admin solution.</p>
      </div>
    </div>
  );
}