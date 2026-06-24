import type { ViewStyle } from "react-native";

// Liquid Glass tokens — mirrors index.html (the design source of truth, Codex-scored 91/100).
export const colors = {
  ink: "#15171F",
  strong: "#2B3342",
  muted: "#5B6475",
  soft: "#97A0B2",
  white: "#FFFFFF",
  cream: "#FFFDF7",
  lemon: "#FFD749",
  lemon2: "#F7C821",
  lemonHi: "#FFF2B0",
  lemonSoft: "#FFF7B8",
  // kept only for faint background blooms (not per-card accents anymore)
  blue: "#6BA5FF",
  violet: "#9D88FF",
  aqua: "#6ECEC4"
};

export const glass = {
  bg: "rgba(255,255,255,0.22)",
  bgStrong: "rgba(255,255,255,0.42)",
  stroke: "rgba(255,255,255,0.62)",
  strokeTop: "rgba(255,255,255,1)",
  // content (opaque, flatter) surfaces — clearly NOT glass
  content: "rgba(252,253,255,0.92)",
  contentStroke: "rgba(231,236,244,0.9)"
};

export const radius = {
  screen: 44,
  lg: 28,
  md: 20,
  sm: 16,
  pill: 999
};

export const shadow = {
  // floating glass: soft diffuse + lift
  glass: {
    shadowColor: "#1C2640",
    shadowOpacity: 0.2,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 22 },
    elevation: 10
  } satisfies ViewStyle,
  // content card: flatter, tighter
  content: {
    shadowColor: "#1C2640",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  } satisfies ViewStyle,
  lemon: {
    shadowColor: "#DAAA14",
    shadowOpacity: 0.3,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 9
  } satisfies ViewStyle
};

export const type = {
  h1: { fontSize: 26, lineHeight: 31, fontWeight: "800" as const, color: colors.ink, letterSpacing: -0.2 },
  h2: { fontSize: 24, lineHeight: 29, fontWeight: "800" as const, color: colors.ink, letterSpacing: -0.2 },
  body: { fontSize: 13, lineHeight: 19, fontWeight: "600" as const, color: colors.muted },
  label: { fontSize: 11, lineHeight: 14, fontWeight: "800" as const, letterSpacing: 0.55, color: colors.muted }
};
