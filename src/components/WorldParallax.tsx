import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { calculateParallaxOffset } from '../hooks/useCameraScroller';
import { PortfolioStop } from '../types/portfolio';
import { CHART } from '../theme';
import { PricePoint, priceAt } from '../lib/priceSeries';
import { trailAnchorPx } from '../lib/waypoints';
import { MarketMascot, MascotCharacter } from './MarketMascot';

interface WorldParallaxProps {
  camX: number;
  cameraVelocity?: number;
  worldWidth: number;
  stops: PortfolioStop[];
  activeStopIndex: number;
  progressPercent: number;
  scenes: { id: string; worldXPercent: number; content: React.ReactNode }[];
  priceSeries: PricePoint[];
  currentWaypointId?: string;
  // Direction of travel: going back turns the chart into a losing session
  marketTrend?: 'up' | 'down';
  onMascotClick?: (character: MascotCharacter) => void;
  renderStopContent: (stop: PortfolioStop, isActive: boolean) => React.ReactNode;
}

// Content reveals once its left edge comes within this fraction of the viewport width
const REVEAL_AT = 0.92;

// Sky band where the career price is plotted (px from the top of the world, and its height)
const PLOT_TOP = 44;

// Mascot size on wide screens and phones (height is 3/4 of the width), and where the axis sits
const MASCOT_W = 144;
const MASCOT_W_NARROW = 112;
const AXIS_FROM_BOTTOM = 80;
const PLOT_PAD = 24;
const PLOT_HEIGHT = 190;
const PLOT_MIN = 900;
const PLOT_MAX = 3500;
const plotY = (value: number) => PLOT_HEIGHT - ((value - PLOT_MIN) / (PLOT_MAX - PLOT_MIN)) * PLOT_HEIGHT;

// Paper tint across the trading day: pre-open dawn → session → closing bell → after hours.
// `wash` tints the lower sky; `dark` is how much the night sky covers the paper.
const SKY_KEYFRAMES: { at: number; wash: [number, number, number]; washAlpha: number; dark: number }[] = [
  { at: 0, wash: [214, 150, 80], washAlpha: 0.16, dark: 0 },
  { at: 40, wash: [90, 150, 160], washAlpha: 0.1, dark: 0 },
  { at: 78, wash: [200, 100, 70], washAlpha: 0.18, dark: 0.1 },
  { at: 100, wash: [8, 12, 20], washAlpha: 0.5, dark: 0.85 },
];

export function skyColorsAt(progress: number): { wash: string; dark: number } {
  const p = Math.max(0, Math.min(100, progress));
  let i = 0;
  while (i < SKY_KEYFRAMES.length - 2 && p > SKY_KEYFRAMES[i + 1].at) i++;
  const a = SKY_KEYFRAMES[i];
  const b = SKY_KEYFRAMES[i + 1];
  const t = (p - a.at) / (b.at - a.at);
  const lerp = (x: number, y: number) => x + (y - x) * t;
  const rgb = a.wash.map((v, k) => Math.round(lerp(v, b.wash[k]))).join(',');
  return {
    wash: `rgba(${rgb},${lerp(a.washAlpha, b.washAlpha).toFixed(2)})`,
    dark: Number(lerp(a.dark, b.dark).toFixed(3)),
  };
}

