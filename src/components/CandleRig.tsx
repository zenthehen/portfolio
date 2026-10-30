import React, { useState } from 'react';
import { CandlePose } from '../types/portfolio';

interface CandleRigProps {
  pose: CandlePose;
  quip: string | null;
  onPoke: () => void;
  isJumping?: boolean;
}

export const CandleRig: React.FC<CandleRigProps> = ({
  pose,
  quip,
  onPoke,
  isJumping = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Body fill color based on market momentum / pose
  let bodyFill = '#3FB68B'; // Default Bullish Green
  if (pose === 'walk-bear') {
    bodyFill = '#EF4444'; // Bearish Red
  } else if (pose === 'celebrate') {
    bodyFill = '#C8922A'; // Golden All-Time High
  }

  // Animation transforms based on movement & jumping
  const jumpClass = isJumping ? '-translate-y-6 scale-105' : '';
  const celebrateClass = pose === 'celebrate' ? 'animate-bounce' : '';
  const walkClass = pose === 'walk-bull' || pose === 'walk-bear' ? 'animate-pulse' : '';

  return (
    <div
      className={`relative inline-block select-none transition-transform duration-200 ${jumpClass} ${celebrateClass}`}
    >
      {/* Speech / Quip Bubble */}
      {quip && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none whitespace-nowrap">
          <div className="relative bg-panel-2 border border-gold px-3 py-1.5 rounded shadow-lg text-cream font-mono text-xs animate-in fade-in zoom-in-90">
            {quip}
            <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2.5 h-2.5 bg-panel-2 border-r border-b border-gold rotate-45" />
          </div>
        </div>
      )}

      {/* Interactive Candlestick Character Button */}
      <button
        type="button"
        onClick={onPoke}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="focus:outline-none cursor-pointer group block"
        aria-label="Poke Candle for a trading & network quip"
        title="Click me for a market insight!"
      >
        <svg
          width="80"
          height="120"
          viewBox="0 0 80 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-150 ${walkClass} ${isHovered ? 'scale-110' : ''}`}
        >
          <defs>
            {/* Flame Glow Filter */}
            <filter id="flame-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Linear Gradient for Flame */}
            <linearGradient id="flame-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0AC49" />
              <stop offset="50%" stopColor="#C8922A" />
              <stop offset="100%" stopColor="#3FB68B" />
            </linearGradient>
          </defs>

          {/* 1. Upper Wick (Top Shadow) */}
          <line
            x1="40"
            y1="16"
            x2="40"
            y2="36"
            stroke={bodyFill}
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Flickering Flame / Data Packet on Top Wick */}
          <circle
            cx="40"
            cy="14"
            r="5"
            fill="url(#flame-gradient)"
            filter="url(#flame-glow)"
            className="animate-pulse"
          />
          <circle
            cx="40"
            cy="14"
            r="2"
            fill="#FFF"
          />

          {/* 2. Main Candlestick Body (Real Body) */}
          <rect
            data-testid="candle-body"
            x="20"
            y="36"
            width="40"
            height="56"
            rx="5"
            fill={bodyFill}
            stroke={pose === 'celebrate' ? '#E0AC49' : '#0D1117'}
            strokeWidth="2.5"
            className="transition-colors duration-200"
          />

          {/* Inner Highlight Reflection */}
          <path
            d="M 23 39 L 23 88"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Character Eyes (Retro Terminal Phosphor Style) */}
          <g className="transition-transform duration-200">
            {/* Left Eye */}
            <circle cx="32" cy="56" r="3" fill="#F5F0E8" />
            <circle
              cx={pose === 'walk-bear' ? "30" : "33"}
              cy="56"
              r="1.5"
              fill="#0D1117"
            />

            {/* Right Eye */}
            <circle cx="48" cy="56" r="3" fill="#F5F0E8" />
            <circle
              cx={pose === 'walk-bear' ? "46" : "49"}
              cy="56"
              r="1.5"
              fill="#0D1117"
            />

            {/* Cheerful Mouth / Terminal Line */}
            {pose === 'celebrate' ? (
              <path
                d="M 33 67 Q 40 74 47 67"
                stroke="#F5F0E8"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            ) : pose === 'walk-bear' ? (
              <path
                d="M 34 68 Q 40 64 46 68"
                stroke="#F5F0E8"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              <path
                d="M 34 66 Q 40 71 46 66"
                stroke="#F5F0E8"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>

          {/* Little Arms on Celebrate Pose */}
          {pose === 'celebrate' && (
            <g stroke="#E0AC49" strokeWidth="2.5" strokeLinecap="round">
              <path d="M 18 52 L 10 40" />
              <path d="M 62 52 L 70 40" />
            </g>
          )}

          {/* 3. Lower Wick (Bottom Tail) */}
          <line
            x1="40"
            y1="92"
            x2="40"
            y2="108"
            stroke={bodyFill}
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Little spark dust / feet dots at bottom */}
          <circle
            cx="36"
            cy="112"
            r="2"
            fill={bodyFill}
            opacity="0.8"
          />
          <circle
            cx="44"
            cy="112"
            r="2"
            fill={bodyFill}
            opacity="0.8"
          />
        </svg>
      </button>
    </div>
  );
};
