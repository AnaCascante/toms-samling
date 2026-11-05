import { createClient } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";

const client = createClient({
  projectId: "id7kivhl",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const {
    _id,
    title,
    studio,
    year,
    genre,
    format,
    condition,
    language,
    duration,
    coverUrl,
    notes,
    mainActors,
    rating,
  } = data;

  await client
    .patch(_id)
    .set({
      title,
      studio,
      year,
      genre,
      format,
      condition,
      language,
      duration,
      coverUrl,
      notes,
      mainActors,
      rating,
    })
    .commit();

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await client.delete(id);
  return NextResponse.json({ success: true });
}
