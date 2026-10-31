// The career "price" plotted across the sky: passes exactly through each waypoint's index level,
// with seeded wiggle between waypoints so it reads like real price action.

export interface PricePoint {
  x: number; // world px
  value: number; // index level
}

const seeded = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export function buildPriceSeries(
  waypoints: { worldXPercent: number; marketIndex: number }[],
  worldWidth: number,
  stepsBetween = 9
): PricePoint[] {
  const sorted = [...waypoints].sort((a, b) => a.worldXPercent - b.worldXPercent);
  const series: PricePoint[] = [];
  sorted.forEach((wp, i) => {
    const x = (wp.worldXPercent / 100) * worldWidth;
    series.push({ x, value: wp.marketIndex });
    const next = sorted[i + 1];
    if (!next) return;
    const nextX = (next.worldXPercent / 100) * worldWidth;
    const swing = Math.max(40, Math.abs(next.marketIndex - wp.marketIndex) * 0.35);
    for (let s = 1; s < stepsBetween; s++) {
      const t = s / stepsBetween;
      const base = wp.marketIndex + (next.marketIndex - wp.marketIndex) * t;
      // Taper the wiggle to zero at both ends so waypoints stay exact
      const wiggle = (seeded(i * 31 + s) - 0.5) * 2 * swing * Math.sin(Math.PI * t);
      series.push({ x: x + (nextX - x) * t, value: Math.round(base + wiggle) });
    }
  });
  return series;
}

export function priceAt(series: PricePoint[], x: number): number {
  if (series.length === 0) return 0;
  if (x <= series[0].x) return series[0].value;
  const last = series[series.length - 1];
  if (x >= last.x) return last.value;
  let i = 1;
  while (series[i].x < x) i++;
  const a = series[i - 1];
  const b = series[i];
  return a.value + ((x - a.x) / (b.x - a.x)) * (b.value - a.value);
}
