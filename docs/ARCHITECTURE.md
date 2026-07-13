# System Architecture Documentation

This document explains the software architecture, data modeling, rendering pipeline, and file parser strategies behind **Nexora IPTV Global**.

---

## 🏗️ High-Level System Architecture

Nexora IPTV Global is designed as a modular, lightweight, high-performance client-side application utilizing Next.js Server Components for initial shell renders and responsive Client Components for real-time video playback and playlist manipulation.

```
                  ┌────────────────────────────────────────┐
                  │            Nexora Client UI            │
                  │  (React 19 / Tailwind / Motion)        │
                  └───────────┬────────────────┬───────────┘
                              │                │
       User Uploads M3U /     │                │ Plays Stream 
       Enters Remote link     │                │ via HLS.js
                              ▼                ▼
                  ┌───────────────────┐  ┌───────────────────┐
                  │  Playlist Parser  │  │  Cinematic Player │
                  │  (Regex Engine)   │  │  (HLS Decoding)   │
                  └───────────┬───────┘  └───────────────────┘
                              │
                    Caches parsed channels
                    and playlists locally
                              ▼
                  ┌───────────────────┐
                  │    Local State    │
                  │   (LocalStorage)  │
                  └───────────────────┘
```

---

## 🔌 Core Modules

### 1. Playlist Parsing Engine (`/lib/iptv-parser.ts`)
The parsing module translates raw Extended M3U and M3U8 string data into structured, typified JSON objects. It utilizes highly optimized regular expressions to extract attributes from `#EXTINF` entries in a single pass.

* **Parsed Interface**:
  ```typescript
  export interface IPTVChannel {
    id: string;         // Unique MD5 or base64 stream URL hash
    name: string;       // Display name of the channel
    url: string;        // Target stream resource link (m3u8, mp4, etc.)
    logo?: string;      // Optional channel icon URL
    category?: string;  // Group title (News, Cinema, Sports, etc.)
    status: "online" | "offline" | "checking";
    latency?: number;   // Response speed in milliseconds
  }
  ```

### 2. Global State Context Provider (`/lib/context.tsx`)
A custom React Context (`AppProvider`) orchestrates application state across views. It reads cached configurations from `localStorage` on mounting, indices channels, and maintains lists for:
- Playlists (active and imported)
- Channels (filtered and loaded)
- User Favorites
- Recently Watched Channels (History logs)
- System Preferences (Themes, player preferences)

### 3. Custom HLS Streaming Wrapper (`/components/VideoPlayer.tsx`)
The media engine wraps a standard HTML5 `<video>` tag with `hls.js`. 
- **CORS handling**: Configured with custom referrers and request headers.
- **Diagnostics**: Monitors buffer status, level drops, and decodes frame speed in real-time to render diagnostic charts.

---

## 🔀 Key Data Flow

### Loading an M3U Playlist:
1. **Trigger**: User inputs a remote M3U URL or drags and drops a local M3U file.
2. **Download (for URL)**: If remote, the app issues a request via an API proxy path (`/api/playlist`) to avoid CORS blocks.
3. **Parsing**: The parser splits the feed line-by-line, matching key-value pairs (`tvg-id`, `tvg-logo`, `group-title`) via regular expressions.
4. **State Dispatch**: The state manager merges the new channel collection into the active global array and saves the updated manifest to the local cache.
5. **UI Update**: Category lists refresh, and the bento-grid updates to display the new channel cards.
