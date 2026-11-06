"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { getFallbackPhoto } from "@/lib/tom-photos";

type Movie = {
  _id: string;
  title: string;
  studio: string;
  year: string;
  genre: string;
  format: string;
  condition: string;
  language: string;
  duration: string;
  coverUrl: string;
  notes: string;
  mainActors: string;
  rating: string;
};

export default function FilmerPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("Alle");
  const [format, setFormat] = useState("Alle");
  const [selected, setSelected] = useState<Movie | null>(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchMovies = async () => {
    try {
      const data = await client.fetch<Movie[]>(
        `*[_type == "movie"] | order(title asc) {
          _id, title, studio, year, genre, format, condition,
          language, duration, coverUrl, notes, mainActors, rating
        }`,
      );
      setMovies(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const genres = [
    "Alle",
    ...Array.from(new Set(movies.map((m) => m.genre).filter(Boolean))).sort(),
  ];
  const formats = [
    "Alle",
    ...Array.from(new Set(movies.map((m) => m.format).filter(Boolean))).sort(),
  ];

  const filtered = movies.filter((m) => {
    const matchSearch =
      m.title?.toLowerCase().includes(search.toLowerCase()) ||
      m.studio?.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genre === "Alle" || m.genre === genre;
    const matchFormat = format === "Alle" || m.format === format;
    return matchSearch && matchGenre && matchFormat;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Er du sikker på at du vil slette denne filmen?")) return;
    try {
      const res = await fetch("/api/sanity", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      setSelected(null);
      fetchMovies();
    } catch {
      alert("Kunne ikke slette. Prøv igjen.");
    }
  };

  const handleSave = async () => {
    if (!editData) return;
    setSaving(true);
    try {
      const res = await fetch("/api/sanity", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Failed to save");
      setEditing(false);
      setSelected(null);
      fetchMovies();
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
        <h1 className="text-4xl font-bold mb-1">🎬 Filmsamling</h1>
        <p className="text-[#6b6358]">
          {filtered.length} av {movies.length} filmer
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Søk etter tittel eller filmselskap..."
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
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="bg-[#1a1a1a] border border-[#333] text-[#f0ece4] px-4 py-2.5 rounded-lg outline-none"
        >
          {formats.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#6b6358]">
          <div className="text-5xl mb-4">🎬</div>
          <p>Ingen filmer funnet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((movie) => (
            <div
              key={movie._id}
              onClick={() => {
                setSelected(movie);
                setEditing(false);
                setEditData(movie);
              }}
              className="bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden hover:border-[#d4a04a]/40 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div className="w-full aspect-[2/3] overflow-hidden">
                <img
                  src={movie.coverUrl || getFallbackPhoto(movie._id)}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <p className="font-semibold text-sm leading-tight text-[#f0ece4]">
                  {movie.title}
                </p>
                <p className="text-[#6b6358] text-xs mt-1">
                  {movie.year} · {movie.format}
                </p>
                <p className="text-[#6b6358] text-xs">{movie.genre}</p>
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
                />
                <h2 className="text-2xl font-bold mb-4 text-[#f0ece4]">
                  {selected.title}
                </h2>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Filmselskap", value: selected.studio },
                    { label: "År", value: selected.year },
                    { label: "Sjanger", value: selected.genre },
                    { label: "Format", value: selected.format },
                    { label: "Tilstand", value: selected.condition },
                    { label: "Språk", value: selected.language },
                    {
                      label: "Varighet",
                      value: selected.duration
                        ? `${selected.duration} min`
                        : null,
                    },
                    { label: "Skuespillere", value: selected.mainActors },
                    { label: "Vurdering", value: selected.rating },
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
                  Rediger film
                </h2>
                <div className="space-y-3">
                  {[
                    { key: "title", label: "Tittel" },
                    { key: "studio", label: "Filmselskap" },
                    { key: "year", label: "År" },
                    { key: "genre", label: "Sjanger" },
                    { key: "format", label: "Format" },
                    { key: "condition", label: "Tilstand" },
                    { key: "language", label: "Språk" },
                    { key: "duration", label: "Varighet (min)" },
                    { key: "mainActors", label: "Skuespillere" },
                    { key: "rating", label: "Vurdering" },
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
