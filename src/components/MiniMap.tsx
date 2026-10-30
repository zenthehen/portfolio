import React from 'react';
import { PortfolioStop } from '../types/portfolio';

interface MiniMapProps {
  stops: PortfolioStop[];
  currentStopIndex: number;
  progressPercent: number;
  onJumpToStop: (stopIndex: number) => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  stops,
  currentStopIndex,
  progressPercent,
  onJumpToStop,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-panel/90 backdrop-blur-md border border-line px-4 py-2 rounded-full shadow-lg flex items-center gap-4 select-none">
      <div className="font-mono text-[10px] text-slate-dim tracking-wider shrink-0">
        STOP {currentStopIndex + 1} OF {stops.length}
      </div>

      {/* Progress Track */}
      <div className="relative w-48 sm:w-72 h-1.5 bg-line rounded-full overflow-visible">
        {/* Fill bar */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold to-bull rounded-full transition-all duration-150"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />

        {/* Moving Candle Marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-gold border border-ink rounded-full shadow"
          style={{ left: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />

        {/* Milestone Pins */}
        {stops.map((stop, idx) => {
          const isPassed = progressPercent >= stop.worldXPercent - 2;
          const isCurrent = idx === currentStopIndex;

          return (
            <button
              key={stop.id}
              type="button"
              onClick={() => onJumpToStop(idx)}
              title={`${stop.title} (${stop.date})`}
              aria-label={`Jump to ${stop.title}`}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full border transition-transform hover:scale-150 ${
                isCurrent
                  ? 'bg-bull border-cream scale-125 z-10'
                  : isPassed
                  ? 'bg-gold border-panel'
                  : 'bg-panel-3 border-line'
              }`}
              style={{ left: `${stop.worldXPercent}%` }}
            />
          );
        })}
      </div>

      <div className="font-mono text-[10px] text-gold-bright shrink-0">
        {Math.round(progressPercent)}%
      </div>
    </div>
  );
};
