"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReseedPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleReseed = async () => {
    if (!confirm("This will delete ALL pieces and recreate them with fresh data. Continue?")) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/reseed", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.message}`);
        setTimeout(() => router.push("/"), 2000);
      } else {
        setMessage(`❌ Error: ${data.error || "Failed to reseed"}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-amber-400">
          Reseed Database
        </h1>
        
        <p className="text-slate-300 mb-6 text-center">
          Click the button below to delete all existing pieces and recreate them with fresh image URLs.
        </p>

        {message && (
          <div className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-600 text-center">
            {message}
          </div>
        )}

        <button
          onClick={handleReseed}
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 font-bold py-3 px-6 rounded-lg transition"
        >
          {loading ? "Reseeding..." : "Reseed Database Now"}
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold py-3 px-6 rounded-lg transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
