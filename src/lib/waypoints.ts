// A waypoint is anything the camera can rest on: a bookend scene or a milestone.
export interface Waypoint {
  id: string;
  worldXPercent: number;
}

// The waypoint whose slot the camera is closest to; that one is "current" and gets highlighted.
export function nearestWaypoint<T extends Waypoint>(waypoints: T[], progressPercent: number): T | undefined {
  let best: T | undefined;
  for (const wp of waypoints) {
    if (!best || Math.abs(wp.worldXPercent - progressPercent) < Math.abs(best.worldXPercent - progressPercent)) {
      best = wp;
    }
  }
  return best;
}

// Where cards line up on screen: near the middle on wide screens (neighbours peek in at the sides),
// a 10% margin on phones where a card fills most of the width.
export function trailAnchorPx(viewportWidth: number): number {
  return Math.max(viewportWidth * 0.1, Math.min(viewportWidth * 0.5 - 210, viewportWidth * 0.3));
}