// Deterministic pseudo-random so stars/particles don't reshuffle between renders
const seeded = (n: number) => {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

// Static background art. Memoized so the camera moving each frame only shifts the wrapper
// transforms instead of re-rendering ~110 candles and 40 racks.
const RANGE_CANDLES = (() => {
  const list = [];
  let close = 220;
  for (let i = 0; i < 110; i++) {
    const open = close;
    close = open - 1.6 + Math.sin(i * 0.37) * 9 + (seeded(i) - 0.5) * 14;
    const top = Math.min(open, close);
    list.push({
      x: i * 44,
      top,
      body: Math.max(3, Math.abs(close - open)),
      high: top - 4 - seeded(i + 50) * 10,
      low: Math.max(open, close) + 4 + seeded(i + 80) * 10,
      isBull: close < open, // y grows downward, so a smaller y means price went up
    });
  }
  return list;
})();

const RANGE_MOVING_AVERAGE = RANGE_CANDLES.map((c, i) => {
  const window = RANGE_CANDLES.slice(Math.max(0, i - 9), i + 1);
  const avg = window.reduce((sum, w) => sum + w.top + w.body / 2, 0) / window.length;
  return `${i === 0 ? 'M' : 'L'} ${c.x + 5} ${avg.toFixed(1)}`;
}).join(' ');

const PencilRange = React.memo(function PencilRange() {
  return (
    <svg width={RANGE_CANDLES.length * 44} height="300" viewBox="0 -20 4840 300" className="overflow-visible">
      <path d={RANGE_MOVING_AVERAGE} fill="none" stroke={CHART.ink} strokeWidth="1.25" strokeDasharray="5 4" />
      {RANGE_CANDLES.map((c, i) => {
        const color = c.isBull ? CHART.bull : CHART.bear;
        return (
          <g key={i}>
            <line x1={c.x + 5} y1={c.high} x2={c.x + 5} y2={c.low} stroke={color} strokeWidth="1" />
            <rect x={c.x} y={c.top} width="10" height={c.body} fill={c.isBull ? CHART.paper : color} stroke={color} strokeWidth="1" />
          </g>
        );
      })}
    </svg>
  );
});

const RackRow = React.memo(function RackRow() {
  return (
    <>
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="w-12 border border-ink-soft/70 bg-paper/60 flex flex-col gap-[5px] px-1.5 pt-1.5"
          style={{ height: `${60 + (i % 5) * 20}px` }}
        >
          {Array.from({ length: 3 + (i % 3) }).map((__, u) => (
            <div key={u} className="flex items-center gap-1">
              <span className={`w-1 h-1 ${(i + u) % 3 === 0 ? 'bg-bull' : 'bg-ink-faint'}`} />
              <span className="flex-1 h-px bg-ink-faint/60" />
            </div>
          ))}
        </div>
      ))}
    </>
  );
});

