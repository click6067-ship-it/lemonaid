import type { PhraseCard, SettingRow } from "./types";

export const phraseCards: PhraseCard[] = [
  { phrase: "I need help", category: "Needs", image: "help" },
  { phrase: "I need water", category: "Drink", image: "water" },
  { phrase: "I am in pain", category: "Health", image: "pain" },
  { phrase: "I am hungry", category: "Food", image: "food" },
  { phrase: "I feel anxious", category: "Feeling", image: "anxious" },
  { phrase: "Call my caregiver", category: "People", image: "caregiver" },
  { phrase: "I need the bathroom", category: "Needs", image: "bathroom" },
  { phrase: "I need to rest", category: "Comfort", image: "rest" },
  { phrase: "Time for my medicine", category: "Health", image: "medicine" },
  { phrase: "Yes, please", category: "Reply", image: "yes" },
  { phrase: "No, thank you", category: "Reply", image: "no" },
  { phrase: "Thank you so much", category: "Social", image: "thanks" },
  { phrase: "I feel cold", category: "Feeling", image: "cold" },
  { phrase: "It is too hot", category: "Feeling", image: "hot" }
];

export const categories = ["All", "Needs", "Health", "Feeling", "Food", "Reply", "Social"];

export const favorites = [
  { phrase: "Please wait a moment.", category: "Everyday" },
  { phrase: "I need to rest.", category: "Comfort" },
  { phrase: "Where is the bathroom?", category: "Place" },
  { phrase: "Please call my family.", category: "Emergency" },
  { phrase: "Could you speak more slowly?", category: "Everyday" },
  { phrase: "I would like some water.", category: "Drink" },
  { phrase: "Thank you for your help.", category: "Social" },
  { phrase: "I am feeling much better.", category: "Health" }
];

export const settings: SettingRow[] = [
  { title: "Voice Style", value: "Natural, warm", icon: "voice" },
  { title: "Speech Speed", value: "Medium slow", icon: "speed" },
  { title: "Large Cards", value: "Optimized touch size", icon: "type", toggle: true },
  { title: "Card Library", value: "Needs, health, food…", icon: "grid" },
  { title: "Haptic Feedback", value: "Buzz on speak", icon: "haptic", toggle: true },
  { title: "Voice Language", value: "English (US)", icon: "globe" },
  { title: "High Contrast", value: "Off", icon: "contrast", toggle: false },
  { title: "Backup & Sync", value: "iCloud · just now", icon: "cloud" }
];
