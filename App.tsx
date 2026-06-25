import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  Activity,
  Droplet,
  Grid2X2,
  Hand,
  Heart,
  Mic,
  Play,
  RotateCw,
  Search,
  SlidersHorizontal,
  Type as TypeIcon,
  User,
  Utensils,
  Waves,
  type LucideIcon
} from "lucide-react-native";
import { useState, type ReactNode } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from "react-native";

import { BottomNav } from "./src/components/BottomNav";
import { ContentSurface, LemonButton } from "./src/components/GlassSurface";
import { WebGlassFX } from "./src/components/WebGlassFX";
import { categories, favorites, phraseCards, settings as settingRows } from "./src/data";
import { fontOptions, useOptionalFonts, type FontSet, type FontVariant } from "./src/fontPresets";
import { colors, radius, shadow, type } from "./src/theme";
import type { PhraseCard, TabKey } from "./src/types";

const isWeb = Platform.OS === "web";
const webData = (o: object) => (isWeb ? ({ dataSet: o } as any) : {});

const logo = require("./assets/logo.png");
const lemonPhoto = require("./assets/lemon-photo.png");

const recognitionSamples = [
  "I need water. Please speak slowly.",
  "I am okay. I need to rest.",
  "Please call my caregiver.",
  "Where is the bathroom?"
];

const phraseIcons: Record<PhraseCard["image"], LucideIcon> = {
  help: Hand,
  water: Droplet,
  pain: Activity,
  food: Utensils,
  anxious: Heart,
  caregiver: User
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>(getInitialTab());
  const fontsLoaded = useOptionalFonts();
  const fonts = fontOptions[getInitialFont()];
  const { height } = useWindowDimensions();
  const compact = height < 760;

  let content: ReactNode = <HomeScreen compact={compact} fonts={fonts} />;
  if (activeTab === "cards") content = <CardsScreen compact={compact} fonts={fonts} />;
  if (activeTab === "saved") content = <SavedScreen compact={compact} fonts={fonts} />;
  if (activeTab === "settings") content = <SettingsScreen compact={compact} fonts={fonts} />;

  return (
    <View style={styles.stage}>
      <StatusBar hidden />
      <WebGlassFX />
      <View
        {...webData({ appbg: true })}
        style={[styles.appFrame, isWeb && { minHeight: height }]}
      >
        {!isWeb && (
          <LinearGradient
            colors={[colors.lemonTint, colors.bg, colors.bg]}
            locations={[0, 0.32, 1]}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.content}>{fontsLoaded ? content : null}</View>
        {/* soft fade just above the floating nav (content scrolls under it) */}
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(243,244,247,0)", "rgba(243,244,247,0.92)"]}
          style={styles.scrollEdge}
        />
        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      </View>
    </View>
  );
}

function getInitialTab(): TabKey {
  if (!isWeb || typeof window === "undefined") return "home";
  const tab = new URLSearchParams(window.location.search).get("tab");
  if (tab === "cards" || tab === "saved" || tab === "settings" || tab === "home") return tab;
  return "home";
}

function getInitialFont(): FontVariant {
  if (!isWeb || typeof window === "undefined") return "ios";
  const font = new URLSearchParams(window.location.search).get("font");
  if (font === "ios" || font === "geist" || font === "jakarta") return font;
  return "ios";
}

function ff(fonts: FontSet, weight: "regular" | "bold" | "extraBold"): any {
  const fontFamily = fonts[weight];
  return fontFamily ? { fontFamily } : undefined;
}

function Toolbar({ title, sub, fonts }: { title: string; sub: string; fonts: FontSet }) {
  return (
    <View style={styles.toolbar}>
      <View style={styles.toolbarText}>
        <Text style={[styles.h1, ff(fonts, "extraBold")]}>{title}</Text>
        <Text style={[styles.sub, ff(fonts, "bold")]}>{sub}</Text>
      </View>
    </View>
  );
}

function HomeScreen({ compact, fonts }: { compact: boolean; fonts: FontSet }) {
  const [recognizedIndex, setRecognizedIndex] = useState(0);
  const recognized = recognitionSamples[recognizedIndex];
  const cycle = () => setRecognizedIndex((i) => (i + 1) % recognitionSamples.length);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <View style={styles.brandBar}>
        <View style={styles.brandLeft}>
          <Image source={logo} style={styles.brandLogo} resizeMode="contain" accessibilityLabel="Lemonaid logo" />
          <View>
            <Text style={[styles.brandName, ff(fonts, "extraBold")]}>Lemonaid</Text>
            <Text style={[styles.brandTag, ff(fonts, "bold")]}>Small words, clear voice.</Text>
          </View>
        </View>
      </View>

      <ContentSurface radiusValue={radius.lg} style={styles.hero} contentStyle={styles.heroInner}>
        <View style={styles.heroPhotoWrap}>
          <Image source={lemonPhoto} style={styles.heroPhoto} resizeMode="cover" accessibilityLabel="Fresh lemon" />
        </View>
        <Text style={[styles.heroTitle, ff(fonts, "extraBold")]}>Press, then speak.</Text>
        <Text style={[styles.heroSub, ff(fonts, "bold")]}>Tap below and speak slowly — we’ll say it out loud, clearly.</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Tap to speak" onPress={cycle} style={styles.speakPress}>
          <LemonButton style={styles.speakBtn}>
            <View style={styles.playRow}>
              <Mic size={20} color="#1A1400" strokeWidth={2.5} />
              <Text style={[styles.speakText, ff(fonts, "extraBold")]}>Tap to speak</Text>
            </View>
          </LemonButton>
        </Pressable>
      </ContentSurface>

      <ContentSurface radiusValue={radius.md} style={styles.result}>
        <Text style={[styles.label, ff(fonts, "extraBold")]}>RECOGNIZED</Text>
        <Text style={[styles.resultText, ff(fonts, "bold")]}>{recognized}</Text>
        <View style={styles.resultActions}>
          <Pressable accessibilityRole="button" accessibilityLabel="Play clear voice" style={styles.flex1}>
            <LemonButton>
              <View style={styles.playRow}>
                <Play size={17} color="#1A1400" fill="#1A1400" />
                <Text style={[styles.playText, ff(fonts, "extraBold")]}>Play clear voice</Text>
              </View>
            </LemonButton>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Try again" onPress={cycle} style={styles.retry}>
            <RotateCw size={19} color={colors.strong} strokeWidth={2.3} />
          </Pressable>
        </View>
      </ContentSurface>
    </ScrollView>
  );
}

