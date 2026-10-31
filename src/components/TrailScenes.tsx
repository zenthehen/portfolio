import React from 'react';
import { UserProfile, SkillGroup } from '../types/portfolio';
import { ArrowRight, Copy, Check, Linkedin, FileDown, RotateCcw } from 'lucide-react';
import { CHART } from '../theme';
import { stagger } from './reveal';

// Leader line pinning a note to the axis, shared with the milestone cards
const Leader: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <span
    aria-hidden="true"
    className={`reveal-leader card-leader absolute left-0 border-l border-dashed ${isActive ? 'border-ink' : 'border-ink-faint'}`}
  />
);

// One headline line that rises out of a mask
const RiseLine: React.FC<{ index: number; children: React.ReactNode }> = ({ index, children }) => (
  <span className="block overflow-hidden pb-[0.04em]">
    <span className="block reveal-rise" style={stagger(index, 150)}>
      {children}
    </span>
  </span>
);

// ── Scene 0: Pre-open (introduction) ──
export const BasecampScene = React.memo(function BasecampScene({ profile, onBegin }: { profile: UserProfile; onBegin: () => void }) {
  return (
    <section aria-label="Introduction" className="w-[min(600px,62vw)] mb-8 clearing-paper">
      <p className="reveal-item text-xs uppercase tracking-[0.14em] text-ink-soft" style={stagger(0, 0)}>
        Pre-open · 10:30 NPT · {profile.location.split(',').slice(-2).join(',').trim()}
      </p>

      <h1 className="mt-3 font-display font-extrabold uppercase text-ink text-[clamp(56px,9vw,128px)] leading-[0.86] tracking-[-0.01em]">
        <RiseLine index={0}>Rishal Raj</RiseLine>{' '}
        <RiseLine index={1}>
          <span
            className="mark inline-block mt-2 leading-[0.92]"
            style={{ '--mark-delay': '0.95s' } as React.CSSProperties}
          >
            Maskey
          </span>
        </RiseLine>
      </h1>

      <p className="reveal-item mt-5 max-w-[46ch] text-base text-ink-soft leading-relaxed" style={stagger(0, 700)}>
        L2 network administrator at {profile.organization}, and a NEPSE trader on the side.
        This page is a price chart of my career. Each candle is a milestone, from the first
        position to the all-time high.
      </p>

      <div className="reveal-item mt-6 flex flex-wrap items-center gap-x-5 gap-y-3" style={stagger(1, 700)}>
        <button
          type="button"
          onClick={onBegin}
          className="group inline-flex items-center gap-2 px-4 py-2.5 bg-ink text-sheet text-sm font-medium hover:bg-ink-soft transition-colors"
        >
          Start at the opening bell
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </button>
        <span className="text-sm text-ink-faint">
          <span className="sm:hidden">or scroll down</span>
          <span className="hidden sm:inline">or scroll, swipe, use ← →</span>
        </span>
      </div>
    </section>
  );
});

