export type TabKey = "home" | "cards" | "saved" | "settings";

export type PhraseCard = {
  phrase: string;
  category: string;
  image: string;
};

export type SettingRow = {
  title: string;
  value: string;
  icon: string;
  toggle?: boolean;
};
