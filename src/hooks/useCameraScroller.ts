import { useState, useEffect, useRef, useCallback } from 'react';
import { CandlePose } from '../types/portfolio';
import { soundEngine } from '../audio/soundEngine';

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

interface UseCameraScrollerOptions {
  worldWidth: number;
}

export function useCameraScroller({
  worldWidth,
}: UseCameraScrollerOptions) {
  const [camX, setCamX] = useState<number>(0);
  const [targetCamX, setTargetCamX] = useState<number>(0);
  const [pose, setPose] = useState<CandlePose>('idle');
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [activeQuip, setActiveQuip] = useState<string | null>(null);

  const prevCamXRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const quipTimerRef = useRef<number | null>(null);

  // Jump to specific percent along the trail (e.g. 0 to 100)
  const jumpToPercent = useCallback(
    (percent: number) => {
      const target = (Math.max(0, Math.min(100, percent)) / 100) * worldWidth;
      setTargetCamX(target);

      // Also sync actual window scroll height if in vertical scroller
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        window.scrollTo({
          top: (percent / 100) * maxScroll,
          behavior: 'smooth',
        });
      }
    },
    [worldWidth]
  );

  // Trigger celebration jump
  const triggerJump = useCallback(() => {
    setIsJumping(true);
    soundEngine.playBlip(780, 0.08);
    setTimeout(() => setIsJumping(false), 300);
  }, []);

  // Show a poke quip with auto-dismiss
  const showQuip = useCallback((text: string) => {
    setActiveQuip(text);
    soundEngine.playBlip(920, 0.06);
    if (quipTimerRef.current) clearTimeout(quipTimerRef.current);
    quipTimerRef.current = window.setTimeout(() => {
      setActiveQuip(null);
    }, 3800);
  }, []);

  // Listen to vertical window scroll and map 1:1 to targetCamX
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const target = mapScrollToCamera(window.scrollY, maxScroll, worldWidth);
      setTargetCamX(target);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [worldWidth]);

  // Keyboard controls: Arrow Left/Right, A/D, Space to Jump
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const step = worldWidth * 0.02; // 2% per arrow tap
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setTargetCamX((prev) => Math.min(worldWidth, prev + step));
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setTargetCamX((prev) => Math.max(0, prev - step));
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        triggerJump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [worldWidth, triggerJump]);

  // Touch Swipe gestures for mobile
  useEffect(() => {
    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchCurrentX = e.touches[0].clientX;
      const deltaX = touchStartX - touchCurrentX;
      if (Math.abs(deltaX) > 10) {
        setTargetCamX((prev) => Math.max(0, Math.min(worldWidth, prev + deltaX * 1.5)));
        touchStartX = touchCurrentX;
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [worldWidth]);

  // Smooth lerp frame loop
  useEffect(() => {
    let animId: number;

    const frame = () => {
      setCamX((current) => {
        const diff = targetCamX - current;
        if (Math.abs(diff) < 0.5) return targetCamX;

        const next = current + diff * 0.12; // Smooth 60fps damping
        const vel = next - prevCamXRef.current;
        velocityRef.current = vel;
        prevCamXRef.current = next;

        // Pose deduction based on velocity
        if (next >= worldWidth * 0.95) {
          setPose('celebrate');
        } else if (vel > 0.4) {
          setPose('walk-bull');
        } else if (vel < -0.4) {
          setPose('walk-bear');
        } else {
          setPose('idle');
        }

        return next;
      });

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [targetCamX, worldWidth]);

  return {
    camX,
    targetCamX,
    pose,
    isJumping,
    activeQuip,
    jumpToPercent,
    triggerJump,
    showQuip,
    progressPercent: worldWidth > 0 ? (camX / worldWidth) * 100 : 0,
  };
}
