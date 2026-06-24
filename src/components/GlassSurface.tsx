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
  nav: "rgba(255,255,255,0.20)",
  hi: glass.bg
};
const NATIVE_INTENSITY: Record<Variant, number> = { glass: 26, strong: 42, nav: 22, hi: 26 };

const isWeb = Platform.OS === "web";
function webData(o: object) {
  return isWeb ? ({ dataSet: o } as any) : {};
}

type GlassProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  radiusValue?: number;
  variant?: Variant;
  specular?: boolean;
}>;

/** Translucent Liquid Glass surface. Web gets backdrop refraction + animated specular via
 *  injected CSS (see WebGlassFX); native falls back to a BlurView frost. */
export function Glass({
  children,
  style,
  contentStyle,
  radiusValue = radius.lg,
  variant = "glass",
  specular = true
}: GlassProps) {
  return (
    <View
      {...webData(DATA[variant])}
      style={[styles.shell, shadow.glass, { borderRadius: radiusValue, backgroundColor: BG[variant] }, style]}
    >
      {!isWeb && <BlurView intensity={NATIVE_INTENSITY[variant]} tint="light" style={StyleSheet.absoluteFill} />}
      <View pointerEvents="none" style={[styles.rim, { borderRadius: radiusValue }]} />
      {specular && (
        <View pointerEvents="none" {...webData({ spec: true })} style={styles.specWrap}>
          <LinearGradient
            colors={["rgba(255,255,255,0.98)", "rgba(255,255,255,0.55)", "rgba(255,255,255,0)"]}
            locations={[0, 0.06, 0.22]}
            start={{ x: 0.18, y: 0 }}
            end={{ x: 0.62, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
      <View pointerEvents="none" style={styles.glint} />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

/** Opaque, flatter CONTENT surface — deliberately NOT glass, to keep the material hierarchy clear. */
export function ContentSurface({
  children,
  style,
  contentStyle,
  radiusValue = radius.md
}: GlassProps) {
  return (
    <View style={[styles.contentShell, shadow.content, { borderRadius: radiusValue }, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

export function LemonButton({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return (
    <View style={[styles.lemonButton, style]}>
      <LinearGradient
        colors={["#FFF3A6", colors.lemon, colors.lemon2]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["rgba(255,255,255,0.7)", "rgba(255,255,255,0)"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.6, y: 0.55 }}
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
    borderTopColor: glass.strokeTop,
    borderLeftColor: "rgba(120,198,255,0.16)",
    borderRightColor: "rgba(255,188,150,0.14)"
  },
  specWrap: {
    position: "absolute",
    left: "-14%",
    right: "-14%",
    top: 0,
    bottom: 0
  },
  glint: {
    position: "absolute",
    top: 1.5,
    left: "16%",
    right: "16%",
    height: 2,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.95)"
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
    minHeight: 46,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    overflow: "hidden",
    ...shadow.lemon
  }
});
