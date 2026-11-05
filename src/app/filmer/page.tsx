"use client";

import { useEffect, useState } from "react";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: "id7kivhl",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: "", // ← we need a token for edit/delete — we'll handle this differently
});

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

  const fetchMovies = () => {
    client
      .fetch(
        `*[_type == "movie"] | order(title asc) {
      _id, title, studio, year, genre, format, condition, language, duration, coverUrl, notes, mainActors, rating
    }`,
      )
      .then(setMovies);
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
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.studio?.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genre === "Alle" || m.genre === genre;
    const matchFormat = format === "Alle" || m.format === format;
    return matchSearch && matchGenre && matchFormat;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Er du sikker på at du vil slette denne filmen?")) return;
    const res = await fetch("/api/movies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setSelected(null);
      fetchMovies();
    }
  };

  const handleSave = async () => {
    if (!editData) return;
    const res = await fetch("/api/movies", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    if (res.ok) {
      setEditing(false);
      setSelected(null);
      fetchMovies();
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">🎬 Filmsamling</h1>
      <p className="text-gray-400 mb-6">
        {filtered.length} av {movies.length} filmer
      </p>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Søk etter tittel eller studio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full sm:w-80 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        >
          {genres.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        >
          {formats.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((movie) => (
          <div
            key={movie._id}
            onClick={() => {
              setSelected(movie);
              setEditing(false);
              setEditData(movie);
            }}
            className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition cursor-pointer"
          >
            {movie.coverUrl ? (
              <img
                src={movie.coverUrl}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center text-4xl">
                🎬
              </div>
            )}
            <div className="p-2">
              <p className="font-semibold text-sm leading-tight">
                {movie.title}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {movie.year} · {movie.format}
              </p>
              <p className="text-gray-500 text-xs">{movie.genre}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail / Edit Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-gray-900 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {!editing ? (
              <>
                {selected.coverUrl && (
                  <img
                    src={selected.coverUrl}
                    alt={selected.title}
                    className="w-full max-h-64 object-contain rounded-lg mb-4"
                  />
                )}
                <h2 className="text-2xl font-bold mb-4">{selected.title}</h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400">Studio:</span>{" "}
                    {selected.studio}
                  </p>
                  <p>
                    <span className="text-gray-400">År:</span> {selected.year}
                  </p>
                  <p>
                    <span className="text-gray-400">Sjanger:</span>{" "}
                    {selected.genre}
                  </p>
                  <p>
                    <span className="text-gray-400">Format:</span>{" "}
                    {selected.format}
                  </p>
                  <p>
                    <span className="text-gray-400">Tilstand:</span>{" "}
                    {selected.condition}
                  </p>
                  <p>
                    <span className="text-gray-400">Språk:</span>{" "}
                    {selected.language}
                  </p>
                  <p>
                    <span className="text-gray-400">Varighet:</span>{" "}
                    {selected.duration} min
                  </p>
                  {selected.mainActors && (
                    <p>
                      <span className="text-gray-400">Skuespillere:</span>{" "}
                      {selected.mainActors}
                    </p>
                  )}
                  {selected.rating && (
                    <p>
                      <span className="text-gray-400">Vurdering:</span>{" "}
                      {selected.rating}
                    </p>
                  )}
                  {selected.notes && (
                    <p>
                      <span className="text-gray-400">Notater:</span>{" "}
                      {selected.notes}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
                  >
                    ✏️ Rediger
                  </button>
                  <button
                    onClick={() => handleDelete(selected._id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
                  >
                    🗑️ Slett
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm ml-auto"
                  >
                    Lukk
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Rediger film</h2>
                <div className="space-y-3">
                  {[
                    { key: "title", label: "Tittel" },
                    { key: "studio", label: "Studio" },
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
                      <label className="text-xs text-gray-400">{label}</label>
                      <input
                        value={
                          (editData as Record<string, string>)?.[key] || ""
                        }
                        onChange={(e) =>
                          setEditData((prev) =>
                            prev ? { ...prev, [key]: e.target.value } : prev,
                          )
                        }
                        className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm"
                  >
                    💾 Lagre
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
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
