import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing or invalid URL" }, { status: 400 });
    }

    // Use AbortController for a 3-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      // Perform a lightweight HEAD or GET request to check stream validity.
      // Many stream URLs don't support HEAD or require specific User-Agents, so we do a standard GET but handle it carefully.
      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      clearTimeout(timeoutId);

      // A status of < 400 typically means the stream endpoint is active and serving content.
      if (response.ok || response.status < 400) {
        return NextResponse.json({ live: true, status: response.status });
      } else {
        return NextResponse.json({ live: false, status: response.status, statusText: response.statusText });
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      // If aborted or connection failed, the stream is offline/unreachable
      return NextResponse.json({ 
        live: false, 
        error: fetchError?.message || "Connection failed or timed out" 
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
