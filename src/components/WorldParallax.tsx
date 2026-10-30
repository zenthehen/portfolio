import React, { useMemo } from 'react';
import { calculateParallaxOffset } from '../hooks/useCameraScroller';
import { PortfolioStop } from '../types/portfolio';
import { CandleRig } from './CandleRig';
import { CandlePose } from '../types/portfolio';

interface WorldParallaxProps {
  camX: number;
  worldWidth: number;
  stops: PortfolioStop[];
  activeStopIndex: number;
  pose: CandlePose;
  isJumping: boolean;
  quip: string | null;
  onPokeCandle: () => void;
  renderStopContent: (stop: PortfolioStop, isActive: boolean) => React.ReactNode;
}

export const WorldParallax: React.FC<WorldParallaxProps> = ({
  camX,
  worldWidth,
  stops,
  activeStopIndex,
  pose,
  isJumping,
  quip,
  onPokeCandle,
  renderStopContent,
}) => {
  // Parallax offsets
  const skyOffset = calculateParallaxOffset(camX, 0.05);
  const mountainOffset = calculateParallaxOffset(camX, 0.18);
  const infraOffset = calculateParallaxOffset(camX, 0.45);
  const trailOffset = camX; // 1:1 foreground

  // Generate background candlestick peaks once
  const mountainCandles = useMemo(() => {
    const list = [];
    for (let i = 0; i < 60; i++) {
      const height = 40 + Math.sin(i * 0.4) * 35 + Math.cos(i * 0.8) * 20;
      const isGreen = i % 3 !== 0;
      list.push({
        x: i * 80,
        height,
        isGreen,
      });
    }
    return list;
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-ink select-none">
      {/* ── Layer 0: Cyber Sky & Floating Financial Tickers (Factor 0.05) ── */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform"
        style={{ transform: `translate3d(${-skyOffset}px, 0, 0)` }}
      >
        <div className="absolute top-16 left-0 right-0 flex gap-24 opacity-25 font-mono text-xs text-slate tracking-wider whitespace-nowrap">
          <span>// NEPSE 2,750.40 ▲ +1.4%</span>
          <span>NABIL 624.00 ▲ +2.1%</span>
          <span>CIT 2,340.00 ▲ +0.8%</span>
          <span>SHIVM 540.00 ▼ -0.5%</span>
          <span>GBIME 242.00 ▲ +1.0%</span>
          <span>HDL 1,820.00 ▲ +3.2%</span>
          <span>// ER605 WAN-1: 940 Mbps</span>
          <span>ER605 WAN-2: STATIC IP OK</span>
          <span>PVE CLUSTER: 3/3 NODES</span>
          <span>// SLA: 99.99%</span>
        </div>

        {/* Subtle Background Cyber Grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, #222B37 1px, transparent 1px), linear-gradient(to bottom, #222B37 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* ── Layer 1: Candlestick Mountain Peaks & Moving Averages (Factor 0.18) ── */}
      <div
        className="absolute bottom-32 left-0 w-[8000px] h-96 pointer-events-none will-change-transform opacity-30"
        style={{ transform: `translate3d(${-mountainOffset}px, 0, 0)` }}
      >
        <svg width="8000" height="380" className="overflow-visible">
          {/* Fibonacci Grid Curves */}
          <path
            d="M 0 280 Q 800 120 1600 240 T 3200 160 T 4800 220 T 6400 90 T 8000 60"
            fill="none"
            stroke="#C8922A"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.4"
          />
          <path
            d="M 0 310 Q 1000 180 2000 290 T 4000 210 T 6000 140 T 8000 100"
            fill="none"
            stroke="#3FB68B"
            strokeWidth="1.5"
            opacity="0.3"
          />

          {/* Silhouetted Candlesticks forming distant peaks */}
          {mountainCandles.map((c, i) => (
            <g key={i} transform={`translate(${c.x}, ${320 - c.height})`}>
              {/* Wick */}
              <line
                x1="6"
                y1="-15"
                x2="6"
                y2={c.height + 15}
                stroke={c.isGreen ? '#3FB68B' : '#EF4444'}
                strokeWidth="1"
                opacity="0.5"
              />
              {/* Candle Body */}
              <rect
                x="1"
                y="0"
                width="10"
                height={c.height}
                fill={c.isGreen ? '#3FB68B' : '#EF4444'}
                opacity="0.4"
                rx="1"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* ── Layer 2: Infrastructure & Data Center Server Blade Forest (Factor 0.45) ── */}
      <div
        className="absolute bottom-24 left-0 w-[10000px] pointer-events-none will-change-transform"
        style={{ transform: `translate3d(${-infraOffset}px, 0, 0)` }}
      >
        <div className="flex items-end gap-12 opacity-40">
          {Array.from({ length: 45 }).map((_, i) => (
            <div
              key={i}
              className="w-16 bg-panel-2 border border-line rounded-t p-1.5 flex flex-col gap-1 shadow-md"
              style={{ height: `${70 + (i % 5) * 22}px` }}
            >
              {/* Blinking Server Status LEDs */}
              <div className="flex gap-1 justify-between">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    i % 2 === 0 ? 'bg-bull animate-pulse' : 'bg-gold'
                  }`}
                />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-dim" />
                <span className="w-1.5 h-1.5 rounded-full bg-bull" />
              </div>
              <div className="h-0.5 bg-line my-0.5" />
              <div className="h-0.5 bg-line my-0.5" />
              <div className="h-0.5 bg-line my-0.5" />
              <span className="mt-auto font-mono text-[8px] text-slate-dim text-center">
                U{i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Layer 3: The Foreground Chart Trail & Milestone Kiosks (Factor 1.0) ── */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(${-trailOffset}px, 0, 0)` }}
      >
        {/* Horizontal Ground Line (The Floor) */}
        <div className="absolute bottom-20 left-0 w-[12000px] h-1.5 bg-gradient-to-r from-line via-gold to-bull opacity-70" />
        <div className="absolute bottom-19 left-0 w-[12000px] h-20 bg-gradient-to-b from-panel-2/60 to-ink pointer-events-none" />

        {/* Milestone Stops rendered along world coordinates */}
        {stops.map((stop, index) => {
          const posX = (stop.worldXPercent / 100) * worldWidth;
          const isActive = index === activeStopIndex;

          return (
            <div
              key={stop.id}
              className="absolute bottom-24 transition-all duration-300"
              style={{ left: `${posX}px` }}
            >
              {renderStopContent(stop, isActive)}
            </div>
          );
        })}
      </div>

      {/* ── Fixed Hero Spot: Candle Character ── */}
      {/* Positioned comfortably at 26% of viewport width */}
      <div className="absolute bottom-24 left-[26%] z-40 -translate-x-1/2 pointer-events-auto">
        <CandleRig
          pose={pose}
          quip={quip}
          onPoke={onPokeCandle}
          isJumping={isJumping}
        />
      </div>
    </div>
  );
};
