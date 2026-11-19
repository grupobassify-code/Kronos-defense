import React, { useRef, useEffect, useState } from 'react';
import {
  MapData,
  PlacedUnit,
  ActiveEnemy,
  Projectile,
  Particle,
  DamageNumber,
  TacticalToolId
} from '../types/game';
import { UNITS } from '../data/units';
import { ENEMIES } from '../data/enemies';
import { isPathTile, isObstacleTile } from '../utils/pathUtils';
import { resolveAssetUrl } from '../utils/assets';
import { getInMatchUnitTier, MAX_IN_MATCH_LEVEL } from '../utils/progression';

interface GameCanvasProps {
  map: MapData;
  placedUnits: PlacedUnit[];
  activeEnemies: ActiveEnemy[];
  projectiles: Projectile[];
  particles: Particle[];
  damageNumbers: DamageNumber[];
  selectedUnit: PlacedUnit | null;
  placementBlueprintId: string | null;
  activeToolId?: TacticalToolId | null;
  hoverTile: { x: number; y: number } | null;
  baseHealth: number;
  maxBaseHealth: number;
  activeShowdownVFX: { type: string; progress: number } | null;
  onTileClick: (gridX: number, gridY: number) => void;
  onSelectUnit: (unit: PlacedUnit | null) => void;
  onTriggerShowdown?: (instanceId: string) => void;
  onHoverTileChange: (tile: { x: number; y: number } | null) => void;
  canAffordPlacement: boolean;
}

// Global Image Cache with onload subscription so canvas redraws as soon as web images finish loading
const imageCache: Record<string, HTMLImageElement> = {};
const imageLoadSubscribers = new Set<() => void>();

function notifyImageLoaded() {
  imageLoadSubscribers.forEach((cb) => {
    try {
      cb();
    } catch {
      // ignore
    }
  });
}

function getImage(url?: string): HTMLImageElement | null {
  const resolved = resolveAssetUrl(url);
  if (!resolved || typeof Image === 'undefined') return null;

  if (!imageCache[resolved]) {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => notifyImageLoaded();
    img.onerror = () => {
      // Allow clean fallback without crashing drawImage
    };
    img.src = resolved;
    imageCache[resolved] = img;
  }

  const cached = imageCache[resolved];
  return cached.complete && cached.naturalWidth > 0 ? cached : null;
}

function safeDrawImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number
): boolean {
  try {
    if (!img.complete || img.naturalWidth <= 0) return false;
    ctx.drawImage(img, dx, dy, dw, dh);
    return true;
  } catch {
    return false;
  }
}

const SHOWDOWN_HOLD_MS = 2000;

