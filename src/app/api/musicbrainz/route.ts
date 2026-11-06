import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const artist = searchParams.get("artist") || "";
  const title = searchParams.get("title") || "";

  if (!title) {
    return NextResponse.json({ error: "No title" }, { status: 400 });
  }

  try {
    // Search for the release on MusicBrainz
    const query = artist
      ? `release:"${title}" AND artist:"${artist}"`
      : `release:"${title}"`;

    const mbRes = await fetch(
      `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&limit=1&fmt=json`,
      {
        headers: {
          "User-Agent": "TomsSamling/1.0 (toms-samling.vercel.app)",
        },
      },
    );
    const mbData = await mbRes.json();
    const release = mbData.releases?.[0];

    if (!release?.id) {
      return NextResponse.json({ coverUrl: null });
    }

    // Get cover art from Cover Art Archive
    const coverRes = await fetch(
      `https://coverartarchive.org/release/${release.id}`,
      { redirect: "follow" },
    );

    if (coverRes.ok) {
      const coverData = await coverRes.json();
      const front = coverData.images?.find(
        (img: { front: boolean }) => img.front,
      );
      const coverUrl =
        front?.thumbnails?.large ||
        front?.image ||
        coverData.images?.[0]?.image;

      return NextResponse.json({
        coverUrl: coverUrl || null,
        year: release.date?.split("-")[0] || "",
      });
    }

    return NextResponse.json({ coverUrl: null });
  } catch {
    return NextResponse.json(
      { error: "MusicBrainz fetch failed" },
      { status: 500 },
    );
  }
}
