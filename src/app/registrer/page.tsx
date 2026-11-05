"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegistrerPage() {
  const router = useRouter();
  const [type, setType] = useState<"movie" | "vinyl">("movie");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("saving");

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((val, key) => {
      data[key] = val as string;
    });
    data._type = type;

    try {
      setStatus("success");
      e.currentTarget.reset();
      setTimeout(() => {
        router.push(type === "movie" ? "/filmer" : "/vinyl");
      }, 1000);
    } catch {
      setStatus("error");
    }
  };

  const movieFields = [
    { name: "title", label: "Tittel", required: true },
    { name: "studio", label: "Studio" },
    { name: "year", label: "År" },
    { name: "genre", label: "Sjanger" },
    { name: "mainActors", label: "Skuespillere" },
    { name: "format", label: "Format" },
    { name: "condition", label: "Tilstand" },
    { name: "language", label: "Språk" },
    { name: "duration", label: "Varighet (min)" },
    { name: "rating", label: "Vurdering" },
    { name: "price", label: "Pris" },
    { name: "coverUrl", label: "Cover URL" },
    { name: "notes", label: "Notater" },
  ];

  const vinylFields = [
    { name: "title", label: "Tittel", required: true },
    { name: "artist", label: "Artist" },
    { name: "year", label: "År" },
    { name: "genre", label: "Sjanger" },
    { name: "format", label: "Format" },
    { name: "condition", label: "Tilstand" },
    { name: "price", label: "Pris" },
    { name: "coverUrl", label: "Cover URL" },
    { name: "notes", label: "Notater" },
  ];

  const fields = type === "movie" ? movieFields : vinylFields;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-gray-400 hover:text-white">
          ← Tilbake
        </Link>
        <h1 className="text-3xl font-bold">➕ Legg til ny</h1>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setType("movie")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            type === "movie" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          🎬 Film
        </button>
        <button
          onClick={() => setType("vinyl")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            type === "vinyl" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          🎵 Vinyl
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-gray-400 mb-1">{field.label}</label>
            <input
              type="text"
              name={field.name}
              required={field.required}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={status === "saving"}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-lg font-semibold transition mt-4"
        >
          {status === "saving" ? "Lagrer..." : "Lagre"}
        </button>

        {status === "success" && (
          <p className="text-green-400 text-center">
            ✅ Lagret! Sender deg videre...
          </p>
        )}
        {status === "error" && (
          <p className="text-red-400 text-center">
            ❌ Noe gikk galt. Prøv igjen.
          </p>
        )}
      </form>
    </main>
  );
}
