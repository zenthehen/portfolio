import React from 'react';
import { PortfolioStop } from '../types/portfolio';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MiniMapProps {
  stops: PortfolioStop[];
  currentStopIndex: number;
  progressPercent: number;
  onJumpToStop: (stopIndex: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
  // Where the reader is, when that isn't a numbered milestone (e.g. "Order book")
  locationLabel?: string | null;
}

const stepButton =
  'p-2 sm:p-1 text-ink-soft hover:text-ink disabled:opacity-30 disabled:hover:text-ink-soft transition-colors';

export const MiniMap: React.FC<MiniMapProps> = ({
  stops,
  currentStopIndex,
  progressPercent,
  onJumpToStop,
  onPrev,
  onNext,
  locationLabel,
}) => {
  const progress = Math.min(100, Math.max(0, progressPercent));

  return (
    <nav
      aria-label="Milestones"
      className="fixed z-40 bottom-[calc(8px+env(safe-area-inset-bottom,0px))] left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 bg-sheet border border-ink pl-1 sm:pl-2 pr-3 sm:pr-4 py-1 sm:py-1.5 flex items-center gap-2 sm:gap-3 select-none"
    >
      <div className="flex items-center">
        <button type="button" onClick={onPrev} disabled={!onPrev} aria-label="Previous waypoint" className={stepButton}>
          <ChevronLeft size={18} />
        </button>
        <button type="button" onClick={onNext} disabled={!onNext} aria-label="Next waypoint" className={stepButton}>
          <ChevronRight size={18} />
        </button>
      </div>

      <span className="w-[76px] sm:w-24 shrink-0 text-xs text-ink-soft whitespace-nowrap tabular">
        {locationLabel ?? `Stop ${currentStopIndex + 1} of ${stops.length}`}
      </span>

      {/* Ruler: hairline track, ink fill, a tick per milestone */}
      <div className="relative flex-1 min-w-0 sm:flex-none sm:w-72 h-5">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-rule" />
        <div className="absolute top-1/2 left-0 h-[2px] -mt-px bg-ink" style={{ width: `${progress}%` }} />

        {stops.map((stop, idx) => {
          const isPassed = progress >= stop.worldXPercent - 2;
          const isCurrent = idx === currentStopIndex;
          return (
            <button
              key={stop.id}
              type="button"
              onClick={() => onJumpToStop(idx)}
              title={`${stop.date}: ${stop.title}`}
              aria-label={`Jump to ${stop.title}`}
              aria-current={isCurrent ? 'step' : undefined}
              className="absolute top-0 h-full w-3 -translate-x-1/2 flex items-center justify-center group"
              style={{ left: `${stop.worldXPercent}%` }}
            >
              <span
                className={`block w-px transition-all ${
                  isCurrent ? 'h-5 bg-ink' : isPassed ? 'h-3 bg-ink' : 'h-3 bg-ink-faint'
                } group-hover:h-5`}
              />
            </button>
          );
        })}

        {/* Current position: a tiny hollow candle */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-3.5 bg-sheet border-[1.5px] border-bull pointer-events-none"
          style={{ left: `${progress}%` }}
        />
      </div>

      <span className="hidden sm:inline font-mono text-xs text-ink tabular w-9 text-right">{Math.round(progress)}%</span>
    </nav>
  );
};
