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
import { ContentSurface, Glass, LemonButton } from "./src/components/GlassSurface";
import { PhoneStatusBar } from "./src/components/PhoneStatusBar";
import { WebGlassFX } from "./src/components/WebGlassFX";
import { categories, favorites, phraseCards, settings as settingRows } from "./src/data";
import { fontOptions, useOptionalFonts, type FontSet, type FontVariant } from "./src/fontPresets";
import { colors, radius, shadow, type } from "./src/theme";
import type { PhraseCard, TabKey } from "./src/types";

const isWeb = Platform.OS === "web";
const webData = (o: object) => (isWeb ? ({ dataSet: o } as any) : {});

const recentPhrases = [
  { phrase: "I am okay.", time: "Just now" },
  { phrase: "Please call my caregiver.", time: "8 min ago" },
  { phrase: "Thank you so much.", time: "22 min ago" }
];

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
  const { width, height } = useWindowDimensions();
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
        style={[styles.appFrame, isWeb && { width: Math.min(width, 412), minHeight: Math.min(height, 920) }]}
      >
        {!isWeb && (
          <>
            <LinearGradient colors={["#FFFFFF", "#F6F9FF", "#FFF7E6"]} locations={[0, 0.52, 1]} style={StyleSheet.absoluteFill} />
            <View pointerEvents="none" style={[styles.blob, styles.blobLemon]} />
            <View pointerEvents="none" style={[styles.blob, styles.blobBlue]} />
          </>
        )}

        <PhoneStatusBar />
        <View style={styles.content}>{fontsLoaded ? content : null}</View>
        {/* scroll-edge: soft fade just above the floating nav (content passes under it) */}
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(248,250,255,0)", "rgba(248,250,255,0.55)"]}
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
      <Glass variant="glass" radiusValue={radius.pill} style={styles.gbtn} contentStyle={styles.center}>
        <View accessibilityRole="button" accessibilityLabel={label}>{icon}</View>
      </Glass>
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
        icon={<Waves size={21} color={colors.strong} strokeWidth={2.2} />} />

      <View style={[styles.hero, compact && { minHeight: 268 }]}>
        <LinearGradient
          colors={[colors.lemonHi, colors.lemon, colors.lemon2, "rgba(255,233,142,0.7)"]}
          locations={[0, 0.28, 0.56, 1]}
          start={{ x: 0.5, y: 0.1 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0)"]} start={{ x: 0.1, y: 0 }} end={{ x: 0.6, y: 0.5 }} style={StyleSheet.absoluteFill} pointerEvents="none" />
        <Text style={[styles.eyebrow, ff(fonts, "extraBold")]}>SPEAK ASSIST</Text>
        <Text style={[styles.heroTitle, ff(fonts, "extraBold")]}>Press and speak naturally.</Text>
        <View style={styles.voiceStage}>
          <View pointerEvents="none" {...webData({ ring: true })} style={styles.ringWrap}>
            <View style={[styles.ring, { width: 168, height: 168 }]} />
            <View style={[styles.ring, { width: 126, height: 126 }]} />
            <View style={[styles.ring, { width: 88, height: 88 }]} />
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Start listening" onPress={cycle} style={({ pressed }) => [styles.mic, pressed && styles.micPressed]}>
            <LinearGradient colors={["#FFF6B0", colors.lemon, colors.lemon2]} start={{ x: 0.3, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
            <Mic size={44} color="#1A1400" strokeWidth={2.6} />
          </Pressable>
        </View>
      </View>

      <Glass variant="strong" radiusValue={radius.md} style={styles.result}>
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
          <Pressable accessibilityRole="button" accessibilityLabel="Try again" onPress={cycle}>
            <Glass variant="glass" radiusValue={radius.sm} style={styles.retry} contentStyle={styles.center}>
              <RotateCw size={19} color={colors.strong} strokeWidth={2.3} />
            </Glass>
          </Pressable>
        </View>
      </Glass>

      <Text style={[styles.sectionLabel, ff(fonts, "extraBold")]}>RECENT</Text>
      <View style={styles.rows}>
        {recentPhrases.map((item) => (
          <ContentSurface key={item.phrase} radiusValue={radius.md} style={styles.row} contentStyle={styles.rowBetween}>
            <View>
              <Text style={[styles.rowTitle, ff(fonts, "bold")]}>{item.phrase}</Text>
              <Text style={[styles.rowMeta, ff(fonts, "bold")]}>{item.time}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={`Play ${item.phrase}`} style={styles.playMini}>
              <Play size={16} color={colors.strong} fill={colors.strong} />
            </Pressable>
          </ContentSurface>
        ))}
      </View>
    </ScrollView>
  );
}

function CardsScreen({ compact, fonts }: { compact: boolean; fonts: FontSet }) {
  const { width } = useWindowDimensions();
  const frame = isWeb ? Math.min(width, 412) : width;
  const tileWidth = Math.floor((frame - 40 - 12) / 2);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <Toolbar title="Cards" sub="Tap a phrase to speak." label="Add card" fonts={fonts}
        icon={<Plus size={22} color={colors.strong} strokeWidth={2.3} />} />

      <Glass variant="hi" radiusValue={radius.md} style={styles.search} contentStyle={styles.searchInner}>
        <Search size={20} color={colors.soft} strokeWidth={2.3} />
        <Text style={[styles.searchText, ff(fonts, "bold")]}>Search phrases</Text>
      </Glass>

      <View style={styles.chips}>
        {categories.map((category, index) => {
          const active = index === 0;
          return active ? (
            <View key={category} style={[styles.chip, styles.chipActive]}>
              <LinearGradient colors={["#FFF3A6", colors.lemon]} start={{ x: 0.3, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
              <Text style={[styles.chipText, { color: "#1A1400" }, ff(fonts, "extraBold")]}>{category}</Text>
            </View>
          ) : (
            <View key={category} style={styles.chip}>
              <Text style={[styles.chipText, ff(fonts, "extraBold")]}>{category}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.grid}>
        {phraseCards.map((card) => {
          const Icon = phraseIcons[card.image];
          return (
            <Pressable key={card.phrase} accessibilityRole="button" accessibilityLabel={`Speak ${card.phrase}`} style={({ pressed }) => [{ width: tileWidth }, pressed && styles.cardPressed]}>
              <ContentSurface radiusValue={radius.md} style={styles.card} contentStyle={styles.cardInner}>
                <View style={styles.cardWell}>
                  <Icon size={20} color={colors.strong} strokeWidth={2.2} />
                </View>
                <Text style={[styles.cardTitle, ff(fonts, "bold")]}>{card.phrase}</Text>
                <Text style={[styles.cardCat, ff(fonts, "bold")]}>{card.category}</Text>
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

      <Glass variant="strong" radiusValue={radius.lg} style={styles.stats}>
        <View style={styles.statsPill}>
          <LinearGradient colors={["#FFF3A6", colors.lemon]} start={{ x: 0.3, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
          <Text style={[styles.statsPillText, ff(fonts, "extraBold")]}><Text style={{ fontSize: 15 }}>12</Text> saved</Text>
        </View>
        <Text style={[styles.label, ff(fonts, "extraBold")]}>THIS WEEK</Text>
        <Text style={[styles.statsBig, ff(fonts, "extraBold")]}>42 phrases spoken</Text>
        <Text style={[styles.statsMeta, ff(fonts, "bold")]}>Most used — “Please wait a moment.”</Text>
      </Glass>

      <Text style={[styles.sectionLabel, ff(fonts, "extraBold")]}>FAVORITES</Text>
      <View style={styles.rows}>
        {favorites.map((item) => (
          <ContentSurface key={item.phrase} radiusValue={radius.md} style={styles.row} contentStyle={styles.rowBetween}>
            <View style={styles.flex1}>
              <Text style={[styles.rowTitle, ff(fonts, "bold")]}>{item.phrase}</Text>
              <Text style={[styles.rowMeta, ff(fonts, "bold")]}>{item.category}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={`Play ${item.phrase}`} style={styles.playMini}>
              <Play size={16} color={colors.strong} fill={colors.strong} />
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
        icon={<Settings size={21} color={colors.strong} strokeWidth={2.3} />} />

      <Glass variant="strong" radiusValue={radius.lg} style={styles.profile} contentStyle={styles.profileInner}>
        <View style={styles.avatar}>
          <LinearGradient colors={["#FFF3A6", colors.lemon]} start={{ x: 0.3, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFill} />
          <Text style={[styles.avatarText, ff(fonts, "extraBold")]}>A</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={[styles.profileName, ff(fonts, "extraBold")]}>Alex</Text>
          <Text style={[styles.profileSub, ff(fonts, "bold")]}>Premium clear voice · English · Calm tone</Text>
        </View>
      </Glass>

      <Text style={[styles.sectionLabel, ff(fonts, "extraBold")]}>PREFERENCES</Text>
      <View style={styles.rows}>
        {settingRows.map((row, index) => {
          const Icon = icons[index];
          const toggle = index === 2;
          return (
            <ContentSurface key={row.title} radiusValue={radius.md} style={styles.setRow} contentStyle={styles.setRowInner}>
              <View style={styles.setWell}>
                <Icon size={20} color={colors.strong} strokeWidth={2.2} />
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
      <LinearGradient colors={["#FFF3A6", colors.lemon]} style={StyleSheet.absoluteFill} />
      <View style={styles.toggleKnob} />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#EEF2F8" },
  appFrame: { width: "100%", height: "100%", maxWidth: isWeb ? 412 : undefined, overflow: "hidden", backgroundColor: colors.cream },
  blob: { position: "absolute", borderRadius: radius.pill, opacity: 1 },
  blobLemon: { width: 260, height: 260, right: -90, top: -40, backgroundColor: "rgba(255,202,64,0.4)" },
  blobBlue: { width: 320, height: 320, left: -60, bottom: -120, backgroundColor: "rgba(108,170,255,0.34)" },
  content: { flex: 1 },
  scrollEdge: { position: "absolute", left: 0, right: 0, bottom: 82, height: 36 },
  scroll: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 44 },

  toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 14, paddingVertical: 12 },
  toolbarText: { flex: 1 },
  h1: { ...type.h1 },
  sub: { ...type.body, marginTop: 3 },
  gbtn: { width: 46, height: 46 },
  center: { alignItems: "center", justifyContent: "center", flex: 1 },
  flex1: { flex: 1 },

  hero: { minHeight: 290, borderRadius: radius.lg, overflow: "hidden", padding: 20, ...shadow.lemon },
  eyebrow: { fontSize: 11, lineHeight: 14, fontWeight: "800", letterSpacing: 0.6, color: "#8A6A00" },
  heroTitle: { fontSize: 24, lineHeight: 29, fontWeight: "800", color: "#2A1F00", marginTop: 6, maxWidth: 230 },
  voiceStage: { height: 168, alignItems: "center", justifyContent: "center", marginTop: 4 },
  ringWrap: { position: "absolute", alignItems: "center", justifyContent: "center", width: 168, height: 168 },
  ring: { position: "absolute", borderRadius: radius.pill, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.7)" },
  mic: {
    width: 108, height: 108, borderRadius: 40, overflow: "hidden", alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.5)", ...shadow.lemon
  },
  micPressed: { transform: [{ scale: 0.96 }] },

  result: { marginTop: -26, marginHorizontal: 6, padding: 16 },
  label: { ...type.label },
  resultText: { color: colors.ink, fontSize: 17, lineHeight: 22, fontWeight: "700", marginTop: 7 },
  resultActions: { flexDirection: "row", gap: 10, marginTop: 13 },
  playRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  playText: { color: "#1A1400", fontSize: 14, fontWeight: "800" },
  retry: { width: 50, minHeight: 46 },

  sectionLabel: { fontSize: 11, lineHeight: 14, fontWeight: "800", letterSpacing: 0.5, color: colors.soft, marginTop: 18, marginBottom: 10, marginLeft: 4 },
  rows: { gap: 10 },
  row: { minHeight: 60, paddingHorizontal: 14, paddingVertical: 12 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  rowTitle: { color: colors.ink, fontSize: 15, lineHeight: 19, fontWeight: "700" },
  rowMeta: { color: colors.muted, fontSize: 12, lineHeight: 15, fontWeight: "600", marginTop: 3 },
  playMini: {
    width: 38, height: 38, borderRadius: radius.pill, alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.85)", borderWidth: 1, borderColor: "rgba(231,236,244,0.9)"
  },

  search: { height: 50, paddingHorizontal: 16, justifyContent: "center" },
  searchInner: { flexDirection: "row", alignItems: "center", gap: 10 },
  searchText: { color: colors.soft, fontSize: 14, fontWeight: "600" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 9, marginVertical: 14 },
  chip: {
    minHeight: 38, paddingHorizontal: 16, borderRadius: radius.pill, alignItems: "center", justifyContent: "center",
    overflow: "hidden", backgroundColor: "rgba(255,255,255,0.66)", borderWidth: 1, borderColor: "rgba(231,236,244,0.9)", ...shadow.content
  },
  chipActive: { borderColor: "rgba(255,255,255,0.6)", ...shadow.lemon },
  chipText: { color: colors.strong, fontSize: 13, fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: { minHeight: 116, padding: 14 },
  cardInner: { flex: 1, justifyContent: "space-between" },
  cardPressed: { transform: [{ scale: 0.975 }] },
  cardWell: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(20,28,48,0.05)" },
  cardTitle: { color: colors.ink, fontSize: 15, lineHeight: 19, fontWeight: "700", marginTop: 12 },
  cardCat: { color: colors.muted, fontSize: 12, lineHeight: 15, fontWeight: "600", marginTop: 2 },

  stats: { padding: 20, minHeight: 132 },
  statsPill: { position: "absolute", top: 16, right: 16, paddingHorizontal: 13, height: 30, borderRadius: radius.pill, overflow: "hidden", alignItems: "center", justifyContent: "center", ...shadow.lemon },
  statsPillText: { color: "#1A1400", fontSize: 12, fontWeight: "800" },
  statsBig: { color: colors.ink, fontSize: 28, lineHeight: 33, fontWeight: "800", marginTop: 4, maxWidth: 220 },
  statsMeta: { color: colors.muted, fontSize: 13, lineHeight: 18, fontWeight: "600", marginTop: 6 },

  profile: { padding: 16 },
  profileInner: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: { width: 54, height: 54, borderRadius: radius.pill, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#1A1400", fontSize: 22, fontWeight: "800" },
  profileName: { color: colors.ink, fontSize: 18, lineHeight: 22, fontWeight: "800" },
  profileSub: { color: colors.muted, fontSize: 13, lineHeight: 18, fontWeight: "600", marginTop: 3 },

  setRow: { minHeight: 62, paddingHorizontal: 14, paddingVertical: 10 },
  setRowInner: { flexDirection: "row", alignItems: "center", gap: 13 },
  setWell: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(20,28,48,0.05)" },
  chev: { color: colors.soft, fontSize: 18, fontWeight: "700" },
  toggle: { width: 50, height: 30, borderRadius: radius.pill, overflow: "hidden", justifyContent: "center", padding: 3 },
  toggleKnob: { width: 24, height: 24, marginLeft: "auto", borderRadius: radius.pill, backgroundColor: colors.white, shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 3 }
});
