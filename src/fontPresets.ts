import { Platform } from "react-native";

export type FontVariant = "ios" | "geist" | "jakarta";

export type FontSet = {
  label: string;
  regular?: string;
  bold?: string;
  extraBold?: string;
};

export const fontOptions: Record<FontVariant, FontSet> = {
  ios: {
    label: "iOS System",
    regular: Platform.select({ ios: "System", default: undefined }),
    bold: Platform.select({ ios: "System", default: undefined }),
    extraBold: Platform.select({ ios: "System", default: undefined })
  },
  geist: {
    label: "Geist",
    regular: "Geist",
    bold: "Geist",
    extraBold: "Geist"
  },
  jakarta: {
    label: "Plus Jakarta Sans",
    regular: "Plus Jakarta Sans",
    bold: "Plus Jakarta Sans",
    extraBold: "Plus Jakarta Sans"
  }
};

export function useOptionalFonts() {
  return true;
}
