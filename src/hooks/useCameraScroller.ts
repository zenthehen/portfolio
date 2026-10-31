import { useState, useEffect, useCallback, useRef } from 'react';

export function mapScrollToCamera(
  scrollY: number,
  maxScroll: number,
  worldWidth: number
): number {
  if (maxScroll <= 0) return 0;
  const clampedScroll = Math.max(0, Math.min(scrollY, maxScroll));
  const ratio = clampedScroll / maxScroll;
  return ratio * worldWidth;
}

export function calculateParallaxOffset(
  camX: number,
  depthFactor: number
): number {
  return camX * depthFactor;
}

// Camera spring: critically damped (damping = 2·√stiffness), settles one card in about half a second
const SPRING_STIFFNESS = 130;
const SPRING_DAMPING = 2 * Math.sqrt(SPRING_STIFFNESS);

// How long one step owns the input, and what counts as a deliberate gesture
const STEP_LOCK_MS = 750;
const WHEEL_GESTURE_GAP_MS = 220;
const WHEEL_STEP_THRESHOLD = 24;
const SWIPE_THRESHOLD_PX = 36;
// The camera counts as travelling until it's this close to its target; the last few pixels of
// the spring's settle are invisible and shouldn't block the next gesture
const TRAVELLING_PX = 40;

interface UseCameraScrollerOptions {
  worldWidth: number;
  // Keyboard and swipe controls only apply while the side-scrolling trek is shown
  enabled?: boolean;
  // Every wheel gesture, swipe or key press steps one waypoint forward (1) or back (-1)
  onStep?: (direction: 1 | -1) => void;
}

