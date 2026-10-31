import React from 'react';
import { CHART } from '../theme';

// Poses the rigs understand. MarketMascot picks one; mascot.css animates the parts for each.
export type MascotPose = 'idle' | 'walk' | 'run' | 'talk' | 'celebrate' | 'sit' | 'grumpy' | 'sleep';

const BULL = {
  body: '#4FA97F',
  light: '#7CCBA4',
  shade: '#3A8463',
  far: '#33765A',
  dark: '#1E4636',
  muzzle: '#9ED9BB',
  horn: '#EFE7D2',
  hornShade: '#C8BC9C',
  hoof: '#141B17',
  eye: '#F6F3EA',
  pupil: '#0E1310',
  tie: CHART.mark,
  tieStripe: '#1B211E',
};

const BEAR = {
  body: '#D9584A',
  light: '#EC8173',
  shade: '#B4463A',
  far: '#9E3D33',
  dark: '#6E2620',
  muzzle: '#F3B2A6',
  nose: '#2A1210',
  paw: '#4A1A15',
  eye: '#F6F3EA',
  pupil: '#140B0A',
  scarf: '#2F3A48',
  scarfStripe: CHART.mark,
  mug: '#EFE7D2',
};

const origin = (x: number, y: number): React.CSSProperties => ({ transformOrigin: `${x}px ${y}px` });

interface LegProps {
  className: string;
  hipX: number;
  thighW: number;
  shinW: number;
  color: string;
  foot: string;
  children?: React.ReactNode;
}

// A leg hangs from the hip (y 76); the shin hangs from the knee and carries the hoof or paw,
// so a walk cycle can swing the thigh and fold the shin. The foot rests on the ground at y 110.
const HIP_Y = 76;
const KNEE_Y = 88;
const Leg: React.FC<LegProps> = ({ className, hipX, thighW, shinW, color, foot, children }) => (
  <g className={`m-leg ${className}`} style={origin(hipX, HIP_Y)}>
    <rect x={hipX - thighW / 2} y={HIP_Y - 6} width={thighW} height={22} rx={thighW / 2} fill={color} />
    <g className="m-shin" style={origin(hipX, KNEE_Y)}>
      <rect x={hipX - shinW / 2} y={KNEE_Y - 2} width={shinW} height={19} rx={shinW / 2} fill={color} />
      <rect x={hipX - (shinW + 3) / 2} y={102} width={shinW + 3} height={8} rx={2.6} fill={foot} />
      {children}
    </g>
  </g>
);

const Shadow: React.FC = () => (
  <ellipse className="m-shadow" cx="78" cy="111" rx="44" ry="4.5" fill="#000" opacity="0.3" style={origin(78, 111)} />
);

const Dust: React.FC = () => (
  <g className="m-dust" style={origin(30, 104)}>
    <circle cx="26" cy="106" r="4" fill={CHART.rule} />
    <circle cx="16" cy="101" r="3" fill={CHART.rule} />
    <circle cx="30" cy="99" r="2.4" fill={CHART.rule} />
  </g>
);

// Eyes come in three expressions; the pose decides which one shows.
const Eye: React.FC<{ cx: number; cy: number; r: number; white: string; pupil: string; line: string }> = ({
  cx,
  cy,
  r,
  white,
  pupil,
  line,
}) => (
  <g className="m-eye">
    <g className="m-eye-open" style={origin(cx, cy)}>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.1} fill={white} />
      <g className="m-pupil">
        <circle cx={cx + r * 0.3} cy={cy + r * 0.1} r={r * 0.55} fill={pupil} />
        <circle cx={cx + r * 0.5} cy={cy - r * 0.15} r={r * 0.18} fill={white} />
      </g>
    </g>
    <path className="m-eye-shut" d={`M ${cx - r} ${cy + 1} Q ${cx} ${cy + r * 0.8} ${cx + r} ${cy + 1}`} fill="none" stroke={line} strokeWidth="1.8" strokeLinecap="round" />
    <path className="m-eye-happy" d={`M ${cx - r} ${cy + 2} Q ${cx} ${cy - r * 1.1} ${cx + r} ${cy + 2}`} fill="none" stroke={line} strokeWidth="1.9" strokeLinecap="round" />
  </g>
);

