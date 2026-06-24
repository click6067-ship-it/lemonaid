# Lemonaid — Liquid Glass Design Notes

iOS 26 "Liquid Glass" redesign of the Lemonaid AAC app. Built from
`Liquid_Glass_iOS_Design_Report_KR.pdf` (Apple-official: WWDC25/26 + Newsroom) and
verified with an adversarial Codex scoring loop against a 100-point rubric
(see `docs/superpowers/specs/2026-06-25-liquid-glass-redesign-design.md`).

## 2026-06-25 — Restraint pass (anti-"AI-slop")
Client feedback: the glass-maximalist build (rainbow background blooms, glowing halos,
animated specular sweeps, translucent low-contrast cards, an invisible lemon-on-lemon mic)
read as awkward / "AI slop" despite scoring 91 on the *glass-fidelity* rubric. That rubric
rewarded exactly the noise that looked generated. This pass re-scores against a **"real shipped
app vs. AI slop"** rubric and executes the project's own "1 hero + calm" philosophy properly:
- Calm near-solid background (warm-white → light gray); rainbow radials + hairlines removed.
- Opaque, high-contrast white content cards (`ContentSurface`); animated specular sweeps removed.
- Lemon is a single disciplined accent (mic + primary button); secondary uses are softened tints.
- Home mic is now a clearly-legible microphone control (the glyph was painting *under* the
  absolute-positioned gradient — fixed with a `position:relative`/`zIndex` wrapper).
- Cards is a real **2-column** grid (was collapsing to 1 column via JS width-math → now `48%` flex).
- Glass is kept only on the floating nav. Codex (gpt) re-score: **84/100, AI-slop risk LOW**
  (converged 84→82→84; remaining notes were preference / conflicted with AAC large-target intent).

**Result: both artifacts scored 91/100 (PASS, ≥90) by Codex (gpt-5.5) judging rendered screenshots.**
- `index.html` — static 4-screen design board (source of truth). Loop: 74→73→82→84→86→88→89→89→**91**.
- `App.tsx` + `src/*` — the deployed Expo **web** app (`expo export --platform web` → Vercel). **91**.

## Render strategy — C default, B on web
The deployed product is Expo **web** (react-native-web → DOM), so the practical target is tier **C**
(approximation) with tier **B** (real refraction) layered on where the web allows it. Tier **A** (Apple's
OS `UIGlassEffect`) is iOS-native only and unusable for a web build.

- **C — 7-cue approximation** (everywhere): translucent material + backdrop blur(+saturate+contrast) +
  specular highlight + edge stroke/rim + adaptive contrast + dynamic shadow + morph.
- **B — real backdrop refraction** (web only): SVG `feDisplacementMap` on `backdrop-filter: url(#glassLens)`
  bends the substrate at glass edges (the web equivalent of `react-native-skia` displacement). Injected by
  `src/components/WebGlassFX.tsx` for the web build; gated behind `CSS.supports` with a plain-blur fallback,
  and disabled under `prefers-reduced-transparency`. Native (iOS/Android) falls back to `expo-blur` frost.
- See `glass-compare.html` for a live side-by-side of C (frost) vs B (lens) — open
  `glass-compare.html?scale=140&blur=3` to make the bending unmistakable.

## Approximation cue → implementation
| Cue | CSS (index.html) | React Native (App.tsx) |
|---|---|---|
| Translucent material | `background: rgba(255,255,255,.22)` | translucent `View` over `BlurView` |
| Backdrop blur | `backdrop-filter: blur()` | `BlurView` (native) / injected CSS (web) |
| Specular highlight | animated `::after` sweep | `LinearGradient` overlay (`data-spec` web sweep) |
| Edge rim + chromatic | bright top border + cyan/warm insets | `rim` View borders |
| Refraction (B, web) | `backdrop-filter: url(#glassLens)` | `WebGlassFX` injects the same filter |
| Adaptive contrast | `--glass-bg-strong` under text + a11y queries | `bgStrong` content under text |
| Dynamic shadow | layered soft + contact shadow | `shadow.glass` / `shadow.content` |
| Morph | `:active scale` + keyframe sweep/pulse/breathe | `Pressable` state + web keyframes |

## Tokens (single source of truth — `src/theme.ts` mirrors index.html `:root`)
```
glass.bg        rgba(255,255,255,.22)
glass.bgStrong  rgba(255,255,255,.42)   (surfaces bearing text)
glass.stroke    rgba(255,255,255,.62)   top brighter (1.0)
glass.content   rgba(252,253,255,.92)   opaque CONTENT (not glass)
radius          screen 44 · lg 28 · md 20 · sm 16 · pill
accent          lemon #FFD749 / #F7C821 — mic, primary action, active tab/chip, toggle, avatar ONLY
```
Removed from the old design: neumorphic double shadows, the 5-colour blob set
(mint/aqua/coral/violet per-card), and scattered radii.

## Layer hierarchy (what is glass vs content)
- **Content** (lists, rows, phrase cards): opaque flat `ContentSurface`, no blur — keeps the material
  hierarchy legible and the screen un-busy.
- **Navigation**: floating glass capsule tab bar (`BottomNav`, the primary glass), narrow (not docked),
  active = soft lemon pill riding an inset track; content scrolls under it (scroll-edge fade above).
- **Controls**: glass toolbar buttons, search (`hi` refraction), chips; press → scale morph.
- **Hero (1 per screen)**: lemon voice field + pulsing rings + mic (Home), stats (Saved), profile
  (Settings), search (Cards). Restraint = 1 hero + 1–2 support glass per screen.

## Substrate
Faint high-frequency hairlines + soft colour blooms behind the glass so the refraction has something to
visibly bend (smooth gradients alone make displacement invisible). Web: injected `[data-appbg]` CSS;
native: a light gradient + two muted blobs.

## Accessibility (report §9)
`prefers-reduced-transparency` → opaque fallback (blur off); `prefers-reduced-motion` → animations off;
text rides `bgStrong`/content surfaces for AA; every icon-only control has an `accessibilityLabel`.

## Verifying / iterating
- Render: headless Chromium screenshot of `index.html` or the served `dist/` (`expo export`).
- Score: `codex exec` judges the screenshot(s) against the rubric (JSON via `--output-schema`).
  Pass the prompt on **stdin** and images via `-i` (the `-i` flag is variadic and will otherwise eat the
  prompt). Keep the prompt self-contained (inline the source) so Codex doesn't crawl the repo and hang.
