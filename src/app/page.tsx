import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-4">🎬🎵 TomsSamling</h1>
      <p className="text-gray-400 text-lg mb-12">Film- og vinylsamling</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl w-full">
        <Link
          href="/filmer"
          className="bg-gray-800 hover:bg-gray-700 rounded-xl p-8 text-center transition"
        >
          <span className="text-5xl block mb-4">🎬</span>
          <h2 className="text-2xl font-bold">Filmer</h2>
          <p className="text-gray-400 mt-2">Bla gjennom filmsamlingen</p>
        </Link>

        <Link
          href="/vinyl"
          className="bg-gray-800 hover:bg-gray-700 rounded-xl p-8 text-center transition"
        >
          <span className="text-5xl block mb-4">🎵</span>
          <h2 className="text-2xl font-bold">Vinyl</h2>
          <p className="text-gray-400 mt-2">Bla gjennom vinylsamlingen</p>
        </Link>
      </div>

      <Link
        href="/registrer"
        className="mt-12 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-semibold transition"
      >
        ➕ Legg til ny
      </Link>
    </main>
  );
}
