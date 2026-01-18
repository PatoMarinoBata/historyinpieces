"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditForm({ piece }: { piece: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(piece.title);
  const [description, setDescription] = useState(piece.description || "");
  const [history, setHistory] = useState(piece.history || "");
  const [images, setImages] = useState((piece.images || []).join(", "));
  const [category, setCategory] = useState<string>(piece.category ?? "OTHER");
  const [lastSoldPrice, setLastSoldPrice] = useState<string>(piece.lastSoldPrice ?? "");
  const [lastSoldDate, setLastSoldDate] = useState<string>(piece.lastSoldDate ? new Date(piece.lastSoldDate).toISOString().slice(0, 10) : "");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/pieces/${piece.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || null,
        history: history || null,
        images,
        lastSoldPrice: lastSoldPrice ? Number(lastSoldPrice) : null,
        lastSoldDate: lastSoldDate || null,
        category,
      }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/pieces");
    } else {
      alert("Failed to update piece");
    }
  };

  const remove = async () => {
    if (!confirm("Delete this piece?")) return;
    const res = await fetch(`/api/pieces/${piece.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/pieces");
    } else {
      alert("Failed to delete piece");
    }
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1 block">Category</label>
        <select className="w-full rounded border border-slate-700 bg-slate-800 p-2" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="PAINTING">Painting</option>
          <option value="CAR">Car</option>
          <option value="STATUE">Statue</option>
          <option value="COLLECTIBLE">Collectible</option>
          <option value="DOCUMENT">Document</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block">Title</label>
        <input className="w-full rounded border border-slate-700 bg-slate-800 p-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block">Description</label>
        <textarea className="w-full rounded border border-slate-700 bg-slate-800 p-2" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
      </div>
      <div>
        <label className="mb-1 block">History</label>
        <textarea className="w-full rounded border border-slate-700 bg-slate-800 p-2" value={history} onChange={(e) => setHistory(e.target.value)} rows={4} />
      </div>
      <div>
        <label className="mb-1 block">Images (comma-separated URLs)</label>
        <input className="w-full rounded border border-slate-700 bg-slate-800 p-2" value={images} onChange={(e) => setImages(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block">Last Sold Price</label>
          <input type="number" className="w-full rounded border border-slate-700 bg-slate-800 p-2" value={lastSoldPrice} onChange={(e) => setLastSoldPrice(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block">Last Sold Date</label>
          <input type="date" className="w-full rounded border border-slate-700 bg-slate-800 p-2" value={lastSoldDate} onChange={(e) => setLastSoldDate(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-3">
        <button disabled={loading} className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-700 disabled:opacity-50" type="submit">{loading ? "Saving..." : "Save"}</button>
        <button type="button" onClick={remove} className="rounded bg-red-600 px-4 py-2 hover:bg-red-700">Delete</button>
      </div>
    </form>
  );
}
