"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert("Credenciales incorrectas");
    } else {
      window.location.href = "/admin";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <form onSubmit={handleSubmit} className="w-96 rounded-2xl bg-slate-800 p-10 shadow-2xl border border-slate-700">
        <h1 className="mb-8 text-center text-3xl font-bold text-slate-100">
          Historical Collectibles
        </h1>
        <h2 className="mb-8 text-center text-xl text-slate-400">
          Panel de Administración
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}