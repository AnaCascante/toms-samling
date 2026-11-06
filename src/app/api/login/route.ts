import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (
    username === process.env.AUTH_USERNAME &&
    password === process.env.AUTH_PASSWORD
  ) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