export const WorldParallax: React.FC<WorldParallaxProps> = ({
  camX,
  cameraVelocity = 0,
  worldWidth,
  stops,
  activeStopIndex,
  progressPercent,
  scenes,
  priceSeries,
  currentWaypointId,
  marketTrend = 'up',
  onMascotClick,
  renderStopContent,
}) => {
  const isSelling = marketTrend === 'down';
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Hold every reveal until after the first paint, so on-screen content animates in on load too
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setHasMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Once revealed, content stays revealed when scrolling back
  const revealedRef = useRef<Set<string>>(new Set());
  // Screen x where the current waypoint's card lines up
  const anchorPx = trailAnchorPx(viewportWidth);
  const isRevealed = (id: string, worldX: number) => {
    if (!hasMounted) return false;
    if (anchorPx + worldX - camX < viewportWidth * REVEAL_AT) revealedRef.current.add(id);
    return revealedRef.current.has(id);
  };

  const paperOffset = calculateParallaxOffset(camX, 0.05);
  const rangeOffset = calculateParallaxOffset(camX, 0.18);
  const rackOffset = calculateParallaxOffset(camX, 0.45);
  const trailOffset = camX; // 1:1 foreground

  const stars = useMemo(
    () => Array.from({ length: 60 }, (_, i) => ({ x: seeded(i) * 100, y: seeded(i + 100) * 50, r: seeded(i + 200) > 0.85 ? 2 : 1 })),
    []
  );
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        x: seeded(i + 300) * 100,
        delay: seeded(i + 400) * -14,
        duration: 10 + seeded(i + 500) * 8,
        isBull: seeded(i + 600) > 0.35,
      })),
    []
  );

  // World x → screen x for the compressed sky chart
  const plotX = (worldX: number) => PLOT_PAD + (worldX / worldWidth) * (viewportWidth - PLOT_PAD * 2);
  const pricePath = useMemo(
    () =>
      priceSeries
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${(PLOT_PAD + (p.x / worldWidth) * (viewportWidth - PLOT_PAD * 2)).toFixed(1)} ${plotY(p.value).toFixed(1)}`)
        .join(' '),
    [priceSeries, worldWidth, viewportWidth]
  );
  const plotEndX = priceSeries.length ? priceSeries[priceSeries.length - 1].x : 0;
  const penValue = priceAt(priceSeries, camX);
  const penX = plotX(camX);
  const penY = plotY(penValue);

  // Going back is a sell-off: remember where it started, so the ground given up shows as a red
  // trail and the label reads the drop from there
  const camXRef = useRef(camX);
  camXRef.current = camX;
  const [lossFrom, setLossFrom] = useState(camX);
  useEffect(() => {
    if (isSelling) setLossFrom(camXRef.current);
  }, [isSelling]);
  const lossFromX = plotX(Math.max(lossFrom, camX));
  const lossValue = isSelling ? priceAt(priceSeries, lossFrom) - penValue : 0;
  const trendColor = isSelling ? CHART.bear : CHART.bull;

  const currentWaypoint = [...stops, ...scenes].find((wp) => wp.id === currentWaypointId);
  const waypointWorldX = currentWaypoint ? (currentWaypoint.worldXPercent / 100) * worldWidth : 0;

  // Mascot on the ground: it stands on the chart's x-axis at a fixed screen spot and runs in
  // place while the axis and cards slide past. On wide screens it walks in the free gap left of
  // the card slot; where there's no gap (phones), the cards lift to leave a walking lane.
  const worldRef = useRef<HTMLDivElement>(null);
  const [worldHeight, setWorldHeight] = useState(0);
  useLayoutEffect(() => {
    const measure = () => setWorldHeight(worldRef.current?.clientHeight ?? 0);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const mascotW = viewportWidth <= 640 ? MASCOT_W_NARROW : MASCOT_W;
  const mascotH = mascotW * 0.75;
  const inLane = anchorPx < mascotW + 24;
  const mascotX = inLane ? viewportWidth - 12 - mascotW / 2 : anchorPx - 14 - mascotW / 2;
  const cardLift = inLane ? mascotH + 6 : 0;

  // A card taller than the space between the header and its slot (tall Order Book on a short
  // phone) shrinks to fit, pinned at its bottom-left so the pin line still lands on the axis
  const [fitScales, setFitScales] = useState<Record<string, number>>({});
  useLayoutEffect(() => {
    const fit = () => {
      const root = worldRef.current;
      if (!root || !worldHeight) return;
      const room = worldHeight - 96 - cardLift - 8;
      const next: Record<string, number> = {};
      root.querySelectorAll<HTMLElement>('[data-waypoint]').forEach((el) => {
        const scale = Math.min(1, room / el.offsetHeight);
        if (scale < 1) next[el.dataset.waypoint!] = Number(scale.toFixed(3));
      });
      setFitScales((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    fit();
    document.fonts?.ready.then(fit);
  }, [worldHeight, cardLift, viewportWidth]);

  const fittedStyle = (id: string, x: number): React.CSSProperties => {
    const scale = fitScales[id];
    return {
      left: `${x}px`,
      bottom: 'calc(96px + var(--card-lift, 0px))',
      ...(scale ? { transform: `scale(${scale})`, transformOrigin: 'left bottom', '--fit': scale } : {}),
    } as React.CSSProperties;
  };

  const sky = skyColorsAt(progressPercent);
  const sunT = Math.min(progressPercent / 82, 1);
  const nightness = Math.max(0, (progressPercent - 76) / 24);
  const isSnowing = progressPercent > 76;

  return (
    <div
      ref={worldRef}
      className="relative w-full h-full overflow-hidden select-none graph-paper"
      style={{ backgroundPosition: `${-paperOffset}px 0`, '--card-lift': `${cardLift}px` } as React.CSSProperties}
    >
      {/* ── Sky: time-of-day wash, nightfall, sun and moon ── */}
      <div
        data-testid="session-sky"
        className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, transparent 30%, ${sky.wash} 100%)` }}
      />
      <div className="absolute inset-0 pointer-events-none bg-night" style={{ opacity: sky.dark }} />

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* The whole star field fades in as one layer (one opacity change per frame, not 60), and
            is skipped entirely in daylight */}
        {nightness > 0 && (
          <div className="absolute inset-0 will-change-[opacity]" style={{ opacity: nightness * 0.9 }}>
            {stars.map((st, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-ink animate-twinkle"
                style={{
                  left: `${st.x}%`,
                  top: `${st.y}%`,
                  width: st.r,
                  height: st.r,
                  animationDelay: `${(i % 7) * 0.6}s`,
                }}
              />
            ))}
          </div>
        )}
        {/* Sun drawn like a plotted marker: inked ring, highlighter fill */}
        <svg
          width="56"
          height="56"
          className="absolute -translate-x-1/2"
          style={{ left: `${12 + sunT * 76}%`, top: `${64 - Math.sin(Math.PI * sunT) * 28}%`, opacity: 1 - nightness }}
        >
          <circle cx="28" cy="28" r="15" fill={CHART.mark} stroke={CHART.ink} strokeWidth="1.5" />
          {Array.from({ length: 12 }, (_, k) => {
            const a = (k / 12) * Math.PI * 2;
            return (
              <line
                key={k}
                x1={28 + Math.cos(a) * 19}
                y1={28 + Math.sin(a) * 19}
                x2={28 + Math.cos(a) * 25}
                y2={28 + Math.sin(a) * 25}
                stroke={CHART.ink}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <svg width="44" height="44" className="absolute right-[14%]" style={{ top: `${28 - nightness * 10}%`, opacity: nightness }}>
          <path d="M 30 6 A 17 17 0 1 0 38 32 A 13 13 0 1 1 30 6 Z" fill={CHART.ink} />
        </svg>
      </div>

      {/* ── Weather: drifting ticks (hollow up, filled down), snow near the summit ── */}
      <div className="absolute inset-0 pointer-events-none motion-reduce:hidden" aria-hidden="true">
        {particles.map((pt, i) => (
          <span
            key={i}
            className="absolute -top-4 animate-tick-fall will-change-transform"
            style={{ left: `${pt.x}%`, animationDelay: `${pt.delay}s`, animationDuration: `${pt.duration}s` }}
          >
            {isSnowing ? (
              <span className="block w-1.5 h-1.5 rounded-full bg-ink/80" />
            ) : (
              <span
                className={`block w-1.5 h-3 transition-colors duration-500 ${
                  pt.isBull && !isSelling ? 'border border-bull/70' : 'border border-transparent bg-bear/60'
                }`}
              />
            )}
          </span>
        ))}
      </div>

      {/* ── Layer 1: distant price range in pencil (Factor 0.18) ── */}
      <div
        className="absolute bottom-40 left-0 h-72 pointer-events-none will-change-transform"
        style={{ transform: `translate3d(${-rangeOffset}px, 0, 0)`, opacity: 0.45 - nightness * 0.2 }}
      >
        <PencilRange />
      </div>

      {/* ── Layer 2: data-center racks, outlined (Factor 0.45) ── */}
      <div
        className="absolute bottom-[86px] left-0 pointer-events-none will-change-transform"
        style={{ transform: `translate3d(${-rackOffset}px, 0, 0)` }}
      >
        <div className="flex items-end gap-16" style={{ opacity: 0.35 + nightness * 0.25 }}>
          <RackRow />
        </div>
      </div>

      {/* ── Plotter: the whole career compressed across the sky, drawn up to the camera as you scroll ── */}
      <svg
        className="absolute left-0 w-full overflow-visible pointer-events-none"
        style={{ top: PLOT_TOP }}
        height={PLOT_HEIGHT}
        aria-hidden="true"
      >
        <defs>
          <clipPath id="plotted-so-far">
            <rect x={0} y={-40} width={penX} height={PLOT_HEIGHT + 80} />
          </clipPath>
          <clipPath id="plot-given-back">
            <rect x={penX} y={-40} width={Math.max(0, lossFromX - penX)} height={PLOT_HEIGHT + 80} />
          </clipPath>
          {(['bull', 'bear'] as const).map((side) => (
            <linearGradient key={side} id={`plot-fill-${side}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART[side]} stopOpacity="0.16" />
              <stop offset="100%" stopColor={CHART[side]} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* Last-price line running ahead of the pen to the right edge */}
        <line x1={penX} x2={viewportWidth} y1={penY} y2={penY} stroke={isSelling ? CHART.bear : CHART.mark} strokeWidth="1" strokeDasharray="2 5" opacity="0.45" />

        {/* Ground given back in a sell-off: a fading red ghost of the line between pen and the high */}
        <g clipPath="url(#plot-given-back)" className="plot-trend" style={{ opacity: isSelling ? 1 : 0 }}>
          <path d={`${pricePath} L ${plotX(plotEndX)} ${PLOT_HEIGHT} L ${plotX(0)} ${PLOT_HEIGHT} Z`} fill="url(#plot-fill-bear)" opacity="0.6" />
          <path d={pricePath} fill="none" stroke={CHART.bear} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
        </g>

        <g clipPath="url(#plotted-so-far)">
          {/* Green and red fills cross-fade, so the session turns without a hard cut */}
          <path d={`${pricePath} L ${plotX(plotEndX)} ${PLOT_HEIGHT} L ${plotX(0)} ${PLOT_HEIGHT} Z`} fill="url(#plot-fill-bull)" className="plot-trend" style={{ opacity: isSelling ? 0 : 1 }} />
          <path d={`${pricePath} L ${plotX(plotEndX)} ${PLOT_HEIGHT} L ${plotX(0)} ${PLOT_HEIGHT} Z`} fill="url(#plot-fill-bear)" className="plot-trend" style={{ opacity: isSelling ? 1 : 0 }} />
          <path d={pricePath} fill="none" stroke={trendColor} strokeWidth="2" strokeLinejoin="round" className="plot-trend" />
        </g>

        {/* Milestone markers fill in as the pen passes them */}
        {stops.map((stop) => {
          const x = (stop.worldXPercent / 100) * worldWidth;
          const passed = camX >= x - 1;
          return (
            <rect
              key={`plot-${stop.id}`}
              className="plot-marker"
              x={plotX(x) - 5}
              y={plotY(stop.marketIndex) - 5}
              width="10"
              height="10"
              fill={passed ? CHART.mark : CHART.paper}
              stroke={passed ? CHART.mark : CHART.rule}
              strokeWidth="1.5"
              style={{ transform: `rotate(45deg) scale(${passed ? 1 : 0.6})` }}
            >
              <title>{`${stop.date}: ${stop.title}`}</title>
            </rect>
          );
        })}

        {/* Pen tip with a pulse; the level label flips to the left near the right edge */}
        <circle className="pen-pulse plot-trend" cx={penX} cy={penY} r="4" fill={isSelling ? CHART.bear : CHART.mark} />
        <circle className="plot-trend" cx={penX} cy={penY} r="4" fill={isSelling ? CHART.bear : CHART.mark} stroke={CHART.paper} strokeWidth="1.5" />
        {/* Level label sits under the pen; the mascot stands on top of it */}
        <g transform={`translate(${Math.max(4, Math.min(viewportWidth - 66, penX - 31))}, ${penY + 10})`}>
          <rect width="62" height="20" fill={CHART.sheet} stroke={isSelling ? CHART.bear : CHART.rule} className="plot-trend" />
          <text x="31" y="14" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill={isSelling ? CHART.bear : CHART.ink}>
            {Math.round(penValue).toLocaleString()}
          </text>
          {/* The drop since the sell-off began */}
          {lossValue >= 1 && (
            <text x="31" y="34" textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill={CHART.bear}>
              ▼ {Math.round(lossValue).toLocaleString()}
            </text>
          )}
        </g>
      </svg>

      {/* ── Ground and axis: viewport-wide and fixed; the ticks slide by background offset, so the
           moving layer below only has to hold the cards ── */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-paper border-t-2 border-ink pointer-events-none" />
      <div
        className="absolute bottom-[72px] inset-x-0 h-2 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, ${CHART.ink} 1px, transparent 1px)`,
          backgroundSize: '120px 100%',
          backgroundPositionX: `${anchorPx - trailOffset}px`,
        }}
      />

      {/* ── Layer 3: the chart's x-axis and everything on it (Factor 1.0) ── */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(${anchorPx - trailOffset}px, 0, 0)` }}
      >
        {/* Axis labels: each milestone's date sits under its position, like a real chart */}
        {stops.map((stop, index) => (
          <div
            key={`axis-${stop.id}`}
            className={`absolute bottom-[56px] -translate-x-1/2 font-mono text-xs tabular whitespace-nowrap ${
              index === activeStopIndex ? 'text-ink font-medium' : 'text-ink-faint'
            }`}
            style={{ left: `${(stop.worldXPercent / 100) * worldWidth}px` }}
          >
            {stop.date}
          </div>
        ))}

        {/* Bookend scenes: basecamp, order book, summit, after hours */}
        {scenes.map((scene) => {
          const x = (scene.worldXPercent / 100) * worldWidth;
          return (
            <div
              key={scene.id}
              data-waypoint={scene.id}
              data-revealed={isRevealed(scene.id, x)}
              className="absolute"
              style={fittedStyle(scene.id, x)}
            >
              {scene.content}
            </div>
          );
        })}

        {/* Milestone stops rendered along world coordinates */}
        {stops.map((stop, index) => {
          const x = (stop.worldXPercent / 100) * worldWidth;
          return (
            <div
              key={stop.id}
              data-waypoint={stop.id}
              data-revealed={isRevealed(stop.id, x)}
              className="absolute"
              style={fittedStyle(stop.id, x)}
            >
              {renderStopContent(stop, index === activeStopIndex)}
            </div>
          );
        })}
      </div>

      {/* ── Bull & bear walking the axis ── */}
      {onMascotClick && worldHeight > 0 && (
        <MarketMascot
          camX={camX}
          velocity={cameraVelocity}
          x={mascotX}
          y={worldHeight - AXIS_FROM_BOTTOM}
          bubbleSide={inLane}
          waypointId={currentWaypointId}
          waypointX={waypointWorldX}
          onClick={onMascotClick}
        />
      )}
    </div>
  );
};
