import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const type = searchParams.get("type") || "movie"; // "movie" or "vinyl"

  if (!query) {
    return NextResponse.json({ error: "No query" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=nb-NO`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );
    const data = await res.json();
    const movie = data.results?.[0];

    if (movie?.poster_path) {
      return NextResponse.json({
        coverUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        year: movie.release_date?.split("-")[0] || "",
      });
    }

    return NextResponse.json({ coverUrl: null });
  } catch {
    return NextResponse.json({ error: "TMDB fetch failed" }, { status: 500 });
  }
}