export function useCameraScroller({
  worldWidth,
  enabled = true,
  onStep,
}: UseCameraScrollerOptions) {
  // Latest callback without re-binding listeners every render
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  // Position and velocity (px/s) come from the spring together, so anything that reacts to motion
  // (mascot gait, which character shows, the index arrow) reads the real motion, not render noise
  const [cam, setCam] = useState({ x: 0, v: 0 });

  // The camera is the only thing that animates. It follows a critically damped spring toward
  // the target, so a new step mid-flight bends the motion smoothly instead of restarting it.
  const motion = useRef({ x: 0, v: 0, target: 0, lastTime: 0, frame: 0 });

  const tick = useCallback((now: number) => {
    const m = motion.current;
    const dt = Math.min(0.034, m.lastTime ? (now - m.lastTime) / 1000 : 1 / 60);
    m.lastTime = now;
    const accel = SPRING_STIFFNESS * (m.target - m.x) - SPRING_DAMPING * m.v;
    m.v += accel * dt;
    m.x += m.v * dt;
    // Land once the remaining creep is sub-pixel-per-frame, instead of crawling the last few pixels
    if (Math.abs(m.target - m.x) < 1 && Math.abs(m.v) < 15) {
      m.x = m.target;
      m.v = 0;
      m.frame = 0;
      m.lastTime = 0;
      setCam({ x: m.x, v: 0 });
      return;
    }
    setCam({ x: m.x, v: m.v });
    m.frame = requestAnimationFrame(tick);
  }, []);

  const moveTo = useCallback(
    (target: number) => {
      const m = motion.current;
      m.target = Math.max(0, Math.min(worldWidth, target));
      if (!m.frame) m.frame = requestAnimationFrame(tick);
    },
    [worldWidth, tick]
  );

  useEffect(() => () => cancelAnimationFrame(motion.current.frame), []);

  // Jump to specific percent along the trail (e.g. 0 to 100)
  const jumpToPercent = useCallback(
    (percent: number) => {
      const clamped = Math.max(0, Math.min(100, percent));
      moveTo((clamped / 100) * worldWidth);

      // Keep the page scroll position (scrollbar, reload, list-view switch) in step, instantly:
      // a smooth native scroll here would be a second animation fighting the camera.
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) window.scrollTo({ top: (clamped / 100) * maxScroll, behavior: 'auto' });
    },
    [worldWidth, moveTo]
  );

  // Scrolling by other means (dragging the scrollbar, a resize re-snap) still moves the camera
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const target = mapScrollToCamera(window.scrollY, maxScroll, worldWidth);
      if (Math.abs(target - motion.current.target) > 2) moveTo(target);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [worldWidth, moveTo]);

  // Paged input: every gesture moves exactly one waypoint, so nothing in the middle gets skipped.
  // Wheel, trackpad, touch and keys are all taken over while the trek is shown; pop-ups marked
  // data-allow-scroll keep their own native scrolling.
  useEffect(() => {
    if (!enabled) return;

    // A step locks input while the camera travels; a wheel "gesture" is an unbroken stream of
    // wheel events (trackpad momentum included) and may step at most once.
    // The lock only holds back more steps the same way: reversing is always deliberate (momentum
    // never changes sign), so it gets through at once and the spring turns the camera around.
    let lockedUntil = 0;
    let lastDirection: 1 | -1 = 1;
    let lastWheelAt = 0;
    let wheelAccum = 0;
    let wheelDirection: 1 | -1 = 1;
    let gestureConsumed = false;
    const step = (direction: 1 | -1) => {
      lockedUntil = performance.now() + STEP_LOCK_MS;
      lastDirection = direction;
      onStepRef.current?.(direction);
    };
    const isTravelling = () => Math.abs(motion.current.target - motion.current.x) > TRAVELLING_PX;
    const isHeldBack = (direction: 1 | -1) =>
      direction === lastDirection && (performance.now() < lockedUntil || isTravelling());
    const allowsNativeScroll = (target: EventTarget | null) =>
      target instanceof Element && target.closest('[data-allow-scroll]') !== null;

    const handleWheel = (e: WheelEvent) => {
      if (allowsNativeScroll(e.target) || e.ctrlKey) return; // ctrl+wheel is pinch-zoom
      e.preventDefault();
      const now = performance.now();
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta === 0) return;
      const direction: 1 | -1 = delta > 0 ? 1 : -1;
      // A pause or a change of direction starts a new gesture
      if (now - lastWheelAt > WHEEL_GESTURE_GAP_MS || direction !== wheelDirection) {
        wheelAccum = 0;
        gestureConsumed = false;
        wheelDirection = direction;
      }
      lastWheelAt = now;
      // While the camera is still travelling this way, the rest of this gesture is spent: one
      // gesture can never chain into a second step, however late slow frames deliver its events
      if (direction === lastDirection && isTravelling()) gestureConsumed = true;
      if (gestureConsumed || isHeldBack(direction)) return;
      wheelAccum += delta;
      if (Math.abs(wheelAccum) >= WHEEL_STEP_THRESHOLD) {
        gestureConsumed = true;
        step(direction);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || allowsNativeScroll(target))) return;
      const forward = ['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'd', 'D'].includes(e.key) && !e.shiftKey;
      const back = ['ArrowLeft', 'ArrowUp', 'PageUp', 'a', 'A'].includes(e.key) || (e.key === ' ' && e.shiftKey);
      if (!forward && !back) return;
      // Let Space/arrows still operate a focused button or link
      if (e.key === ' ' && target && ['BUTTON', 'A'].includes(target.tagName)) return;
      e.preventDefault();
      const direction = forward ? 1 : -1;
      if (!e.repeat || !isHeldBack(direction)) step(direction);
    };

    let startX = 0;
    let startY = 0;
    let tracking = false;
    const handleTouchStart = (e: TouchEvent) => {
      tracking = !allowsNativeScroll(e.target);
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (tracking && e.cancelable) e.preventDefault(); // no native momentum that could skip cards
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (!tracking) return;
      const dx = startX - e.changedTouches[0].clientX;
      const dy = startY - e.changedTouches[0].clientY;
      const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy; // swipe left or up = forward
      // Every swipe is deliberate (native momentum is blocked above), so each one counts, even
      // mid-slide: the step is taken from where the camera is heading, so none get skipped
      if (Math.abs(delta) > SWIPE_THRESHOLD_PX) step(delta > 0 ? 1 : -1);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled]);

  return {
    camX: cam.x,
    cameraVelocity: cam.v,
    jumpToPercent,
    progressPercent: worldWidth > 0 ? (cam.x / worldWidth) * 100 : 0,
  };
}
