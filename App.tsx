import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  Grid2X2,
  Mic,
  Play,
  Plus,
  RotateCw,
  Search,
  Settings,
  SlidersHorizontal,
  Type,
  Waves
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
import { GlassSurface, LemonButton } from "./src/components/GlassSurface";
import { PhoneStatusBar } from "./src/components/PhoneStatusBar";
import { PhraseIllustration } from "./src/components/PhraseIllustration";
import { categories, favorites, phraseCards, settings as settingRows } from "./src/data";
import { fontOptions, useOptionalFonts, type FontSet, type FontVariant } from "./src/fontPresets";
import { colors, radius, shadow, type } from "./src/theme";
import type { TabKey } from "./src/types";

const recentPhrases = [
  { phrase: "I am okay.", time: "Just now" },
  { phrase: "Please call my caregiver.", time: "8 min ago" }
];

const recognitionSamples = [
  "I need water. Please speak slowly.",
  "I am okay. I need to rest.",
  "Please call my caregiver.",
  "Where is the bathroom?"
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>(getInitialTab());
  const fontsLoaded = useOptionalFonts();
  const fontVariant = getInitialFont();
  const fonts = fontOptions[fontVariant];
  const { width, height } = useWindowDimensions();
  const compact = height < 760;

  let content: ReactNode = <HomeScreen compact={compact} fonts={fonts} />;
  if (activeTab === "cards") content = <CardsScreen compact={compact} fonts={fonts} />;
  if (activeTab === "saved") content = <SavedScreen compact={compact} fonts={fonts} />;
  if (activeTab === "settings") content = <SettingsScreen compact={compact} fonts={fonts} />;

  return (
    <View style={styles.stage}>
      <StatusBar hidden />
      <View style={[styles.appFrame, Platform.OS === "web" && { width: Math.min(width, 430), minHeight: Math.min(height, 920) }]}>
        <LinearGradient
          colors={["#FFFEFA", "#F8FBFF", "#FFF8D6"]}
          locations={[0, 0.52, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Blob style={styles.blobLemon} color="rgba(255, 215, 73, 0.58)" />
        <Blob style={styles.blobAqua} color="rgba(99, 211, 232, 0.28)" />
        <Blob style={styles.blobViolet} color="rgba(157, 136, 255, 0.24)" />

        <PhoneStatusBar />
        <View style={styles.content}>{fontsLoaded ? content : null}</View>
        <BottomNav activeTab={activeTab} onChange={setActiveTab} fontFamily={fonts.extraBold} />
      </View>
    </View>
  );
}

function getInitialTab(): TabKey {
  if (Platform.OS !== "web" || typeof window === "undefined") return "home";
  const tab = new URLSearchParams(window.location.search).get("tab");
  if (tab === "cards" || tab === "saved" || tab === "settings" || tab === "home") return tab;
  return "home";
}

function getInitialFont(): FontVariant {
  if (Platform.OS !== "web" || typeof window === "undefined") return "ios";
  const font = new URLSearchParams(window.location.search).get("font");
  if (font === "ios" || font === "geist" || font === "jakarta") return font;
  return "ios";
}

function fontFace(fonts: FontSet, weight: "regular" | "bold" | "extraBold"): any {
  const fontFamily = fonts[weight];
  return fontFamily ? { fontFamily } : undefined;
}

function HomeScreen({ compact, fonts }: { compact: boolean; fonts: FontSet }) {
  const [recognizedIndex, setRecognizedIndex] = useState(0);
  const [lastAction, setLastAction] = useState("Ready");
  const recognized = recognitionSamples[recognizedIndex];

  function cycleRecognition() {
    setRecognizedIndex((current) => (current + 1) % recognitionSamples.length);
    setLastAction("Listening complete");
  }

  function playPhrase(phrase: string) {
    setLastAction(`Playing: ${phrase}`);
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, compact && styles.scrollCompact]}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={[styles.h1, fontFace(fonts, "extraBold")]}>Good morning, Alex</Text>
          <Text style={[styles.subtitle, fontFace(fonts, "bold")]}>Small words, clear voice.</Text>
        </View>
        <GlassIcon>
          <Waves size={21} color={colors.ink} strokeWidth={2.2} />
        </GlassIcon>
      </View>

      <View style={[styles.homeHero, compact && styles.homeHeroCompact]}>
        <LinearGradient
          colors={["#FFFACC", colors.lemon, "rgba(255, 215, 73, 0.54)", "rgba(255,255,255,0.34)"]}
          locations={[0, 0.35, 0.58, 1]}
          style={StyleSheet.absoluteFill}
        />
        <Blob style={styles.heroAquaBlob} color="rgba(99, 211, 232, 0.56)" />
        <Blob style={styles.heroWhiteBlob} color="rgba(255,255,255,0.72)" />
        <Text style={[styles.label, fontFace(fonts, "extraBold")]}>SPEAK ASSIST</Text>
        <Text style={[styles.heroTitle, fontFace(fonts, "extraBold")]}>Press and speak naturally.</Text>
        <View style={[styles.voiceStage, compact && styles.voiceStageCompact]}>
          <View style={styles.voiceRingOuter} />
          <View style={styles.voiceRingMid} />
          <View style={styles.voiceRingInner} />
          <Pressable accessibilityRole="button" accessibilityLabel="Start listening" onPress={cycleRecognition} style={({ pressed }) => [styles.micButton, pressed && styles.pressed]}>
            <LinearGradient colors={["#FFF8BD", colors.lemon, colors.lemonDeep]} style={StyleSheet.absoluteFill} />
            <View style={styles.micHighlight} />
            <Mic size={46} color={colors.ink} strokeWidth={2.8} />
          </Pressable>
        </View>
      </View>

      <GlassSurface style={[styles.resultCard, compact && styles.resultCardCompact]} radiusValue={30} intensity={58}>
        <Text style={[styles.label, fontFace(fonts, "extraBold")]}>RECOGNIZED TEXT · {lastAction}</Text>
        <Text style={[styles.resultText, fontFace(fonts, "extraBold")]}>{recognized}</Text>
        <View style={styles.resultActions}>
          <Pressable accessibilityRole="button" accessibilityLabel="Play clear voice" onPress={() => playPhrase(recognized)} style={styles.playButton}>
            <LemonButton style={styles.playButtonSurface}>
              <View style={styles.playButtonContent}>
                <Play size={18} color={colors.ink} fill={colors.ink} />
                <Text style={[styles.playButtonText, fontFace(fonts, "extraBold")]}>Play clear voice</Text>
              </View>
            </LemonButton>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Try again" onPress={cycleRecognition}>
            <GlassSurface style={styles.retryButton} contentStyle={styles.centerContent} radiusValue={18} intensity={44}>
              <RotateCw size={20} color={colors.strong} strokeWidth={2.4} />
            </GlassSurface>
          </Pressable>
        </View>
      </GlassSurface>

      <View style={styles.recentList}>
        {recentPhrases.map((item) => (
          <GlassSurface key={item.phrase} style={styles.recentItem} contentStyle={styles.rowBetween} radiusValue={24} intensity={42}>
            <View>
              <Text style={[styles.recentPhrase, fontFace(fonts, "extraBold")]}>{item.phrase}</Text>
              <Text style={[styles.recentTime, fontFace(fonts, "extraBold")]}>{item.time}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={`Play ${item.phrase}`} onPress={() => playPhrase(item.phrase)}>
              <Play size={17} color={colors.ink} fill={colors.ink} />
            </Pressable>
          </GlassSurface>
        ))}
      </View>
    </ScrollView>
  );
}

