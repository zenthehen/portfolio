import React, { useEffect, useRef, useState } from 'react';
import { MASCOT_LINES } from '../data/portfolioContent';
import { BullRig, BearRig, MascotPose } from './MascotRigs';
import './mascot.css';

export type MascotCharacter = 'bull' | 'bear';

interface MarketMascotProps {
  camX: number;
  // Camera velocity in px/s straight from the scroll spring: decides running, gait and who shows
  velocity?: number;
  // Screen position: x is the mascot's centre, y is where its feet rest (the chart's x-axis)
  x: number;
  y: number;
  // Open the speech bubble beside the mascot (phones, where the lane sits under the card)
  // instead of above it
  bubbleSide?: boolean;
  // Nearest waypoint and its world x, for arrival lines and poses
  waypointId: string | undefined;
  waypointX: number;
  onClick: (character: MascotCharacter) => void;
}

// Camera speed (px/s): above RUN_AT it's moving, above GALLOP_AT it gallops rather than walks
const RUN_AT = 60;
const GALLOP_AT = 420;
const BUBBLE_MS = 4200;

const CELEBRATE_AT = new Set(['ath-summit', 'summit']);

// Landing on a new card: squash on impact, stretch back, settle; the shadow answers
const LANDING: Keyframe[] = [
  { transform: 'translateY(-14px) scale(0.94, 1.08)' },
  { transform: 'translateY(0) scale(1.12, 0.84)', offset: 0.45 },
  { transform: 'scale(0.96, 1.05)', offset: 0.7 },
  { transform: 'none' },
];
const SHADOW_LANDING: Keyframe[] = [
  { transform: 'scale(0.6)', opacity: 0.12 },
  { transform: 'scale(1.12)', opacity: 0.38, offset: 0.45 },
  { transform: 'none', opacity: 0.3 },
];

