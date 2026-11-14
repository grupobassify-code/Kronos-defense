import { MapData } from '../types/game';

export interface PathPoint {
  x: number;
  y: number;
}

export interface DetailedPath {
  points: PathPoint[];
  totalLength: number;
  segments: {
    from: PathPoint;
    to: PathPoint;
    length: number;
    cumulativeLength: number;
  }[];
}

/**
 * Converts discrete grid waypoints to pixel coordinates and calculates
 * exact segment lengths for smooth enemy movement and interpolation.
 */
export function calculateDetailedPath(map: MapData): DetailedPath {
  const tileSize = map.tileSize;
  const halfTile = tileSize / 2;

  const points: PathPoint[] = map.pathWaypoints.map((wp) => ({
    x: wp.x * tileSize + halfTile,
    y: wp.y * tileSize + halfTile
  }));

  const segments = [];
  let totalLength = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    totalLength += length;
    segments.push({
      from,
      to,
      length,
      cumulativeLength: totalLength
    });
  }

  return { points, totalLength, segments };
}

/**
 * Returns pixel position and angle (in radians) along the path given distance traveled
 */
export function getPositionAlongPath(
  path: DetailedPath,
  distance: number
): { x: number; y: number; angle: number; reachedEnd: boolean } {
  if (distance <= 0) {
    const first = path.points[0];
    const next = path.points[1] || first;
    const angle = Math.atan2(next.y - first.y, next.x - first.x);
    return { x: first.x, y: first.y, angle, reachedEnd: false };
  }

  if (distance >= path.totalLength) {
    const last = path.points[path.points.length - 1];
    const prev = path.points[path.points.length - 2] || last;
    const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
    return { x: last.x, y: last.y, angle, reachedEnd: true };
  }

  let accumulated = 0;
  for (const seg of path.segments) {
    if (distance <= accumulated + seg.length) {
      const segDistance = distance - accumulated;
      const t = segDistance / seg.length;
      const x = seg.from.x + (seg.to.x - seg.from.x) * t;
      const y = seg.from.y + (seg.to.y - seg.from.y) * t;
      const angle = Math.atan2(seg.to.y - seg.from.y, seg.to.x - seg.from.x);
      return { x, y, angle, reachedEnd: false };
    }
    accumulated += seg.length;
  }

  const last = path.points[path.points.length - 1];
  return { x: last.x, y: last.y, angle: 0, reachedEnd: true };
}

/**
 * Checks if a grid coordinate belongs to the path
 */
export function isPathTile(map: MapData, gridX: number, gridY: number): boolean {
  for (let i = 0; i < map.pathWaypoints.length - 1; i++) {
    const p1 = map.pathWaypoints[i];
    const p2 = map.pathWaypoints[i + 1];

    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);

    if (p1.x === p2.x && gridX === p1.x && gridY >= minY && gridY <= maxY) {
      return true;
    }
    if (p1.y === p2.y && gridY === p1.y && gridX >= minX && gridX <= maxX) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a grid coordinate is an obstacle
 */
export function isObstacleTile(map: MapData, gridX: number, gridY: number): boolean {
  return map.obstacles.some((obs) => obs.x === gridX && obs.y === gridY);
}