function CardsScreen({ compact, fonts }: { compact: boolean; fonts: FontSet }) {
  const { width } = useWindowDimensions();
  const [spokenPhrase, setSpokenPhrase] = useState("Ready");
  const frameWidth = Platform.OS === "web" ? Math.min(width, 430) : width;
  const tileWidth = Math.floor((frameWidth - 44 - 11) / 2);
  const narrow = frameWidth < 360;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, compact && styles.scrollCompact]}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={[styles.h1, fontFace(fonts, "extraBold")]}>Cards</Text>
          <Text style={[styles.subtitle, fontFace(fonts, "bold")]}>{spokenPhrase === "Ready" ? "Tap a phrase to speak." : spokenPhrase}</Text>
        </View>
        <GlassIcon>
          <Plus size={24} color={colors.ink} strokeWidth={2.3} />
        </GlassIcon>
      </View>

      <GlassSurface style={styles.searchBox} contentStyle={styles.searchInner} radiusValue={21} intensity={52}>
        <Search size={22} color={colors.soft} strokeWidth={2.3} />
        <Text style={[styles.searchText, fontFace(fonts, "bold")]}>Search phrases</Text>
      </GlassSurface>

      <View style={styles.categoryRow}>
        {categories.map((category, index) => (
          <GlassSurface key={category} style={[styles.categoryChip, index === 0 && styles.categoryChipActive]} contentStyle={styles.centerContent} radiusValue={24} intensity={44}>
            <Text style={[styles.categoryText, fontFace(fonts, "extraBold")]}>{category}</Text>
          </GlassSurface>
        ))}
      </View>

      <View style={styles.cardGrid}>
        {phraseCards.map((card) => (
          <PhraseTile key={card.phrase} card={card} fonts={fonts} tileWidth={tileWidth} narrow={narrow} onSpeak={setSpokenPhrase} />
        ))}
      </View>
    </ScrollView>
  );
}

