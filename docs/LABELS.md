# GitHub Label Documentation

To maintain a clean and highly organized issue tracker and pull request pipeline, Nexora IPTV Global uses a standardized set of labels. This document guides maintainers on how to apply labels correctly.

---

## 🎨 Label Categories

### 1. Issue Types
These labels define the nature of the issue or feedback being reported.

| Label | Color | Description |
| --- | --- | --- |
| `type: bug` | `#D93F0B` | Something is broken or behaving unexpectedly. |
| `type: feature` | `#0E8A16` | Request for a new feature, page, or player capability. |
| `type: enhancement` | `#1D76DB` | Visual refinements, minor utility updates, or performance gains. |
| `type: security` | `#B60205` | Vulnerability reports, dependency warnings, or authorization issues. |
| `type: documentation` | `#0075CA` | Updates or creations under `/docs` or the main README. |

### 2. Stream & Playlist Flags
Specific to IPTV playlist handling and live player capabilities.

| Label | Color | Description |
| --- | --- | --- |
| `stream: parsing` | `#C2E0C6` | Relating to M3U / M3U8 regex parsing or metadata indexing. |
| `stream: player` | `#F9D0C4` | Relating to HLS video stream decoding, volume caching, or full-screen modes. |
| `stream: fifa` | `#6BE2FA` | Issues or features specific to the FIFA World Cup match centers. |

### 3. Status Flags
These labels track where an issue stands in the active triage flow.

| Label | Color | Description |
| --- | --- | --- |
| `status: triaged` | `#FEF2C0` | Reviewed by a core team member and approved for development. |
| `status: in-progress` | `#FBCA04` | Currently being actively worked on by a contributor. |
| `status: blocked` | `#E11D21` | Blocked by an upstream library issue or requiring design clarifications. |
| `status: duplicate` | `#CFD3D7` | This issue was already reported elsewhere. |

### 4. Experience Levels
Helps onboard new contributors to the Nexora open-source stream.

| Label | Color | Description |
| --- | --- | --- |
| `good first issue` | `#7057ff` | Excellent entry-level task for first-time open source contributors. |
| `help wanted` | `#0052cc` | Complex issue seeking guidance or specialized engineering input. |
