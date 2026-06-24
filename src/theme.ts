import type { ViewStyle } from "react-native";

export const colors = {
  ink: "#15171F",
  strong: "#273044",
  muted: "#768196",
  soft: "#A0A9BA",
  white: "#FFFFFF",
  cream: "#FFFEFA",
  lemon: "#FFE66F",
  lemonSoft: "#FFF7B8",
  lemonDeep: "#FFD749",
  mint: "#58D6B0",
  aqua: "#63D3E8",
  coral: "#FF8E7A",
  violet: "#9D88FF",
  blue: "#6BA5FF"
};

export const radius = {
  screen: 44,
  xl: 38,
  lg: 32,
  md: 24,
  sm: 18,
  pill: 999
};

export const shadow = {
  soft: {
    shadowColor: "#445066",
    shadowOpacity: 0.14,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 18 },
    elevation: 8
  } satisfies ViewStyle,
  liquid: {
    shadowColor: "#3E485C",
    shadowOpacity: 0.16,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 20 },
    elevation: 10
  } satisfies ViewStyle,
  lemon: {
    shadowColor: "#DAB120",
    shadowOpacity: 0.28,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 },
    elevation: 10
  } satisfies ViewStyle
};

export const type = {
  h1: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800" as const,
    color: colors.ink
  },
  h2: {
    fontSize: 29,
    lineHeight: 33,
    fontWeight: "800" as const,
    color: colors.ink
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700" as const,
    color: colors.muted
  },
  label: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "800" as const,
    letterSpacing: 0.48,
    color: colors.muted
  }
};
