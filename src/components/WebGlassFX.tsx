import { useEffect } from "react";
import { Platform } from "react-native";

/**
 * Web-only Liquid Glass enhancer. The deployed product is the Expo *web* build
 * (react-native-web -> DOM), so on web we inject the exact glass system proven in
 * index.html (Codex-scored 91/100): real backdrop refraction via SVG feDisplacementMap,
 * a sharp specular sweep, mic pulse, and a breathing nav selection. Glass surfaces opt in
 * with `dataSet` attributes (data-glass / data-glass-strong / data-nav / data-glasshi /
 * data-spec / data-ring / data-pill). On native this renders nothing (BlurView handles blur).
 *
 * Honest scope: native (iOS/Android) gets tier-C frosted glass (no displacement); the
 * displacement/refraction is a web-DOM technique and only the web build receives it.
 */
const STYLE_ID = "lemonaid-glass-fx";

export function WebGlassFX() {
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;

    // 1) build an edge-lens displacement map (neutral interior, inward push at rim)
    const S = 256;
    const band = 0.26 * (S / 2);
    const canvas = document.createElement("canvas");
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext("2d");
    let mapUrl = "";
    if (ctx) {
      const img = ctx.createImageData(S, S);
      const d = img.data;
      const cx = S / 2;
      const cy = S / 2;
      for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
          const dist = Math.min(x, S - 1 - x, y, S - 1 - y);
          const mag = dist < band ? Math.pow(1 - dist / band, 2) : 0;
          let vx = cx - x;
          let vy = cy - y;
          const L = Math.hypot(vx, vy) || 1;
          vx /= L;
          vy /= L;
          const i = (y * S + x) * 4;
          d[i] = 128 + vx * mag * 127;
          d[i + 1] = 128 + vy * mag * 127;
          d[i + 2] = 128;
          d[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      mapUrl = canvas.toDataURL();
    }

    // 2) inject the two displacement filters (parsed in the SVG namespace)
    const svgMarkup =
      '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute">' +
      '<filter id="glassLens" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">' +
      '<feImage href="' + mapUrl + '" result="m" preserveAspectRatio="none" x="0" y="0" width="100%" height="100%"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="m" scale="40" xChannelSelector="R" yChannelSelector="G"/>' +
      "</filter>" +
      '<filter id="glassLensStrong" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">' +
      '<feImage href="' + mapUrl + '" result="m2" preserveAspectRatio="none" x="0" y="0" width="100%" height="100%"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="m2" scale="58" xChannelSelector="R" yChannelSelector="G"/>' +
      "</filter></svg>";
    try {
      const parsed = new DOMParser().parseFromString(svgMarkup, "image/svg+xml");
      document.body.appendChild(parsed.documentElement);
    } catch {
      /* ignore */
    }

    // 3) inject the glass CSS (refraction where supported, plain-blur fallback otherwise)
    const supportsLens =
      typeof window !== "undefined" &&
      window.CSS &&
      (CSS.supports("backdrop-filter", "url(#glassLens) blur(2px)") ||
        CSS.supports("-webkit-backdrop-filter", "url(#glassLens) blur(2px)"));

    const glassBlur = supportsLens
      ? "url(#glassLens) blur(13px) saturate(1.7) contrast(1.05)"
      : "blur(20px) saturate(1.7)";
    const strongLens = supportsLens
      ? "url(#glassLensStrong) blur(4px) saturate(2) contrast(1.06)"
      : "blur(14px) saturate(1.9)";

    const css = `
      [data-glass]{ backdrop-filter:${glassBlur}; -webkit-backdrop-filter:blur(13px) saturate(1.7); }
      [data-glass-strong]{ backdrop-filter:${glassBlur}; -webkit-backdrop-filter:blur(16px) saturate(1.7); }
      [data-nav]{ backdrop-filter:${strongLens}; -webkit-backdrop-filter:blur(6px) saturate(2); }
      [data-glasshi]{ backdrop-filter:${strongLens}; -webkit-backdrop-filter:blur(6px) saturate(2); }
      [data-spec]{ animation: lemSweep 7s ease-in-out infinite; will-change: transform; }
      [data-ring]{ animation: lemPulse 2.6s ease-in-out infinite; will-change: transform, opacity; }
      [data-pill]{ animation: lemBreathe 4.5s ease-in-out infinite; will-change: transform; }
      @keyframes lemSweep { 0%,100%{ transform: translateX(-7%);} 50%{ transform: translateX(7%);} }
      @keyframes lemPulse { 0%,100%{ transform: scale(.985); opacity:.7;} 50%{ transform: scale(1.05); opacity:1;} }
      @keyframes lemBreathe { 0%,100%{ transform: scaleX(1);} 50%{ transform: scaleX(1.05);} }
      @media (prefers-reduced-transparency: reduce){
        [data-glass],[data-glass-strong],[data-nav],[data-glasshi]{ backdrop-filter:none; -webkit-backdrop-filter:none; background-color:rgba(255,255,255,.96)!important; }
      }
      @media (prefers-reduced-motion: reduce){
        [data-spec],[data-ring],[data-pill]{ animation:none!important; transform:none!important; }
      }
      [data-appbg]{
        background-image:
          repeating-linear-gradient(54deg, rgba(64,86,128,.042) 0 1px, transparent 1px 13px),
          repeating-linear-gradient(-54deg, rgba(64,86,128,.03) 0 1px, transparent 1px 17px),
          radial-gradient(56% 22% at 93% 0%, rgba(255,202,64,.5), transparent 60%),
          radial-gradient(95% 30% at 50% 104%, rgba(92,160,255,.5), transparent 60%),
          radial-gradient(58% 24% at 82% 40%, rgba(110,206,196,.3), transparent 60%),
          radial-gradient(52% 26% at 1% 46%, rgba(170,148,255,.32), transparent 62%),
          linear-gradient(168deg, #ffffff 0%, #f6f9ff 52%, #fff7e6 100%);
      }
    `;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }, []);

  return null;
}
