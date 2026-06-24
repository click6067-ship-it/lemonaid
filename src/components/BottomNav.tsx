import { Grid2X2, Home, Settings, Star } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import type { TabKey } from "../types";

const tabs = [
  { key: "home" as const, label: "Home", Icon: Home },
  { key: "cards" as const, label: "Cards", Icon: Grid2X2 },
  { key: "saved" as const, label: "Saved", Icon: Star },
  { key: "settings" as const, label: "Settings", Icon: Settings }
];

const isWeb = Platform.OS === "web";
const webData = (o: object) => (isWeb ? ({ dataSet: o } as any) : {});

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
            {active && (
              <View pointerEvents="none" style={styles.activeHalo}>
                <LinearGradient
                  colors={["rgba(255,244,183,0.88)", "rgba(255,215,73,0.32)", "rgba(255,255,255,0)"]}
                  locations={[0, 0.58, 1]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              </View>
            )}
            <Icon
              size={21}
              color={active ? "#1A1400" : "#6D7689"}
              strokeWidth={2.2}
              fill={active && key === "saved" ? "#1A1400" : "none"}
            />
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
    paddingHorizontal: 18,
    paddingTop: 9,
    paddingBottom: 14,
    backgroundColor: "rgba(250,252,255,0.86)",
    borderTopWidth: 1,
    borderTopColor: "rgba(208,216,230,0.72)"
  },
  row: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    height: 58
  },
  tab: {
    flex: 1,
    height: 58,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  activeHalo: {
    position: "absolute",
    top: 6,
    width: 42,
    height: 30,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#DAAA14",
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  label: {
    color: "#6D7689",
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "700",
    letterSpacing: 0
  },
  labelActive: {
    color: "#1A1400",
    fontWeight: "800"
  }
});
