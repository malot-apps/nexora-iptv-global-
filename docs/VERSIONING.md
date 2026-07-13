# Versioning Policy

Nexora IPTV Global strictly adheres to **Semantic Versioning 2.0.0 (SemVer)**. This ensures that third-party developers, stream managers, and fork administrators can anticipate changes without library disruptions.

---

## 🔢 SemVer Structure

Every release is represented by a version tag: **`MAJOR.MINOR.PATCH`**

```
v2.4.0
 │ │ └─ PATCH: Backwards-compatible bug fixes or minor player tweaks.
 │ └─── MINOR: New backward-compatible features (e.g., FIFA tournament hubs).
 └───── MAJOR: Breaking architectural changes or total UI restructurings.
```

---

## 🛠️ When to Increment

### 1. PATCH (`X.Y.Z` ──> `X.Y.Z+1`)
Increment the patch version for backwards-compatible bug fixes and security hotfixes.
- Examples:
  - Fixing stream timeouts in the HLS player.
  - Correcting alignment on a responsive Sidebar drawer button.
  - Standardizing a TypeScript interface to resolve build compile warnings.

### 2. MINOR (`X.Y.0` ──> `X.Y+1.0`)
Increment the minor version when adding new backward-compatible features.
- Examples:
  - Adding support for Xtream Codes parser configurations.
  - Adding keybind shortcuts to the player screen (Space for pause, F for full-screen).
  - Introducing automated latency validation gauges on the dashboard bento cards.

### 3. MAJOR (`X.0.0` ──> `X+1.0.0`)
Increment the major version when introducing breaking structural or routing changes.
- Examples:
  - Migrating the database persistence layers (e.g., swapping LocalStorage with an SQL/Firestore cluster).
  - Modifying the underlying player from custom `hls.js` wraps to a separate multi-platform framework.
  - Re-routing root application views.

---

## 🏷️ Pre-release Identifiers

During active development cycles, we tag release candidates using hyphen suffixes:
- **Alpha**: `v2.5.0-alpha.1` (Internal core feature testing)
- **Beta**: `v2.5.0-beta.2` (Community-ready beta test streams)
- **Release Candidate**: `v2.5.0-rc.1` (Final stable testing pipeline)
