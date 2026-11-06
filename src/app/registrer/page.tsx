"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const movieGenres = [
  "Action",
  "Komedie",
  "Drama",
  "Thriller",
  "Skrekk",
  "Sci-Fi",
  "Fantasy",
  "Romantikk",
  "Dokumentar",
  "Animasjon",
  "Krim",
  "Eventyr",
  "Musikal",
  "Western",
  "Krigsfilm",
  "Annet",
];

const movieStudios = [
  "Disney",
  "Pixar",
  "Marvel",
  "DreamWorks",
  "Warner Bros.",
  "Universal",
  "Sony Pictures",
  "20th Century Studios",
  "Paramount",
  "Lionsgate",
  "Columbia Pictures",
  "New Line Cinema",
  "MGM",
  "A24",
  "Studio Ghibli",
  "Lucasfilm",
  "DC Studios",
  "Netflix",
  "Amazon Studios",
  "HBO",
  "Nordisk Film",
  "Annet",
];

const movieFormats = ["DVD", "Blu-ray", "4K UHD", "VHS", "LaserDisc", "Annet"];

const conditions = [
  "Mint",
  "Nær Mint",
  "Veldig God",
  "God",
  "Brukbar",
  "Dårlig",
];

const vinylGenres = [
  "Rock",
  "Pop",
  "Jazz",
  "Klassisk",
  "Blues",
  "Country",
  "Electronic",
  "Hip-Hop",
  "R&B",
  "Soul",
  "Funk",
  "Reggae",
  "Metal",
  "Punk",
  "Folk",
  "Indie",
  "Alternativ",
  "Disco",
  "Annet",
];