export const GameCanvas: React.FC<GameCanvasProps> = ({
  map,
  placedUnits,
  activeEnemies,
  projectiles,
  particles,
  damageNumbers,
  selectedUnit,
  placementBlueprintId,
  activeToolId = null,
  hoverTile,
  baseHealth,
  maxBaseHealth,
  activeShowdownVFX,
  onTileClick,
  onSelectUnit,
  onTriggerShowdown,
  onHoverTileChange,
  canAffordPlacement
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [, setImageLoadTick] = useState(0);
  const [showdownHold, setShowdownHold] = useState<{
    instanceId: string;
    pixelX: number;
    pixelY: number;
    progress: number;
  } | null>(null);

  const holdRafRef = useRef<number | null>(null);
  const holdActiveRef = useRef<{ instanceId: string; startTime: number } | null>(null);
  const suppressClickRef = useRef<boolean>(false);
  const onTriggerShowdownRef = useRef(onTriggerShowdown);
  onTriggerShowdownRef.current = onTriggerShowdown;

  const canvasWidth = map.cols * map.tileSize;
  const canvasHeight = map.rows * map.tileSize;

  const cancelShowdownHold = () => {
    if (holdRafRef.current !== null) {
      cancelAnimationFrame(holdRafRef.current);
      holdRafRef.current = null;
    }
    holdActiveRef.current = null;
    setShowdownHold(null);
  };

  useEffect(() => {
    return () => {
      if (holdRafRef.current !== null) {
        cancelAnimationFrame(holdRafRef.current);
      }
    };
  }, []);

  // Subscribe to async image load events so canvas redraws immediately when web assets arrive
  useEffect(() => {
    const onLoaded = () => setImageLoadTick((n) => (n + 1) % 1000000);
    imageLoadSubscribers.add(onLoaded);
    return () => {
      imageLoadSubscribers.delete(onLoaded);
    };
  }, []);

  // Preload priority assets for the active map (avoid saturating browser connections on mount)
  useEffect(() => {
    if (map.bgImageUrl) getImage(map.bgImageUrl);
    getImage('/assets/images/attack_supernova_1791483748936.jpg');
    getImage('/assets/images/attack_meteor_1791483757694.jpg');
    getImage('/assets/images/attack_orbital_beam_1791483770365.jpg');
  }, [map]);

  const getGridCoordsFromClient = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;
    const x = (clientX - rect.x) * scaleX;
    const y = (clientY - rect.y) * scaleY;
    const gridX = Math.floor(x / map.tileSize);
    const gridY = Math.floor(y / map.tileSize);
    if (gridX < 0 || gridX >= map.cols || gridY < 0 || gridY >= map.rows) return null;
    return { gridX, gridY };
  };

  // Handle canvas pointer move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const coords = getGridCoordsFromClient(e.clientX, e.clientY);
    if (coords) {
      if (!hoverTile || hoverTile.x !== coords.gridX || hoverTile.y !== coords.gridY) {
        onHoverTileChange({ x: coords.gridX, y: coords.gridY });
      }
      if (holdActiveRef.current) {
        const activeUnit = placedUnits.find((u) => u.instanceId === holdActiveRef.current?.instanceId);
        if (!activeUnit || activeUnit.gridX !== coords.gridX || activeUnit.gridY !== coords.gridY) {
          cancelShowdownHold();
        }
      }
    } else {
      if (hoverTile) onHoverTileChange(null);
      if (holdActiveRef.current) cancelShowdownHold();
    }
  };

  const handlePointerLeave = () => {
    onHoverTileChange(null);
    cancelShowdownHold();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (activeToolId || placementBlueprintId || !onTriggerShowdown) return;

    const coords = getGridCoordsFromClient(e.clientX, e.clientY);
    if (!coords) return;

    const clickedUnit = placedUnits.find((u) => u.gridX === coords.gridX && u.gridY === coords.gridY);
    if (!clickedUnit || !clickedUnit.showdownReady) return;

    cancelShowdownHold();
    const startTime = performance.now();
    const instanceId = clickedUnit.instanceId;
    const pixelX = clickedUnit.pixelX;
    const pixelY = clickedUnit.pixelY;
    holdActiveRef.current = { instanceId, startTime };
    setShowdownHold({ instanceId, pixelX, pixelY, progress: 0 });

    const step = (now: number) => {
      if (!holdActiveRef.current || holdActiveRef.current.instanceId !== instanceId) return;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / SHOWDOWN_HOLD_MS);
      if (progress >= 1) {
        cancelShowdownHold();
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 250);
        onTriggerShowdownRef.current?.(instanceId);
        return;
      }
      setShowdownHold({ instanceId, pixelX, pixelY, progress });
      holdRafRef.current = requestAnimationFrame(step);
    };

    holdRafRef.current = requestAnimationFrame(step);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const hadHold = !!holdActiveRef.current;
    cancelShowdownHold();
    // On touch devices, releasing before 2s might skip synthetic click after a long press (~0.6s-1.9s)
    if (hadHold && e.pointerType !== 'mouse' && !suppressClickRef.current) {
      const coords = getGridCoordsFromClient(e.clientX, e.clientY);
      if (coords) {
        const clickedUnit = placedUnits.find((u) => u.gridX === coords.gridX && u.gridY === coords.gridY);
        if (clickedUnit) {
          suppressClickRef.current = true;
          window.setTimeout(() => {
            suppressClickRef.current = false;
          }, 180);
          onSelectUnit(clickedUnit);
        }
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    const coords = getGridCoordsFromClient(e.clientX, e.clientY);
    if (!coords) return;
    const { gridX, gridY } = coords;

    // Single click ALWAYS opens Upgrades Inspector if clicking on a unit (never auto-fires Showdown)
    const clickedUnit = placedUnits.find((u) => u.gridX === gridX && u.gridY === gridY);
    if (activeToolId || placementBlueprintId) {
      onTileClick(gridX, gridY);
    } else if (clickedUnit) {
      onSelectUnit(clickedUnit);
    } else {
      onTileClick(gridX, gridY);
    }
  };

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 1. Draw Grid Background (with AI scenery image if available)
    drawGrid(ctx, map, hoverTile, placementBlueprintId, activeToolId, placedUnits, canAffordPlacement);

    // 2. Draw Path & Waypoints
    drawPath(ctx, map);

    // 3. Draw Obstacles (rocks / stones smashable by Hammer)
    drawObstacles(ctx, map, hoverTile, activeToolId);

    // 4. Draw Spawn Portal and Core Citadel
    drawSpawnAndBase(ctx, map, baseHealth, maxBaseHealth);

    // 5. Draw Range / Tool Radius Indicator if selected, placing, or bombing
    drawRangeOverlays(ctx, map, selectedUnit, placementBlueprintId, activeToolId, hoverTile);

    // 6. Draw Placed Units (with AI character sprites & Yellow Showdown Glow)
    placedUnits.forEach((unit) => {
      const isHovered = !!hoverTile && hoverTile.x === unit.gridX && hoverTile.y === unit.gridY;
      drawUnit(ctx, unit, selectedUnit?.instanceId === unit.instanceId, isHovered);
    });

    // 6b. Draw 2s Showdown Hold Charge Ring when holding a Showdown-ready character
    if (showdownHold) {
      drawShowdownHoldRing(ctx, showdownHold.pixelX, showdownHold.pixelY, showdownHold.progress);
    }

    // 7. Draw Active Enemies (with AI boss portraits)
    activeEnemies.forEach((enemy) => {
      drawEnemy(ctx, enemy);
    });

    // 8. Draw Projectiles
    projectiles.forEach((proj) => {
      drawProjectile(ctx, proj);
    });

    // 9. Draw Particle Systems
    particles.forEach((p) => {
      drawParticle(ctx, p);
    });

    // 10. Draw Floating Damage Numbers
    damageNumbers.forEach((num) => {
      drawDamageNumber(ctx, num);
    });

    // 11. Draw Showdown Full Screen VFX with AI attack art
    if (activeShowdownVFX) {
      drawShowdownOverlay(ctx, canvasWidth, canvasHeight, activeShowdownVFX);
    }
  });

  const hoveredUnit = hoverTile
    ? placedUnits.find((u) => u.gridX === hoverTile.x && u.gridY === hoverTile.y)
    : undefined;
  const cursorClass = hoveredUnit && !placementBlueprintId && !activeToolId
    ? 'cursor-pointer'
    : 'cursor-crosshair';

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex items-center justify-center select-none">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={cancelShowdownHold}
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
        className={`block ${cursorClass} max-w-full h-auto aspect-[18/11] touch-manipulation`}
      />
    </div>
  );
};

/* ================= RENDER HELPERS ================= */