function SavedScreen({ compact, fonts }: { compact: boolean; fonts: FontSet }) {
  const [lastPlayed, setLastPlayed] = useState("Your fastest phrases.");

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, compact && styles.scrollCompact]}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={[styles.h1, fontFace(fonts, "extraBold")]}>Saved</Text>
          <Text style={[styles.subtitle, fontFace(fonts, "bold")]}>{lastPlayed}</Text>
        </View>
        <GlassIcon>
          <Plus size={24} color={colors.ink} strokeWidth={2.3} />
        </GlassIcon>
      </View>

      <View style={styles.savedHero}>
        <LinearGradient colors={["#FFF4AA", colors.lemon, "#D9F7ED"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <Blob style={styles.savedWhiteBlob} color="rgba(255,255,255,0.72)" />
        <Text style={[styles.label, fontFace(fonts, "extraBold")]}>THIS WEEK</Text>
        <Text style={[styles.savedHeroTitle, fontFace(fonts, "extraBold")]}>42 phrases spoken</Text>
        <Text style={[styles.savedHeroSub, fontFace(fonts, "extraBold")]}>Most used: “Please wait.”</Text>
        <GlassSurface style={styles.favoriteStat} radiusValue={27} intensity={50}>
          <Text style={[styles.favoriteStatNumber, fontFace(fonts, "extraBold")]}>12</Text>
          <Text style={[styles.favoriteStatLabel, fontFace(fonts, "extraBold")]}>favorites</Text>
        </GlassSurface>
      </View>

      <View style={styles.favoriteList}>
        {favorites.map((item) => (
          <GlassSurface key={item.phrase} style={styles.favoriteRow} radiusValue={28} intensity={46}>
            <View style={styles.favoriteText}>
              <Text style={[styles.favoritePhrase, fontFace(fonts, "extraBold")]}>{item.phrase}</Text>
              <Text style={[styles.favoriteCategory, fontFace(fonts, "extraBold")]}>{item.category}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={`Play ${item.phrase}`} onPress={() => setLastPlayed(`Playing: ${item.phrase}`)} style={styles.playMini}>
              <LemonButton style={styles.playMiniSurface}>
                <Play size={18} color={colors.ink} fill={colors.ink} />
              </LemonButton>
            </Pressable>
          </GlassSurface>
        ))}
      </View>
    </ScrollView>
  );
}

function SettingsScreen({ compact, fonts }: { compact: boolean; fonts: FontSet }) {
  const icons = [Waves, SlidersHorizontal, Type, Grid2X2];

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, compact && styles.scrollCompact]}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={[styles.h1, fontFace(fonts, "extraBold")]}>Settings</Text>
          <Text style={[styles.subtitle, fontFace(fonts, "bold")]}>Voice and access.</Text>
        </View>
        <GlassIcon>
          <Settings size={22} color={colors.ink} strokeWidth={2.3} />
        </GlassIcon>
      </View>

      <GlassSurface style={styles.profileCard} contentStyle={styles.profileContent} radiusValue={38} intensity={56}>
        <View style={styles.avatar}>
          <LinearGradient colors={["#FFF8BD", "#D9F7ED"]} style={StyleSheet.absoluteFill} />
          <Text style={[styles.avatarText, fontFace(fonts, "extraBold")]}>A</Text>
        </View>
        <View>
          <Text style={[styles.profileName, fontFace(fonts, "extraBold")]}>Alex</Text>
          <Text style={[styles.profileSub, fontFace(fonts, "extraBold")]}>Premium clear voice{"\n"}English · Calm tone</Text>
        </View>
      </GlassSurface>

      <View style={styles.settingsList}>
        {settingRows.map((row, index) => {
          const Icon = icons[index];
          const toggle = index === 2;
          return (
            <GlassSurface key={row.title} style={styles.settingRow} radiusValue={27} intensity={44}>
              <View style={styles.settingIcon}>
                <Icon size={22} color={colors.muted} strokeWidth={2.3} />
              </View>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, fontFace(fonts, "extraBold")]}>{row.title}</Text>
                <Text style={[styles.settingValue, fontFace(fonts, "extraBold")]}>{row.value}</Text>
              </View>
              {toggle ? <Toggle /> : <Text style={[styles.chevron, fontFace(fonts, "bold")]}>›</Text>}
            </GlassSurface>
          );
        })}
      </View>
    </ScrollView>
  );
}

