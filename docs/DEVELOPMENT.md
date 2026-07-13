# Development Guide

This guide is designed for developers who wish to modify, debug, or extend the core functionalities of **Nexora IPTV Global**.

---

## 🛠️ Environment Configuration

Nexora utilizes **Next.js 15+ (App Router)** with **TypeScript** and **Tailwind CSS v4**.

### System Requirements
- **Node.js**: `v22.x` or higher (Long-Term Support)
- **NPM**: `v10.x` or higher
- **Core Engine**: Standard modern web browser with HLS decoding support or a WebGL/MediaSource API-capable engine.

---

## 💻 Code Style & Standards

To ensure a highly maintainable and clean repository structure, strictly adhere to the following standards:

### 1. TypeScript & Type Safety
- **Strict Mode**: Ensure `strict` checks are active in `tsconfig.json`.
- **Imports**: All `import` statements must be declared at the top-level. Use named imports exclusively.
  ```typescript
  // ❌ Avoid
  import * as React from 'react';
  
  // ✅ Preferred
  import React, { useState, useEffect } from 'react';
  ```
- **Type Casting**: Avoid using `as any` type casting. Implement explicit interfaces and schemas.

### 2. Styling Guide
- Style components exclusively using **Tailwind CSS v4** utility classes inside the files.
- Avoid using custom inline `style={...}` objects or raw `.css` stylesheets unless rendering highly specific dynamic calculations (like absolute position percentages in the video player track).
- Ensure high color contrast between elements to meet WCAG AA requirements.

### 3. Icons & Assets
- Use icons imported from the `lucide-react` library.
- Custom vector representations must use Lucide equivalents to keep the visual design cohesive.

---

## 🧪 Testing

We use **Jest** and **React Testing Library** to verify IPTV parsers and UI state managers.

### Run All Unit Tests
```bash
npm run test
```

### Writing a Test Case
Place test files inside the `/tests/` directory matching the suffix `.test.ts` or `.test.tsx`.

Example:
```typescript
import { parseM3U } from "../lib/iptv-parser";

describe("IPTV Parser Engine", () => {
  it("should extract stream channels correctly from M3U string", () => {
    const mockM3U = `#EXTM3U\n#EXTINF:-1,Test Channel\nhttp://stream.m3u8`;
    const channels = parseM3U(mockM3U);
    expect(channels.length).toBe(1);
    expect(channels[0].name).toBe("Test Channel");
  });
});
```

---

## 🧹 Code Quality Checking

Always run code validation routines before submitting updates:

```bash
# Execute ESLint checks
npm run lint

# Perform Next.js production compilations
npm run build
```
Any compile or syntax warnings must be resolved before merging branches.