function drawGrid(
  ctx: CanvasRenderingContext2D,
  map: MapData,
  hoverTile: { x: number; y: number } | null,
  placementBlueprintId: string | null,
  activeToolId: TacticalToolId | null,
  placedUnits: PlacedUnit[],
  canAffordPlacement: boolean
) {
  const ts = map.tileSize;
  const width = map.cols * ts;
  const height = map.rows * ts;

  // 1. Draw AI Scenery Background
  const bgImg = getImage(map.bgImageUrl);
  if (bgImg && safeDrawImage(ctx, bgImg, 0, 0, width, height)) {
    // Dark tactical overlay to keep gameplay elements crisp and legible
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = map.theme.bg;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Subtle grid lines & tile shading
  for (let c = 0; c < map.cols; c++) {
    for (let r = 0; r < map.rows; r++) {
      const isPath = isPathTile(map, c, r);
      const isObstacle = isObstacleTile(map, c, r);
      const unitOnTile = placedUnits.find((u) => u.gridX === c && u.gridY === r);
      const hasUnit = Boolean(unitOnTile);

      const px = c * ts;
      const py = r * ts;

      if (!isPath && !isObstacle) {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.3)';
        ctx.fillRect(px + 1, py + 1, ts - 2, ts - 2);

        // Tech marker dot in center of buildable cells
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(px + ts / 2 - 1, py + ts / 2 - 1, 2, 2);
      }

      // Grid line
      ctx.strokeStyle = map.theme.gridLine;
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 0.5, py + 0.5, ts, ts);

      // Hover highlight
      if (hoverTile && hoverTile.x === c && hoverTile.y === r) {
        if (activeToolId) {
          let isValidTarget = false;
          let accentColor = '#EF4444';
          if (activeToolId === 'shovel') {
            isValidTarget = hasUnit;
            accentColor = '#F59E0B';
          } else if (activeToolId === 'hammer') {
            isValidTarget = isObstacle;
            accentColor = '#F97316';
          } else if (activeToolId === 'battery') {
            isValidTarget = hasUnit;
            accentColor = '#22D3EE';
          } else if (activeToolId === 'wrench') {
            isValidTarget = Boolean(unitOnTile && unitOnTile.level < MAX_IN_MATCH_LEVEL);
            accentColor = '#10B981';
          } else if (activeToolId === 'bomb') {
            isValidTarget = true;
            accentColor = '#EF4444';
          }
          ctx.fillStyle = isValidTarget ? `${accentColor}44` : 'rgba(239, 68, 68, 0.25)';
          ctx.fillRect(px + 1, py + 1, ts - 2, ts - 2);
          ctx.strokeStyle = isValidTarget ? accentColor : '#EF4444';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(px + 1, py + 1, ts - 2, ts - 2);
        } else if (placementBlueprintId) {
          const isValid = !isPath && !isObstacle && !hasUnit && canAffordPlacement;
          ctx.fillStyle = isValid ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.4)';
          ctx.fillRect(px + 1, py + 1, ts - 2, ts - 2);
          ctx.strokeStyle = isValid ? '#22C55E' : '#EF4444';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(px + 1, py + 1, ts - 2, ts - 2);
        } else if (!isPath && !isObstacle) {
          ctx.fillStyle = map.theme.buildableHover;
          ctx.fillRect(px + 1, py + 1, ts - 2, ts - 2);
        }
      }
    }
  }
}

function drawPath(ctx: CanvasRenderingContext2D, map: MapData) {
  const ts = map.tileSize;
  const half = ts / 2;
  const pts = map.pathWaypoints;

  // Path base corridor
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Outer border glow
  ctx.strokeStyle = map.theme.pathBorder;
  ctx.lineWidth = ts * 0.78;
  ctx.beginPath();
  ctx.moveTo(pts[0].x * ts + half, pts[0].y * ts + half);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x * ts + half, pts[i].y * ts + half);
  }
  ctx.stroke();

  // Inner road surface
  ctx.strokeStyle = map.theme.pathColor;
  ctx.lineWidth = ts * 0.68;
  ctx.beginPath();
  ctx.moveTo(pts[0].x * ts + half, pts[0].y * ts + half);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x * ts + half, pts[i].y * ts + half);
  }
  ctx.stroke();

  // Directional energy guide dashes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([8, 12]);
  ctx.beginPath();
  ctx.moveTo(pts[0].x * ts + half, pts[0].y * ts + half);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x * ts + half, pts[i].y * ts + half);
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawObstacles(
  ctx: CanvasRenderingContext2D,
  map: MapData,
  hoverTile: { x: number; y: number } | null,
  activeToolId: TacticalToolId | null
) {
  const ts = map.tileSize;
  const half = ts / 2;

  map.obstacles.forEach((obs) => {
    const px = obs.x * ts + half;
    const py = obs.y * ts + half;
    const isHammerMode = activeToolId === 'hammer';
    const isHovered = isHammerMode && hoverTile && hoverTile.x === obs.x && hoverTile.y === obs.y;

    ctx.save();
    // Base boulder shadow
    ctx.fillStyle = 'rgba(2, 6, 23, 0.65)';
    ctx.beginPath();
    ctx.ellipse(px, py + 4, half * 0.72, half * 0.56, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rugged multi-faceted rock body
    const r = half * 0.72;
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = isHovered ? '#FB923C' : isHammerMode ? '#F59E0B' : '#64748B';
    ctx.lineWidth = isHovered ? 3 : 2;
    ctx.beginPath();
    ctx.moveTo(px - r * 0.75, py - r * 0.25);
    ctx.lineTo(px - r * 0.25, py - r * 0.85);
    ctx.lineTo(px + r * 0.55, py - r * 0.7);
    ctx.lineTo(px + r * 0.88, py + r * 0.05);
    ctx.lineTo(px + r * 0.48, py + r * 0.76);
    ctx.lineTo(px - r * 0.55, py + r * 0.72);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Rock facets highlight
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(px - r * 0.25, py - r * 0.85);
    ctx.lineTo(px + r * 0.55, py - r * 0.7);
    ctx.lineTo(px + r * 0.1, py);
    ctx.lineTo(px - r * 0.55, py - r * 0.15);
    ctx.closePath();
    ctx.fill();

    // Cracks
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px - 5, py - 8);
    ctx.lineTo(px + 2, py + 1);
    ctx.lineTo(px - 3, py + 9);
    ctx.stroke();

    if (isHammerMode) {
      ctx.font = 'bold 9px system-ui';
      ctx.textAlign = 'center';
      ctx.fillStyle = isHovered ? '#FDE047' : '#FDBA74';
      ctx.fillText(isHovered ? 'ROMPER' : 'PIEDRA', px, py - r - 4);
    }
    ctx.restore();
  });
}