function SelectField({
  name,
  label,
  options,
  required,
}: {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[#a89f91] mb-1 text-sm">{label}</label>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
      >
        <option value="" disabled>
          Velg {label.toLowerCase()}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({ name, label }: { name: string; label: string }) {
  return (
    <div>
      <label className="block text-[#a89f91] mb-1 text-sm">{label}</label>
      <textarea
        name={name}
        rows={3}
        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a] resize-none"
      />
    </div>
  );
}

export default function RegistrerPage() {
  const router = useRouter();
  const [type, setType] = useState<"movie" | "vinyl">("movie");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [title, setTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [fetchedYear, setFetchedYear] = useState("");
  const [fetchingCover, setFetchingCover] = useState(false);

  const fetchCover = async (titleValue: string) => {
    if (!titleValue || titleValue.length < 2) return;
    setFetchingCover(true);
    try {
      const res = await fetch(
        `/api/tmdb?query=\${encodeURIComponent(titleValue)}`,
      );
      const data = await res.json();
      if (data.coverUrl) {
        setCoverUrl(data.coverUrl);
        if (data.year) setFetchedYear(data.year);
      } else {
        setCoverUrl("");
      }
    } catch {
      setCoverUrl("");
    } finally {
      setFetchingCover(false);
    }
  };

  const handleTitleBlur = () => {
    if (type === "movie") fetchCover(title);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("saving");

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((val, key) => {
      if (val) data[key] = val as string;
    });

    // Use auto-fetched cover if no manual one entered
    if (!data.coverUrl && coverUrl) {
      data.coverUrl = coverUrl;
    }

    try {
      const res = await fetch("/api/sanity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _type: type, ...data }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setStatus("success");
      e.currentTarget.reset();
      setTitle("");
      setCoverUrl("");
      setFetchedYear("");

      setTimeout(() => {
        router.push(type === "movie" ? "/filmer" : "/vinyl");
      }, 1500);
    } catch (err) {
      console.error("Save error:", err);
      setStatus("error");
    }
  };

  return (
    <main className="py-12 px-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="text-[#6b6358] hover:text-[#d4a04a] transition-colors"
        >
          ← Tilbake
        </Link>
        <h1 className="text-3xl font-bold">Legg til ny</h1>
      </div>

      <div className="flex gap-3 mb-10">
        <button
          onClick={() => {
            setType("movie");
            setCoverUrl("");
            setTitle("");
            setFetchedYear("");
          }}
          className={`px-6 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wider transition-all \${
            type === "movie"
              ? "bg-[#d4a04a] text-[#0d0d0d]"
              : "bg-[#1a1a1a] border border-[#333] text-[#a89f91] hover:border-[#d4a04a]/40"
          }`}
        >
          🎬 Film
        </button>
        <button
          onClick={() => {
            setType("vinyl");
            setCoverUrl("");
            setTitle("");
            setFetchedYear("");
          }}
          className={`px-6 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wider transition-all ${
            type === "vinyl"
              ? "bg-[#d4a04a] text-[#0d0d0d]"
              : "bg-[#1a1a1a] border border-[#333] text-[#a89f91] hover:border-[#d4a04a]/40"
          }`}
        >
          🎵 Vinyl
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === "movie" ? (
          <>
            {/* Title with auto-fetch */}
            <div>
              <label className="block text-[#a89f91] mb-1 text-sm">
                Tittel *
              </label>
              <input
                type="text"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                placeholder="Skriv tittel og tab for å hente cover..."
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
              />
              {fetchingCover && (
                <p className="text-[#a89f91] text-xs mt-1">
                  🔍 Henter cover fra TMDB...
                </p>
              )}
            </div>

            {/* Cover preview */}
            {coverUrl && (
              <div className="flex items-start gap-4 p-3 bg-[#1a1a1a] border border-[#333] rounded-lg">
                <img
                  src={coverUrl}
                  alt="Cover"
                  className="w-16 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-green-400 text-sm mb-1">
                    ✅ Cover funnet automatisk!
                  </p>
                  {fetchedYear && (
                    <p className="text-[#a89f91] text-xs">År: {fetchedYear}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setCoverUrl("")}
                    className="text-red-400 text-xs mt-2 hover:text-red-300"
                  >
                    ✕ Fjern cover
                  </button>
                </div>
              </div>
            )}

            <SelectField
              name="studio"
              label="Filmselskap"
              options={movieStudios}
            />
            <div>
              <label className="block text-[#a89f91] mb-1 text-sm">År</label>
              <input
                type="text"
                name="year"
                value={fetchedYear}
                onChange={(e) => setFetchedYear(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
              />
            </div>
            <SelectField name="genre" label="Sjanger" options={movieGenres} />
            <div>
              <label className="block text-[#a89f91] mb-1 text-sm">
                Hovedskuespillere
              </label>
              <input
                type="text"
                name="mainActors"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
              />
            </div>
            <SelectField name="format" label="Format" options={movieFormats} />
            <SelectField
              name="condition"
              label="Tilstand"
              options={conditions}
            />
            <div>
              <label className="block text-[#a89f91] mb-1 text-sm">Språk</label>
              <input
                type="text"
                name="language"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
              />
            </div>
            <div>
              <label className="block text-[#a89f91] mb-1 text-sm">
                Varighet (min)
              </label>
              <input
                type="text"
                name="duration"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
              />
            </div>
            <div>
              <label className="block text-[#a89f91] mb-1 text-sm">
                Vurdering
              </label>
              <input
                type="text"
                name="rating"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
              />
            </div>
            <div>
              <label className="block text-[#a89f91] mb-1 text-sm">
                Pris (kr)
              </label>
              <input
                type="text"
                name="price"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
              />
            </div>
            <div>
              <label className="block text-[#a89f91] mb-1 text-sm">
                Cover URL (valgfri overstyring)
              </label>
              <input
                type="text"
                name="coverUrl"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="Lim inn egen URL eller la stå tom"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
              />
            </div>
            <TextAreaField name="notes" label="Notater" />
          </>
        ) : (
          <>
            <div>
              <label className="block text-[#a89f91] mb-1 text-sm">
                Tittel *
              </label>
              <input
                type="text"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
              />
            </div>
            <div>
              <label className="block text-[#a89f91] mb-1 text-sm">
                Artist
              </label>
              <input
                type="text"
                name="artist"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
              />
            </div>
            <div>
              <label className="block text-[#a89f91] mb-1 text-sm">År</label>
              <input
                type="text"
                name="year"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
              />
            </div>
            <SelectField name="genre" label="Sjanger" options={vinylGenres} />
            <SelectField
              name="condition"
              label="Tilstand"
              options={conditions}
            />
            <div>
              <label className="block text-[#a89f91] mb-1 text-sm">
                Plateselskap
              </label>
              <input
                type="text"
                name="label"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
              />
            </div>
            <div>
              <label className="block text-[#a89f91] mb-1 text-sm">
                Pris (kr)
              </label>
              <input
                type="text"
                name="price"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
              />
            </div>
            <div>
              <label className="block text-[#a89f91] mb-1 text-sm">
                Cover URL
              </label>
              <input
                type="text"
                name="coverUrl"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
              />
            </div>
            <TextAreaField name="notes" label="Notater" />
          </>
        )}

        <button
          type="submit"
          disabled={status === "saving"}
          className="w-full bg-[#d4a04a] hover:bg-[#e8b85c] disabled:opacity-50 text-[#0d0d0d] py-3.5 rounded-full font-semibold text-sm uppercase tracking-wider transition-all mt-6"
        >
          {status === "saving" ? "Lagrer..." : "Lagre"}
        </button>

        {status === "success" && (
          <p className="text-green-400 text-center mt-4">
            ✅ Lagret! Sender deg videre...
          </p>
        )}
        {status === "error" && (
          <p className="text-red-400 text-center mt-4">
            ❌ Noe gikk galt. Prøv igjen.
          </p>
        )}
      </form>
    </main>
  );
}
