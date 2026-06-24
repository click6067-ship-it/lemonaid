import { Grid2X2, Home, Settings, Star } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { Glass } from "./GlassSurface";
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

type BottomNavProps = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  fontFamily?: string;
};

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <Glass variant="nav" style={styles.root} radiusValue={30} contentStyle={styles.row}>
      <View pointerEvents="none" style={styles.track} />
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
              <View pointerEvents="none" {...webData({ pill: true })} style={styles.pill}>
                <LinearGradient
                  colors={["rgba(255,233,142,0.94)", "rgba(255,215,73,0.9)"]}
                  start={{ x: 0.3, y: 0 }}
                  end={{ x: 0.8, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              </View>
            )}
            <Icon
              size={23}
              color={active ? "#1A1400" : "#6D7689"}
              strokeWidth={2.2}
              fill={active && key === "saved" ? "#1A1400" : "none"}
            />
          </Pressable>
        );
      })}
    </Glass>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 30,
    right: 30,
    bottom: 18,
    height: 64,
    paddingHorizontal: 7,
    paddingVertical: 7
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: "100%"
  },
  track: {
    position: "absolute",
    left: 6,
    right: 6,
    top: 6,
    bottom: 6,
    borderRadius: 24,
    backgroundColor: "rgba(40,52,78,0.04)",
    borderTopColor: "rgba(40,52,78,0.06)",
    borderTopWidth: 1
  },
  tab: {
    flex: 1,
    height: 50,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  pill: {
    ...StyleSheet.absoluteFillObject,
    margin: 3,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)",
    shadowColor: "#DAAA14",
    shadowOpacity: 0.26,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6
  }
});