function drawSpawnAndBase(
  ctx: CanvasRenderingContext2D,
  map: MapData,
  baseHealth: number,
  maxBaseHealth: number
) {
  const ts = map.tileSize;
  const half = ts / 2;
  const spawnWp = map.pathWaypoints[0];
  const baseWp = map.pathWaypoints[map.pathWaypoints.length - 1];

  const spawnX = spawnWp.x * ts + half;
  const spawnY = spawnWp.y * ts + half;
  const baseX = baseWp.x * ts + half;
  const baseY = baseWp.y * ts + half;

  // SPAWN PORTAL
  ctx.save();
  ctx.beginPath();
  ctx.arc(spawnX, spawnY, half * 0.85, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
  ctx.fill();
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#F87171';
  ctx.beginPath();
  ctx.arc(spawnX, spawnY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // BASE CITADEL: Chrono Core Crystal
  ctx.save();
  const hpRatio = Math.max(0, baseHealth / maxBaseHealth);
  const coreColor = hpRatio > 0.5 ? '#10B981' : hpRatio > 0.25 ? '#F59E0B' : '#EF4444';
  const pulse = Math.sin(Date.now() / 250) * 0.15 + 0.85;

  // Outer defense shield aura
  ctx.beginPath();
  ctx.arc(baseX, baseY, half * 1.15, 0, Math.PI * 2);
  ctx.fillStyle = hpRatio < 0.3 ? `rgba(239, 68, 68, ${0.2 * pulse})` : `rgba(16, 185, 129, 0.12)`;
  ctx.fill();
  ctx.strokeStyle = hpRatio < 0.3 ? '#EF4444' : `${coreColor}88`;
  ctx.lineWidth = hpRatio < 0.3 ? 2.5 : 1.5;
  ctx.stroke();

  // Core Citadel Chamber
  ctx.beginPath();
  ctx.arc(baseX, baseY, half * 0.95, 0, Math.PI * 2);
  ctx.fillStyle = `${coreColor}33`;
  ctx.fill();
  ctx.strokeStyle = coreColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Hexagonal inner crystal
  ctx.fillStyle = coreColor;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const r = half * 0.55 * pulse;
    const x = baseX + Math.cos(angle) * r;
    const y = baseY + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // Core Center Glow Point
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(baseX, baseY, 4, 0, Math.PI * 2);
  ctx.fill();

  // HP indicator ring
  ctx.beginPath();
  ctx.arc(baseX, baseY, half * 0.95 + 4, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * hpRatio);
  ctx.strokeStyle = coreColor;
  ctx.lineWidth = 4;
  ctx.stroke();

  // HP text badge above core
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(baseX - 26, baseY - half - 14, 52, 13);
  ctx.fillStyle = coreColor;
  ctx.fillText(`♥ ${Math.round(baseHealth)}/10`, baseX, baseY - half - 4);

  // Label "NÚCLEO (FUGAS: X/10)" below core
  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = hpRatio < 0.3 ? '#EF4444' : '#94A3B8';
  ctx.fillText(`FUGAS: ${Math.max(0, 10 - Math.round(baseHealth))}/10`, baseX, baseY + half + 14);

  ctx.restore();
}

function drawRangeOverlays(
  ctx: CanvasRenderingContext2D,
  map: MapData,
  selectedUnit: PlacedUnit | null,
  placementBlueprintId: string | null,
  activeToolId: TacticalToolId | null,
  hoverTile: { x: number; y: number } | null
) {
  const ts = map.tileSize;
  const half = ts / 2;

  if (selectedUnit && !activeToolId) {
    const bp = UNITS[selectedUnit.blueprintId];
    if (bp) {
      const tier = getInMatchUnitTier(bp, selectedUnit.level);
      const range = tier.range;

      ctx.save();
      ctx.beginPath();
      ctx.arc(selectedUnit.pixelX, selectedUnit.pixelY, range, 0, Math.PI * 2);
      ctx.fillStyle = `${bp.colorTheme.primary}18`;
      ctx.fill();
      ctx.strokeStyle = bp.colorTheme.primary;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
  }

  if (activeToolId === 'bomb' && hoverTile) {
    const px = hoverTile.x * ts + half;
    const py = hoverTile.y * ts + half;
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, 115, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.22)';
    ctx.fill();
    ctx.strokeStyle = '#F97316';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  if (placementBlueprintId && hoverTile) {
    const bp = UNITS[placementBlueprintId];
    if (bp) {
      const px = hoverTile.x * ts + half;
      const py = hoverTile.y * ts + half;
      const range = bp.baseRange;

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, range, 0, Math.PI * 2);
      ctx.fillStyle = `${bp.colorTheme.primary}15`;
      ctx.fill();
      ctx.strokeStyle = bp.colorTheme.primary;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
  }
}

function drawUnit(ctx: CanvasRenderingContext2D, unit: PlacedUnit, isSelected: boolean, isHovered: boolean) {
  const bp = UNITS[unit.blueprintId];
  if (!bp) return;

  const { pixelX: x, pixelY: y, angle, level, showdownReady } = unit;

  ctx.save();
  ctx.translate(x, y);

  // Selection halo
  const haloRadius = level >= 6 ? 33 : level >= 4 ? 31 : level === 3 ? 29 : level === 2 ? 26 : 23;
  if (isSelected) {
    ctx.beginPath();
    ctx.arc(0, 0, haloRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Showdown Ready: Bright Yellow Illumination Aura (click directly on character to launch!)
  if (showdownReady) {
    const t = Date.now();
    const sdPulse = 1 + Math.sin(t / 160) * 0.1;
    const auraR = (haloRadius + 10) * sdPulse;

    const grad = ctx.createRadialGradient(0, 0, 8, 0, 0, auraR);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.72)');
    grad.addColorStop(0.55, 'rgba(250, 204, 21, 0.42)');
    grad.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.beginPath();
    ctx.arc(0, 0, auraR, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Bright outer pulsing yellow ring
    ctx.beginPath();
    ctx.arc(0, 0, (haloRadius + 1) * sdPulse, 0, Math.PI * 2);
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = isHovered ? 4 : 3;
    ctx.stroke();

    // Orbiting bright yellow sparks
    const rot = (t / 700) % (Math.PI * 2);
    ctx.fillStyle = '#FEF08A';
    for (let i = 0; i < 4; i++) {
      const a = rot + (i * Math.PI) / 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * (haloRadius + 2), Math.sin(a) * (haloRadius + 2), 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // DYNAMIC EVOLVING BASE PLATE (PLACA BASE):
  // El color y la estructura de la base cambian y se vuelven mucho más espectaculares con cada mejora (Nv. 1 - 6)
  const animTime = Date.now();

  if (level >= 6) {
    // NIVEL 6: TRASCENDENCIA CÓSMICA (Doble anillo prismático rotatorio)
    const rotA = (animTime / 1400) % (Math.PI * 2);
    const rotB = -(animTime / 1900) % (Math.PI * 2);
    const pulse = Math.sin(animTime / 240) * 0.1 + 0.9;

    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 29 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(236, 72, 153, 0.22)';
    ctx.fill();
    ctx.strokeStyle = '#F472B6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.rotate(rotA);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const sx = Math.cos(a) * 26;
      const sy = Math.sin(a) * 26;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.rotate(rotB - rotA);
    ctx.fillStyle = '#FDE047';
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 25.5, Math.sin(a) * 25.5, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.strokeStyle = '#FDE047';
    ctx.lineWidth = 3.5;
    ctx.stroke();
  } else if (level === 5) {
    // NIVEL 5: ASCENSIÓN ARCANO VIOLETA
    const rot = (animTime / 1600) % (Math.PI * 2);
    const pulse = Math.sin(animTime / 280) * 0.09 + 0.91;

    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 27 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(168, 85, 247, 0.24)';
    ctx.fill();
    ctx.strokeStyle = '#C084FC';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.rotate(rot);
    ctx.fillStyle = '#E879F9';
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 24.5, Math.sin(a) * 24.5, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#1E1B4B';
    ctx.fill();
    ctx.strokeStyle = '#C084FC';
    ctx.lineWidth = 3.2;
    ctx.stroke();
  } else if (level === 4) {
    // NIVEL 4: SOBRECARGA ESMERALDA / PLASMA
    const rot = (animTime / 2000) % (Math.PI * 2);
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
    ctx.fill();
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.rotate(rot);
    ctx.fillStyle = '#6EE7B7';
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      ctx.fillRect(Math.cos(a) * 23 - 2, Math.sin(a) * 23 - 2, 4, 4);
    }
    ctx.restore();

    ctx.beginPath();
    ctx.arc(0, 0, 21.5, 0, Math.PI * 2);
    ctx.fillStyle = '#064E3B';
    ctx.fill();
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 3;
    ctx.stroke();
  } else if (level === 3) {
    // NIVEL 3: PEDESTAL MÍTICO DORADO / TRONO DIVINO RESONANTE
    const gearRot = (animTime / 1800) % (Math.PI * 2);
    const pulseGlow = Math.sin(animTime / 320) * 0.12 + 0.88;

    // Outer Radiant Aura Halo
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 26 * pulseGlow, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#FDE047';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 8-Point Golden Rotating Gear / Crown Teeth
    ctx.rotate(gearRot);
    ctx.fillStyle = '#D97706';
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const gx = Math.cos(a) * 23.5;
      const gy = Math.sin(a) * 23.5;
      ctx.beginPath();
      ctx.rect(gx - 2.5, gy - 2.5, 5, 5);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // Main Gilded Dais Body
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#1C1917';
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Secondary Inner Gold Filigree Bezel
    ctx.beginPath();
    ctx.arc(0, 0, 18.5, 0, Math.PI * 2);
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // 4 Brilliant Diamond Studs
    ctx.fillStyle = '#FEF08A';
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 20, Math.sin(a) * 20, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (level === 2) {
    // NIVEL 2: BALUARTE REFORZADO DE CIBER-ALEACIÓN Y NEÓN DE PLASMA
    const pulseNeon = Math.sin(animTime / 260) * 0.08 + 0.92;

    // Armored Cyber Octagon Base
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const r = 21 * pulseNeon;
      const ox = Math.cos(a) * r;
      const oy = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(ox, oy);
      else ctx.lineTo(ox, oy);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(8, 47, 73, 0.4)';
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.restore();

    // Solid Inner Cyan Pedestal
    ctx.beginPath();
    ctx.arc(0, 0, 19, 0, Math.PI * 2);
    ctx.fillStyle = '#082F49';
    ctx.fill();
    ctx.strokeStyle = bp.colorTheme.primary;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 4 Neon Energy Conduit Nodes
    ctx.fillStyle = '#38BDF8';
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 19, Math.sin(a) * 19, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // NIVEL 1: BASE TÁCTICA DE ACERO Y GRAFITO ESTÁNDAR
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Subtle steel notch rivets
    ctx.fillStyle = '#94A3B8';
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 16.5, Math.sin(a) * 16.5, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.strokeStyle = `${bp.colorTheme.primary}77`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  // Draw character sprite portrait clipped in circle
  const heroImg = getImage(bp.imageUrl);
  if (heroImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 15.5, 0, Math.PI * 2);
    ctx.clip();
    safeDrawImage(ctx, heroImg, -16, -16, 32, 32);
    if (showdownReady) {
      ctx.fillStyle = 'rgba(250, 204, 21, 0.26)';
      ctx.fillRect(-16, -16, 32, 32);
    }
    ctx.restore();
  } else {
    // Vector fallback
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fillStyle = showdownReady ? '#FACC15' : bp.colorTheme.secondary;
    ctx.fill();
  }

  // Rotating weapon pointer
  ctx.save();
  ctx.rotate(angle);
  ctx.fillStyle =
    level >= 6
      ? '#F472B6'
      : level === 5
      ? '#E879F9'
      : level === 4
      ? '#34D399'
      : level === 3
      ? '#FDE047'
      : level === 2
      ? '#38BDF8'
      : bp.colorTheme.primary;
  ctx.fillRect(8, -2.5, level >= 4 ? 13 : 11, 5);
  ctx.restore();

  // Level Stars / Badge indicator
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (level >= 6) {
    ctx.fillStyle = '#FDE047';
    ctx.font = 'bold 10px system-ui';
    ctx.fillText('✦Nv.6✦', 0, 20);
  } else if (level === 5) {
    ctx.fillStyle = '#E879F9';
    ctx.font = 'bold 9.5px system-ui';
    ctx.fillText('★★★★★', 0, 19);
  } else if (level === 4) {
    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 9.5px system-ui';
    ctx.fillText('★★★★', 0, 19);
  } else if (level === 3) {
    ctx.fillStyle = '#FDE047';
    ctx.font = 'bold 10px system-ui';
    ctx.fillText('★★★', 0, 19);
  } else if (level === 2) {
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 9px system-ui';
    ctx.fillText('★★', 0, 18);
  } else {
    ctx.fillStyle = '#CBD5E1';
    ctx.font = 'bold 8.5px system-ui';
    ctx.fillText('★', 0, 17);
  }
  ctx.restore();

  // Crisp Showdown Click Prompt above character when glowing yellow
  if (showdownReady) {
    ctx.save();
    const label = isHovered ? '⚡ ¡LANZAR!' : '⚡ LISTO';
    ctx.font = 'bold 9px system-ui';
    const textW = ctx.measureText(label).width;
    const boxW = textW + 8;
    const boxH = 14;
    const boxY = -haloRadius - 10;
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.roundRect(-boxW / 2, boxY - boxH / 2, boxW, boxH, 5);
    ctx.fill();
    ctx.strokeStyle = '#713F12';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, boxY + 0.5);
    ctx.restore();
  }

  ctx.restore();
}

function drawEnemy(ctx: CanvasRenderingContext2D, enemy: ActiveEnemy) {
  const { x, y, size, color, accentColor, currentHealth, maxHealth, isBoss, angle, slowUntil, freezeUntil, burnUntil } = enemy;

  ctx.save();
  ctx.translate(x, y);

  // Status effects
  if (freezeUntil > 0) {
    ctx.beginPath();
    ctx.arc(0, 0, size + 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
    ctx.fill();
    ctx.strokeStyle = '#FDE047';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // 3 Dizzy spinning stun stars orbiting enemy head
    const stunAngle = (Date.now() / 240) % (Math.PI * 2);
    ctx.fillStyle = '#FBBF24';
    for (let st = 0; st < 3; st++) {
      const sa = stunAngle + (st * Math.PI * 2) / 3;
      const sx = Math.cos(sa) * (size + 7);
      const sy = Math.sin(sa) * 5 - (size + 7);
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (slowUntil > 0) {
    ctx.beginPath();
    ctx.arc(0, 0, size + 3, 0, Math.PI * 2);
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  if (burnUntil > 0) {
    ctx.beginPath();
    ctx.arc(0, 0, size + 3, 0, Math.PI * 2);
    ctx.strokeStyle = '#F97316';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Elemental Aura for Arena 2+ (Fire/Volcano, Cyber, Void)
  if (enemy.elementalAura === 'fire') {
    ctx.beginPath();
    ctx.arc(0, 0, size + 4, 0, Math.PI * 2);
    ctx.strokeStyle = '#EA580C';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (enemy.elementalAura === 'cyber') {
    ctx.beginPath();
    ctx.arc(0, 0, size + 4, 0, Math.PI * 2);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (enemy.elementalAura === 'void') {
    ctx.beginPath();
    ctx.arc(0, 0, size + 4, 0, Math.PI * 2);
    ctx.strokeStyle = '#C084FC';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Enemy Body
  ctx.save();
  ctx.rotate(angle);

  // Check if Enemy/Boss has AI sprite image!
  const enemyBp = ENEMIES[enemy.type];
  const enemyImg = enemyBp?.imageUrl ? getImage(enemyBp.imageUrl) : null;

  if (enemyImg) {
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.save();
    ctx.clip();
    safeDrawImage(ctx, enemyImg, -size, -size, size * 2, size * 2);
    ctx.restore();

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = isBoss ? 3 : 2;
    ctx.stroke();
  } else if (isBoss || enemy.type === 'boss_infernal') {
    ctx.fillStyle = color;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    // Jagged crown boss polygon
    ctx.moveTo(size * 1.2, 0);
    ctx.lineTo(-size * 0.7, size * 0.85);
    ctx.lineTo(-size * 0.3, size * 0.3);
    ctx.lineTo(-size * 0.9, 0);
    ctx.lineTo(-size * 0.3, -size * 0.3);
    ctx.lineTo(-size * 0.7, -size * 0.85);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = accentColor;
    ctx.fill();
  } else if (enemy.type === 'pyro_golem' || enemy.type === 'cyber_dreadnought') {
    ctx.fillStyle = color;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const rx = Math.cos(a) * size;
      const ry = Math.sin(a) * size;
      if (i === 0) ctx.moveTo(rx, ry);
      else ctx.lineTo(rx, ry);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.fillRect(-size * 0.3, -size * 0.3, size * 0.6, size * 0.6);
  } else if (enemy.type === 'magma_fiend' || enemy.type === 'void_reaver') {
    ctx.fillStyle = color;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(size * 1.35, 0);
    ctx.lineTo(-size * 0.8, size * 0.9);
    ctx.lineTo(-size * 0.3, 0);
    ctx.lineTo(-size * 0.8, -size * 0.9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (enemy.type === 'tank') {
    ctx.fillStyle = color;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const rx = Math.cos(a) * size;
      const ry = Math.sin(a) * size;
      if (i === 0) ctx.moveTo(rx, ry);
      else ctx.lineTo(rx, ry);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (enemy.type === 'scout') {
    ctx.fillStyle = color;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(size * 1.3, 0);
    ctx.lineTo(-size, size * 0.8);
    ctx.lineTo(-size * 0.5, 0);
    ctx.lineTo(-size, -size * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillStyle = color;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(size * 0.4, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = accentColor;
    ctx.fill();
  }

  ctx.restore();

  // Health Bar
  const barW = isBoss ? 54 : Math.max(26, size * 2.2);
  const barH = isBoss ? 6 : 4;
  const barY = -size - (isBoss ? 14 : 9);
  const hpPct = Math.max(0, currentHealth / maxHealth);

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(-barW / 2, barY, barW, barH);

  const hpColor = hpPct > 0.5 ? '#22C55E' : hpPct > 0.25 ? '#F59E0B' : '#EF4444';
  ctx.fillStyle = hpColor;
  ctx.fillRect(-barW / 2, barY, barW * hpPct, barH);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-barW / 2, barY, barW, barH);

  // Kinetic Shield bar & aura indicator if enemy has shield
  if (enemy.shield && enemy.shield > 0) {
    const shieldMax = enemy.maxShield || maxHealth * 0.45;
    const shieldPct = Math.min(1, enemy.shield / Math.max(1, shieldMax));
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(-barW / 2, barY - 3, barW * shieldPct, 2);

    ctx.beginPath();
    ctx.arc(0, 0, size + 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  if (isBoss) {
    ctx.font = 'bold 9px system-ui';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(enemy.name, 0, barY - (enemy.shield && enemy.shield > 0 ? 7 : 4));
  }

  ctx.restore();
}

function drawProjectile(ctx: CanvasRenderingContext2D, proj: Projectile) {
  ctx.save();

  if (proj.type === 'beam') {
    ctx.strokeStyle = proj.color;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(proj.startX, proj.startY);
    ctx.lineTo(proj.targetX, proj.targetY);
    ctx.stroke();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else if (proj.type === 'lightning') {
    // Crackling jagged electric bolt from origin to current position
    ctx.strokeStyle = proj.color || '#38BDF8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const segments = 4;
    const dx = (proj.targetX - proj.startX) / segments;
    const dy = (proj.targetY - proj.startY) / segments;
    ctx.moveTo(proj.startX, proj.startY);
    for (let i = 1; i < segments; i++) {
      const jitterX = (Math.random() - 0.5) * 16;
      const jitterY = (Math.random() - 0.5) * 16;
      ctx.lineTo(proj.startX + dx * i + jitterX, proj.startY + dy * i + jitterY);
    }
    ctx.lineTo(proj.x, proj.y);
    ctx.stroke();

    // Bright core
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  } else if (proj.type === 'slash') {
    // Crescent sword blade slash wave travelling along vector
    const angle = Math.atan2(proj.targetY - proj.startY, proj.targetX - proj.startX);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.arc(0, 0, 11, -Math.PI / 2.2, Math.PI / 2.2);
    ctx.strokeStyle = proj.color || '#F43F5E';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 7, -Math.PI / 3, Math.PI / 3);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else if (proj.type === 'arrow') {
    // Longbow arrow with fletching and glowing tip
    const angle = Math.atan2(proj.targetY - proj.startY, proj.targetX - proj.startX);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    ctx.strokeStyle = proj.color || '#10B981';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(8, 0);
    ctx.stroke();

    // Arrowhead
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(4, -3);
    ctx.lineTo(4, 3);
    ctx.closePath();
    ctx.fill();

    // Glowing tip aura
    ctx.beginPath();
    ctx.arc(8, 0, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = proj.color || '#34D399';
    ctx.fill();
  } else if (proj.type === 'stun') {
    // Pulsing seismic magnetic stun wave / hammer concussive ring
    ctx.strokeStyle = proj.color || '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Impact sparks
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + Date.now() / 200;
      ctx.beginPath();
      ctx.moveTo(proj.x + Math.cos(a) * 5, proj.y + Math.sin(a) * 5);
      ctx.lineTo(proj.x + Math.cos(a) * 11, proj.y + Math.sin(a) * 11);
      ctx.stroke();
    }
  } else if (proj.type === 'shockwave') {
    // Expanding ground seismic tremor wave
    ctx.strokeStyle = proj.color || '#D97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(217, 119, 6, 0.35)';
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 7, 0, Math.PI * 2);
    ctx.fill();
  } else if (proj.type === 'multishot') {
    // Cluster of 3 simultaneous micro-pellets
    const angle = Math.atan2(proj.targetY - proj.startY, proj.targetX - proj.startX);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    ctx.fillStyle = proj.color || '#F97316';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.arc(-4, -4, 2.5, 0, Math.PI * 2);
    ctx.arc(-4, 4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (proj.type === 'missile') {
    // Rocket missile with smoke trail and flaming exhaust
    const angle = Math.atan2(proj.targetY - proj.startY, proj.targetX - proj.startX);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    ctx.fillStyle = '#475569';
    ctx.fillRect(-7, -2.5, 11, 5);

    // Warhead nose cone
    ctx.fillStyle = proj.color || '#EF4444';
    ctx.beginPath();
    ctx.moveTo(4, -2.5);
    ctx.lineTo(8, 0);
    ctx.lineTo(4, 2.5);
    ctx.closePath();
    ctx.fill();

    // Rocket exhaust flame
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.moveTo(-7, -2);
    ctx.lineTo(-12, 0);
    ctx.lineTo(-7, 2);
    ctx.closePath();
    ctx.fill();
  } else if (proj.type === 'spore') {
    // Organic toxic spore cluster
    ctx.fillStyle = proj.color || '#22C55E';
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#86EFAC';
    ctx.beginPath();
    ctx.arc(proj.x - 2, proj.y - 2, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (proj.type === 'portal') {
    // Swirling cosmic dimensional anomaly
    const spin = (Date.now() / 250) % (Math.PI * 2);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(spin);

    ctx.strokeStyle = proj.color || '#A855F7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 1.5);
    ctx.stroke();

    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (proj.type === 'fireball') {
    ctx.fillStyle = proj.color;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (proj.type === 'coin') {
    ctx.fillStyle = '#EAB308';
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#CA8A04';
    ctx.lineWidth = 1;
    ctx.stroke();
  } else if (proj.type === 'ice') {
    ctx.fillStyle = '#06B6D4';
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = proj.color;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, p.alpha);
  ctx.fillStyle = p.color;

  if (p.shape === 'square') {
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  } else if (p.shape === 'ring') {
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawDamageNumber(ctx: CanvasRenderingContext2D, num: DamageNumber) {
  ctx.save();
  const alpha = Math.max(0, num.life / num.maxLife);
  ctx.globalAlpha = alpha;
  ctx.font = num.isCrit ? 'bold 13px system-ui' : 'bold 11px system-ui';
  ctx.fillStyle = num.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(num.value > 0 ? `${num.value}` : `+${Math.abs(num.value)}`, num.x, num.y);
  ctx.restore();
}

function drawShowdownOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  vfx: { type: string; progress: number }
) {
  const p = Math.max(0, Math.min(1, vfx.progress));
  if (p >= 0.99) return;

  ctx.save();
  const fade = Math.max(0, 1 - p);

  if (vfx.type === 'supernova') {
    const atkImg = getImage('/assets/images/attack_supernova_1791483748936.jpg');
    if (atkImg) {
      const size = Math.min(width, height) * (0.55 + p * 0.75);
      ctx.globalAlpha = 0.72 * fade;
      safeDrawImage(ctx, atkImg, width / 2 - size / 2, height / 2 - size / 2, size, size);
    }
    ctx.fillStyle = `rgba(239, 68, 68, ${0.32 * fade})`;
    ctx.fillRect(0, 0, width, height);
  } else if (vfx.type === 'meteor') {
    const atkImg = getImage('/assets/images/attack_meteor_1791483757694.jpg');
    if (atkImg) {
      const size = 240 * (1 - p * 0.3);
      const x = width * 0.3 + p * width * 0.4;
      const y = -40 + p * (height + 40);
      ctx.globalAlpha = 0.85 * fade;
      safeDrawImage(ctx, atkImg, x - size / 2, y - size / 2, size, size);
    }
  } else if (vfx.type === 'orbital') {
    const atkImg = getImage('/assets/images/attack_orbital_beam_1791483770365.jpg');
    if (atkImg) {
      ctx.globalAlpha = 0.68 * fade;
      safeDrawImage(ctx, atkImg, 0, 0, width, height);
    }
    ctx.fillStyle = `rgba(168, 85, 247, ${0.32 * fade})`;
    ctx.fillRect(0, 0, width, height);
  } else if (vfx.type === 'blizzard') {
    ctx.fillStyle = `rgba(6, 182, 212, ${0.3 * fade})`;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = `rgba(207, 250, 254, ${fade})`;
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, width, height);
  } else if (vfx.type === 'hyperdrive') {
    ctx.fillStyle = `rgba(16, 185, 129, ${0.24 * fade})`;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
}

function drawShowdownHoldRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number
) {
  const p = Math.max(0, Math.min(1, progress));
  const r = 34;
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + Math.PI * 2 * p;
  const remainingSec = Math.max(0, 2.0 * (1 - p)).toFixed(1);

  ctx.save();

  // Subtle dark track
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Bright golden progress arc
  ctx.beginPath();
  ctx.arc(x, y, r, startAngle, endAngle);
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Compact countdown pill above character
  const label = `SHOWDOWN ${remainingSec}s`;
  ctx.font = 'bold 10px system-ui, sans-serif';
  const tw = ctx.measureText(label).width;
  const pw = tw + 12;
  const ph = 18;
  const px = x - pw / 2;
  const py = y - r - 22;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(px, py, pw, ph, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FEF08A';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, py + ph / 2);

  ctx.restore();
}
