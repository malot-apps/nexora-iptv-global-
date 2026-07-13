# 🎨 Coding Standards & Directory Architecture

This document contains style rules, code guidelines, directory architectures, and specific instructions for both human contributors and AI coding agents working on **Nexora IPTV Global**.

---

## 💻 1. General Coding Standards

All TypeScript and React files must align with standard modern conventions to ensure extreme readability and long-term maintainability.

### Type Safety (TypeScript)
- **Strict Checks**: Write code compatible with strict TypeScript parameters. Avoid using the fallback type `any`. If a value's structure is truly variable, prefer `unknown` paired with type guards.
- **Named Imports**: Do not destruct default imports or wildcard modules. Always use named imports placed strictly at the top of files.
  ```typescript
  // ❌ Avoid
  import * as React from 'react';
  const { useState } = React;

  // ✅ Preferred
  import React, { useState } from 'react';
  ```
- **Enum Declarations**: Use standard `enum` definitions. Do not use `const enum`. Never use `import type` to import enum values.
  ```typescript
  // ✅ Preferred Standard Enum
  export enum StreamStatus {
    ONLINE = "online",
    OFFLINE = "offline",
    CHECKING = "checking"
  }
  ```

### Functional Component Conventions
- **Functional First**: Write components as Functional Components with hooks. Class components are strictly prohibited unless dealing with archaic library wrappers.
- **`useEffect` Safety**: Never update state directly in the body of a React component as it triggers infinite re-renders. Keep dependency arrays primitive (strings, numbers, booleans) or stabilized with `useMemo`/`useCallback`.
- **HTML Element IDs**: Every meaningful interactive component, button, dialog, modal, input, or card must include a unique, semantic `id` attribute. Do not add `id` elements to basic layout wrappers (like `<div>` or `<span>`).
  ```tsx
  // ✅ Good id usage
  <button id="player-theater-mode-toggle" onClick={toggleTheater}>
    <Expand className="h-4 w-4" />
  </button>
  ```

---

## 📁 2. Directory & Folder Rules

The folder structure organizes files by strict functional separation:

```
├── .github/                # GitHub-specific workflows, issue templates, and config
├── app/                    # Next.js App Router root
│   ├── api/                # Serverless route handlers (Proxies, stream fetches)
│   ├── globals.css         # Tailwind directives and core variables
│   ├── layout.tsx          # Main html frame and typography injections
│   └── page.tsx            # Central dashboard page assembler
├── components/             # Reusable UI component modules
│   ├── ui/                 # Atomic UI primitives (buttons, modals, sliders)
│   ├── DashboardView.tsx   # Bento grid, filter rails, channel matrices
│   ├── Sidebar.tsx         # Console side-navigation drawer
│   └── VideoPlayer.tsx     # Custom HLS media container
├── docs/                   # Full documentation hub
├── lib/                    # Core utilities, context handlers, and parsers
│   ├── context.tsx         # Global state provider
│   ├── iptv-parser.ts      # Fast Regex-based M3U aggregator
│   └── theme-helper.ts     # Multi-theme styling class converters
└── public/                 # Static vector assets, logos, and badges
```

### Folder Navigation Rules
- **No Path Blending**: Never incorporate descriptive inline natural words within path parameters (e.g., avoid writing paths like `/components/some file`).
- **Workspace Root**: The root directory is `.`. Never use absolute container paths starting with `/` (e.g., `/app/applet/somefile`) to refer to files inside your project directory unless specifying Next.js API routing. Refer to workspace folders using relative paths (`./components/Sidebar.tsx` or `@/components/Sidebar.tsx` alias configurations).

---

## 🤖 3. AI Agent Development Rules

Nexora leverages advanced AI coding assistance. If you are an AI assistant (such as Google AI Studio agent, Cursor, or Copilot) editing this repository, you must adhere to these directives:

### 1. The Strict Scope Principle
- **Do NOT Over-Engineer**: Implement *exactly* what was requested. Avoid adding unrequested features, side-menus, dashboards, custom analytics tools, or telemetry loops.
- **Anti-AI-Slop Directive**: Keep our margins, status bars, and headers clean. Never clutter the UI with diagnostic terminal logs, container port markers, ping responses, or descriptive system metadata unless the user explicitly requested them. Use clean, human-friendly labels.

### 2. Read-Before-Write Mandate
- **Always View Existing Files**: Before calling an editing tool on an existing file, you must first call `view_file` to understand its full contents. Do not assume or guess the code based on frameworks or common conventions.
- **Verify Lines in Real-Time**: If multiple steps have elapsed since you last read a target file, you must re-read the lines you intend to replace right before issuing the edit to prevent "target content not found" errors due to stale cache files.

### 3. Native File Tools First
- Prefer native file viewer and listing tools over executing raw system terminal commands (such as `cat`, `ls`, or `grep`) unless specialized capabilities are required. If you run a grep command, exclude generated directories (`node_modules`, `.next`, `dist`) to keep lookups performant.
