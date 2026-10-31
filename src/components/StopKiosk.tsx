import React from 'react';
import { PortfolioStop } from '../types/portfolio';
import { Layers, Network, FileDown, ArrowUpRight } from 'lucide-react';
import { stagger } from './reveal';

interface StopKioskProps {
  stop: PortfolioStop;
  isActive: boolean;
  onOpenDetails: (stopId: string) => void;
  onOpenTopology?: () => void;
}

// INITIAL_POSITION → "Initial position", AI_VISION_DEPLOY → "AI vision deploy"
const ACRONYMS = new Set(['AI', 'HA', 'L2', 'NOC']);
const readableOrderType = (code: string) =>
  code
    .split('_')
    .map((word, i) => (ACRONYMS.has(word) ? word : i === 0 ? word.charAt(0) + word.slice(1).toLowerCase() : word.toLowerCase()))
    .join(' ');

// The card's main action: a solid highlighter button, so it reads as clickable at a glance;
// on the card in view a ring pings out from it now and then
const ctaClass = (isActive: boolean) =>
  `cta group inline-flex items-center gap-1.5 px-3 py-2 bg-mark text-on-mark text-sm font-semibold border border-mark hover:bg-ink hover:border-ink hover:text-sheet transition-colors ${
    isActive ? 'cta-ping' : ''
  }`;

const CtaArrow = () => (
  <ArrowUpRight size={15} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
);

const StopKioskCard: React.FC<StopKioskProps> = ({
  stop,
  isActive,
  onOpenDetails,
  onOpenTopology,
}) => {
  return (
    <div className="relative">
      {/* Leader line pinning the note to its date on the axis (outside the frame so the wipe doesn't clip it) */}
      <span
        aria-hidden="true"
        className={`reveal-leader card-leader absolute left-0 border-l border-dashed ${isActive ? 'border-ink' : 'border-ink-faint'}`}
      />
      <article
        data-testid="stop-kiosk-card"
        data-active={isActive}
        className={`reveal-frame relative w-[min(400px,80vw)] bg-sheet transition-[border-color,transform] duration-300 hover:-translate-y-1 ${
          isActive
            ? 'border-[1.5px] border-ink -translate-y-1 z-30'
            : 'border border-rule card-dim hover:border-ink-faint z-20'
        }`}
      >
        <header className="reveal-item flex items-baseline justify-between gap-3 px-4 sm:px-5 pt-4" style={stagger(0)}>
          <span className="font-mono text-xs text-ink-faint tabular">{stop.date}</span>
          <span className="text-xs text-ink-soft">{readableOrderType(stop.orderType)}</span>
        </header>

        <div className="px-4 sm:px-5 pt-2 pb-4 sm:pb-5 flex flex-col gap-2.5 sm:gap-3">
          <div className="reveal-item" style={stagger(1)}>
            <h3 className="font-display font-extrabold uppercase text-[22px] sm:text-[26px] leading-[1.02] tracking-[0.01em] text-ink">
              <span className={isActive ? 'mark' : undefined}>{stop.title}</span>
            </h3>
            <p className="mt-1.5 text-sm text-ink-soft">{stop.organization}</p>
          </div>

          <p className="reveal-item text-sm text-ink-soft leading-relaxed line-clamp-3 sm:line-clamp-4" style={stagger(2)}>{stop.description}</p>

          {stop.metrics && stop.metrics.length > 0 && (
            <dl className="reveal-item grid grid-cols-2 border-t border-rule" style={stagger(3)}>
              {stop.metrics.map((m) => (
                <div key={m.label} className="pt-2 pr-3">
                  <dt className="text-xs uppercase tracking-[0.08em] text-ink-faint">{m.label}</dt>
                  <dd className="text-sm font-medium text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <p className="reveal-item font-mono text-xs leading-relaxed text-ink-soft" style={stagger(4)}>{stop.tags.join('  ·  ')}</p>

          <footer className="reveal-item flex items-center justify-between gap-2 pt-3 border-t border-rule" style={stagger(5)}>
            {stop.projectDetails ? (
              <button type="button" onClick={() => onOpenDetails(stop.id)} className={ctaClass(isActive)}>
                <Layers size={14} aria-hidden="true" />
                View architecture
                <CtaArrow />
              </button>
            ) : stop.id === 'proxmox-citadel' && onOpenTopology ? (
              <button type="button" onClick={onOpenTopology} className={ctaClass(isActive)}>
                <Network size={14} aria-hidden="true" />
                Inspect homelab
                <CtaArrow />
              </button>
            ) : stop.id === 'ath-summit' ? (
              <a
                href="assets/Rishal-Raj-Maskey-CV.pdf"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink text-sheet text-sm font-medium hover:bg-ink-soft transition-colors"
              >
                <FileDown size={14} />
                Download CV
              </a>
            ) : (
              <span />
            )}

            <span className="font-mono text-xs text-ink-faint tabular">
              NEPSE {stop.marketIndex.toLocaleString()}
            </span>
          </footer>
        </div>
      </article>
    </div>
  );
};

// Memoized: cards only re-render when they become (in)active, not on every camera frame
export const StopKiosk = React.memo(StopKioskCard);
