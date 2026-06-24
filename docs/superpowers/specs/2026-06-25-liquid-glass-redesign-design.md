# Lemonaid — Liquid Glass Redesign (Design + Scoring Rubric)

Date: 2026-06-25
Targets: `index.html` (4-screen mockup board, visual source of truth) + `App.tsx` / `src/theme.ts` / `src/components/*` (Expo web app, the Vercel-deployed product).
Reference: `Liquid_Glass_iOS_Design_Report_KR.pdf` (Apple-official-based: WWDC25/26 sessions S1–S9, Newsroom).

## Goal
Reach **real latest iOS (iOS 26) Liquid Glass** look & feel, scored ≥ 90/100 by an adversarial Codex judge, faithful to the report's **content-first restraint**, keeping **Lemonaid lemon-yellow as a focused accent**.

## Render strategy (agreed)
| Tier | Method | Where | Decision |
|---|---|---|---|
| **C** (default) | 7-cue approximation: translucent material + backdrop blur(+saturate+contrast) + specular + edge stroke/rim + adaptive contrast + dynamic shadow + morph | every glass element, iOS·Android·**web common** | ✅ ship |
| **B** (option, kept open) | real backdrop displacement (lensing): web = SVG `feDisplacementMap` on `backdrop-filter: url(#lens)`; native = `react-native-skia` Backdrop+DisplacementMap | hero (mic/voice) only, graceful fallback to C | 🔶 Phase 2 / demoed in `glass-compare.html` |
| **A** | OS system glass (`UIGlassEffect`) | iOS native only — useless for web build | ❌ not used |

Why C is the pragmatic optimum: the product ships as Expo **web** (react-native-web → Vercel). A is iOS-only; B (Skia/WebGL) is heavy and awkward to compose with react-native-web. C is the cross-platform common denominator that still satisfies the report's 7 cues. Real lensing exists; it's just overkill for a web-deployed mockup except on a single hero.

## Approximation technique → implementation mapping
| Cue | Simulates | CSS (index.html) | React Native (App.tsx) |
|---|---|---|---|
| Translucent material | floating layer, background bleeds | `background: rgba(255,255,255,.42)` | `BlurView` + translucent `View` |
| Backdrop blur | frost / layer separation | `backdrop-filter: blur(24px)` | `BlurView intensity tint="light"` |
| Tint sampling feel | glass picks up backdrop color | `saturate(1.45)` + faint tint | color overlay View over blur |
| Specular highlight | sharp glint | `::before` diagonal `linear-gradient(#fff→transparent)` | absolute `LinearGradient` overlay |
| Edge stroke / rim | refractive bright edge | `border:1px` + brighter top + `inset 0 1px 0 #fff` | `borderWidth:1` + bright top inset View |
| Adaptive contrast | legibility on translucency | `--glass-bg-strong` under text; a11y media queries | text-area opacity bump View |
| Dynamic shadow | floating depth | soft diffuse + tight contact shadow | platform shadow / elevation |
| Morphing | alive/fluid | `:active{transform:scale(.985)}` + transition | `Pressable` state + Animated |

## Design tokens (single source of truth — mirror identically into `src/theme.ts`)
```
--glass-bg:        rgba(255,255,255,.42)
--glass-bg-strong: rgba(255,255,255,.64)   /* surfaces bearing text */
--glass-stroke:    rgba(255,255,255,.70)
--glass-stroke-top:rgba(255,255,255,.95)   /* brighter top rim */
--glass-shadow:    0 18px 55px rgba(28,38,64,.16), 0 2px 8px rgba(28,38,64,.08)
--glass-inner:     inset 0 1px 0 rgba(255,255,255,.80)
--glass-blur:      blur(24px) saturate(1.45) contrast(1.04)
--specular:        linear-gradient(135deg, rgba(255,255,255,.95), rgba(255,255,255,0) 42%)
--radius-lg: 28px  --radius-md: 20px  --radius-sm: 16px  --radius-pill: 999px
accent: --lemon #ffd749  --lemon-2 #f7c821  ink #15171f  muted #5b6475
```
REMOVE: neumorphic double shadows (`--shadow-light:-13px -13px…`), multi-color blob set (mint/aqua/coral/violet card colors), scattered radii.

