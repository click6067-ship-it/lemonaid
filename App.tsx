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
  Plus,
  RotateCw,
  Search,
  Settings,
  SlidersHorizontal,
  Type as TypeIcon,
  User,
  Utensils,
  Waves,
  type LucideIcon
} from "lucide-react-native";
import { useState, type ReactNode } from "react";
import {
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

function Toolbar({ title, sub, icon, fonts, label }: { title: string; sub: string; icon: ReactNode; fonts: FontSet; label: string }) {
  return (
    <View style={styles.toolbar}>
      <View style={styles.toolbarText}>
        <Text style={[styles.h1, ff(fonts, "extraBold")]}>{title}</Text>
        <Text style={[styles.sub, ff(fonts, "bold")]}>{sub}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={label} style={styles.iconBtn}>
        {icon}
      </Pressable>
    </View>
  );
}

function HomeScreen({ compact, fonts }: { compact: boolean; fonts: FontSet }) {
  const [recognizedIndex, setRecognizedIndex] = useState(0);
  const recognized = recognitionSamples[recognizedIndex];
  const cycle = () => setRecognizedIndex((i) => (i + 1) % recognitionSamples.length);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <Toolbar title="Good morning" sub="Small words, clear voice." label="Voice settings" fonts={fonts}
        icon={<SlidersHorizontal size={20} color={colors.strong} strokeWidth={2.3} />} />

      <ContentSurface radiusValue={radius.lg} style={styles.hero} contentStyle={styles.heroInner}>
        <Text style={[styles.eyebrow, ff(fonts, "bold")]}>SPEAK ASSIST</Text>
        <Text style={[styles.heroTitle, ff(fonts, "extraBold")]}>Press, then speak naturally.</Text>

        <View style={styles.voiceStage}>
          <View pointerEvents="none" {...webData({ ring: true })} style={styles.ringWrap}>
            <View style={[styles.ring, { width: 130, height: 130 }]} />
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Start listening" onPress={cycle} style={({ pressed }) => [styles.mic, pressed && styles.micPressed]}>
            <LinearGradient colors={[colors.lemon, colors.lemon2]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={styles.micGlyph}>
              <Mic size={44} color="#1A1400" strokeWidth={2.6} />
            </View>
          </Pressable>
        </View>

        <Text style={[styles.heroHint, ff(fonts, "bold")]}>Tap the mic, then speak slowly.</Text>
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
      <Toolbar title="Cards" sub="Tap a phrase to speak." label="Add card" fonts={fonts}
        icon={<Plus size={22} color={colors.strong} strokeWidth={2.3} />} />

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
      <Toolbar title="Saved" sub="Your fastest phrases." label="Add favorite" fonts={fonts}
        icon={<Plus size={22} color={colors.strong} strokeWidth={2.3} />} />

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
      <Toolbar title="Settings" sub="Voice and access." label="Settings" fonts={fonts}
        icon={<Settings size={20} color={colors.strong} strokeWidth={2.3} />} />

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

  hero: { backgroundColor: colors.lemonTint, borderColor: "rgba(244,190,0,0.16)" },
  heroInner: { padding: 24, alignItems: "center" },
  eyebrow: { fontSize: 11, lineHeight: 14, fontWeight: "800", letterSpacing: 1.4, color: "#A07C00", alignSelf: "flex-start" },
  heroTitle: { fontSize: 22, lineHeight: 28, fontWeight: "800", color: colors.ink, marginTop: 8, alignSelf: "flex-start", maxWidth: 280, letterSpacing: -0.2 },
  voiceStage: { height: 170, width: "100%", alignItems: "center", justifyContent: "center", marginTop: 4 },
  ringWrap: { position: "absolute", alignItems: "center", justifyContent: "center", width: 130, height: 130 },
  ring: { position: "absolute", borderRadius: radius.pill, borderWidth: 1.5, borderColor: "rgba(244,190,0,0.22)" },
  mic: {
    width: 96, height: 96, borderRadius: radius.pill, overflow: "hidden", alignItems: "center", justifyContent: "center",
    borderWidth: 3, borderColor: "rgba(255,255,255,0.95)", ...shadow.lemon
  },
  micGlyph: { position: "relative", zIndex: 1, alignItems: "center", justifyContent: "center" },
  micPressed: { transform: [{ scale: 0.95 }] },
  heroHint: { color: colors.muted, fontSize: 13, lineHeight: 17, fontWeight: "600", marginTop: 8 },

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
    backgroundColor: "rgba(255,207,36,0.18)"
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
  statsPill: { paddingHorizontal: 11, height: 25, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,207,36,0.20)" },
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
