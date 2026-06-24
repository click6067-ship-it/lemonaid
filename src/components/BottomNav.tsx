import { Grid2X2, Home, Settings, Star } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { GlassSurface } from "./GlassSurface";
import { colors, radius } from "../theme";
import type { TabKey } from "../types";

const tabs = [
  { key: "home" as const, label: "Home", Icon: Home },
  { key: "cards" as const, label: "Cards", Icon: Grid2X2 },
  { key: "saved" as const, label: "Saved", Icon: Star },
  { key: "settings" as const, label: "Settings", Icon: Settings }
];

type BottomNavProps = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  fontFamily?: string;
};

export function BottomNav({ activeTab, onChange, fontFamily }: BottomNavProps) {
  return (
    <GlassSurface style={styles.root} radiusValue={31} intensity={58}>
      <View style={styles.row}>
        {tabs.map(({ key, label, Icon }) => {
          const active = key === activeTab;
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={label}
              onPress={() => onChange(key)}
              style={[styles.tab, active && styles.activeTab]}
            >
              <Icon size={22} color={active ? colors.ink : "#7B8496"} strokeWidth={2.3} fill={active && key === "saved" ? colors.ink : "none"} />
              <Text style={[styles.label, fontFamily ? { fontFamily } : null, active && styles.activeLabel]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 16,
    height: 74,
    padding: 8
  },
  row: {
    flexDirection: "row",
    gap: 6
  },
  tab: {
    height: 58,
    flex: 1,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 3
  },
  activeTab: {
    backgroundColor: colors.lemon,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    shadowColor: "#B48B06",
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 8, height: 10 },
    elevation: 4
  },
  label: {
    color: "#7B8496",
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "800"
  },
  activeLabel: {
    color: colors.ink
  }
});
