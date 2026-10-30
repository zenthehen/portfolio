import React from 'react';
import { Volume2, VolumeX, Play, Pause, FileDown, LayoutList, Compass } from 'lucide-react';

interface HudHeaderProps {
  marketIndex: number;
  uptime: string;
  isMuted: boolean;
  onToggleSound: () => void;
  onStartTour: () => void;
  isTourActive: boolean;
  viewMode: 'trek' | 'vertical';
  onToggleViewMode: () => void;
}

export const HudHeader: React.FC<HudHeaderProps> = ({
  marketIndex,
  uptime,
  isMuted,
  onToggleSound,
  onStartTour,
  isTourActive,
  viewMode,
  onToggleViewMode,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink/90 backdrop-blur-md border-b border-line px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded border border-gold/60 bg-panel-2 flex items-center justify-center font-display font-bold text-xs text-gold-bright tracking-tight">
          RM
        </div>
        <div className="hidden sm:block">
          <div className="font-mono text-xs font-semibold text-cream tracking-wide">
            RISHAL RAJ MASKEY
          </div>
          <div className="font-mono text-[10px] text-slate-dim">
            NEPSE TRADER · L2 NET-ADMIN
          </div>
        </div>
      </div>

      {/* Altimeter / Financial & Network Ticker */}
      <div className="flex items-center gap-2 sm:gap-4 font-mono text-xs">
        {/* Market Altimeter */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-panel border border-line">
          <span className="text-slate-dim text-[11px]">NEPSE:</span>
          <span className="text-bull font-semibold">
            {marketIndex.toLocaleString()}
          </span>
          <span className="text-bull text-[10px]">▲</span>
        </div>

        {/* Network Uptime */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-panel border border-line">
          <span className="w-1.5 h-1.5 rounded-full bg-bull animate-pulse" />
          <span className="text-slate-dim text-[11px]">UPTIME:</span>
          <span className="text-gold-bright font-semibold">{uptime}</span>
        </div>

        {/* Latency */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-panel border border-line">
          <span className="text-slate-dim text-[11px]">PING:</span>
          <span className="text-cream font-semibold">1.2ms</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Guided Tour Button */}
        {viewMode === 'trek' && (
          <button
            type="button"
            onClick={onStartTour}
            aria-label={isTourActive ? 'Pause tour' : 'Start guided tour'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded font-mono text-xs border transition-colors ${
              isTourActive
                ? 'bg-gold-soft border-gold text-gold-bright font-semibold'
                : 'bg-panel-2 border-line text-slate hover:text-cream hover:border-gold'
            }`}
            title={isTourActive ? 'Pause Tour' : 'Autoplay Story Tour'}
          >
            {isTourActive ? <Pause size={13} /> : <Play size={13} />}
            <span className="hidden sm:inline">
              {isTourActive ? 'PAUSE' : 'TOUR'}
            </span>
          </button>
        )}

        {/* View Mode Switcher (Trek vs Vertical) */}
        <button
          type="button"
          onClick={onToggleViewMode}
          aria-label="Switch view mode"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded font-mono text-xs bg-panel-2 border border-line text-slate hover:text-cream hover:border-gold transition-colors"
          title={viewMode === 'trek' ? 'Switch to Vertical View' : 'Switch to Side-Scrolling Trek'}
        >
          {viewMode === 'trek' ? <LayoutList size={14} /> : <Compass size={14} />}
          <span className="hidden sm:inline">
            {viewMode === 'trek' ? 'LIST VIEW' : 'TREK VIEW'}
          </span>
        </button>

        {/* Audio Synthesizer Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          aria-label="Toggle audio"
          className={`p-1.5 rounded border transition-colors ${
            !isMuted
              ? 'bg-gold-soft border-gold text-gold-bright'
              : 'bg-panel-2 border-line text-slate hover:text-cream hover:border-gold'
          }`}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        {/* CV Download Button */}
        <a
          href="assets/Rishal-Raj-Maskey-CV.pdf"
          download
          aria-label="Download CV"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded font-mono text-xs font-semibold bg-gold text-ink hover:bg-gold-bright transition-colors"
          title="Download CV (PDF)"
        >
          <FileDown size={14} />
          <span>CV</span>
        </a>
      </div>
    </header>
  );
};
