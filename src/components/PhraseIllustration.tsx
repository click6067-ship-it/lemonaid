import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";

import { colors } from "../theme";
import type { PhraseCard } from "../types";

type PhraseIllustrationProps = {
  type: PhraseCard["image"];
  accent: string;
};

export function PhraseIllustration({ type, accent }: PhraseIllustrationProps) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 74 62" fill="none" preserveAspectRatio="xMidYMid meet">
      <Ellipse cx={37} cy={53} rx={25} ry={6} fill="rgba(39,48,68,0.10)" />
      {type === "help" ? <Help accent={accent} /> : null}
      {type === "water" ? <Water accent={accent} /> : null}
      {type === "pain" ? <Pain accent={accent} /> : null}
      {type === "food" ? <Food accent={accent} /> : null}
      {type === "anxious" ? <Anxious accent={accent} /> : null}
      {type === "caregiver" ? <Caregiver accent={accent} /> : null}
    </Svg>
  );
}

function Help({ accent }: { accent: string }) {
  return (
    <G>
      <Circle cx={37} cy={18} r={12} fill="#FFF7D1" />
      <Path d="M28 31c3-5 15-5 18 0l3 17H25l3-17Z" fill={accent} opacity={0.9} />
      <Path d="M23 33c-3-4-2-9 2-10 4-1 6 2 7 6M51 33c3-4 2-9-2-10-4-1-6 2-7 6" stroke={colors.ink} strokeWidth={3} strokeLinecap="round" />
      <Path d="M31 18c3 4 9 4 12 0" stroke={colors.ink} strokeWidth={2.4} strokeLinecap="round" />
    </G>
  );
}

function Water({ accent }: { accent: string }) {
  return (
    <G>
      <Path d="M37 8s16 17 16 30a16 16 0 0 1-32 0C21 25 37 8 37 8Z" fill={accent} opacity={0.26} />
      <Path d="M37 13s12 14 12 24a12 12 0 1 1-24 0c0-10 12-24 12-24Z" fill="#DDF9FF" />
      <Path d="M31 39c3 4 9 4 12 0" stroke={accent} strokeWidth={3} strokeLinecap="round" />
      <Circle cx={32} cy={31} r={2} fill={colors.ink} />
      <Circle cx={42} cy={31} r={2} fill={colors.ink} />
    </G>
  );
}

function Pain({ accent }: { accent: string }) {
  return (
    <G>
      <Rect x={16} y={25} width={42} height={17} rx={8.5} transform="rotate(-18 16 25)" fill="#FFE2DE" />
      <Rect x={20} y={26} width={34} height={13} rx={6.5} transform="rotate(-18 20 26)" fill="#FFFFFF" opacity={0.76} />
      <Path d="m33 27 9 9M42 27l-9 9" stroke={accent} strokeWidth={3} strokeLinecap="round" />
      <Circle cx={23} cy={39} r={2} fill={accent} />
      <Circle cx={52} cy={24} r={2} fill={accent} />
    </G>
  );
}

function Food({ accent }: { accent: string }) {
  return (
    <G>
      <Path d="M19 31h36c0 11-8 19-18 19S19 42 19 31Z" fill="#E9FFF5" />
      <Path d="M23 31h28" stroke={colors.ink} strokeWidth={3} strokeLinecap="round" />
      <Path d="M30 25c3-5 7-5 10 0 3-4 7-4 10 0" stroke={accent} strokeWidth={3} strokeLinecap="round" />
      <Path d="M30 50h14" stroke={colors.ink} strokeWidth={3} strokeLinecap="round" />
      <Circle cx={31} cy={38} r={2} fill={colors.ink} />
      <Circle cx={43} cy={38} r={2} fill={colors.ink} />
    </G>
  );
}

function Anxious({ accent }: { accent: string }) {
  return (
    <G>
      <Circle cx={37} cy={29} r={20} fill="#F2ECFF" />
      <Path d="M26 22c2-3 6-3 8 0M40 22c2-3 6-3 8 0" stroke={colors.ink} strokeWidth={3} strokeLinecap="round" />
      <Path d="M31 40c3-4 9-4 12 0" stroke={accent} strokeWidth={3} strokeLinecap="round" />
      <Path d="M18 18c-4 5-4 16 0 22M56 18c4 5 4 16 0 22" stroke={accent} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
    </G>
  );
}

function Caregiver({ accent }: { accent: string }) {
  return (
    <G>
      <Circle cx={29} cy={22} r={10} fill="#FFF7D1" />
      <Circle cx={47} cy={24} r={9} fill="#EAF2FF" />
      <Path d="M15 50c3-12 25-12 28 0H15Z" fill={accent} opacity={0.78} />
      <Path d="M35 50c2-9 20-9 23 0H35Z" fill="#CFE5FF" />
      <Path d="M25 23c2 3 6 3 8 0M44 25c2 2 5 2 7 0" stroke={colors.ink} strokeWidth={2.4} strokeLinecap="round" />
    </G>
  );
}
