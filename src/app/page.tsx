import Link from "next/link";

async function getCounts() {
  try {
    const [moviesRes, vinylRes] = await Promise.all([
      fetch(
        "https://id7kivhl.api.sanity.io/v2024-01-01/data/query/production?query=count(*[_type==%22movie%22])",
        { cache: "no-store" },
      ),
      fetch(
        "https://id7kivhl.api.sanity.io/v2024-01-01/data/query/production?query=count(*[_type==%22vinyl%22])",
        { cache: "no-store" },
      ),
    ]);
    const moviesData = await moviesRes.json();
    const vinylData = await vinylRes.json();
    return {
      movieCount: moviesData.result || 0,
      vinylCount: vinylData.result || 0,
    };
  } catch {
    return { vinylCount: 0, movieCount: 0 };
  }
}

export default async function HomePage() {
  const { vinylCount, movieCount } = await getCounts();

  return (
    <div>
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://eu.chat-img.sintra.ai/0c9b552b-9543-4cbb-83ed-be831c9efd3d/10471f91-a023-4723-8d4e-b171cbe5bcea/image.png?w=1344&h=768"
            alt="Vinyl og film samling"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/70 via-[#0d0d0d]/50 to-[#0d0d0d]" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#d4a04a]/10 border border-[#d4a04a]/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#d4a04a] text-sm font-medium">
              🎵 Vinyl & Film
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            Toms <span className="text-[#d4a04a]">Samling</span>
          </h1>
          <p className="text-[#a89f91] text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            En personlig database for vinyl-plater og filmer. Registrer,
            organiser og utforsk hele kolleksjonen.
          </p>
          <Link
            href="/registrer"
            className="bg-[#d4a04a] hover:bg-[#e8b85c] text-[#0d0d0d] font-semibold px-8 py-3.5 rounded-full transition-all hover:scale-105 text-sm uppercase tracking-wider"
          >
            + Registrer ny
          </Link>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/vinyl"
            className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 text-center hover:border-[#d4a04a]/40 transition-all hover:scale-[1.02] group"
          >
            <div className="text-4xl mb-3">🎵</div>
            <div className="text-3xl font-bold text-[#d4a04a] mb-1">
              {vinylCount}
            </div>
            <div className="text-[#a89f91] text-sm uppercase tracking-wider">
              Vinyl-plater
            </div>
            <div className="text-[#6b6358] text-xs mt-2 group-hover:text-[#d4a04a] transition-colors">
              Se samlingen →
            </div>
          </Link>
          <Link
            href="/filmer"
            className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 text-center hover:border-[#d4a04a]/40 transition-all hover:scale-[1.02] group"
          >
            <div className="text-4xl mb-3">🎬</div>
            <div className="text-3xl font-bold text-[#d4a04a] mb-1">
              {movieCount}
            </div>
            <div className="text-[#a89f91] text-sm uppercase tracking-wider">
              Filmer
            </div>
            <div className="text-[#6b6358] text-xs mt-2 group-hover:text-[#d4a04a] transition-colors">
              Se samlingen →
            </div>
          </Link>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#1a1a1a]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Slik fungerer det
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                n: "1",
                title: "Registrer",
                desc: "Legg til vinyl-plater og filmer. Cover-bilder hentes automatisk.",
              },
              {
                n: "2",
                title: "Organiser",
                desc: "Filtrer etter sjanger, artist, filmselskap, år og mer.",
              },
              {
                n: "3",
                title: "Utforsk",
                desc: "Søk og bla gjennom hele samlingen med cover-bilder.",
              },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#d4a04a]/10 border border-[#d4a04a]/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#d4a04a] text-xl font-bold">
                    {step.n}
                  </span>
                </div>
                <h3 className="font-semibold mb-2 text-lg">{step.title}</h3>
                <p className="text-[#a89f91] text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Klar til å starte?</h2>
          <p className="text-[#a89f91] mb-8">
            Begynn å registrere Toms samling i dag.
          </p>
          <Link
            href="/registrer"
            className="inline-block bg-[#d4a04a] hover:bg-[#e8b85c] text-[#0d0d0d] font-semibold px-10 py-4 rounded-full transition-all hover:scale-105 text-sm uppercase tracking-wider"
          >
            Legg til element
          </Link>
        </div>
      </section>
    </div>
  );
}
