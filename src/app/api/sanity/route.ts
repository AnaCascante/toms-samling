import { createClient } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

// Use the same project/dataset as existing read routes to avoid env drift.
const projectId = "id7kivhl";
const dataset = "production";
const rawToken = process.env.SANITY_WRITE_TOKEN;
const token = rawToken?.trim().replace(/^['\"]|['\"]$/g, "");

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const allowedFieldsByType: Record<"movie" | "vinyl", string[]> = {
  movie: [
    "title",
    "studio",
    "year",
    "genre",
    "format",
    "condition",
    "language",
    "duration",
    "rating",
    "price",
    "notes",
    "coverUrl",
    "mainActors",
  ],
  vinyl: [
    "title",
    "artist",
    "year",
    "genre",
    "condition",
    "label",
    "price",
    "notes",
    "coverUrl",
  ],
};

function sanitizePayload(
  type: "movie" | "vinyl",
  input: Record<string, unknown>,
) {
  const allowed = new Set(allowedFieldsByType[type]);
  const output: Record<string, string> = {};

  for (const [key, raw] of Object.entries(input)) {
    if (!allowed.has(key)) continue;
    if (typeof raw !== "string") continue;

    const value = raw.trim();
    if (!value) continue;

    output[key] = value;
  }

  if (output.coverUrl) {
    try {
      // Sanity url fields must be valid absolute URLs.
      new URL(output.coverUrl);
    } catch {
      delete output.coverUrl;
    }
  }

  return output;
}

function sanitizePayloadLoose(input: Record<string, unknown>) {
  const mergedAllowed = new Set([
    ...allowedFieldsByType.movie,
    ...allowedFieldsByType.vinyl,
  ]);
  const output: Record<string, string> = {};

  for (const [key, raw] of Object.entries(input)) {
    if (!mergedAllowed.has(key)) continue;
    if (typeof raw !== "string") continue;

    const value = raw.trim();
    if (!value) continue;

    output[key] = value;
  }

  if (output.coverUrl) {
    try {
      new URL(output.coverUrl);
    } catch {
      delete output.coverUrl;
    }
  }

  return output;
}

function hasServerConfig() {
  return Boolean(token);
}

function tokenFingerprint(value?: string) {
  if (!value) return "missing";
  return createHash("sha256").update(value).digest("hex").slice(0, 10);
}

async function getTokenProjectIds(value?: string) {
  if (!value) return "missing-token";

  try {
    const res = await fetch("https://api.sanity.io/v2021-06-07/projects", {
      headers: { Authorization: `Bearer ${value}` },
      cache: "no-store",
    });

    if (!res.ok) return `projects-api-${res.status}`;

    const json = (await res.json()) as { projects?: Array<{ id?: string }> };
    const ids = (json.projects || [])
      .map((p) => p.id)
      .filter((id): id is string => Boolean(id));

    return ids.length ? ids.join(",") : "none";
  } catch {
    return "projects-api-failed";
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!hasServerConfig()) {
      return NextResponse.json(
        { error: "Server config missing: Sanity env vars are not set" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as Record<string, unknown>;
    const type = body._type;

    if (type !== "movie" && type !== "vinyl") {
      return NextResponse.json(
        { error: "Invalid document type" },
        { status: 400 },
      );
    }

    const data = sanitizePayload(type, body);
    if (!data.title) {
      return NextResponse.json({ error: "Tittel er påkrevd" }, { status: 400 });
    }

    const result = await writeClient.create({ _type: type, ...data });
    return NextResponse.json(result);
  } catch (err: any) {
    const message = err?.message || "Failed to create";
    const isHostMismatch =
      typeof message === "string" &&
      message.toLowerCase().includes("session does not match project host");

    console.error("SANITY ERROR:", message, err.statusCode, err.response?.body);

    if (isHostMismatch) {
      const tokenProjects = await getTokenProjectIds(token);

      return NextResponse.json(
        {
          error:
            "Sanity token mismatch: SANITY_WRITE_TOKEN belongs to a different Sanity project than " +
            `${projectId}.${dataset}. Please update token/env in Vercel and redeploy. ` +
            `Debug: tokenFingerprint=${tokenFingerprint(token)}, projectIdSource=fixed, datasetSource=fixed, tokenProjects=${tokenProjects}.`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!hasServerConfig()) {
      return NextResponse.json(
        { error: "Server config missing: Sanity env vars are not set" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as Record<string, unknown>;
    const _id = typeof body._id === "string" ? body._id : "";
    const type = body._type;

    if (!_id) {
      return NextResponse.json(
        { error: "Missing document id" },
        { status: 400 },
      );
    }

    const data =
      type === "movie" || type === "vinyl"
        ? sanitizePayload(type, body)
        : sanitizePayloadLoose(body);
    const result = await writeClient.patch(_id).set(data).commit();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await writeClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
