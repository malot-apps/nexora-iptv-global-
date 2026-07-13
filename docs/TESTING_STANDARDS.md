# 🧪 Testing Specifications & Standards

This document describes the testing practices, environment setups, and quality assurance workflows for **Nexora IPTV Global**. 

---

## 📐 1. Core Testing Rules

To maintain high stability in stream decoding and state synchronization, Nexora relies on comprehensive test suites. All development branches must pass test verifications before they can merge into the `develop` or `main` branches.

### Core Testing Directives:
- **Test File Location**: All tests must reside inside the `/tests/` directory and match the naming suffix `<module-name>.test.ts` or `<module-name>.test.tsx`.
- **Test Isolation**: Unit tests must execute in complete isolation. Never write tests that depend on online stream servers or active database nodes. Mock any fetch responses or network traffic explicitly.
- **Coverage Targets**: Critical parsing utilities (`lib/iptv-parser.ts`) and theme helpers must maintain a minimum of **85% code coverage**.

---

## 🛠️ 2. Running the Test Suite

We use **Jest** paired with **React Testing Library** to execute unit tests.

### Running All Tests
```bash
npm run test
```

### Running Tests in Watch Mode
Perfect for rapid local iteration during feature edits:
```bash
npm run test:watch
```

---

## 📝 3. Writing Unit Tests

### Standard Utility Test Example
When testing static helper functions or data parsers, test for multiple valid inputs, malformed structures, empty scenarios, and safety fallbacks.

```typescript
import { parseM3U } from "../lib/iptv-parser";

describe("IPTV M3U Parser Utility", () => {
  it("successfully parses standard #EXTM3U lines", () => {
    const rawM3U = `#EXTM3U
#EXTINF:-1 tvg-id="hbo" group-title="Cinema",HBO HD
http://streaming.hbo.example.com/hbo.m3u8`;

    const result = parseM3U(rawM3U);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("HBO HD");
    expect(result[0].category).toBe("Cinema");
    expect(result[0].url).toBe("http://streaming.hbo.example.com/hbo.m3u8");
  });

  it("handles empty or malformed strings gracefully", () => {
    const badInput = `Random text file contents with no valid tags`;
    const result = parseM3U(badInput);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });
});
```

### React Hook / Context Test Example
Use `@testing-library/react-hooks` or wrap components inside test wrappers to test active stream additions, favorites selections, or recent history updates.

```typescript
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppProvider, useApp } from "../lib/context";

// Small dummy testing client
const TestComponent = () => {
  const { favorites, addFavorite } = useApp();
  return (
    <div>
      <span data-testid="fav-count">{favorites.length}</span>
      <button 
        id="test-add-fav" 
        onClick={() => addFavorite({ id: "test-id", name: "Test Channel", url: "http://stream.url" })}
      >
        Add
      </button>
    </div>
  );
};

describe("App Context State Engine", () => {
  it("updates Favorites counter correctly", () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const counter = screen.getByTestId("fav-count");
    expect(counter.textContent).toBe("0");

    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);

    expect(counter.textContent).toBe("1");
  });
});
```
