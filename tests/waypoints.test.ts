import { describe, it, expect } from 'vitest';
import { nearestWaypoint, trailAnchorPx } from '../src/lib/waypoints';

const trail = [
  { id: 'a', worldXPercent: 0 },
  { id: 'b', worldXPercent: 12 },
  { id: 'c', worldXPercent: 22 },
];

describe('Trail waypoints', () => {
  it('highlights whichever waypoint is closest to the camera, not one that has already slid past', () => {
    expect(nearestWaypoint(trail, 0)?.id).toBe('a');
    expect(nearestWaypoint(trail, 7)?.id).toBe('b');
    expect(nearestWaypoint(trail, 15)?.id).toBe('b');
    expect(nearestWaypoint(trail, 18)?.id).toBe('c');
  });

  it('lines cards up near the middle on desktop and at a 10% margin on phones', () => {
    expect(trailAnchorPx(1440)).toBe(432);
    expect(trailAnchorPx(390)).toBe(39);
  });
});
