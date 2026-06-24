# Lemonaid Design Notes

## Toss-Derived Tokens

| Token | Value | Use |
| --- | --- | --- |
| Canvas | `#FFFFFF` | App background and tab bar |
| Light surface | `#F9FAFB` | Quiet recent items and secondary areas |
| Secondary bg | `#F2F4F6` | Inputs, neutral buttons, icon wells |
| Divider | `#E5E8EB` | Rows, cards, tab border |
| Heading | `#191F28` | Top title, main AAC output, text on yellow |
| Strong label | `#333D4B` | Primary labels and icons |
| Sub | `#4E5968` | Secondary icons and chips |
| Body | `#6B7684` | Short helper/status copy |
| Caption | `#8B95A1` | Section labels, timestamps, inactive nav |
| Placeholder | `#B0B8C1` | Empty message state |
| Accent yellow | `#FFD91A` | Primary gesture, primary action, active chip |
| Accent deep | `#F5C800` | Yellow borders and active tab icon |
| Success | `#03B26C` | Enabled switch |
| Error | `#F04452` | Reserved destructive/error state |

| Scale | Values |
| --- | --- |
| Font | Pretendard CDN, then `-apple-system`, `Apple SD Gothic Neo`, `Noto Sans KR`, sans-serif |
| Type | Display 30/700/40, DisplayL 26/700/36, HeadingL 22/700/30, Heading 20/600/28, Subtitle 16/600/24, BodyL 16/400/24, Body 14/400/22, Caption 12/400/18 |
| Weights | 700, 600, 400 only |
| Spacing | 8px base, 20px screen padding, 32px section gap, 12px element gap |
| Radius | Cards 12px, primary/featured 16px, chips and switches pill |
| Elevation | Flat cards: `0 2px 8px rgba(0,0,0,.08)`; tactile controls use the lighter tokens below; phone shell keeps presentation shadow |
| Touch targets | Primary controls 58px+, tabs 68px, cards 126px, settings rows 68px |

## Yellow Adaptation

The mockup uses Toss's restraint but swaps Toss blue for Lemonaid yellow. Yellow is concentrated in the Voice hero field and microphone gesture, the Cards speak action, the Favorites add action, the active chip, and active bottom-tab icon color. Repeated row actions use neutral surfaces so the app does not become a yellow UI.

Yellow always pairs with `#191F28`; white text is never used on yellow.

## Tactile / Depth

This revision uses neumorphism-lite only as a selective, matte accent. The app remains light mode and avoids glossy highlights, specular shine, dark surfaces, and low-contrast gray-on-gray depth.

- Mic key: `linear-gradient(180deg, #FFE04A 0%, #FFD91A 48%, #FFD000 100%)`, `0 1px 0 rgba(255,255,255,.62) inset`, and `0 10px 24px rgba(245,200,0,.30)`, with a recessed active state of `0 2px 8px rgba(135,104,0,.20) inset`.
- Warm app canvas: `linear-gradient(180deg, #FFFFFF 0%, #FFFDF5 58%, #FFF9DC 100%)`, kept faint so white surfaces and dark text stay crisp.
- Raised matte controls: `0 1px 0 rgba(255,255,255,.72) inset, 0 8px 20px rgba(25,31,40,.08)` on symbol cards and favorite play buttons, with `0 2px 6px rgba(25,31,40,.08) inset` when pressed.
- Yellow CTAs reuse the matte accent gradient and warm elevation; symbol cards and favorite play buttons keep `1px` borders, so boundaries remain perceivable without relying on shadow.

Depth is decorative only. Text contrast is still carried by dark ink on yellow and dark ink on white, while tile/card separation still uses borders and surface contrast.

React Native / Expo port: use `Pressable` state for the recessed shadows, platform shadow props (`shadowColor`, `shadowOpacity`, `shadowRadius`, `shadowOffset`, plus Android `elevation`) for the soft lift, and `expo-linear-gradient` for the mic/CTA fill and faint canvas gradient.

## Voice Screen v5

The Voice first screen now uses a stronger lemon focal field, a larger matte raised mic key, and a more transparent frosted result card. The gradient sits on `.voice-hero` behind both the mic and the glass card, so the blur has saturated warm color to frost over without turning the whole app yellow.

