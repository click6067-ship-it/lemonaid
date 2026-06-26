import type { ViewStyle } from "react-native";

// Calm, high-contrast tokens. Lemon is the SINGLE accent — used only on the mic,
// primary action, active tab, toggle and avatar. Everything else is clean neutral.

// Warm "lemonade" ink: espresso near-black headings on a faintly warm canvas, so the
// text ties to the lemon accent instead of fighting it with cold black.
export const colors = {
  ink: "#221A11",     // primary text — warm espresso near-black
  strong: "#473B2C",  // secondary strong / icons — warm dark
  muted: "#5C6370",   // meta text — ~6:1 for AA legibility
  soft: "#6E7682",    // labels / placeholder / inactive icon — ~4.6:1 (was #9AA1AE, sub-AA)
  line: "#ECEEF2",    // hairline border
  line2: "#E3E6EC",   // slightly stronger divider
  white: "#FFFFFF",
  card: "#FFFFFF",
  bg: "#F6F3EC",      // faintly warm canvas — cohesive with the lemon brand
  well: "#F1F3F6",    // inset wells inside cards
  cream: "#FFFDF7",
  lemon: "#FFE98C",   // accent — soft, light yellow
  lemon2: "#FBDE74",  // accent deep (gradient end)
  lemonHi: "#FFF5C8",
  lemonSoft: "#FFFBEC",
  lemonTint: "#FFFDF7" // very light lemon wash for hero
};

// Kept for the one remaining glass element (the floating nav). Clean, near-opaque.
export const glass = {
  bg: "rgba(255,255,255,0.62)",
  bgStrong: "rgba(255,255,255,0.82)",
  stroke: "rgba(255,255,255,0.9)",
  strokeTop: "rgba(255,255,255,1)",
  content: "#FFFFFF",
  contentStroke: "#ECEEF2"
};

export const radius = {
  screen: 40,
  lg: 24,
  md: 18,
  sm: 13,
  pill: 999
};

export const shadow = {
  // clean card lift — soft and tight, no halo
  card: {
    shadowColor: "#10131C",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  } satisfies ViewStyle,
  // floating nav
  nav: {
    shadowColor: "#0E1220",
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12
  } satisfies ViewStyle,
  // lemon accent (mic, primary button) — subtle warm lift, not a glow
  lemon: {
    shadowColor: "#D9A800",
    shadowOpacity: 0.24,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7
  } satisfies ViewStyle
};

export const type = {
  h1: { fontSize: 27, lineHeight: 33, fontWeight: "800" as const, color: colors.ink, letterSpacing: -0.3 },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: "800" as const, color: colors.ink, letterSpacing: -0.2 },
  body: { fontSize: 14, lineHeight: 19, fontWeight: "500" as const, color: colors.muted },
  label: { fontSize: 12, lineHeight: 15, fontWeight: "700" as const, letterSpacing: 0.3, color: colors.soft }
};
