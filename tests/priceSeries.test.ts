import { describe, it, expect } from 'vitest';
import { buildPriceSeries, priceAt } from '../src/lib/priceSeries';

const waypoints = [
  { worldXPercent: 0, marketIndex: 1000 },
  { worldXPercent: 50, marketIndex: 2000 },
  { worldXPercent: 100, marketIndex: 3000 },
];

describe('Career price series', () => {
  it('passes exactly through every waypoint', () => {
    const series = buildPriceSeries(waypoints, 1000);
    expect(priceAt(series, 0)).toBe(1000);
    expect(priceAt(series, 500)).toBe(2000);
    expect(priceAt(series, 1000)).toBe(3000);
  });

  it('is deterministic and clamps outside the world', () => {
    expect(buildPriceSeries(waypoints, 1000)).toEqual(buildPriceSeries(waypoints, 1000));
    const series = buildPriceSeries(waypoints, 1000);
    expect(priceAt(series, -50)).toBe(1000);
    expect(priceAt(series, 5000)).toBe(3000);
  });

  it('wiggles between waypoints like price action', () => {
    const series = buildPriceSeries(waypoints, 1000);
    const between = series.filter((p) => p.x > 0 && p.x < 500).map((p) => p.value);
    const straight = between.map((_, i) => 1000 + ((i + 1) / 9) * 1000);
    expect(between.some((v, i) => Math.abs(v - straight[i]) > 5)).toBe(true);
  });
});
