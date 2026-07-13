# 📺 Nexora IPTV Global

<p align="center">
  <img src="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80" alt="Nexora IPTV Global Header Banner" width="100%" style="border-radius: 12px; margin-bottom: 24px;" />
</p>

<p align="center">
  <a href="#features"><b>Features</b></a> •
  <a href="#tech-stack"><b>Tech Stack</b></a> •
  <a href="#installation"><b>Installation</b></a> •
  <a href="#playlist-support"><b>Playlist Support</b></a> •
  <a href="#fifa-match-center"><b>FIFA Match Center</b></a> •
  <a href="#roadmap"><b>Roadmap</b></a> •
  <a href="#license"><b>License</b></a>
</p>

---

## 🚀 Welcome to Nexora IPTV Global

**Nexora IPTV Global** is a premium, next-generation, high-fidelity IPTV stream aggregator, playlist parser, and cinematic video player. Designed with a gorgeous modern slate-colored responsive interface, Nexora delivers seamless integration for streaming Live TV, sports tournaments, cinema, news, and world broadcasts with ultra-low latency. 

Whether you import custom M3U playlist URLs, upload local M3U files, or utilize Nexora's automated smart playlist aggregation engine, the system parses, labels, validates, and indexes your streams instantly.

---

## ✨ Features

- **🌐 Smart Playlist Aggregation Engine**: Dynamic, automated fetching and parallel processing of multiple M3U feeds. Includes smart recovery so that a single corrupted feed never disrupts your library.
- **⚡ Cinematic Player Hub**: High-fidelity, custom-styled media player built on `hls.js` supporting adaptive streaming, live playback controls, volume caching, theater ratios, and live connection status indicators.
- **🏆 FIFA World Cup 2026 Hub**: Real-time channel filters and dynamic event discovery for international broadcasts, dedicated sports streams, and live tournament matches.
- **📁 Dynamic Categories & Parsing**: Automatically extracts metadata (`tvg-id`, `tvg-name`, `tvg-logo`, `group-title`) and dynamically groups channels into high-fidelity categories (e.g., *Cinema & Animation*, *Sports & Adventure*, *News & Documentaries*).
- **❤️ Favorites & Custom Watch History**: Secure, lightweight local-storage persistence engine to maintain your favorite list, history logs, and last watched video position.
- **🎨 Interactive Slate Interface**: A fluid, responsive side menu, bento-grid dashboards, custom help/about overlays, and smooth transition animations powered by `motion/react` and Tailwind CSS.
- **🛠️ Self-Healing Diagnostics**: Integrated latency testing, status verification checkers, and dynamic recovery scripts for broken streams.

---

## 📱 Screenshots

| Home Dashboard View | Cinematic Stream Player |
|---|---|
| <img src="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80" alt="Dashboard" width="100%" style="border-radius: 8px;" /> | <img src="https://images.unsplash.com/photo-1542204172-e7052809a86e?auto=format&fit=crop&w=600&q=80" alt="Video Player" width="100%" style="border-radius: 8px;" /> |

---

## 🛠️ Tech Stack

Nexora is built using modern, highly robust technologies ensuring high performance and developer friendliness:

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router & React Server Components)
- **Runtime**: [Node.js 22](https://nodejs.org/)
- **Frontend Core**: [React 19](https://react.dev/)
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **HLS Streaming Engine**: [hls.js](https://github.com/video-dev/hls.js/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing Framework**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)

---

## 📦 Installation

To get a local instance of Nexora up and running, follow these simple steps:

### Prerequisites
- Node.js version **22.x** or higher
- npm version **10.x** or higher

### Step-by-Step Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/nexora-iptv/nexora-iptv-global.git
   cd nexora-iptv-global
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and define any custom environments (if needed):
   ```bash
   cp .env.example .env
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to explore the dashboard.

5. **Run Linting & Tests**
   ```bash
   # Run ES Linting
   npm run lint

   # Run Jest Unit Tests
   npm run test
   ```

---

## 🔧 Playlist Support

Nexora IPTV Global fully supports the Extended M3U and M3U8 specifications. It extracts the following attributes from the `#EXTINF` record:

```ini
#EXTINF:-1 tvg-id="espn-hd" tvg-name="ESPN HD" tvg-logo="https://example.com/logos/espn.png" group-title="Sports",ESPN Live Stream
http://example.com/live/espn.m3u8
```

- **`tvg-id`**: Unique channel identifier.
- **`tvg-logo`**: Channel icon/logo. Remote URLs are proxy-rendered cleanly.
- **`group-title`**: Automated category grouping (e.g., Sports, News, Movies).
- **`tvg-name` / Display Name**: Parsed name of the broadcast channel.

---

## 🏆 FIFA Match Center

Nexora features a built-in **FIFA World Cup 2026** filter inside the side menu console.
- **Auto-Discovery**: The system automatically indexes imported channels matching keywords like `FIFA`, `World Cup`, `Copa del Mundo`, and `Match Day`.
- **Match Alerts**: Quick status indicators highlight which FIFA broadcast channels are currently active and running.

---

## 📂 Folder Structure

```
├── .github/                # GitHub configurations & templates
│   ├── ISSUE_TEMPLATE/     # Standard bug report & feature templates
│   └── CODEOWNERS          # Code owners definition
├── app/                    # Next.js App Router core
│   ├── api/                # Backend Serverless routes (Playlist proxy/fetching)
│   ├── globals.css         # Tailwind & global stylesheet
│   └── page.tsx            # Main application root assembler
├── components/             # Reusable UI component modules
│   ├── DashboardView.tsx   # Dashboard bento-grid & stream catalog
│   ├── Sidebar.tsx         # Responsive left Drawer Navigation console
│   ├── VideoPlayer.tsx     # Custom HLS.js streaming console
│   └── ...
├── docs/                   # Full project documentation hub
│   ├── ARCHITECTURE.md     # System architecture & data flow
│   ├── DEVELOPMENT.md      # Development guides & standards
│   └── ROADMAP.md          # Multi-phase engineering timeline
├── lib/                    # Shared hooks, context and parsing engines
│   ├── context.tsx         # Global Application state & index engine
│   └── iptv-parser.ts      # Fast, regular-expression M3U parsing engine
└── package.json            # NPM scripts & package dependencies
```

---

## 🚀 Deployment

Nexora is fully compatible with production builds and standard container environments.

### Build and Compile
```bash
npm run build
```
This produces a fully compiled, highly optimized Next.js static asset build inside the `.next/` directory.

### Production Start
```bash
npm run start
```
By default, the production server binds to port `3000`.

---

## 🗺️ Roadmap

- [x] High-performance M3U dynamic stream parser
- [x] Custom HLS stream player integration with latency metrics
- [x] Automated parallel playlist fetch APIs
- [x] Responsive left Drawer/Sidebar navigation console
- [ ] Xtream Codes API integration support
- [ ] User authentication with persistent remote favorites
- [ ] Multi-screen video grid layout (watch 4 matches at once)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<p align="center">Made with ❤️ by the Nexora IPTV Global Open Source Team</p>