// ── Scene 1: Order book (skills) ──
export const OrderBookScene = React.memo(function OrderBookScene({ groups, isActive }: { groups: SkillGroup[]; isActive: boolean }) {
  return (
    <div className="relative">
      <Leader isActive={isActive} />
      <section
        aria-label="Skills"
        className={`reveal-frame relative w-[min(500px,85vw)] bg-sheet transition-[border-color] duration-300 ${
          isActive ? 'border-[1.5px] border-ink' : 'border border-rule card-dim'
        }`}
      >
        <header className="reveal-item flex items-baseline justify-between gap-3 px-4 sm:px-5 pt-4 pb-3 border-b border-rule" style={stagger(0)}>
          <h2 className="font-display font-extrabold uppercase text-[26px] leading-none text-ink">
            <span className={isActive ? 'mark' : undefined}>Order book</span>
          </h2>
          <span className="text-xs text-ink-faint">Positions I hold</span>
        </header>
        <table className="w-full text-sm">
          <tbody>
            {groups.map((g, i) => (
              <tr
                key={g.ticker}
                className="reveal-item border-b border-rule/70 last:border-b-0 align-baseline hover:bg-sheet-2 transition-colors"
                style={stagger(i + 1)}
              >
                <td className="pl-4 sm:pl-5 pr-3 py-1.5 sm:py-2 font-mono text-xs font-medium text-bull whitespace-nowrap">▲ {g.ticker}</td>
                <td className="pr-4 sm:pr-5 py-1.5 sm:py-2">
                  <span className="font-medium text-ink">{g.title}</span>
                  <span className="block text-[11px] sm:text-xs text-ink-soft leading-snug sm:leading-relaxed">{g.items.join(', ')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
});

// Small candles thrown off the ATH flag: [dx, dy, rotation, bull?]
const BURST: [number, number, number, boolean][] = [
  [-70, -60, -140, true], [-40, -95, 80, false], [-5, -120, 200, true], [30, -100, -90, true],
  [65, -70, 160, false], [85, -30, -220, true], [-90, -20, 120, true], [50, -130, 60, true],
  [-60, -125, -60, false], [100, -90, 240, true], [15, -70, -180, true], [-25, -50, 100, false],
];

// ── Scene 2: All-time high (contact) ──
interface SummitSceneProps {
  profile: UserProfile;
  isActive: boolean;
  onCopyEmail: () => void;
  copied: boolean;
}

export const SummitScene = React.memo(function SummitScene({ profile, isActive, onCopyEmail, copied }: SummitSceneProps) {
  return (
    <section aria-label="Contact" className="relative flex items-end gap-8">
      {/* The ATH candle: highlighter body grows from its base, flag planted on the upper wick */}
      <div className="relative hidden sm:block shrink-0 -mb-4" aria-hidden="true">
        <svg width="64" height="250" viewBox="0 0 64 250" className="overflow-visible">
          <line x1="32" y1="40" x2="32" y2="246" stroke={CHART.ink} strokeWidth="1.5" />
          <rect className="ath-grow" x="14" y="62" width="36" height="150" fill={CHART.mark} stroke={CHART.ink} strokeWidth="1.5" />
          <g className="reveal-item" style={stagger(0, 1000)}>
            <line x1="32" y1="6" x2="32" y2="40" stroke={CHART.ink} strokeWidth="1.5" />
            <path d="M 32 6 L 62 13 L 32 20 Z" fill={CHART.ink} />
            <text x="35" y="16" fontSize="7" fontFamily="JetBrains Mono, monospace" fill={CHART.sheet}>ATH</text>
          </g>
        </svg>
        {BURST.map(([dx, dy, r, bull], i) => (
          <span
            key={i}
            className={`burst-bit absolute left-[30px] top-[10px] w-1.5 h-3 ${bull ? 'border border-bull' : 'bg-bear'}`}
            style={{ '--dx': `${dx}px`, '--dy': `${dy}px`, '--r': `${r}deg`, animationDelay: `${1 + i * 0.03}s` } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="relative">
        <Leader isActive={isActive} />
        <div
          className={`reveal-frame relative w-[min(420px,80vw)] bg-sheet p-4 sm:p-5 transition-[border-color] duration-300 ${
            isActive ? 'border-[1.5px] border-ink' : 'border border-rule card-dim'
          }`}
        >
          <p className="reveal-item text-xs uppercase tracking-[0.14em] text-ink-faint" style={stagger(0)}>
            All-time high · contact
          </p>
          <h2 className="reveal-item mt-2 font-display font-extrabold uppercase text-[34px] sm:text-[40px] leading-[0.92] text-ink" style={stagger(1)}>
            Let's open <span className={isActive ? 'mark' : undefined}>a position</span>
          </h2>
          <p className="reveal-item mt-3 text-sm text-ink-soft leading-relaxed" style={stagger(2)}>
            Network operations, homelab builds, or a conversation about NEPSE. I read every email.
          </p>

          <div className="reveal-item mt-4 flex items-stretch border border-ink" style={stagger(3)}>
            <span className="flex-1 min-w-0 px-3 py-2.5 font-mono text-sm text-ink truncate select-all">{profile.email}</span>
            <button
              type="button"
              onClick={onCopyEmail}
              aria-label="Copy email address"
              className="inline-flex items-center gap-1.5 px-3 border-l border-ink bg-ink text-sheet text-sm font-medium hover:bg-ink-soft transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="reveal-item mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm" style={stagger(4)}>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
              <Linkedin size={14} /> LinkedIn
            </a>
            <a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`} className="font-mono text-ink-soft tabular hover:text-ink">
              {profile.phone}
            </a>
            <a href={profile.cvUrl} download className="inline-flex items-center gap-1.5 text-ink underline decoration-rule underline-offset-4 hover:decoration-ink">
              <FileDown size={14} /> CV (PDF)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});

// ── Scene 3: After hours (footer, drawn on the night sky) ──
export const AfterHoursScene = React.memo(function AfterHoursScene({ profile, onReturn }: { profile: UserProfile; onReturn: () => void }) {
  return (
    <footer aria-label="Footer" className="w-[min(440px,80vw)] mb-6 text-ink clearing-night">
      <p className="reveal-item text-xs uppercase tracking-[0.14em] text-ink-faint" style={stagger(0, 0)}>
        After hours · market closed 15:00 NPT
      </p>
      <p className="mt-3 font-display font-extrabold uppercase text-[36px] sm:text-[44px] leading-[0.92]">
        <RiseLine index={0}>The market sleeps.</RiseLine>
        <RiseLine index={1}>The servers don't.</RiseLine>
      </p>
      <p className="reveal-item mt-3 text-sm text-ink-soft" style={stagger(0, 600)}>
        Uptime {profile.uptime}. Three of three nodes healthy. See you at the next opening bell.
      </p>
      <button
        type="button"
        onClick={onReturn}
        className="reveal-item group mt-5 inline-flex items-center gap-1.5 px-3 py-1.5 border border-ink-faint text-sm text-ink hover:border-ink transition-colors"
        style={stagger(1, 600)}
      >
        <RotateCcw size={13} className="transition-transform duration-500 group-hover:-rotate-180" /> Back to pre-open
      </button>
      <p className="reveal-item mt-8 text-xs text-ink-faint" style={stagger(2, 600)}>
        © {new Date().getFullYear()} {profile.name} · Kathmandu, Nepal
      </p>
    </footer>
  );
});
