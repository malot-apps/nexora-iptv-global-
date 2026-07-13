# Nexora IPTV Global Project Roadmap

This document outlines the multi-phase engineering and design roadmap for **Nexora IPTV Global**. Our milestones focus on boosting stream decoding performance, introducing automated scheduling hubs, and securing cross-device playlist syncing.

---

## 📍 Phase 1: Core Parsing & Player Foundation (Completed)
- [x] Create high-performance Extended M3U / M3U8 string parser using efficient regex tokens.
- [x] Configure adaptive bitrate streaming player powered by modern `hls.js`.
- [x] Add dynamic playlist management supporting local uploads and online proxy-fetches.
- [x] Build sleek responsive Sidebar drawer and Bento-Grid dashboard.
- [x] Integrate global search and category-level indexing.

---

## 📍 Phase 2: FIFA World Cup 2026 & Diagnostics (Completed)
- [x] Program dedicated World Cup/FIFA Match Center channel filter matrices.
- [x] Create stream latency validation benchmarks directly on the dashboard cards.
- [x] Implement lightweight Client-Side Local Storage cache state management.
- [x] Design Help Desk overlays, keyboard shortcuts, and About modals.
- [x] Package comprehensive development, workflow, architecture, and security document pipelines.

---

## 📍 Phase 3: Advanced APIs & Custom Sync (Q3 - Q4 2026)
- [ ] **Xtream Codes Parser Integration**: Add login flows supporting host, username, password authentication for standard IPTV servers.
- [ ] **EPG (Electronic Program Guide) Support**: Parse XMLTV schemas to show current, preceding, and upcoming show cards.
- [ ] **Parallel Latency Health Probe**: Background workers to run multi-threaded ping checks on all imported streams to mark dead links.
- [ ] **Audio/Subtitle Track Selector**: Dynamic menu inside the Cinematic Player to select different audio languages or closed captions.

---

## 📍 Phase 4: Multi-Screen & Cast Integrations (Q1 - Q2 2027)
- [ ] **Nexora Quad-View Grid**: Watch up to 4 live sports matches simultaneously inside an adjustable quad-frame layout.
- [ ] **Chromecast & AirPlay Proxies**: Direct streaming handoffs from your local browser window to big-screen smart televisions.
- [ ] **Remote Database Persistence**: Add serverless SQL/Firestore options to synchronize favorite channels and playlists across multiple consumer tablets and desktops.
- [ ] **Personalized Smart Recommendations**: An AI-powered suggestion list matching streams based on your historic categories and daily times.
