import { useEffect } from "react";
import { Platform } from "react-native";

import { WEB_FONT_FAMILIES } from "../fontPresets";

/**
 * Web-only style enhancer for the Expo web build (react-native-web -> DOM).
 * Provides a calm app background and a clean frosted blur for the floating nav +
 * small glass controls. Deliberately restrained: no rainbow blooms, no animated
 * specular sweeps — just one gentle mic-ring pulse. Honors reduced-transparency
 * and reduced-motion. Native (iOS/Android) renders nothing (expo-blur handles blur).
 */
const STYLE_ID = "lemonaid-glass-fx";

export function WebGlassFX() {
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;

    // Load candidate brand fonts (Google Fonts). Mapped to FontVariant in fontPresets.
    if (!document.getElementById("lemonaid-fonts")) {
      const pre1 = document.createElement("link");
      pre1.rel = "preconnect"; pre1.href = "https://fonts.googleapis.com";
      const pre2 = document.createElement("link");
      pre2.rel = "preconnect"; pre2.href = "https://fonts.gstatic.com"; pre2.crossOrigin = "anonymous";
      const link = document.createElement("link");
      link.id = "lemonaid-fonts";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?" + WEB_FONT_FAMILIES.map((f) => "family=" + f).join("&") + "&display=swap";
      document.head.appendChild(pre1);
      document.head.appendChild(pre2);
      document.head.appendChild(link);
    }

    const css = `
      [data-nav]{ backdrop-filter: blur(20px) saturate(1.3); -webkit-backdrop-filter: blur(20px) saturate(1.3); }
      [data-glass],[data-glasshi]{ backdrop-filter: blur(14px) saturate(1.2); -webkit-backdrop-filter: blur(14px) saturate(1.2); }
      [data-glass-strong]{ backdrop-filter: blur(16px) saturate(1.2); -webkit-backdrop-filter: blur(16px) saturate(1.2); }
      [data-ring]{ animation: lemPulse 2.8s ease-in-out infinite; will-change: transform, opacity; }
      @keyframes lemPulse { 0%,100%{ transform: scale(.96); opacity:.55; } 50%{ transform: scale(1.04); opacity:.9; } }
      @media (prefers-reduced-transparency: reduce){
        [data-nav],[data-glass],[data-glass-strong],[data-glasshi]{
          backdrop-filter:none; -webkit-backdrop-filter:none; background-color:rgba(255,255,255,.97)!important;
        }
      }
      @media (prefers-reduced-motion: reduce){
        [data-ring]{ animation:none!important; transform:none!important; }
      }
      [data-appbg]{
        background-image:
          radial-gradient(120% 38% at 50% -8%, rgba(255,233,140,.18), transparent 60%),
          linear-gradient(180deg, #FBF8F1 0%, #F6F3EC 46%, #F6F3EC 100%);
      }
    `;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }, []);

  return null;
}
