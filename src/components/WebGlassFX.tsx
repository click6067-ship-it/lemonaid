import { useEffect } from "react";
import { Platform } from "react-native";

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
          radial-gradient(120% 38% at 50% -8%, rgba(255,207,36,.10), transparent 60%),
          linear-gradient(180deg, #FAFBFC 0%, #F3F4F7 46%, #F3F4F7 100%);
      }
    `;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }, []);

  return null;
}
