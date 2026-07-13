import { getThemeClasses } from "../lib/theme-helper";

describe("Nexora Theme Config Helper", () => {
  it("should output correct color maps for Premium Gold theme", () => {
    const goldClasses = getThemeClasses("gold");
    expect(goldClasses.text).toBe("text-amber-500");
    expect(goldClasses.bg).toBe("bg-amber-500");
    expect(goldClasses.border).toBe("border-amber-500/20");
    expect(goldClasses.accentColor).toBe("#f59e0b");
  });

  it("should output correct color maps for Neon Cyan theme", () => {
    const cyanClasses = getThemeClasses("cyan");
    expect(cyanClasses.text).toBe("text-cyan-400");
    expect(cyanClasses.bg).toBe("bg-cyan-500");
    expect(cyanClasses.border).toBe("border-cyan-500/20");
    expect(cyanClasses.accentColor).toBe("#22d3ee");
  });

  it("should output correct color maps for Cosmic Violet theme", () => {
    const violetClasses = getThemeClasses("violet");
    expect(violetClasses.text).toBe("text-violet-400");
    expect(violetClasses.bg).toBe("bg-violet-500");
    expect(violetClasses.accentColor).toBe("#a78bfa");
  });

  it("should output correct color maps for Clean Minimalism theme", () => {
    const minimalClasses = getThemeClasses("minimal");
    expect(minimalClasses.text).toBe("text-indigo-400");
    expect(minimalClasses.bg).toBe("bg-indigo-600");
    expect(minimalClasses.accentColor).toBe("#4f46e5");
  });

  it("should default to gold theme classes if an unrecognized theme name is passed", () => {
    const fallbackClasses = getThemeClasses("unknown-theme-variant");
    expect(fallbackClasses.text).toBe("text-amber-500");
    expect(fallbackClasses.bg).toBe("bg-amber-500");
  });
});
