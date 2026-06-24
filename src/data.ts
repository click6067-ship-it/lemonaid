import type { PhraseCard } from "./types";
import { colors } from "./theme";

export const phraseCards: PhraseCard[] = [
  {
    phrase: "I need help",
    category: "Need",
    image: "help",
    color: "#D2A800",
    glow: "rgba(255, 230, 111, 0.72)"
  },
  {
    phrase: "I need water",
    category: "Drink",
    image: "water",
    color: "#149BB0",
    glow: "rgba(99, 211, 232, 0.45)"
  },
  {
    phrase: "I am in pain",
    category: "Health",
    image: "pain",
    color: "#E2644E",
    glow: "rgba(255, 142, 122, 0.40)"
  },
  {
    phrase: "I am hungry",
    category: "Food",
    image: "food",
    color: "#19A67A",
    glow: "rgba(88, 214, 176, 0.42)"
  },
  {
    phrase: "I feel anxious",
    category: "Feeling",
    image: "anxious",
    color: "#735EE7",
    glow: "rgba(157, 136, 255, 0.38)"
  },
  {
    phrase: "Call my caregiver",
    category: "People",
    image: "caregiver",
    color: "#437BDC",
    glow: "rgba(107, 165, 255, 0.38)"
  }
];

export const categories = ["Needs", "Pain", "Food", "People"];

export const favorites = [
  { phrase: "Please wait a moment.", category: "Everyday" },
  { phrase: "I need to rest.", category: "Comfort" },
  { phrase: "Where is the bathroom?", category: "Place" },
  { phrase: "Please call my family.", category: "Emergency" }
];

export const settings = [
  { title: "Voice Style", value: "Natural, warm", accent: colors.lemonSoft },
  { title: "Speech Speed", value: "Medium slow", accent: colors.lemonSoft },
  { title: "Large Cards", value: "Optimized touch size", accent: colors.lemonSoft },
  { title: "Card Library", value: "Needs, pain, food, people", accent: colors.lemonSoft }
];
