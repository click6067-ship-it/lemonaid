import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, radius, shadow } from "../theme";

type GlassSurfaceProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  radiusValue?: number;
  intensity?: number;
}>;

const lemonShadow = shadow.lemon;

export function GlassSurface({
  children,
  style,
  contentStyle,
  radiusValue = radius.md,
  intensity = 42
}: GlassSurfaceProps) {
  return (
    <View style={[styles.shell, { borderRadius: radiusValue }, style]}>
      <BlurView intensity={intensity} tint="light" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={["rgba(255,255,255,0.70)", "rgba(255,255,255,0.28)", "rgba(255,255,255,0.16)"]}
        locations={[0, 0.46, 1]}
        start={{ x: 0.05, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={[styles.edge, { borderRadius: radiusValue }]} />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.88)",
    backgroundColor: "rgba(255,255,255,0.34)",
    ...shadow.liquid
  },
  edge: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderTopColor: "rgba(255,255,255,0.96)",
    borderLeftColor: "rgba(255,255,255,0.84)",
    borderRightColor: "rgba(255,255,255,0.26)",
    borderBottomColor: "rgba(255,255,255,0.22)"
  },
  content: {
    position: "relative"
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center"
  },
  lemonButton: {
    borderRadius: 20,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.86)",
    overflow: "hidden",
    ...lemonShadow
  }
});

export function LemonButton({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return (
    <View style={[styles.lemonButton, style]}>
      <LinearGradient
        colors={["#FFF8BD", colors.lemon, colors.lemonDeep]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["rgba(255,255,255,0.74)", "rgba(255,255,255,0)"]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.7, y: 0.65 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.content, styles.centerContent]}>{children}</View>
    </View>
  );
}