function CardsScreen({ compact, fonts }: { compact: boolean; fonts: FontSet }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <Toolbar title="Cards" sub="Tap a phrase to speak." fonts={fonts} />

      <View style={styles.search}>
        <Search size={19} color={colors.soft} strokeWidth={2.3} />
        <Text style={[styles.searchText, ff(fonts, "bold")]}>Search phrases</Text>
      </View>

      <View style={styles.chips}>
        {categories.map((category, index) => {
          const active = index === 0;
          return (
            <View key={category} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive, ff(fonts, "extraBold")]}>{category}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.grid}>
        {phraseCards.map((card) => {
          const Icon = phraseIcons[card.image];
          return (
            <Pressable key={card.phrase} accessibilityRole="button" accessibilityLabel={`Speak ${card.phrase}`} style={({ pressed }) => [styles.tile, pressed && styles.cardPressed]}>
              <ContentSurface radiusValue={radius.md} style={styles.card} contentStyle={styles.cardInner}>
                <View style={styles.cardWell}>
                  <Icon size={21} color={colors.ink} strokeWidth={2.4} />
                </View>
                <View>
                  <Text style={[styles.cardTitle, ff(fonts, "bold")]}>{card.phrase}</Text>
                  <Text style={[styles.cardCat, ff(fonts, "bold")]}>{card.category}</Text>
                </View>
              </ContentSurface>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function SavedScreen({ compact, fonts }: { compact: boolean; fonts: FontSet }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <Toolbar title="Saved" sub="Your fastest phrases." fonts={fonts} />

      <ContentSurface radiusValue={radius.lg} style={styles.stats}>
        <View style={styles.statsHead}>
          <Text style={[styles.label, ff(fonts, "extraBold")]}>THIS WEEK</Text>
          <View style={styles.statsPill}>
            <Text style={[styles.statsPillText, ff(fonts, "extraBold")]}>12 saved</Text>
          </View>
        </View>
        <Text style={[styles.statsBig, ff(fonts, "extraBold")]}>42 phrases spoken</Text>
        <Text style={[styles.statsMeta, ff(fonts, "bold")]}>Most used — “Please wait a moment.”</Text>
      </ContentSurface>

      <Text style={[styles.sectionLabel, ff(fonts, "extraBold")]}>FAVORITES</Text>
      <View style={styles.rows}>
        {favorites.map((item) => (
          <ContentSurface key={item.phrase} radiusValue={radius.md} style={styles.row} contentStyle={styles.rowBetween}>
            <View style={styles.flex1}>
              <Text style={[styles.rowTitle, ff(fonts, "bold")]}>{item.phrase}</Text>
              <Text style={[styles.rowMeta, ff(fonts, "bold")]}>{item.category}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={`Play ${item.phrase}`} style={styles.playMini}>
              <Play size={15} color="#1A1400" fill="#1A1400" />
            </Pressable>
          </ContentSurface>
        ))}
      </View>
    </ScrollView>
  );
}

function SettingsScreen({ compact, fonts }: { compact: boolean; fonts: FontSet }) {
  const icons: LucideIcon[] = [Waves, SlidersHorizontal, TypeIcon, Grid2X2];
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <Toolbar title="Settings" sub="Voice and access." fonts={fonts} />

      <ContentSurface radiusValue={radius.lg} style={styles.profile} contentStyle={styles.profileInner}>
        <View style={styles.avatar}>
          <LinearGradient colors={[colors.lemonHi, colors.lemon]} start={{ x: 0.3, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
          <Text style={[styles.avatarText, ff(fonts, "extraBold")]}>A</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={[styles.profileName, ff(fonts, "extraBold")]}>Alex</Text>
          <Text style={[styles.profileSub, ff(fonts, "bold")]}>Premium clear voice · English · Calm tone</Text>
        </View>
      </ContentSurface>

      <Text style={[styles.sectionLabel, ff(fonts, "extraBold")]}>PREFERENCES</Text>
      <View style={styles.rows}>
        {settingRows.map((row, index) => {
          const Icon = icons[index];
          const toggle = index === 2;
          return (
            <ContentSurface key={row.title} radiusValue={radius.md} style={styles.setRow} contentStyle={styles.setRowInner}>
              <View style={styles.setWell}>
                <Icon size={20} color={colors.ink} strokeWidth={2.4} />
              </View>
              <View style={styles.flex1}>
                <Text style={[styles.rowTitle, ff(fonts, "bold")]}>{row.title}</Text>
                <Text style={[styles.rowMeta, ff(fonts, "bold")]}>{row.value}</Text>
              </View>
              {toggle ? <Toggle /> : <Text style={[styles.chev, ff(fonts, "bold")]}>›</Text>}
            </ContentSurface>
          );
        })}
      </View>
    </ScrollView>
  );
}

function Toggle() {
  return (
    <View style={styles.toggle}>
      <LinearGradient colors={[colors.lemonHi, colors.lemon]} style={StyleSheet.absoluteFill} />
      <View style={styles.toggleKnob} />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, backgroundColor: colors.bg },
  appFrame: { flex: 1, width: "100%", height: "100%", overflow: "hidden", backgroundColor: colors.bg },
  content: { flex: 1 },
  scrollEdge: { position: "absolute", left: 0, right: 0, bottom: 74, height: 38 },
  scroll: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: isWeb ? 26 : 22,
    paddingBottom: 124
  },

  toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 14, paddingVertical: 10, marginBottom: 8 },
  toolbarText: { flex: 1 },
  h1: { ...type.h1 },
  sub: { ...type.body, marginTop: 4, color: colors.muted },
  iconBtn: {
    width: 44, height: 44, borderRadius: radius.pill, alignItems: "center", justifyContent: "center",
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, ...shadow.card
  },
  center: { alignItems: "center", justifyContent: "center", flex: 1 },
  flex1: { flex: 1 },

  brandBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6, marginBottom: 16 },
  brandLeft: { flexDirection: "row", alignItems: "center", gap: 11 },
  brandLogo: { width: 42, height: 42 },
  brandName: { fontSize: 20, lineHeight: 24, fontWeight: "800", color: colors.ink, letterSpacing: -0.3 },
  brandTag: { fontSize: 12.5, lineHeight: 16, fontWeight: "600", color: colors.muted, marginTop: 1 },
  hero: { flex: 1 },
  heroInner: { flex: 1, padding: 22, alignItems: "center", justifyContent: "center" },
  heroPhotoWrap: { width: 172, height: 172, borderRadius: radius.pill, overflow: "hidden", borderWidth: 4, borderColor: colors.white, ...shadow.card },
  heroPhoto: { width: "100%", height: "100%" },
  heroTitle: { fontSize: 23, lineHeight: 29, fontWeight: "800", color: colors.ink, marginTop: 18, textAlign: "center", letterSpacing: -0.3 },
  heroSub: { fontSize: 14, lineHeight: 19, fontWeight: "600", color: colors.muted, marginTop: 7, textAlign: "center", maxWidth: 290 },
  speakPress: { width: "100%", marginTop: 18 },
  speakBtn: { width: "100%", minHeight: 56 },
  speakText: { color: "#1A1400", fontSize: 16, fontWeight: "800" },

  result: { marginTop: 14, padding: 18 },
  label: { ...type.label },
  resultText: { color: colors.ink, fontSize: 18, lineHeight: 24, fontWeight: "700", marginTop: 8 },
  resultActions: { flexDirection: "row", gap: 10, marginTop: 14, alignItems: "stretch" },
  playRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  playText: { color: "#1A1400", fontSize: 15, fontWeight: "800" },
  retry: {
    width: 48, minHeight: 48, borderRadius: radius.sm, alignItems: "center", justifyContent: "center",
    backgroundColor: colors.well, borderWidth: 1, borderColor: colors.line
  },

  sectionLabel: { fontSize: 12, lineHeight: 15, fontWeight: "800", letterSpacing: 0.6, color: colors.soft, marginTop: 24, marginBottom: 12, marginLeft: 4 },
  rows: { gap: 10 },
  row: { minHeight: 62, paddingHorizontal: 16, paddingVertical: 13 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  rowTitle: { color: colors.ink, fontSize: 15, lineHeight: 20, fontWeight: "700" },
  rowMeta: { color: colors.muted, fontSize: 12.5, lineHeight: 16, fontWeight: "600", marginTop: 3 },
  playMini: {
    width: 36, height: 36, borderRadius: radius.pill, alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,233,140,0.46)"
  },

  search: {
    height: 50, paddingHorizontal: 16, borderRadius: radius.md, flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, ...shadow.card
  },
  searchText: { color: colors.soft, fontSize: 15, fontWeight: "600" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14, marginBottom: 16 },
  chip: {
    height: 36, paddingHorizontal: 16, borderRadius: radius.pill, alignItems: "center", justifyContent: "center",
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line
  },
  chipActive: { backgroundColor: colors.lemon, borderColor: colors.lemon },
  chipText: { color: colors.muted, fontSize: 13.5, fontWeight: "700" },
  chipTextActive: { color: "#1A1400" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "stretch", rowGap: 12 },
  tile: { width: "48%" },
  card: { flex: 1, minHeight: 112 },
  cardInner: { flex: 1, justifyContent: "flex-start", padding: 15, minHeight: 112 },
  cardPressed: { transform: [{ scale: 0.975 }] },
  cardWell: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.well },
  cardTitle: { color: colors.ink, fontSize: 15, lineHeight: 19, fontWeight: "700", marginTop: 14 },
  cardCat: { color: colors.muted, fontSize: 12, lineHeight: 15, fontWeight: "600", marginTop: 3 },

  stats: { padding: 22, minHeight: 124 },
  statsHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  statsPill: { paddingHorizontal: 11, height: 25, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,233,140,0.52)" },
  statsPillText: { color: "#6E5200", fontSize: 12, fontWeight: "800" },
  statsBig: { color: colors.ink, fontSize: 25, lineHeight: 31, fontWeight: "800", marginTop: 10, maxWidth: 230, letterSpacing: -0.3 },
  statsMeta: { color: colors.muted, fontSize: 13, lineHeight: 18, fontWeight: "600", marginTop: 8 },

  profile: { padding: 16 },
  profileInner: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: { width: 48, height: 48, borderRadius: radius.pill, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#1A1400", fontSize: 20, fontWeight: "800" },
  profileName: { color: colors.ink, fontSize: 18, lineHeight: 22, fontWeight: "800" },
  profileSub: { color: colors.muted, fontSize: 13, lineHeight: 18, fontWeight: "600", marginTop: 3 },

  setRow: { minHeight: 64, paddingHorizontal: 16, paddingVertical: 12 },
  setRowInner: { flexDirection: "row", alignItems: "center", gap: 14 },
  setWell: { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: colors.well },
  chev: { color: colors.muted, fontSize: 22, fontWeight: "600" },
  toggle: { width: 46, height: 28, borderRadius: radius.pill, overflow: "hidden", justifyContent: "center", padding: 3 },
  toggleKnob: { width: 22, height: 22, marginLeft: "auto", borderRadius: radius.pill, backgroundColor: colors.white, shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 3 }
});
