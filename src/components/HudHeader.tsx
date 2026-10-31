import React from 'react';
import { Volume2, VolumeX, Play, Pause, FileDown, LayoutList, LineChart } from 'lucide-react';

interface HudHeaderProps {
  marketIndex: number;
  marketTrend?: 'up' | 'down';
  uptime: string;
  isMuted: boolean;
  onToggleSound: () => void;
  onStartTour: () => void;
  isTourActive: boolean;
  viewMode: 'trek' | 'vertical';
  onToggleViewMode: () => void;
}

const textButton =
  'inline-flex items-center gap-1.5 px-2 py-1.5 text-sm text-ink-soft hover:text-ink transition-colors';

export const HudHeader: React.FC<HudHeaderProps> = ({
  marketIndex,
  marketTrend = 'up',
  uptime,
  isMuted,
  onToggleSound,
  onStartTour,
  isTourActive,
  viewMode,
  onToggleViewMode,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-sheet border-b border-rule px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 select-none">
      <div className="flex items-baseline gap-3 min-w-0">
        <span className="font-display font-extrabold uppercase text-lg sm:text-xl leading-none text-ink whitespace-nowrap">
          Rishal Raj Maskey
        </span>
        <span className="hidden lg:inline text-xs text-ink-faint whitespace-nowrap">
          NEPSE trader · L2 network admin
        </span>
      </div>

      {/* Readouts: the plotted index level under the camera, and network uptime */}
      <dl className="flex items-center divide-x divide-rule font-mono text-xs tabular">
        <div className="flex items-baseline gap-2 px-2 sm:px-3">
          <dt className="sr-only sm:not-sr-only text-ink-faint">NEPSE</dt>
          {/* Re-keyed every 20 points so the flash replays while the index moves */}
          <dd
            key={Math.round(marketIndex / 20)}
            className={`w-[6.5ch] px-1 -mx-1 text-right font-medium ${
              marketTrend === 'up' ? 'text-bull tick-up' : 'text-bear tick-down'
            }`}
          >
            {marketIndex.toLocaleString()}
          </dd>
          <span aria-hidden="true" className={marketTrend === 'up' ? 'text-bull' : 'text-bear'}>
            {marketTrend === 'up' ? '▲' : '▼'}
          </span>
        </div>
        <div className="hidden md:flex items-baseline gap-2 px-3">
          <dt className="text-ink-faint">Uptime</dt>
          <dd className="text-ink font-medium">{uptime}</dd>
        </div>
      </dl>

      <nav className="flex items-center sm:gap-1" aria-label="Page controls">
        {viewMode === 'trek' && (
          <button
            type="button"
            onClick={onStartTour}
            aria-label={isTourActive ? 'Pause tour' : 'Start guided tour'}
            className={`${textButton} ${isTourActive ? 'text-ink font-medium' : ''}`}
          >
            {isTourActive ? <Pause size={14} /> : <Play size={14} />}
            <span className="hidden sm:inline">{isTourActive ? 'Pause' : 'Tour'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onToggleViewMode}
          aria-label="Switch view mode"
          className={textButton}
        >
          {viewMode === 'trek' ? <LayoutList size={14} /> : <LineChart size={14} />}
          <span className="hidden sm:inline">{viewMode === 'trek' ? 'List view' : 'Chart view'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleSound}
          aria-label="Toggle audio"
          aria-pressed={!isMuted}
          title={isMuted ? 'Turn sound on' : 'Turn sound off'}
          className={textButton}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        <a
          href="assets/Rishal-Raj-Maskey-CV.pdf"
          download
          aria-label="Download CV"
          className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-3 py-1.5 bg-ink text-sheet text-sm font-medium hover:bg-ink-soft transition-colors"
        >
          <FileDown size={14} />
          CV
        </a>
      </nav>
    </header>
  );
};