- Gradient field: `radial-gradient(circle at 50% 18%, rgba(255,226,89,.96) 0%, rgba(255,196,0,.78) 31%, rgba(255,184,0,.52) 54%, rgba(255,244,168,.48) 72%, rgba(255,255,255,.84) 100%)`, a second center glow `radial-gradient(circle at 50% 46%, rgba(255,226,89,.92) 0%, rgba(255,196,0,.48) 35%, rgba(255,184,0,.2) 61%, rgba(255,255,255,0) 82%)`, over `linear-gradient(180deg, #FFE259 0%, #FFC400 48%, #FFB800 70%, #FFF6C7 100%)`.
- Matte mic: `linear-gradient(180deg, #FFE259 0%, #FFD21A 45%, #FFC400 100%)`, `1px` warm border, `0 1px 0 rgba(255,255,255,.66) inset`, `0 26px 46px rgba(183,138,0,.30)`, and `0 10px 18px rgba(25,31,40,.10)`.
- Mic glow and rings: 232px desktop mic stage with a larger radial halo `rgba(255,226,89,.48) -> rgba(255,196,0,.24) -> transparent`, plus 2.15s pulse rings using `rgba(183,138,0,.40)`, `rgba(255,226,89,.56)`, and `rgba(255,196,0,.48)`.
- Mic pressed state: `0 4px 14px rgba(135,104,0,.24) inset`, `0 1px 0 rgba(255,255,255,.36) inset`, and a reduced outer shadow for a recessed key.
- Glass result card: `background: rgba(255,255,255,.40)`, `backdrop-filter: blur(24px) saturate(1.4)`, `-webkit-backdrop-filter: blur(24px) saturate(1.4)`, `border: 1px solid rgba(255,255,255,.78)` with `border-top-color: rgba(255,255,255,.94)`, `0 1px 0 rgba(255,255,255,.72) inset`, `0 18px 44px rgba(78,89,104,.16)`, and a soft inner highlight overlay.
- Primary result action: solid matte yellow button, not glass, using the same `#FFE04A -> #FFD000` fill so the affordance remains unmistakable.

Contrast checks:

- Result-card text `#191F28` over the deepest warm glass composite `#FFD466` is `11.72:1`.
- Result-card label `#4E5968` over the deepest warm glass composite `#FFD466` is `5.03:1`.
- Result-card text `#191F28` over the main saturated glass composite `#FFDC66` is `12.37:1`.
- Result-card label `#4E5968` over the main saturated glass composite `#FFDC66` is `5.31:1`.
- Yellow action text `#191F28` over `#FFC400` is `10.37:1`.

React Native / Expo port: use `expo-linear-gradient` for the hero field and matte mic/action fills. Use `expo-blur` `BlurView` with intensity around `30` and `tint="light"` for the result card, then place a translucent white overlay above the blur to preserve text contrast. Use stacked shadow Views or platform shadow props for neumorphism-lite: outer soft shadow on the wrapper, `Pressable` state swapping to inset-like inner shadow treatment where the platform permits it.

## Icon-First Copy

Decorative subtitles and explanatory helper lines were removed. The UI keeps only functional text: AAC card words, favorite phrases, recent recognized phrases, terse status copy, and Settings labels/values.

Unambiguous controls use icon-only buttons with `aria-label`s: playback, redo, send, copy, delete, clear, add, and bottom tabs. The bottom tab bar has no visible Korean labels; each tab still exposes `aria-label="음성"`, `aria-label="카드"`, `aria-label="즐겨찾기"`, and `aria-label="설정"`.

## AAC-Size Deviations

Toss financial rows can be dense, but Lemonaid is communication-first. The visual language follows Toss through flat surfaces, greys, hierarchy, and a single accent, while target sizes stay larger than fintech defaults:

- Symbol cards remain large enough for motor accessibility.
- Tab buttons keep generous 68px hit areas despite icon-only rendering.
- Settings rows use a comfortable 68px height.
- Primary controls remain 58px+.

## Icon System

The mockup still uses one inline SVG sprite near the top of `body`. Every rendered icon is referenced as `<svg class="ic"><use href="#ic-name"></use></svg>`. Icons remain 24 by 24, `stroke-width="2"`, round caps, round joins, and `currentColor`.

Bottom tabs now rely on icon shape and accessible names instead of visible labels. Inactive icons are neutral grey; active icons use the yellow accent/deep yellow color.

## React Native / Expo Port Notes

- Map the CSS tokens into a `theme.ts` object before building components.
- Load Pretendard through the native font pipeline rather than the CDN used by this static HTML.
- Use `SafeAreaView` for the status/top and bottom tab spacing.
- Use `Pressable` with minimum heights matching the AAC touch tokens above.
- Port each `<symbol>` into a named `react-native-svg` component with the same 24 by 24 `viewBox`, 2px stroke, round caps, and `currentColor` equivalent via props.
- Preserve the icon names where possible, for example `IcHelpHand`, `IcDrop`, `IcCards`, and `IcSettings`.
- Keep bottom tabs icon-only in React Native, with `accessibilityLabel` values matching the current `aria-label`s.
