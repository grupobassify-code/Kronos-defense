import React, { useRef, useEffect } from 'react';
import {
  MapData,
  PlacedUnit,
  ActiveEnemy,
  Projectile,
  Particle,
  DamageNumber
} from '../types/game';
import { UNITS } from '../data/units';
import { ENEMIES } from '../data/enemies';
import { isPathTile, isObstacleTile } from '../utils/pathUtils';

interface GameCanvasProps {
  map: MapData;
  placedUnits: PlacedUnit[];
  activeEnemies: ActiveEnemy[];
  projectiles: Projectile[];
  particles: Particle[];
  damageNumbers: DamageNumber[];
  selectedUnit: PlacedUnit | null;
  placementBlueprintId: string | null;
  hoverTile: { x: number; y: number } | null;
  baseHealth: number;
  maxBaseHealth: number;
  activeShowdownVFX: { type: string; progress: number } | null;
  onTileClick: (gridX: number, gridY: number) => void;
  onSelectUnit: (unit: PlacedUnit | null) => void;
  onHoverTileChange: (tile: { x: number; y: number } | null) => void;
  canAffordPlacement: boolean;
}

// Global Image Cache to prevent flickering during animation
const imageCache: Record<string, HTMLImageElement> = {};

function getImage(url?: string): HTMLImageElement | null {
  if (!url || typeof Image === 'undefined') return null;
  if (!imageCache[url]) {
    const img = new Image();
    img.src = url;
    imageCache[url] = img;
  }
  const cached = imageCache[url];
  return cached.complete && cached.naturalWidth > 0 ? cached : null;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  map,
  placedUnits,
  activeEnemies,
  projectiles,
  particles,
  damageNumbers,
  selectedUnit,
  placementBlueprintId,
  hoverTile,
  baseHealth,
  maxBaseHealth,
  activeShowdownVFX,
  onTileClick,
  onSelectUnit,
  onHoverTileChange,
  canAffordPlacement
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const canvasWidth = map.cols * map.tileSize;
  const canvasHeight = map.rows * map.tileSize;

  // Preload map, unit, and sprite sheet images
  useEffect(() => {
    if (map.bgImageUrl) getImage(map.bgImageUrl);
    getImage('/assets/images/spritesheet_heroes_roster_1791484962258.jpg');
    getImage('/assets/images/spritesheet_enemies_horde_1791484974731.jpg');
    getImage('/assets/images/spritesheet_tactical_vfx_1791484983154.jpg');
    Object.values(UNITS).forEach((u) => {
      if (u.imageUrl) getImage(u.imageUrl);
      if (u.showdownImageUrl) getImage(u.showdownImageUrl);
    });
    Object.values(ENEMIES).forEach((e) => {
      if (e.imageUrl) getImage(e.imageUrl);
    });
  }, [map]);

  // Handle canvas mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;

    const mouseX = (e.clientX - rect.x) * scaleX;
    const mouseY = (e.clientY - rect.y) * scaleY;

    const gridX = Math.floor(mouseX / map.tileSize);
    const gridY = Math.floor(mouseY / map.tileSize);

    if (gridX >= 0 && gridX < map.cols && gridY >= 0 && gridY < map.rows) {
      if (!hoverTile || hoverTile.x !== gridX || hoverTile.y !== gridY) {
        onHoverTileChange({ x: gridX, y: gridY });
      }
    } else {
      if (hoverTile) onHoverTileChange(null);
    }
  };

  const handleMouseLeave = () => {
    onHoverTileChange(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;

    const mouseX = (e.clientX - rect.x) * scaleX;
    const mouseY = (e.clientY - rect.y) * scaleY;

    const gridX = Math.floor(mouseX / map.tileSize);
    const gridY = Math.floor(mouseY / map.tileSize);

    if (gridX >= 0 && gridX < map.cols && gridY >= 0 && gridY < map.rows) {
      // Check if clicked on placed unit
      const clickedUnit = placedUnits.find((u) => u.gridX === gridX && u.gridY === gridY);
      if (placementBlueprintId) {
        // Placement attempt
        onTileClick(gridX, gridY);
      } else if (clickedUnit) {
        onSelectUnit(clickedUnit);
      } else {
        // Clicked empty or path tile
        onTileClick(gridX, gridY);
      }
    }
  };

  const handleTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0] || e.touches[0];
    if (!touch) return;

    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;

    const touchX = (touch.clientX - rect.x) * scaleX;
    const touchY = (touch.clientY - rect.y) * scaleY;

    const gridX = Math.floor(touchX / map.tileSize);
    const gridY = Math.floor(touchY / map.tileSize);

    if (gridX >= 0 && gridX < map.cols && gridY >= 0 && gridY < map.rows) {
      const clickedUnit = placedUnits.find((u) => u.gridX === gridX && u.gridY === gridY);
      if (placementBlueprintId) {
        onTileClick(gridX, gridY);
      } else if (clickedUnit) {
        onSelectUnit(clickedUnit);
      } else {
        onTileClick(gridX, gridY);
      }
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
    drawGrid(ctx, map, hoverTile, placementBlueprintId, placedUnits, canAffordPlacement);

    // 2. Draw Path & Waypoints
    drawPath(ctx, map);

    // 3. Draw Obstacles
    drawObstacles(ctx, map);

    // 4. Draw Spawn Portal and Core Citadel
    drawSpawnAndBase(ctx, map, baseHealth, maxBaseHealth);

    // 5. Draw Range Indicator if selected or placing
    drawRangeOverlays(ctx, map, selectedUnit, placementBlueprintId, hoverTile);

    // 6. Draw Placed Units (with AI character sprites)
    placedUnits.forEach((unit) => {
      drawUnit(ctx, unit, selectedUnit?.instanceId === unit.instanceId);
    });

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

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex items-center justify-center select-none">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onTouchEnd={handleTouch}
        className="block cursor-crosshair max-w-full h-auto aspect-[18/11] touch-manipulation"
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
  placedUnits: PlacedUnit[],
  canAffordPlacement: boolean
) {
  const ts = map.tileSize;
  const width = map.cols * ts;
  const height = map.rows * ts;

  // 1. Draw AI Scenery Background
  const bgImg = getImage(map.bgImageUrl);
  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, width, height);
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
      const hasUnit = placedUnits.some((u) => u.gridX === c && u.gridY === r);

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
        if (placementBlueprintId) {
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

function drawObstacles(ctx: CanvasRenderingContext2D, map: MapData) {
  const ts = map.tileSize;
  const half = ts / 2;

  map.obstacles.forEach((obs) => {
    const px = obs.x * ts + half;
    const py = obs.y * ts + half;

    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(px, py, half * 0.72, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.beginPath();
    ctx.rect(px - 4, py - 4, 8, 8);
    ctx.fill();
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
  hoverTile: { x: number; y: number } | null
) {
  const ts = map.tileSize;
  const half = ts / 2;

  if (selectedUnit) {
    const bp = UNITS[selectedUnit.blueprintId];
    if (bp) {
      const tier = bp.tiers[selectedUnit.level - 1];
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

function drawUnit(ctx: CanvasRenderingContext2D, unit: PlacedUnit, isSelected: boolean) {
  const bp = UNITS[unit.blueprintId];
  if (!bp) return;

  const { pixelX: x, pixelY: y, angle, level, showdownReady } = unit;

  ctx.save();
  ctx.translate(x, y);

  // Selection halo
  if (isSelected) {
    ctx.beginPath();
    ctx.arc(0, 0, level === 3 ? 29 : level === 2 ? 26 : 23, 0, Math.PI * 2);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Showdown Ready Pulse
  if (showdownReady) {
    ctx.beginPath();
    ctx.arc(0, 0, level === 3 ? 28 : level === 2 ? 25 : 22, 0, Math.PI * 2);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  // DYNAMIC EVOLVING BASE PLATE (PLACA BASE):
  // El color y la estructura de la base cambian y se vuelven mucho más espectaculares con cada mejora
  const animTime = Date.now();

  if (level === 3) {
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
    ctx.drawImage(heroImg, -16, -16, 32, 32);
    ctx.restore();
  } else {
    // Vector fallback
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fillStyle = bp.colorTheme.secondary;
    ctx.fill();
  }

  // Rotating weapon pointer
  ctx.save();
  ctx.rotate(angle);
  ctx.fillStyle = level === 3 ? '#FDE047' : level === 2 ? '#38BDF8' : bp.colorTheme.primary;
  ctx.fillRect(8, -2.5, 11, 5);
  ctx.restore();

  // Level Stars indicator
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (level === 3) {
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

  // Check if Boss has AI sprite image!
  const enemyBp = ENEMIES[enemy.type];
  const bossImg = isBoss && enemyBp?.imageUrl ? getImage(enemyBp.imageUrl) : null;

  if (bossImg) {
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.save();
    ctx.clip();
    ctx.drawImage(bossImg, -size, -size, size * 2, size * 2);
    ctx.restore();

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
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

  if (isBoss) {
    ctx.font = 'bold 9px system-ui';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(enemy.name, 0, barY - 4);
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
  ctx.save();
  const p = vfx.progress;

  if (vfx.type === 'supernova') {
    const atkImg = getImage('/assets/images/attack_supernova_1791483748936.jpg');
    if (atkImg) {
      const size = Math.min(width, height) * (0.6 + p * 0.8);
      ctx.globalAlpha = Math.max(0, 1 - p);
      ctx.drawImage(atkImg, width / 2 - size / 2, height / 2 - size / 2, size, size);
    }
    ctx.fillStyle = `rgba(239, 68, 68, ${0.4 * (1 - p)})`;
    ctx.fillRect(0, 0, width, height);
  } else if (vfx.type === 'meteor') {
    const atkImg = getImage('/assets/images/attack_meteor_1791483757694.jpg');
    if (atkImg) {
      const size = 260 * (1 - p * 0.3);
      const x = width * 0.3 + p * width * 0.4;
      const y = -50 + p * (height + 50);
      ctx.globalAlpha = Math.max(0, 1 - p * 0.5);
      ctx.drawImage(atkImg, x - size / 2, y - size / 2, size, size);
    }
  } else if (vfx.type === 'orbital') {
    const atkImg = getImage('/assets/images/attack_orbital_beam_1791483770365.jpg');
    if (atkImg) {
      ctx.globalAlpha = Math.max(0, 1 - p);
      ctx.drawImage(atkImg, 0, 0, width, height);
    }
    ctx.fillStyle = `rgba(168, 85, 247, ${0.4 * (1 - p)})`;
    ctx.fillRect(0, 0, width, height);
  } else if (vfx.type === 'blizzard') {
    ctx.fillStyle = `rgba(6, 182, 212, ${0.35 * (1 - p)})`;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#CFFAFE';
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, width, height);
  } else if (vfx.type === 'hyperdrive') {
    ctx.fillStyle = `rgba(16, 185, 129, ${0.25 * (1 - p)})`;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
}
