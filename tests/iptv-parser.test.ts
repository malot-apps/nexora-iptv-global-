import { parseM3U } from "../lib/iptv-parser";

describe("Nexora IPTV M3U Playlist Parser", () => {
  it("should successfully parse standard M3U playlists with channel metadata", () => {
    const mockM3U = `#EXTM3U
#EXTINF:-1 tvg-id="nasa" tvg-name="NASA TV" tvg-logo="https://nasa.gov/logo.png" group-title="Science",NASA TV HD Live
https://nasa-stream.nasa.gov/live.m3u8
#EXTINF:-1 tvg-logo="https://movie.com/sintel.png" group-title="Cinema",Sintel Cinema Stream
https://bitdash.com/sintel.m3u8`;

    const channels = parseM3U(mockM3U, "test-playlist");

    expect(channels).toHaveLength(2);
    
    // Validate Channel 1
    expect(channels[0].name).toBe("NASA TV HD Live");
    expect(channels[0].logo).toBe("https://nasa.gov/logo.png");
    expect(channels[0].category).toBe("Science");
    expect(channels[0].tvgId).toBe("nasa");
    expect(channels[0].tvgName).toBe("NASA TV");
    expect(channels[0].url).toBe("https://nasa-stream.nasa.gov/live.m3u8");
    expect(channels[0].playlistId).toBe("test-playlist");

    // Validate Channel 2
    expect(channels[1].name).toBe("Sintel Cinema Stream");
    expect(channels[1].logo).toBe("https://movie.com/sintel.png");
    expect(channels[1].category).toBe("Cinema");
    expect(channels[1].url).toBe("https://bitdash.com/sintel.m3u8");
  });

  it("should supply fallback parameters when tags are missing", () => {
    const mockMinimalM3U = `#EXTM3U
#EXTINF:-1,Generic News Channel
http://news.com/stream.m3u8`;

    const channels = parseM3U(mockMinimalM3U, "minimal-playlist");

    expect(channels).toHaveLength(1);
    expect(channels[0].name).toBe("Generic News Channel");
    expect(channels[0].category).toBe("General / Imported");
    expect(channels[0].logo).toContain("picsum.photos");
    expect(channels[0].url).toBe("http://news.com/stream.m3u8");
  });

  it("should return an empty array for empty or invalid playlists", () => {
    const invalidM3U = `Hello World this is not a playlist`;
    const channels = parseM3U(invalidM3U, "invalid-playlist");
    expect(channels).toHaveLength(0);
  });
});
