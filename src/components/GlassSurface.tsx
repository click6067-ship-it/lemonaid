import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, glass, radius, shadow } from "../theme";

type Variant = "glass" | "strong" | "nav" | "hi";

const DATA: Record<Variant, object> = {
  glass: { glass: true },
  strong: { glassStrong: true },
  nav: { nav: true },
  hi: { glasshi: true }
};
const BG: Record<Variant, string> = {
  glass: glass.bg,
  strong: glass.bgStrong,
  nav: "rgba(255,255,255,0.62)",
  hi: glass.bg
};
const NATIVE_INTENSITY: Record<Variant, number> = { glass: 24, strong: 40, nav: 30, hi: 24 };

const isWeb = Platform.OS === "web";
function webData(o: object) {
  return isWeb ? ({ dataSet: o } as any) : {};
}

type GlassProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  radiusValue?: number;
  variant?: Variant;
}>;

/** Clean frosted-glass surface — reserved for small controls + the floating nav.
 *  A single static top highlight, no animated sweep. */
export function Glass({
  children,
  style,
  contentStyle,
  radiusValue = radius.lg,
  variant = "glass"
}: GlassProps) {
  return (
    <View
      {...webData(DATA[variant])}
      style={[styles.shell, shadow.card, { borderRadius: radiusValue, backgroundColor: BG[variant] }, style]}
    >
      {!isWeb && <BlurView intensity={NATIVE_INTENSITY[variant]} tint="light" style={StyleSheet.absoluteFill} />}
      <View pointerEvents="none" style={[styles.rim, { borderRadius: radiusValue }]} />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

/** Opaque, flat content card — the primary surface for lists, rows, tiles, heroes. */
export function ContentSurface({
  children,
  style,
  contentStyle,
  radiusValue = radius.md
}: GlassProps) {
  return (
    <View style={[styles.contentShell, shadow.card, { borderRadius: radiusValue }, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

export function LemonButton({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return (
    <View style={[styles.lemonButton, style]}>
      <LinearGradient
        colors={[colors.lemon, colors.lemon2]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.content, styles.center]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: glass.stroke
  },
  rim: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: "transparent",
    borderTopColor: glass.strokeTop
  },
  contentShell: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: glass.contentStroke,
    backgroundColor: glass.content
  },
  content: {
    position: "relative"
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
  },
  lemonButton: {
    borderRadius: radius.sm,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    ...shadow.lemon
  }
});
