import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";

export function PhoneStatusBar() {
  return (
    <View style={styles.root}>
      <Text style={styles.time}>9:41</Text>
      <View style={styles.notch} />
      <View style={styles.icons}>
        <View style={styles.signal}>
          <View style={[styles.bar, { height: 4 }]} />
          <View style={[styles.bar, { height: 6 }]} />
          <View style={[styles.bar, { height: 9 }]} />
          <View style={[styles.bar, { height: 12 }]} />
        </View>
        <View style={styles.wifi}>
          <View style={styles.wifiOuter} />
          <View style={styles.wifiInner} />
        </View>
        <View style={styles.battery}>
          <View style={styles.batteryFill} />
          <View style={styles.batteryCap} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 58,
    paddingTop: 19,
    paddingHorizontal: 27,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  time: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 17,
    fontWeight: "800"
  },
  notch: {
    position: "absolute",
    top: 14,
    left: "50%",
    width: 122,
    height: 34,
    marginLeft: -61,
    borderRadius: 999,
    backgroundColor: "#050507"
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  signal: {
    width: 17,
    height: 12,
    flexDirection: "row",
    gap: 2,
    alignItems: "flex-end"
  },
  bar: {
    width: 3,
    borderRadius: 3,
    backgroundColor: colors.ink
  },
  wifi: {
    width: 16,
    height: 12
  },
  wifiOuter: {
    position: "absolute",
    top: 1,
    left: 0,
    width: 16,
    height: 10,
    borderTopWidth: 2,
    borderTopColor: colors.ink,
    borderRadius: 16
  },
  wifiInner: {
    position: "absolute",
    top: 6,
    left: 4,
    width: 8,
    height: 5,
    borderTopWidth: 2,
    borderTopColor: colors.ink,
    borderRadius: 8
  },
  battery: {
    width: 25,
    height: 12,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 4
  },
  batteryFill: {
    position: "absolute",
    top: 2,
    left: 2,
    width: 14,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.ink
  },
  batteryCap: {
    position: "absolute",
    right: -5,
    top: 3,
    width: 3,
    height: 5,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: colors.ink
  }
});
