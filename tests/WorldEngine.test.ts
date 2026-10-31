import { describe, it, expect } from 'vitest';
import { calculateParallaxOffset, mapScrollToCamera } from '../src/hooks/useCameraScroller';
import { skyColorsAt } from '../src/components/WorldParallax';

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


describe('Trading-day sky', () => {
  it('starts with a warm pre-open wash and goes to night by after hours', () => {
    expect(skyColorsAt(0).dark).toBe(0);
    expect(skyColorsAt(0).wash).toBe('rgba(214,150,80,0.16)');
    expect(skyColorsAt(100).dark).toBeGreaterThan(0.8);
  });

  it('clamps progress outside 0–100', () => {
    expect(skyColorsAt(-20)).toEqual(skyColorsAt(0));
    expect(skyColorsAt(150)).toEqual(skyColorsAt(100));
  });
});
