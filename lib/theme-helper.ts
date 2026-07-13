/**
 * Theme configuration utility for mapping premium dark themes
 * to Tailwind design utilities and glowing accents.
 */
export function getThemeClasses(theme: "gold" | "cyan" | "violet" | "emerald" | "minimal" | string) {
  switch (theme) {
    case "minimal":
      return {
        text: "text-indigo-400",
        textHover: "hover:text-indigo-300",
        bg: "bg-indigo-600",
        bgHover: "hover:bg-indigo-500",
        bgLight: "bg-indigo-600/10",
        border: "border-white/5",
        borderActive: "border-indigo-500/50",
        glow: "shadow-indigo-500/10",
        focus: "focus:ring-indigo-500 focus:border-indigo-500",
        accentColor: "#4f46e5",
        gradient: "from-indigo-600/10 via-indigo-600/5 to-transparent",
      };
    case "gold":
      return {
        text: "text-amber-500",
        textHover: "hover:text-amber-400",
        bg: "bg-amber-500",
        bgHover: "hover:bg-amber-600",
        bgLight: "bg-amber-500/10",
        border: "border-amber-500/20",
        borderActive: "border-amber-500/50",
        glow: "shadow-amber-500/10",
        focus: "focus:ring-amber-500 focus:border-amber-500",
        accentColor: "#f59e0b",
        gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
      };
    case "cyan":
      return {
        text: "text-cyan-400",
        textHover: "hover:text-cyan-300",
        bg: "bg-cyan-500",
        bgHover: "hover:bg-cyan-600",
        bgLight: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        borderActive: "border-cyan-500/50",
        glow: "shadow-cyan-500/10",
        focus: "focus:ring-cyan-400 focus:border-cyan-400",
        accentColor: "#22d3ee",
        gradient: "from-cyan-500/10 via-cyan-500/5 to-transparent",
      };
    case "violet":
      return {
        text: "text-violet-400",
        textHover: "hover:text-violet-300",
        bg: "bg-violet-500",
        bgHover: "hover:bg-violet-600",
        bgLight: "bg-violet-500/10",
        border: "border-violet-500/20",
        borderActive: "border-violet-500/50",
        glow: "shadow-violet-500/10",
        focus: "focus:ring-violet-400 focus:border-violet-400",
        accentColor: "#a78bfa",
        gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
      };
    case "emerald":
      return {
        text: "text-emerald-400",
        textHover: "hover:text-emerald-300",
        bg: "bg-emerald-500",
        bgHover: "hover:bg-emerald-600",
        bgLight: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        borderActive: "border-emerald-500/50",
        glow: "shadow-emerald-500/10",
        focus: "focus:ring-emerald-400 focus:border-emerald-400",
        accentColor: "#34d399",
        gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      };
    default:
      return {
        text: "text-amber-500",
        textHover: "hover:text-amber-400",
        bg: "bg-amber-500",
        bgHover: "hover:bg-amber-600",
        bgLight: "bg-amber-500/10",
        border: "border-amber-500/20",
        borderActive: "border-amber-500/50",
        glow: "shadow-amber-500/10",
        focus: "focus:ring-amber-500 focus:border-amber-500",
        accentColor: "#f59e0b",
        gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
      };
  }
}