function PhraseTile({
  card,
  fonts,
  tileWidth,
  narrow,
  onSpeak
}: {
  card: (typeof phraseCards)[number];
  fonts: FontSet;
  tileWidth: number;
  narrow: boolean;
  onSpeak: (phrase: string) => void;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Speak ${card.phrase}`} onPress={() => onSpeak(`Speaking: ${card.phrase}`)} style={({ pressed }) => [{ width: tileWidth }, pressed && styles.pressed]}>
      <GlassSurface style={[styles.phraseCard, narrow && styles.phraseCardNarrow]} contentStyle={styles.phraseCardContent} radiusValue={28} intensity={42}>
        <Blob style={styles.phraseGlow} color={card.glow} />
        <GlassSurface style={[styles.phraseImage, narrow && styles.phraseImageNarrow]} contentStyle={styles.centerContent} radiusValue={24} intensity={28}>
          <PhraseIllustration type={card.image} accent={card.color} />
        </GlassSurface>
        <Text style={[styles.phraseText, narrow && styles.phraseTextNarrow, fontFace(fonts, "extraBold")]}>{card.phrase}</Text>
        <Text style={[styles.phraseCategory, fontFace(fonts, "extraBold")]}>{card.category}</Text>
      </GlassSurface>
    </Pressable>
  );
}

function GlassIcon({ children }: { children: ReactNode }) {
  return (
    <GlassSurface style={styles.glassIcon} contentStyle={styles.centerContent} radiusValue={18} intensity={44}>
      {children}
    </GlassSurface>
  );
}

function Toggle() {
  return (
    <View style={styles.toggle}>
      <LinearGradient colors={["#FFF7B6", colors.lemon]} style={StyleSheet.absoluteFill} />
      <View style={styles.toggleKnob} />
    </View>
  );
}

function Blob({ color, style }: { color: string; style: object }) {
  return <View pointerEvents="none" style={[styles.blob, { backgroundColor: color }, style]} />;
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC"
  },
  appFrame: {
    width: "100%",
    height: "100%",
    maxWidth: Platform.OS === "web" ? 430 : undefined,
    overflow: "hidden",
    backgroundColor: colors.cream
  },
  blob: {
    position: "absolute",
    borderRadius: radius.pill,
    opacity: 1
  },
  blobLemon: {
    width: 290,
    height: 290,
    right: -118,
    bottom: 28
  },
  blobAqua: {
    width: 240,
    height: 240,
    right: -86,
    top: 260
  },
  blobViolet: {
    width: 240,
    height: 240,
    left: -105,
    top: 128
  },
  content: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 110
  },
  scrollCompact: {
    paddingTop: 12
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 18
  },
  headerText: {
    flex: 1
  },
  h1: {
    ...type.h1
  },
  subtitle: {
    ...type.body,
    marginTop: 7
  },
  label: {
    ...type.label
  },
  glassIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center"
  },
  homeHero: {
    minHeight: 318,
    overflow: "hidden",
    borderRadius: 36,
    padding: 22,
    ...shadow.lemon
  },
  homeHeroCompact: {
    minHeight: 292
  },
  heroAquaBlob: {
    width: 230,
    height: 230,
    left: -82,
    bottom: -70
  },
  heroWhiteBlob: {
    width: 170,
    height: 170,
    right: -52,
    top: -42
  },
  heroTitle: {
    ...type.h2,
    maxWidth: 270,
    marginTop: 10
  },
  voiceStage: {
    height: 166,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  voiceStageCompact: {
    height: 138
  },
  voiceRingOuter: {
    position: "absolute",
    width: 166,
    height: 166,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.78)"
  },
  voiceRingMid: {
    position: "absolute",
    width: 124,
    height: 124,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.66)"
  },
  voiceRingInner: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.72)"
  },
  micButton: {
    width: 112,
    height: 112,
    borderRadius: 44,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.86)",
    ...shadow.lemon
  },
  micHighlight: {
    position: "absolute",
    top: 9,
    left: 13,
    right: 13,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.48)"
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92
  },
  resultCard: {
    marginTop: -28,
    padding: 17,
    transform: [{ rotate: "-2.2deg" }]
  },
  resultCardCompact: {
    marginTop: -20
  },
  resultText: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    marginTop: 7
  },
  resultActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12
  },
  playButton: {
    flex: 1
  },
  playButtonSurface: {
    minHeight: 48
  },
  playButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  playButtonText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "800"
  },
  retryButton: {
    width: 52,
    height: 48,
    alignItems: "center",
    justifyContent: "center"
  },
  recentList: {
    marginTop: 15,
    gap: 12
  },
  recentItem: {
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center"
  },
  recentPhrase: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "800"
  },
  recentTime: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "800",
    marginTop: 3
  },
  searchBox: {
    height: 54,
    paddingHorizontal: 16,
    justifyContent: "center"
  },
  searchInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  searchText: {
    color: colors.soft,
    fontSize: 14,
    fontWeight: "800"
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 18
  },
  categoryChip: {
    flexGrow: 1,
    minWidth: 64,
    minHeight: 66,
    alignItems: "center",
    justifyContent: "center"
  },
  categoryChipActive: {
    backgroundColor: colors.lemon
  },
  categoryText: {
    color: colors.strong,
    fontSize: 11,
    fontWeight: "800"
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 11
  },
  phraseCard: {
    minHeight: 124,
    padding: 14
  },
  phraseCardNarrow: {
    minHeight: 112,
    padding: 10
  },
  phraseCardContent: {
    minHeight: 96,
    alignItems: "center",
    justifyContent: "center"
  },
  phraseGlow: {
    width: 108,
    height: 108,
    right: -39,
    top: -34
  },
  phraseImage: {
    width: 86,
    height: 70,
    alignItems: "center",
    justifyContent: "center"
  },
  phraseImageNarrow: {
    width: 72,
    height: 58
  },
  phraseText: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "800",
    marginTop: 10,
    textAlign: "center"
  },
  phraseTextNarrow: {
    fontSize: 15,
    lineHeight: 18
  },
  phraseCategory: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "800",
    marginTop: 5,
    textAlign: "center"
  },
  savedHero: {
    minHeight: 174,
    overflow: "hidden",
    borderRadius: 36,
    padding: 20,
    ...shadow.lemon
  },
  savedWhiteBlob: {
    width: 210,
    height: 210,
    right: -88,
    bottom: -105
  },
  savedHeroTitle: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
    maxWidth: 220,
    marginTop: 8
  },
  savedHeroSub: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
    marginTop: 10
  },
  favoriteStat: {
    position: "absolute",
    right: 22,
    bottom: 20,
    width: 104,
    padding: 15
  },
  favoriteStatNumber: {
    color: colors.ink,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "800"
  },
  favoriteStatLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2
  },
  favoriteList: {
    gap: 10,
    marginTop: 16
  },
  favoriteRow: {
    minHeight: 70,
    paddingLeft: 17,
    paddingRight: 13,
    paddingVertical: 11
  },
  favoriteText: {
    paddingRight: 66
  },
  favoritePhrase: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "800"
  },
  favoriteCategory: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "800",
    marginTop: 4
  },
  playMini: {
    position: "absolute",
    right: 13,
    top: 11,
    width: 49,
    height: 49
  },
  playMiniSurface: {
    width: 49,
    height: 49,
    minHeight: 49
  },
  profileCard: {
    minHeight: 166,
    padding: 20
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 34,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: colors.strong,
    fontSize: 38,
    lineHeight: 45,
    fontWeight: "800"
  },
  profileName: {
    color: colors.ink,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "800"
  },
  profileSub: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    marginTop: 6
  },
  settingsList: {
    gap: 10,
    marginTop: 18
  },
  settingRow: {
    minHeight: 66,
    padding: 10,
    paddingRight: 15
  },
  settingIcon: {
    position: "absolute",
    left: 15,
    top: 9,
    width: 48,
    height: 48,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 247, 184, 0.62)"
  },
  settingText: {
    paddingLeft: 66,
    paddingRight: 58,
    justifyContent: "center",
    minHeight: 46
  },
  settingTitle: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 17,
    fontWeight: "800"
  },
  settingValue: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "800",
    marginTop: 4
  },
  chevron: {
    position: "absolute",
    right: 17,
    top: 20,
    color: colors.muted,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "700"
  },
  toggle: {
    position: "absolute",
    right: 15,
    top: 16,
    width: 56,
    height: 34,
    borderRadius: radius.pill,
    overflow: "hidden",
    padding: 4,
    ...shadow.lemon
  },
  toggleKnob: {
    width: 26,
    height: 26,
    marginLeft: "auto",
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    shadowColor: "#3F4658",
    shadowOpacity: 0.2,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4
  }
});
