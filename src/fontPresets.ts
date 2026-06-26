import { Platform } from "react-native";

export type FontVariant = "ios" | "jakarta";

export type FontSet = {
  label: string;
  regular?: string;
  bold?: string;
  extraBold?: string;
};

// Web font families loaded by WebGlassFX via Google Fonts. `ios` = platform system
// font (no custom family). Each candidate maps all weights to one family; weight comes
// from the per-style fontWeight (400/600/700/800).
const fam = (family: string, label: string): FontSet => ({ label, regular: family, bold: family, extraBold: family });

export const fontOptions: Record<FontVariant, FontSet> = {
  ios: {
    label: "System",
    regular: Platform.select({ ios: "System", default: undefined }),
    bold: Platform.select({ ios: "System", default: undefined }),
    extraBold: Platform.select({ ios: "System", default: undefined })
  },
  jakarta: fam("Plus Jakarta Sans", "Plus Jakarta Sans")
};

// Google Fonts families to inject on web (kept in sync with fontOptions above).
export const WEB_FONT_FAMILIES = ["Plus+Jakarta+Sans:wght@400;500;600;700;800"];

export function useOptionalFonts() {
  return true;
}