export const MarketMascot: React.FC<MarketMascotProps> = ({
  camX,
  velocity = 0,
  x,
  y,
  bubbleSide = false,
  waypointId,
  waypointX,
  onClick,
}) => {
  // The spring's own velocity drives running, direction and gait. (Measuring camera movement
  // between renders made the pose flicker whenever something else caused an extra render.)
  const speed = Math.abs(velocity);
  const isRunning = speed > RUN_AT;

  const [character, setCharacter] = useState<MascotCharacter>('bull');
  const [bubble, setBubble] = useState<{ text: string; key: number } | null>(null);
  const spokenAt = useRef<string | null>(null);
  const bubbleTimer = useRef<number>();

  // Hop onto each new card as it slides in: squash-and-stretch played with the Web Animations
  // API on the rigs already on screen, rather than remounting them (which would rebuild both
  // drawings and restart every animation in the middle of a move)
  const rigRef = useRef<HTMLDivElement>(null);
  const lastWaypoint = useRef(waypointId);
  useEffect(() => {
    if (waypointId === lastWaypoint.current) return;
    lastWaypoint.current = waypointId;
    const root = rigRef.current;
    if (!root || typeof root.animate !== 'function' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    root.querySelectorAll<SVGGElement>('.mascot-sprite.is-on .m-all').forEach((part) =>
      part.animate(LANDING, { duration: 500, easing: 'cubic-bezier(0.3, 0.7, 0.4, 1)' })
    );
    root.querySelectorAll<SVGEllipseElement>('.mascot-sprite.is-on .m-shadow').forEach((shadow) =>
      shadow.animate(SHADOW_LANDING, { duration: 500, easing: 'ease-out' })
    );
  }, [waypointId]);

  const heading: MascotCharacter | null = velocity > RUN_AT ? 'bull' : velocity < -RUN_AT ? 'bear' : null;
  const firstFrame = useRef(true);
  useEffect(() => {
    const isFirst = firstFrame.current;
    firstFrame.current = false;

    if (heading) {
      // Forward is the bull's market, backward the bear's
      setCharacter((c) => (c === heading ? c : heading));
      setBubble(null);
      spokenAt.current = null;
      return;
    }

    // Settled on a waypoint: say something about it, once per arrival
    if (waypointId && Math.abs(camX - waypointX) < 1.5 && spokenAt.current !== waypointId) {
      spokenAt.current = waypointId;
      const lines = MASCOT_LINES[waypointId];
      if (!lines) return;
      window.clearTimeout(bubbleTimer.current);
      // Let the intro animation play before the first line
      const delay = isFirst && waypointId === 'basecamp' ? 1600 : 160;
      bubbleTimer.current = window.setTimeout(() => {
        setBubble({ text: lines[character], key: Date.now() });
        bubbleTimer.current = window.setTimeout(() => setBubble(null), BUBBLE_MS);
      }, delay);
    }
  }, [camX, heading, waypointId, waypointX, character]);

  // On unmount (including React StrictMode's dev remount) cancel the pending line and forget the
  // arrival, so the remounted mascot greets again instead of staying silent
  useEffect(
    () => () => {
      window.clearTimeout(bubbleTimer.current);
      spokenAt.current = null;
    },
    []
  );

  const isSleeping = waypointId === 'after-hours' && !isRunning;
  const isCelebrating = !isRunning && !isSleeping && character === 'bull' && !!waypointId && CELEBRATE_AT.has(waypointId);

  // One pose per character; the rig animates every part for it
  const movingPose: MascotPose = speed > GALLOP_AT ? 'run' : 'walk';
  const restingPose = (who: MascotCharacter): MascotPose => {
    if (isSleeping) return 'sleep';
    if (who === 'bull') return isCelebrating ? 'celebrate' : bubble ? 'talk' : 'idle';
    return bubble ? 'grumpy' : 'sit';
  };
  const bullPose = isRunning ? movingPose : restingPose('bull');
  const bearPose = isRunning ? movingPose : restingPose('bear');

  // Eyes follow the pointer while resting (a couple of px either way)
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = rootRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dxp = e.clientX - (r.left + r.width / 2);
        const dyp = e.clientY - (r.top + r.height / 3);
        const len = Math.hypot(dxp, dyp) || 1;
        // The bear's drawing is mirrored, so its horizontal look is flipped back
        const flip = el.classList.contains('is-bear') ? -1 : 1;
        el.style.setProperty('--look-x', `${((dxp / len) * 1.4 * flip).toFixed(2)}px`);
        el.style.setProperty('--look-y', `${((dyp / len) * 1.2).toFixed(2)}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Faster scrolling, faster gallop
  // Snapped to three speeds: --gait drives the duration of every animated joint, so changing it
  // every frame would make the browser re-time all of them each frame (and the page janks)
  const gait = speed > 2400 ? 0.2 : speed > 1100 ? 0.26 : 0.32;

  const left = x;
  // Above the mascot the bubble extends left into the free gap beside the card
  const bubbleAlign = left < 200 ? 'left' : 'right';

  const state = [
    'mascot',
    isRunning && 'is-running',
    isSleeping && 'is-sleeping',
    isCelebrating && 'is-celebrating',
    character === 'bear' && 'is-bear',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={rootRef} className={state} style={{ left, top: y, '--gait': `${gait}s` } as React.CSSProperties}>
      {bubble && (
        <div
          key={bubble.key}
          role="status"
          className={`mascot-bubble ${bubbleSide ? 'mascot-bubble--side' : `mascot-bubble--${bubbleAlign}`}`}
        >
          <span className="mascot-bubble-who">{character === 'bull' ? 'Bull' : 'Bear'}</span>
          {bubble.text}
        </div>
      )}

      {isSleeping && (
        <div className="mascot-zzz" aria-hidden="true">
          <span>z</span>
          <span>z</span>
          <span>Z</span>
        </div>
      )}

      <div ref={rigRef} className="mascot-rig">
        <button
          type="button"
          onClick={() => onClick('bull')}
          aria-label="Bull: go to the next card"
          title="Charge to the next card"
          tabIndex={character === 'bull' ? 0 : -1}
          className={`mascot-sprite mascot-sprite--bull ${character === 'bull' ? 'is-on' : 'is-off'}`}
        >
          <BullRig pose={bullPose} />
        </button>
        <button
          type="button"
          onClick={() => onClick('bear')}
          aria-label="Bear: go back one card"
          title="Back off one card"
          tabIndex={character === 'bear' ? 0 : -1}
          className={`mascot-sprite mascot-sprite--bear ${character === 'bear' ? 'is-on' : 'is-off'}`}
        >
          <BearRig pose={bearPose} />
        </button>
      </div>
    </div>
  );
};
