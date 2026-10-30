import React from 'react';
import { PortfolioStop } from '../types/portfolio';
import { ExternalLink, Terminal, Layers, Activity, FileText } from 'lucide-react';

interface StopKioskProps {
  stop: PortfolioStop;
  isActive: boolean;
  onOpenDetails: (stopId: string) => void;
  onOpenTopology?: () => void;
}

export const StopKiosk: React.FC<StopKioskProps> = ({
  stop,
  isActive,
  onOpenDetails,
  onOpenTopology,
}) => {
  return (
    <div
      data-testid="stop-kiosk-card"
      className={`w-[360px] sm:w-[420px] rounded-lg transition-all duration-300 transform ${
        isActive
          ? 'bg-panel border-2 border-gold shadow-[0_0_30px_rgba(200,146,42,0.3)] scale-100 z-30'
          : 'bg-panel/90 border border-line opacity-80 hover:opacity-100 hover:border-gold/50 z-20'
      }`}
    >
      {/* Kiosk Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-panel-2 border-b border-line rounded-t-lg">
        <div className="flex items-center gap-2 font-mono text-xs text-slate">
          <Terminal size={14} className={isActive ? 'text-gold-bright' : 'text-slate-dim'} />
          <span>{stop.date}</span>
          <span className="text-slate-dim">·</span>
          <span className="text-gold-bright font-semibold">{stop.orderType}</span>
        </div>

        {stop.roleBadge && (
          <span
            className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
              isActive
                ? 'bg-gold-soft text-gold-bright border-gold/40'
                : 'bg-panel-3 text-slate border-line'
            }`}
          >
            {stop.roleBadge}
          </span>
        )}
      </div>

      {/* Kiosk Content Body */}
      <div className="p-5 flex flex-col gap-3">
        <div>
          <h3 className="font-display font-semibold text-lg sm:text-xl text-cream leading-snug">
            {stop.title}
          </h3>
          <p className="font-sans text-xs text-gold mt-0.5">{stop.organization}</p>
        </div>

        <p className="text-xs sm:text-sm text-slate leading-relaxed font-sans line-clamp-4">
          {stop.description}
        </p>

        {/* Milestone Metrics Chips */}
        {stop.metrics && stop.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2 my-1">
            {stop.metrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-panel-2 border border-line rounded px-2.5 py-1.5 flex flex-col"
              >
                <span className="font-mono text-[10px] text-slate-dim uppercase tracking-wider">
                  {m.label}
                </span>
                <span className="font-mono text-xs font-semibold text-cream">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {stop.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10.5px] px-2 py-0.5 rounded bg-panel-2 border border-line text-slate hover:text-cream hover:border-gold/40 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-line/60 flex items-center justify-between gap-2 mt-1">
          {stop.projectDetails ? (
            <button
              type="button"
              onClick={() => onOpenDetails(stop.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs font-medium bg-panel-2 border border-line text-cream hover:border-gold hover:text-gold-bright transition-colors"
            >
              <Layers size={13} />
              Architecture Details
            </button>
          ) : stop.id === 'proxmox-citadel' && onOpenTopology ? (
            <button
              type="button"
              onClick={onOpenTopology}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs font-medium bg-panel-2 border border-gold/40 text-gold-bright hover:bg-gold-soft transition-colors"
            >
              <Activity size={13} />
              Inspect Homelab Topology
            </button>
          ) : stop.id === 'ath-summit' ? (
            <a
              href="assets/Rishal-Raj-Maskey-CV.pdf"
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs font-medium bg-gold text-ink hover:bg-gold-bright transition-colors"
            >
              <FileText size={13} />
              Download CV (PDF)
            </a>
          ) : (
            <span className="font-mono text-[11px] text-slate-dim flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-bull" />
              Verified Milestone
            </span>
          )}

          <span className="font-mono text-[11px] text-slate-dim">
            NEPSE: {stop.marketIndex} pts
          </span>
        </div>
      </div>
    </div>
  );
};
