import { Grid2X2, Home, Settings, Star } from "lucide-react-native";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius } from "../theme";
import type { TabKey } from "../types";

const tabs = [
  { key: "home" as const, label: "Home", Icon: Home },
  { key: "cards" as const, label: "Cards", Icon: Grid2X2 },
  { key: "saved" as const, label: "Saved", Icon: Star },
  { key: "settings" as const, label: "Settings", Icon: Settings }
];

const isWeb = Platform.OS === "web";
const webData = (o: object) => (isWeb ? ({ dataSet: o } as any) : {});

// Active tab "color comes in" (Online Groceries-style): the selected icon + label
// light up in a legible lemon-gold; inactive stay neutral gray.
const ACTIVE_ICON = "#E3A300";
const ACTIVE_LABEL = "#7E6200";

type BottomNavProps = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  fontFamily?: string;
};

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <View {...webData({ nav: true })} style={styles.root}>
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
              style={styles.tab}
            >
              <View style={styles.iconWrap}>
                <Icon
                  size={23}
                  color={active ? ACTIVE_ICON : colors.soft}
                  strokeWidth={active ? 2.6 : 2}
                  fill={active && key === "saved" ? ACTIVE_ICON : "none"}
                />
              </View>
              <Text numberOfLines={1} style={[styles.label, active && styles.labelActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "rgba(255,255,255,0.78)",
    borderTopWidth: 1,
    borderTopColor: colors.line
  },
  row: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around"
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingTop: 2
  },
  iconWrap: {
    width: 48,
    height: 28,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center"
  },
  label: {
    color: colors.soft,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "600",
    letterSpacing: 0
  },
  labelActive: {
    color: ACTIVE_LABEL,
    fontWeight: "700"
  }
});
