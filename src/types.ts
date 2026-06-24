export type TabKey = "home" | "cards" | "saved" | "settings";

export type PhraseCard = {
  phrase: string;
  category: string;
  image: "help" | "water" | "pain" | "food" | "anxious" | "caregiver";
  color: string;
  glow: string;
};
