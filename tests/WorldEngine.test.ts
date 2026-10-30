import { describe, it, expect } from 'vitest';
import { calculateParallaxOffset, mapScrollToCamera } from '../src/hooks/useCameraScroller';

describe('Camera & Parallax Calculations', () => {
  it('maps vertical scroll percentage to world camera offset correctly', () => {
    const camX = mapScrollToCamera(500, 1000, 5000);
    expect(camX).toBe(2500);
  });

  it('clamps scroll values within bounds', () => {
    const neg = mapScrollToCamera(-100, 1000, 5000);
    expect(neg).toBe(0);

    const over = mapScrollToCamera(1500, 1000, 5000);
    expect(over).toBe(5000);
  });

  it('calculates parallax layer offsets according to depth factors', () => {
    const skyOffset = calculateParallaxOffset(1000, 0.05);
    const midOffset = calculateParallaxOffset(1000, 0.40);
    expect(skyOffset).toBe(50);
    expect(midOffset).toBe(400);
  });
});