## Layer hierarchy (what is glass vs content)
- **Content** (lists, text, card bodies): opaque light surfaces, no blur, readability first.
- **Navigation** (tab bar, top toolbar): floating glass — the primary glass area; sits over content; shadow/opacity shifts on scroll.
- **Controls** (buttons, chips, toggle): glass capsule + specular rim; press → `scale(.985)` morph; active chip = liquid pill.
- **Hero** (1 per screen): the lemon voice/mic field (Home), stats (Saved), profile (Settings), search (Cards).
- Restraint: **1 hero glass + 1–2 support glass** per screen. Everything else is content.

## Per-screen plan
- **Home**: hero = lemon voice field with mic (glass + optional B lens) · support = result card (strong glass) + exactly 2 recent rows (content).
- **Cards**: search (glass) + chips (active=lemon pill) + grid of **neutral** phrase cards (content, dark-ink icons, no per-card color).
- **Saved**: stats hero (glass) + favorite list rows (content) + mini play (glass control).
- **Settings**: profile (glass) + setting rows (content light) + lemon toggle.
- Floating glass tab bar on all four.

## Geometry, motion, accessibility
- Concentric radii: phone 44 → panel 28 → control 20 → chip/pill. One consistent step-down.
- Motion: press scale+shadow shrink; active tab capsule; (web hero) optional pointer-driven specular.
- A11y (report §9): text glass uses `--glass-bg-strong` for AA; `@media (prefers-reduced-transparency: reduce)` → opaque fallback; `@media (prefers-reduced-motion: reduce)` → drop transforms; never color-only state.

---

# SCORING RUBRIC (100 pts) — Codex judges each round
Score = sum. Target ≥ 90. Each dimension: award full only if implemented AND visually convincing (per Claude's rendered screenshots) AND code-correct. Deduct with specific reasons.

| # | Dimension | Pts | Full-credit criteria |
|---|---|---:|---|
| 1 | Translucency & layer separation | 10 | Glass is genuinely translucent (backdrop visible); content vs control layers distinct; NOT everything glass |
| 2 | Backdrop blur quality | 8 | Real blur+saturate+contrast stack, not flat opacity; tuned per layer |
| 3 | Specular highlight | 10 | Diagonal glint + edge glint present on glass; reads as light on glass (bonus: motion/pointer responsive) |
| 4 | Edge stroke / rim (lensing approx) | 10 | 1px bright rim, brighter top, inner highlight; conveys refractive glass edge |
| 5 | Adaptive contrast / legibility | 10 | Text on glass passes ~AA (≥4.5 body / ≥3 large); stronger material under text; a11y fallbacks present |
| 6 | Dynamic shadow / floating depth | 8 | Soft diffuse + contact shadow; element reads as floating over content |
| 7 | Floating functional navigation | 10 | Tab bar floats as glass capsule over content (not a docked solid bar); toolbar grouping |
| 8 | Morphing / fluid interaction | 8 | Press morph (scale/shadow), active pill slide, smooth transitions; reduced-motion handled |
| 9 | Rounded / concentric geometry | 8 | Consistent radius hierarchy; capsules/pills; concentric with screen corners |
| 10 | Content-first restraint | 8 | 1 hero + 1–2 support glass per screen; limited blur layers; not busy/multicolor |
| 11 | Scroll edge effect | 5 | Content fades/blurs under nav/toolbar edge; layers stay legible |
| 12 | Accessibility adaptation | 5 | reduced-transparency + reduced-motion media queries; AA; shape/label not color-only |
| 13 | Brand discipline (Lemonaid yellow) | 5 | Yellow concentrated on mic/primary/active only; glass stays neutral; adaptive-tint spirit |
| 14 | Overall iOS-26 resemblance | 5 | Judge's holistic "does this look like real iOS 26 Liquid Glass" |

Codex output each round (machine-readable):
```
SCORE: <int>/100
PER-DIM: [{n, pts_awarded, max, gap}]
TOP_FIXES: [ordered, specific, actionable]
VERDICT: PASS (>=90) | ITERATE
```
