"use client";

import { useEffect, useState } from "react";
import { getFallbackPhoto } from "@/lib/tom-photos";

type Vinyl = {
  _id: string;
  title: string;
  artist: string;
  year: string;
  genre: string;
  format: string;
  condition: string;
  price: string;
  notes: string;
  coverUrl: string;
};

export default function VinylPage() {
  const [records, setRecords] = useState<Vinyl[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("Alle");
  const [selected, setSelected] = useState<Vinyl | null>(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Vinyl | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/vinyl");
      const data = await res.json();
      setRecords(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const genres = [
    "Alle",
    ...Array.from(new Set(records.map((r) => r.genre).filter(Boolean))).sort(),
  ];

  const filtered = records.filter((r) => {
    const matchSearch =
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.artist?.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genre === "Alle" || r.genre === genre;
    return matchSearch && matchGenre;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Er du sikker på at du vil slette denne platen?")) return;
    try {
      const res = await fetch("/api/vinyl", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      setSelected(null);
      fetchRecords();
    } catch {
      alert("Kunne ikke slette. Prøv igjen.");
    }
  };

  const handleSave = async () => {
    if (!editData) return;
    setSaving(true);
    try {
      const res = await fetch("/api/vinyl", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Failed to save");
      setEditing(false);
      setSelected(null);
      fetchRecords();
    } catch {
      alert("Kunne ikke lagre. Prøv igjen.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-[#d4a04a] flex items-center justify-center text-[#0d0d0d] font-bold animate-pulse">
          T
        </div>
      </div>
    );
  }

  return (
    <main className="py-10 px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-1">🎵 Vinylsamling</h1>
        <p className="text-[#6b6358]">
          {filtered.length} av {records.length} plater
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Søk etter tittel eller artist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#1a1a1a] border border-[#333] text-[#f0ece4] px-4 py-2.5 rounded-lg w-full sm:w-80 outline-none focus:ring-2 focus:ring-[#d4a04a]/50 placeholder-[#6b6358]"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="bg-[#1a1a1a] border border-[#333] text-[#f0ece4] px-4 py-2.5 rounded-lg outline-none"
        >
          {genres.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#6b6358]">
          <div className="text-5xl mb-4">🎵</div>
          <p>Ingen plater funnet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((record) => (
            <div
              key={record._id}
              onClick={() => {
                setSelected(record);
                setEditing(false);
                setEditData(record);
              }}
              className="bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden hover:border-[#d4a04a]/40 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={record.coverUrl || getFallbackPhoto(record._id)}
                  alt={record.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = getFallbackPhoto(record._id);
                  }}
                />
              </div>
              <div className="p-2">
                <p className="font-semibold text-sm leading-tight text-[#f0ece4]">
                  {record.title}
                </p>
                <p className="text-[#6b6358] text-xs mt-1">{record.artist}</p>
                <p className="text-[#6b6358] text-xs">
                  {record.year} · {record.genre}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#111] border border-[#333] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {!editing ? (
              <>
                <img
                  src={selected.coverUrl || getFallbackPhoto(selected._id)}
                  alt={selected.title}
                  className="w-full max-h-64 object-contain rounded-xl mb-4"
                  onError={(e) => {
                    e.currentTarget.src = getFallbackPhoto(selected._id);
                  }}
                />
                <h2 className="text-2xl font-bold mb-4 text-[#f0ece4]">
                  {selected.title}
                </h2>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Artist", value: selected.artist },
                    { label: "År", value: selected.year },
                    { label: "Sjanger", value: selected.genre },
                    { label: "Format", value: selected.format },
                    { label: "Tilstand", value: selected.condition },
                    { label: "Pris", value: selected.price },
                    { label: "Notater", value: selected.notes },
                  ]
                    .filter((f) => f.value)
                    .map(({ label, value }) => (
                      <p key={label}>
                        <span className="text-[#6b6358]">{label}:</span>{" "}
                        <span className="text-[#f0ece4]">{value}</span>
                      </p>
                    ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-[#d4a04a] hover:bg-[#e8b85c] text-[#0d0d0d] px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    ✏️ Rediger
                  </button>
                  <button
                    onClick={() => handleDelete(selected._id)}
                    className="bg-red-900/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    🗑️ Slett
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="ml-auto bg-[#1a1a1a] hover:bg-[#222] border border-[#333] px-4 py-2 rounded-full text-sm text-[#a89f91]"
                  >
                    Lukk
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4 text-[#f0ece4]">
                  Rediger vinyl
                </h2>
                <div className="space-y-3">
                  {[
                    { key: "title", label: "Tittel" },
                    { key: "artist", label: "Artist" },
                    { key: "year", label: "År" },
                    { key: "genre", label: "Sjanger" },
                    { key: "format", label: "Format" },
                    { key: "condition", label: "Tilstand" },
                    { key: "price", label: "Pris" },
                    { key: "coverUrl", label: "Cover URL" },
                    { key: "notes", label: "Notater" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-xs text-[#6b6358]">{label}</label>
                      <input
                        value={
                          (editData as Record<string, string>)?.[key] || ""
                        }
                        onChange={(e) =>
                          setEditData((prev) =>
                            prev ? { ...prev, [key]: e.target.value } : prev,
                          )
                        }
                        className="w-full bg-[#1a1a1a] border border-[#333] text-[#f0ece4] px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#d4a04a]/50"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#d4a04a] hover:bg-[#e8b85c] disabled:opacity-50 text-[#0d0d0d] px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    {saving ? "Lagrer..." : "💾 Lagre"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-[#1a1a1a] border border-[#333] hover:bg-[#222] px-4 py-2 rounded-full text-sm text-[#a89f91]"
                  >
                    Avbryt
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
