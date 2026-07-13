import { NextRequest, NextResponse } from "next/server";
import { parseM3U } from "@/lib/iptv-parser";

export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json();

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ error: "Invalid or missing URLs array" }, { status: 400 });
    }

    const allChannels: any[] = [];

    // Fetch and parse each URL in parallel, but handle failures individually so one bad URL doesn't crash the engine
    await Promise.all(
      urls.map(async (url) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout per playlist

          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            console.warn(`Failed to fetch automated playlist: ${url}. Status: ${response.status}`);
            return;
          }

          const content = await response.text();
          // Use "automated" as the parent playlist ID so parsed channels are tagged with it
          const parsed = parseM3U(content, "automated");
          allChannels.push(...parsed);
        } catch (err: any) {
          console.warn(`Error processing playlist URL: ${url}`, err.message || err);
        }
      })
    );

    return NextResponse.json({ channels: allChannels });
  } catch (err: any) {
    console.error("Automated playlist fetch error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
