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
    artist,
    year,
    genre,
    format,
    condition,
    price,
    notes,
    coverUrl,
  } = data;

  await client
    .patch(_id)
    .set({
      title,
      artist,
      year,
      genre,
      format,
      condition,
      price,
      notes,
      coverUrl,
    })
    .commit();

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await client.delete(id);
  return NextResponse.json({ success: true });
}