export const BullRig = React.memo(function BullRig({ pose }: { pose: MascotPose }) {
  const c = BULL;
  return (
    <svg viewBox="0 0 160 120" className="mm-svg mm-bull" data-pose={pose} aria-hidden="true">
      <Shadow />
      <g className="m-all" style={origin(78, 110)}>
        <Dust />
        <g className="m-torso" style={origin(48, 108)}>
          <Leg className="m-leg-bf" hipX={48} thighW={15} shinW={8.5} color={c.far} foot={c.hoof} />
          <Leg className="m-leg-ff" hipX={96} thighW={13} shinW={8.5} color={c.far} foot={c.hoof} />

          {/* tail: the base swishes, the tuft follows a beat later */}
          <g className="m-tail" style={origin(34, 50)}>
            <path d="M 34 50 C 26 48 22 54 22 62" fill="none" stroke={c.body} strokeWidth="3.5" strokeLinecap="round" />
            <g className="m-tail-tip" style={origin(22, 62)}>
              <path d="M 22 59 C 16 62 16 71 22 73 C 27 71 27 63 22 59 Z" fill={c.dark} />
            </g>
          </g>

          <g className="m-chest" style={origin(74, 90)}>
            {/* rump → big shoulder hump → chest → belly */}
            <path d="M 34 52 C 36 40 52 34 66 33 C 76 26 92 24 104 32 C 112 37 116 46 116 56 C 116 70 110 82 98 86 C 84 90 60 90 46 86 C 34 82 28 70 34 52 Z" fill={c.body} />
            <path d="M 70 34 C 80 28 94 27 103 33 C 96 33 84 36 76 42 Z" fill={c.light} />
            <path d="M 46 84 C 62 89 86 89 98 85 C 92 80 60 80 46 84 Z" fill={c.shade} />
            <path d="M 52 50 C 58 58 58 72 52 82" fill="none" stroke={c.shade} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 96 44 C 92 56 92 70 98 82" fill="none" stroke={c.shade} strokeWidth="2.5" strokeLinecap="round" />
          </g>

          <Leg className="m-leg-bn" hipX={56} thighW={15} shinW={8.5} color={c.body} foot={c.hoof} />
          <Leg className="m-leg-fn" hipX={104} thighW={13} shinW={8.5} color={c.body} foot={c.hoof} />

          {/* the trader's tie, knotted at the neck; it streams back at a gallop */}
          <g className="m-tie" style={origin(109, 53)}>
            <path d="M 106 51 L 112 51 L 110.5 55 L 107.5 55 Z" fill={c.tie} />
            <path d="M 107.5 55 L 110.5 55 L 113 71 L 109 76 L 105 71 Z" fill={c.tie} />
            <path d="M 106.5 61 L 112 58.5 M 105.8 66 L 112.6 63" stroke={c.tieStripe} strokeWidth="1.3" opacity="0.6" />
          </g>

          <g className="m-head" style={origin(108, 46)}>
            <path className="m-horn-far" d="M 110 34 C 104 26 106 16 114 14 C 110 20 112 27 116 31 Z" fill={c.hornShade} />
            <g className="m-ear" style={origin(114, 39)}>
              <path d="M 114 37 C 106 34 99 38 97 43 C 103 45 110 43 114 41 Z" fill={c.shade} />
              <path d="M 111 38.5 C 106 37.5 102 39.5 101 41.5 C 105 42 109 41.2 111 40.3 Z" fill={c.muzzle} opacity="0.6" />
            </g>
            <path d="M 104 34 C 112 28 124 30 130 38 C 136 46 140 56 140 64 C 140 72 134 76 126 75 C 118 74 112 68 108 60 C 105 54 102 42 104 34 Z" fill={c.body} />
            <path d="M 112 30 C 115 24 121 27 119 31 C 123 26 128 30 124 34 C 119 33 115 33 112 30 Z" fill={c.dark} />
            <path className="m-horn" d="M 120 31 C 118 20 126 11 137 13 C 131 16 127 22 126 32 Z" fill={c.horn} />
            <path d="M 131 14 C 134 13 136 13 137 13 C 135 14.5 133.5 15.5 132.5 17 Z" fill={c.hornShade} />
            {/* broad, blocky muzzle with slanted nostril slits */}
            <path d="M 124 63 C 125 57 137 55 142 59 C 145.5 62 145 71 139 74 C 133 76.5 126 74.5 124.5 70 Z" fill={c.muzzle} />
            <ellipse className="m-nostril" cx="138.8" cy="62.6" rx="1.2" ry="2.5" fill={c.dark} transform="rotate(-24 138.8 62.6)" />
            <ellipse className="m-nostril" cx="131.6" cy="63.2" rx="1.1" ry="2.2" fill={c.dark} transform="rotate(20 131.6 63.2)" />
            <circle className="m-ring" cx="135" cy="72.5" r="3.6" fill="none" stroke={CHART.mark} strokeWidth="2" style={origin(135, 69)} />
            <path className="m-mouth-closed" d="M 127 72.5 Q 131 74.5 135 73.5" fill="none" stroke={c.dark} strokeWidth="1.4" strokeLinecap="round" />
            <ellipse className="m-mouth-open" cx="130.5" cy="73.6" rx="3.4" ry="2.6" fill={c.dark} />
            <path className="m-mouth-grin" d="M 125 71 Q 131 79 138 72.5 Q 131 75 125 71 Z" fill={c.dark} />
            <Eye cx={125} cy={46} r={4.3} white={c.eye} pupil={c.pupil} line={c.dark} />
            <path className="m-brow" d="M 118.5 39.5 L 130 42.2" stroke={c.dark} strokeWidth="2.6" strokeLinecap="round" style={origin(124, 41)} />
            <g className="m-steam">
              <circle cx="147" cy="66" r="3.4" fill={CHART.ink} />
              <circle cx="146" cy="60" r="2.6" fill={CHART.ink} />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
});

export const BearRig = React.memo(function BearRig({ pose }: { pose: MascotPose }) {
  const c = BEAR;
  return (
    <svg viewBox="0 0 160 120" className="mm-svg mm-bear" data-pose={pose} aria-hidden="true">
      <Shadow />
      <g className="m-all" style={origin(78, 110)}>
        <Dust />
        <g className="m-torso" style={origin(46, 108)}>
          <Leg className="m-leg-bf" hipX={46} thighW={18} shinW={12} color={c.far} foot={c.paw} />
          <Leg className="m-leg-ff" hipX={92} thighW={17} shinW={12} color={c.far} foot={c.paw} />

          <g className="m-tail" style={origin(31, 56)}>
            <circle cx="28" cy="56" r="5.5" fill={c.shade} />
            <g className="m-tail-tip" style={origin(28, 56)} />
          </g>

          <g className="m-chest" style={origin(72, 92)}>
            {/* rump → shoulder hump → chest → belly */}
            <path d="M 30 60 C 30 44 42 34 58 34 C 66 26 84 24 96 30 C 108 36 114 48 114 60 C 114 76 104 88 88 90 C 72 92 52 92 42 88 C 32 84 30 72 30 60 Z" fill={c.body} />
            <path d="M 62 33 C 72 26 86 25 95 30 C 86 31 74 34 66 40 Z" fill={c.light} />
            <path d="M 42 86 C 58 92 82 92 96 88 C 90 82 56 82 42 86 Z" fill={c.shade} />
            <path d="M 50 46 l -3 5 M 58 42 l -3 5 M 70 40 l -3 5 M 84 38 l -3 5" stroke={c.shade} strokeWidth="2" strokeLinecap="round" />
          </g>

          <Leg className="m-leg-bn" hipX={55} thighW={18} shinW={12} color={c.body} foot={c.paw} />
          <Leg className="m-leg-fn" hipX={101} thighW={17} shinW={12} color={c.body} foot={c.paw}>
            {/* the ▼ mug, only shown while sitting */}
            <g className="m-mug">
              <rect x="104" y="88" width="13" height="15" rx="2.5" fill={c.mug} />
              <path d="M 117 91.5 C 122 91.5 122 99.5 117 99.5" fill="none" stroke={c.mug} strokeWidth="2.4" />
              <path d="M 107.5 93 L 113.5 93 L 110.5 98 Z" fill={c.body} />
              <g className="m-mug-steam">
                <path d="M 108 85 C 106 81 110 79 108 75" fill="none" stroke={CHART.ink} strokeWidth="1.6" strokeLinecap="round" />
                <path d="M 113 85 C 111 81 115 79 113 75" fill="none" stroke={CHART.ink} strokeWidth="1.6" strokeLinecap="round" />
              </g>
            </g>
          </Leg>

          {/* scarf: wrapped at the neck, the loose end trails behind when running */}
          <g className="m-scarf-tail" style={origin(100, 56)}>
            <path d="M 100 55 L 87 67 L 92 71 L 104 59 Z" fill={c.scarf} />
            <path d="M 92 63 L 96 67 M 89 66 L 93 70" stroke={c.scarfStripe} strokeWidth="1.4" />
          </g>

          <g className="m-head" style={origin(104, 48)}>
            <g className="m-ear" style={origin(110, 30)}>
              <circle cx="118" cy="25" r="5.6" fill={c.far} />
              <circle cx="107" cy="29" r="6.2" fill={c.body} />
              <circle cx="107" cy="29" r="3" fill={c.muzzle} opacity="0.7" />
            </g>
            <path d="M 100 40 C 102 28 116 24 126 30 C 132 34 134 42 134 48 L 146 54 C 150 56 150 62 145 64 C 138 67 128 66 120 64 C 110 62 102 54 100 40 Z" fill={c.body} />
            <ellipse cx="140" cy="59" rx="9" ry="6" fill={c.muzzle} />
            <ellipse cx="147" cy="55.5" rx="3.4" ry="2.6" fill={c.nose} />
            <path className="m-mouth-closed" d="M 135 63.5 Q 139 61.3 143 63.5" fill="none" stroke={c.dark} strokeWidth="1.4" strokeLinecap="round" />
            <g className="m-mouth-open">
              <ellipse cx="139.5" cy="63.8" rx="3.6" ry="2.8" fill={c.nose} />
              <path d="M 137 61.8 L 138.2 63.6 L 139.4 61.8 Z M 140 61.8 L 141.2 63.6 L 142.4 61.8 Z" fill={c.eye} />
            </g>
            <path className="m-mouth-grin" d="M 134 62 Q 139.5 68 145 62 Q 139.5 64.5 134 62 Z" fill={c.nose} />
            <Eye cx={125} cy={44} r={3.6} white={c.eye} pupil={c.pupil} line={c.dark} />
            <path className="m-brow" d="M 119 37.5 L 130.5 40.5" stroke={c.dark} strokeWidth="2.8" strokeLinecap="round" style={origin(125, 39)} />
            <g className="m-steam">
              <circle cx="114" cy="20" r="3.2" fill={CHART.ink} />
              <circle cx="120" cy="15" r="2.4" fill={CHART.ink} />
            </g>
          </g>

          {/* scarf wrap drawn over the neck */}
          <path d="M 98 46 C 104 54 116 58 125 56 L 126 62.5 C 116 65 102 61 95 53 Z" fill={c.scarf} />
          <path d="M 103 53.5 L 105 58.5 M 110 56 L 111 61 M 117 57.2 L 117.6 62.4" stroke={c.scarfStripe} strokeWidth="1.5" />
        </g>
      </g>
    </svg>
  );
});
