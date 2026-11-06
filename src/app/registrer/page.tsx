"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { client } from "@/sanity/lib/client";

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

function TextField({
  name,
  label,
  required,
  type = "text",
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[#a89f91] mb-1 text-sm">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-[#f0ece4] focus:outline-none focus:ring-2 focus:ring-[#d4a04a]/50 focus:border-[#d4a04a]"
      />
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("saving");

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((val, key) => {
      if (val) data[key] = val as string;
    });

    try {
      const token = process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN;
      const writeClient = client.withConfig({ token, useCdn: false });

      await writeClient.create({
        _type: type,
        ...data,
      });

      setStatus("success");
      e.currentTarget.reset();
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
          onClick={() => setType("movie")}
          className={`px-6 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wider transition-all ${
            type === "movie"
              ? "bg-[#d4a04a] text-[#0d0d0d]"
              : "bg-[#1a1a1a] border border-[#333] text-[#a89f91] hover:border-[#d4a04a]/40"
          }`}
        >
          🎬 Film
        </button>
        <button
          onClick={() => setType("vinyl")}
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
            <TextField name="title" label="Tittel" required />
            <SelectField
              name="studio"
              label="Filmselskap"
              options={movieStudios}
            />
            <TextField name="year" label="År" />
            <SelectField name="genre" label="Sjanger" options={movieGenres} />
            <TextField name="mainActors" label="Hovedskuespillere" />
            <SelectField name="format" label="Format" options={movieFormats} />
            <SelectField
              name="condition"
              label="Tilstand"
              options={conditions}
            />
            <TextField name="language" label="Språk" />
            <TextField name="duration" label="Varighet (min)" />
            <TextField name="rating" label="Vurdering" />
            <TextField name="price" label="Pris (kr)" />
            <TextField name="coverUrl" label="Cover URL" />
            <TextAreaField name="notes" label="Notater" />
          </>
        ) : (
          <>
            <TextField name="title" label="Tittel" required />
            <TextField name="artist" label="Artist" />
            <TextField name="year" label="År" />
            <SelectField name="genre" label="Sjanger" options={vinylGenres} />
            <SelectField
              name="condition"
              label="Tilstand"
              options={conditions}
            />
            <TextField name="label" label="Plateselskap" />
            <TextField name="price" label="Pris (kr)" />
            <TextField name="coverUrl" label="Cover URL" />
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
