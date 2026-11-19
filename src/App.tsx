/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapData,
  PlacedUnit,
  ActiveEnemy,
  Projectile,
  Particle,
  DamageNumber,
  GameSpeed,
  ViewState,
  TargetStrategy,
  WaveConfig,
  PlayerProgression,
  Mission,
  PackReward,
  UnitBlueprint,
  ShopPackTierId,
  TacticalToolId
} from './types/game';
import { UNITS, UNIT_LIST, getDivinityForArena, getArenaGiftCharacter } from './data/units';
import { findCheatCode } from './data/cheatCodes';
import { compareRarities } from './utils/rarity';
import { TACTICAL_TOOL_MAP, getToolUnlockedAtArena } from './data/tools';
import { ENEMIES } from './data/enemies';
import { MAPS, DEFAULT_MAP, getArenaForWave, getArenaByMapId, ARENAS, ArenaInfo } from './data/maps';
import { getWaveConfig, getWaveScaling } from './data/waves';
import { calculateDetailedPath, getPositionAlongPath, isPathTile, isObstacleTile } from './utils/pathUtils';
import { sounds } from './utils/audio';
import { music } from './utils/music';
import {
  loadProgression,
  saveProgression,
  getLevelStatMultiplier,
  getInMatchUnitTier,
  canUseUnitShowdown,
  MAX_IN_MATCH_LEVEL,
  openBoosterPack,
  openShopTierPack,
  syncMissionsWithProgression,
  LEVEL_UP_COSTS,
  getKillsRequiredForPack,
  getCardShopPrice,
  canBuyCardInShop,
  SHOP_PACK_COIN_PRICE,
  SHOP_PACK_TIERS,
  SHOP_BUNDLE_3_PACKS_PRICE,
  SHOP_SP_COIN_PRICE,
  SHOP_SP_BUNDLE_AMOUNT
} from './utils/progression';
import { Sparkles } from 'lucide-react';

import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { UnitShop } from './components/UnitShop';
import { UnitInspector } from './components/UnitInspector';
import { RoundSummaryModal } from './components/RoundSummaryModal';
import { GameOverModal } from './components/GameOverModal';
import { CardsHub } from './components/CardsHub';
import { MapSelectModal } from './components/MapSelectModal';
import { ArenaUnlockCeremonyModal } from './components/ArenaUnlockCeremonyModal';
import { ToolsBar } from './components/ToolsBar';

const INITIAL_TOOL_COOLDOWNS: Record<TacticalToolId, number> = {
  shovel: 0,
  hammer: 0,
  battery: 0,
  bomb: 0,
  core_shield: 0,
  wrench: 0
};

const SHOWDOWN_COOLDOWN_SCALE = 2.0;

export default function App() {
  // Story Mode Persistent Progression & Missions
  const [initialData] = useState(() => loadProgression());
  const [progression, setProgression] = useState<PlayerProgression>(initialData.progression);
  const [missions, setMissions] = useState<Mission[]>(initialData.missions);

  // Clash Royale style main navigation tabs: 'CARDS' (Left) vs 'BATTLE' (Right)
  const [activeBottomTab, setActiveBottomTab] = useState<'CARDS' | 'BATTLE'>('BATTLE');

  // Auto-save progression to localStorage whenever it changes
  useEffect(() => {
    saveProgression(progression, missions);
  }, [progression, missions]);

  // Synchronize progression-derived missions (kills, waves, arenas, gold, cards, lv.10)
  useEffect(() => {
    setMissions((prev) => syncMissionsWithProgression(prev, progression));
  }, [
    progression.lifetimeKills,
    progression.lifetimeWaves,
    progression.lifetimeGold,
    progression.highScoreWave,
    progression.unlockedCardIds.length,
    progression.completedArenaLevels?.length,
    progression.cardMasteryLevels
  ]);

  // AI Procedural Music: automatically play Menu theme in Cards hub, Battle theme in Battle screen
  useEffect(() => {
    if (progression.settings?.musicEnabled === false) {
      music.stopTheme();
      return;
    }
    if (activeBottomTab === 'CARDS') {
      music.playTheme('MENU');
    } else {
      music.playTheme('BATTLE');
    }
  }, [activeBottomTab, progression.settings?.musicEnabled]);

  // Game Setup & View State (Direct to 2-screen Clash Royale gameplay)
  const [viewState, setViewState] = useState<ViewState>('PLAYING');
  const [currentMap, setCurrentMap] = useState<MapData>(DEFAULT_MAP);
  const [difficulty, setDifficulty] = useState<'normal' | 'hard' | 'infinite'>('infinite');

  // Player Resources & Base (Contador de 10 vidas / límite de 10 enemigos que pueden llegar al Núcleo)
  const [baseHealth, setBaseHealth] = useState<number>(10);
  const [maxBaseHealth, setMaxBaseHealth] = useState<number>(10);
  const [gold, setGold] = useState<number>(220);
  const [earnedGoldInMatch, setEarnedGoldInMatch] = useState<number>(0);
  const [autoBankedCoinsInMatch, setAutoBankedCoinsInMatch] = useState<number>(0);
  const [cardsHubSubTab, setCardsHubSubTab] = useState<'DECK' | 'SHOP' | 'PACKS' | 'MISSIONS' | 'ALMANAC' | null>(null);
  const [freeShopUntil, setFreeShopUntil] = useState<number>(0);
  const redeemedCodesGuardRef = useRef<Set<string>>(
    new Set((initialData.progression.redeemedCheatCodes || []).map((c) => c.toLowerCase()))
  );

  // Wave & Progress (Infinite mode: totalWaves = 0)
  const [currentWave, setCurrentWave] = useState<number>(1);
  const [totalWaves, setTotalWaves] = useState<number>(0);
  const [isWaveActive, setIsWaveActive] = useState<boolean>(false);

  // Dynamic intensity modulation for battle music
  useEffect(() => {
    music.setWaveActive(isWaveActive);
  }, [isWaveActive]);
  const [autoWave, setAutoWave] = useState<boolean>(() => progression.settings?.autoWave ?? false);
  const [autoShowdown, setAutoShowdown] = useState<boolean>(false);
  const [gameSpeed, setGameSpeed] = useState<GameSpeed>(() => (progression.settings?.gameSpeed as GameSpeed) ?? 1);
  const [isMuted, setIsMuted] = useState<boolean>(() => progression.settings?.sfxMuted ?? sounds.getMuted());
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(() => !(progression.settings?.musicEnabled ?? true));

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      sounds.setMuted(next);
      setProgression((p) => ({
        ...p,
        settings: {
          ...(p.settings || { musicEnabled: true, musicVolume: 0.35, autoWave: false, gameSpeed: 1, sfxMuted: false }),
          sfxMuted: next
        }
      }));
      return next;
    });
  }, []);

  const handleToggleMusic = useCallback(() => {
    setIsMusicMuted((prev) => {
      const next = !prev;
      music.setMuted(next);
      setProgression((p) => ({
        ...p,
        settings: {
          ...(p.settings || { musicEnabled: true, musicVolume: 0.35, autoWave: false, gameSpeed: 1, sfxMuted: false }),
          musicEnabled: !next
        }
      }));
      return next;
    });
  }, []);

  // Units & Enemies
  const [placedUnits, setPlacedUnits] = useState<PlacedUnit[]>([]);
  const [activeEnemies, setActiveEnemies] = useState<ActiveEnemy[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);

  // Selection, Placement & Tactical Tools
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [hoverTile, setHoverTile] = useState<{ x: number; y: number } | null>(null);
  const [activeToolId, setActiveToolId] = useState<TacticalToolId | null>(null);
  const [removedObstacles, setRemovedObstacles] = useState<{ x: number; y: number }[]>([]);
  const [toolCooldowns, setToolCooldowns] = useState<Record<TacticalToolId, number>>(INITIAL_TOOL_COOLDOWNS);

  const effectiveMap = React.useMemo<MapData>(() => {
    if (removedObstacles.length === 0) return currentMap;
    return {
      ...currentMap,
      obstacles: currentMap.obstacles.filter(
        (obs) => !removedObstacles.some((rem) => rem.x === obs.x && rem.y === obs.y)
      )
    };
  }, [currentMap, removedObstacles]);

  // VFX (flash breve ~0.6s con autolimpieza de seguridad para que jamás se quede trabado)
  const [activeShowdownVFX, setActiveShowdownVFX] = useState<{ type: string; progress: number } | null>(null);

  useEffect(() => {
    if (!activeShowdownVFX) return;
    const failSafe = window.setTimeout(() => {
      setActiveShowdownVFX(null);
    }, 750);
    return () => window.clearTimeout(failSafe);
  }, [Boolean(activeShowdownVFX), activeShowdownVFX?.type]);

  // Statistics & 100-Kill Milestone Toast
  const [totalKills, setTotalKills] = useState<number>(0);
  const [killToast, setKillToast] = useState<string | null>(null);
  const [totalGoldEarned, setTotalGoldEarned] = useState<number>(220);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };
  const [summaryData, setSummaryData] = useState<{
    waveNumber: number;
    rewardGold: number;
    alchemistYield: number;
    enemiesDefeated: number;
    savedCoinsEarned?: number;
  } | null>(null);

  // Clash Royale Arena Promotion state
  const [arenaPromotion, setArenaPromotion] = useState<{
    arena: ArenaInfo;
    completedArenaLevel: number;
    wave: number;
    giftedUnit: UnitBlueprint | null;
    coinsEarned: number;
  } | null>(null);
  const [showMapSelectModal, setShowMapSelectModal] = useState<boolean>(true);

  // Helper to safely reposition units when advancing arena
  const findNearestValidBuildableTile = (
    map: MapData,
    startX: number,
    startY: number,
    occupiedTiles: Set<string>
  ): { x: number; y: number } => {
    const key = `${startX},${startY}`;
    if (!isPathTile(map, startX, startY) && !isObstacleTile(map, startX, startY) && !occupiedTiles.has(key)) {
      return { x: startX, y: startY };
    }

    for (let radius = 1; radius < Math.max(map.cols, map.rows); radius++) {
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
          const tx = startX + dx;
          const ty = startY + dy;
          if (tx >= 0 && tx < map.cols && ty >= 0 && ty < map.rows) {
            const tKey = `${tx},${ty}`;
            if (!isPathTile(map, tx, ty) && !isObstacleTile(map, tx, ty) && !occupiedTiles.has(tKey)) {
              return { x: tx, y: ty };
            }
          }
        }
      }
    }
    return { x: startX, y: startY };
  };

  // Wave Spawner State
  const waveSpawnerRef = useRef<{
    waveNumber: number;
    config: WaveConfig;
    elapsed: number;
    spawnedCounts: number[];
    isDoneSpawning: boolean;
    waveKills: number;
  }>({
    waveNumber: 1,
    config: getWaveConfig(1),
    elapsed: 0,
    spawnedCounts: [],
    isDoneSpawning: false,
    waveKills: 0
  });

  const detailedPathRef = useRef(calculateDetailedPath(DEFAULT_MAP));

  // Keep refs for game loop to avoid stale closures
  const stateRef = useRef({
    placedUnits,
    activeEnemies,
    projectiles,
    particles,
    damageNumbers,
    gold,
    earnedGoldInMatch,
    baseHealth,
    isWaveActive,
    gameSpeed,
    difficulty,
    map: effectiveMap,
    progression,
    freeShopUntil,
    activeShowdownVFX
  });

  useEffect(() => {
    stateRef.current = {
      placedUnits,
      activeEnemies,
      projectiles,
      particles,
      damageNumbers,
      gold,
      earnedGoldInMatch,
      baseHealth,
      isWaveActive,
      gameSpeed,
      difficulty,
      map: effectiveMap,
      progression,
      freeShopUntil,
      activeShowdownVFX
    };
  });

  // Start or restart infinite match (keeping all unlocked cards, levels, coins, and packs)
  const handleRestartInfiniteMatch = useCallback(() => {
    setCurrentMap(DEFAULT_MAP);
    detailedPathRef.current = calculateDetailedPath(DEFAULT_MAP);
    setDifficulty('infinite');

    setBaseHealth(10);
    setMaxBaseHealth(10);
    setGold(220);
    setEarnedGoldInMatch(0);
    setAutoBankedCoinsInMatch(0);
    setCurrentWave(1);
    setTotalWaves(0);
    setIsWaveActive(false);
    setPlacedUnits([]);
    setActiveEnemies([]);
    setProjectiles([]);
    setParticles([]);
    setDamageNumbers([]);
    setSelectedBlueprintId(null);
    setSelectedUnitId(null);
    setHoverTile(null);
    setActiveToolId(null);
    setRemovedObstacles([]);
    setToolCooldowns(INITIAL_TOOL_COOLDOWNS);
    setActiveShowdownVFX(null);
    setTotalKills(0);
    setTotalGoldEarned(220);
    setSummaryData(null);
    setArenaPromotion(null);
    setGameSpeed(1);
    setViewState('PLAYING');
    setActiveBottomTab('BATTLE');
  }, []);

  // Start Wave (supports starting next wave automatically or on button click)
  const handleStartWave = useCallback((overrideWaveNum?: number) => {
    if (isWaveActive) return;

    const waveNum = typeof overrideWaveNum === 'number' ? overrideWaveNum : currentWave;
    const currentArena = getArenaByMapId(currentMap.id);
    sounds.playWaveStart();
    const config = getWaveConfig(waveNum, currentArena.arenaLevel);
    waveSpawnerRef.current = {
      waveNumber: waveNum,
      config,
      elapsed: 0,
      spawnedCounts: new Array(config.segments.length).fill(0),
      isDoneSpawning: false,
      waveKills: 0
    };
    setIsWaveActive(true);
    setActiveBottomTab('BATTLE');
  }, [isWaveActive, currentWave, currentMap.id]);

  // User request:
  // "Cada vez que pazes de arena, se reinician tus rondas y los personajes que tenias"
  const handleProceedToNextArena = useCallback((nextArena: ArenaInfo) => {
    setArenaPromotion(null);
    setCurrentMap(nextArena.map);
    detailedPathRef.current = calculateDetailedPath(nextArena.map);
    // Reset rounds and characters on arena advance
    setCurrentWave(1);
    setPlacedUnits([]);
    setActiveEnemies([]);
    setProjectiles([]);
    setParticles([]);
    setDamageNumbers([]);
    setSelectedBlueprintId(null);
    setSelectedUnitId(null);
    setHoverTile(null);
    setActiveToolId(null);
    setRemovedObstacles([]);
    setToolCooldowns(INITIAL_TOOL_COOLDOWNS);
    setBaseHealth(10);
    setMaxBaseHealth(10);
    setGold(260 + (nextArena.arenaLevel - 1) * 35);
    setEarnedGoldInMatch(0);
    setAutoBankedCoinsInMatch(0);
    setActiveShowdownVFX(null);
    setActiveBottomTab('BATTLE');
    sounds.playWaveStart();
  }, []);

  // Next Round after summary: handles wave advancement or arena victory
  const handleNextRound = useCallback(() => {
    setSummaryData(null);
    const currentArena = getArenaByMapId(currentMap.id);

    // Check if player passed the current arena!
    // User request: "Cada vez que pazes de arena, se reinician tus rondas y los personajes que tenias"
    // "haz que la arena 2 del volcan no se desbloque , hasta que se termine la arena 1"
    if (currentWave >= currentArena.roundsRequired) {
      const nextLevel = Math.min(ARENAS.length, currentArena.arenaLevel + 1);
      const nextArena = ARENAS.find((a) => a.arenaLevel === nextLevel) || currentArena;

      // Bank 50% of remaining earned arena gold + Arena Completion coin bonus
      const rawBankableRemaining = Math.min(stateRef.current.gold, stateRef.current.earnedGoldInMatch);
      const bankableRemaining = Math.floor(rawBankableRemaining * 0.5);
      const arenaBonusCoins = 120 + currentArena.arenaLevel * 40;
      const totalAddedCoins = bankableRemaining + arenaBonusCoins;

      setGold((g) => Math.max(0, g - bankableRemaining));
      setEarnedGoldInMatch(0);

      // Compute gift character if arriving at a new Arena whose gift hasn't been claimed yet
      const currentProg = stateRef.current.progression;
      const alreadyGifted = (currentProg.giftedArenaLevels || [1]).includes(nextLevel);
      const giftedUnit =
        nextLevel > currentArena.arenaLevel && !alreadyGifted
          ? getArenaGiftCharacter(nextLevel, currentProg.unlockedCardIds)
          : null;

      // Unlock next arena, record completed arena (unlocks its Divinity in Shop), and grant 1 new character
      setProgression((p) => {
        const nextCompleted = Array.from(new Set([...(p.completedArenaLevels || []), currentArena.arenaLevel]));
        const nextGifted = giftedUnit
          ? Array.from(new Set([...(p.giftedArenaLevels || [1]), nextLevel]))
          : p.giftedArenaLevels || [1];

        let nextUnlocked = p.unlockedCardIds;
        let nextDeck = p.activeDeckCardIds || [];
        if (giftedUnit && !nextUnlocked.includes(giftedUnit.id)) {
          nextUnlocked = [...nextUnlocked, giftedUnit.id];
          if (nextDeck.length < 7 && !nextDeck.includes(giftedUnit.id)) {
            nextDeck = [...nextDeck, giftedUnit.id];
          }
        }

        return {
          ...p,
          highestArenaUnlocked: Math.max(p.highestArenaUnlocked || 1, nextLevel),
          completedArenaLevels: nextCompleted,
          giftedArenaLevels: nextGifted,
          unlockedCardIds: nextUnlocked,
          activeDeckCardIds: nextDeck,
          unopenedPacks: p.unopenedPacks + 1,
          skillPoints: p.skillPoints + 60,
          savedCoins: (p.savedCoins ?? 0) + totalAddedCoins
        };
      });

      setKillToast(
        giftedUnit
          ? `🎁 ¡Arena nueva! Regalo: ${giftedUnit.name} y +${totalAddedCoins} monedas en Bóveda.`
          : `💰 ¡Arena superada! +${totalAddedCoins} monedas guardadas en tu Bóveda.`
      );
      setTimeout(() => setKillToast(null), 4500);

      sounds.playVictory();
      setArenaPromotion({
        arena: nextArena,
        completedArenaLevel: currentArena.arenaLevel,
        wave: currentWave,
        giftedUnit,
        coinsEarned: totalAddedCoins
      });
      return;
    }

    const nextWaveNum = currentWave + 1;
    setCurrentWave(nextWaveNum);
    setToolCooldowns((prev) => {
      const next = { ...prev };
      (Object.keys(next) as TacticalToolId[]).forEach((k) => {
        if (next[k] > 0) next[k] = next[k] - 1;
      });
      return next;
    });

    if (autoWave) {
      setTimeout(() => {
        handleStartWave(nextWaveNum);
      }, 500);
    }
  }, [currentWave, currentMap.id, autoWave, handleStartWave]);

  // Enemy defeat callback with progressive kill requirements:
  // User request: "haz que los sobres tipo el primero ocupo 100 enemigos derrotados el 2 200 el 3 250, que se vallan aumentando un poco mas"
  const registerEnemyKill = useCallback((enemy: ActiveEnemy) => {
    const currentArena = getArenaByMapId(currentMap.id);
    const goldBonus = (currentArena.arenaLevel - 1) * 2;
    const finalGold = enemy.goldReward + goldBonus;

    setGold((g) => g + finalGold);
    setEarnedGoldInMatch((e) => e + finalGold);
    setTotalGoldEarned((g) => g + finalGold);
    if (waveSpawnerRef.current) {
      waveSpawnerRef.current.waveKills++;
    }

    setTotalKills((k) => k + 1);

    setProgression((prev) => {
      const nextLifetime = prev.lifetimeKills + 1;
      const claimed = prev.packsClaimedFromKills || 0;
      const targetKills = getKillsRequiredForPack(claimed);
      const nextTowards = (prev.killsTowardsNextPack || 0) + 1;

      if (nextTowards >= targetKills) {
        sounds.playCoin();
        const nextTarget = getKillsRequiredForPack(claimed + 1);
        setKillToast(`🎉 ¡Sobre Desbloqueado! (${targetKills} enemigos derrotados). Siguiente sobre requiere ${nextTarget} bajas.`);
        setTimeout(() => setKillToast(null), 4500);

        return {
          ...prev,
          lifetimeKills: nextLifetime,
          unopenedPacks: prev.unopenedPacks + 1,
          skillPoints: prev.skillPoints + 50,
          killsTowardsNextPack: Math.max(0, nextTowards - targetKills),
          packsClaimedFromKills: claimed + 1
        };
      }

      return {
        ...prev,
        lifetimeKills: nextLifetime,
        killsTowardsNextPack: nextTowards
      };
    });

    setMissions((missionsList) =>
      missionsList.map((m) => {
        if (
          m.id === 'mission_recon_kills' ||
          m.id === 'mission_slayer_150' ||
          m.id === 'mission_slayer_500' ||
          m.id === 'mission_slayer_1500' ||
          m.id === 'mission_slayer_5000' ||
          m.id === 'mission_slayer_15000'
        ) {
          const nextCount = m.currentCount + 1;
          return { ...m, currentCount: nextCount, completed: m.completed || nextCount >= m.targetCount };
        }
        if (
          enemy.isBoss &&
          (m.id === 'mission_defeat_boss' ||
            m.id === 'mission_boss_hunter_10' ||
            m.id === 'mission_boss_slayer_35')
        ) {
          const nextCount = m.currentCount + 1;
          return { ...m, currentCount: nextCount, completed: m.completed || nextCount >= m.targetCount };
        }
        return m;
      })
    );
  }, [currentMap.id]);

  // Trigger Showdown (unlocked from Card Nv.3 OR Match Unit Nv.3)
  const handleTriggerShowdown = useCallback((instanceId: string) => {
    const targetUnit = stateRef.current.placedUnits.find((u) => u.instanceId === instanceId);
    const targetBp = targetUnit ? UNITS[targetUnit.blueprintId] : null;
    const targetCardLevel = targetUnit ? progression.cardMasteryLevels[targetUnit.blueprintId] || 1 : 1;
    if (
      targetUnit &&
      targetUnit.showdownReady &&
      targetBp &&
      canUseUnitShowdown(targetCardLevel, targetUnit.level)
    ) {
      setMissions((missionsList) =>
        missionsList.map((m) => {
          if (m.id === 'mission_showdown_master_25') {
            const nextCount = m.currentCount + 1;
            return { ...m, currentCount: nextCount, completed: m.completed || nextCount >= m.targetCount };
          }
          return m;
        })
      );
    }

    setPlacedUnits((prevUnits) => {
      const unit = prevUnits.find((u) => u.instanceId === instanceId);
      if (!unit || !unit.showdownReady) return prevUnits;

      const bp = UNITS[unit.blueprintId];
      if (!bp) return prevUnits;

      const cardLevel = progression.cardMasteryLevels[unit.blueprintId] || 1;
      const mastery = getLevelStatMultiplier(cardLevel);
      if (!canUseUnitShowdown(cardLevel, unit.level)) return prevUnits;

      sounds.playShowdown();

      // Ability logic per blueprint
      if (bp.id === 'vanguard_solar') {
        // Meteor Shower: 6 meteors along path (shortened stun)
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((enemy) => ({
            ...enemy,
            currentHealth: Math.max(0, enemy.currentHealth - 260),
            freezeUntil: Math.max(enemy.freezeUntil, enemy.isBoss ? 0.6 : 1.2)
          }))
        );
      } else if (bp.id === 'pyromancer') {
        // Supernova Infernal: huge burn + damage
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((enemy) => ({
            ...enemy,
            currentHealth: Math.max(0, enemy.currentHealth - 380),
            burnUntil: 5.0,
            burnDps: 30
          }))
        );
      } else if (bp.id === 'zeker') {
        // Tormenta de Filos Zeker: 340 lightning damage + 1.1s stun (0.5s boss)
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((enemy) => ({
            ...enemy,
            currentHealth: Math.max(0, enemy.currentHealth - 340),
            freezeUntil: Math.max(enemy.freezeUntil, enemy.isBoss ? 0.5 : 1.1)
          }))
        );
      } else if (bp.id === 'cryo_mage') {
        // Ventisca Cero (Nerfed): freezes each enemy at most ONCE for 1.5s (0.6s bosses) and slows all enemies
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((enemy) => {
            const canParalyze = !enemy.cryoParalyzed;
            const freezeTime = canParalyze ? (enemy.isBoss ? 0.6 : 1.5) : 0;
            return {
              ...enemy,
              currentHealth: Math.max(0, enemy.currentHealth - 35),
              freezeUntil: freezeTime > 0 ? Math.max(enemy.freezeUntil, freezeTime) : enemy.freezeUntil,
              cryoParalyzed: enemy.cryoParalyzed || canParalyze,
              slowUntil: Math.max(enemy.slowUntil, 4.5),
              slowMultiplier: 0.45
            };
          })
        );
      } else if (bp.id === 'alchemist') {
        // Midas Touch: gives +220 gold immediately
        setActiveShowdownVFX({ type: 'hyperdrive', progress: 0 });
        sounds.playCoin();
        setGold((g) => g + 220);
        setEarnedGoldInMatch((e) => e + 220);
        setTotalGoldEarned((g) => g + 220);
      } else if (bp.id === 'resonator') {
        // Tactical Hyperdrive: boost all placed units
        setActiveShowdownVFX({ type: 'hyperdrive', progress: 0 });
        return prevUnits.map((u) => ({
          ...u,
          boostedUntil: 8.0,
          showdownReady: u.instanceId === instanceId ? false : u.showdownReady,
          showdownCooldownTimer:
            u.instanceId === instanceId ? bp.showdownCooldown * mastery.showdownCdMult * SHOWDOWN_COOLDOWN_SCALE : u.showdownCooldownTimer
        }));
      } else if (bp.id === 'void_sniper') {
        // Orbital Rupture Beam: 1200 damage to strongest enemy
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        setActiveEnemies((prevEnemies) => {
          if (prevEnemies.length === 0) return prevEnemies;
          let strongest = prevEnemies[0];
          for (const e of prevEnemies) {
            if (e.currentHealth > strongest.currentHealth) strongest = e;
          }
          return prevEnemies.map((e) =>
            e.instanceId === strongest.instanceId
              ? { ...e, currentHealth: Math.max(0, e.currentHealth - 1200) }
              : e
          );
        });
      } else if (bp.id === 'chrono_guardian') {
        // Chrono Rewind: restores +2 core lives and pushes enemies back
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        setBaseHealth((hp) => Math.min(maxBaseHealth, hp + 2));
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            distanceTraveled: Math.max(0, e.distanceTraveled - 120)
          }))
        );
      } else if (bp.id === 'valkyrie_storm') {
        // Tormenta de Relámpagos: 480 damage to all enemies and 1.4s stun (0.7s boss)
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 480),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.7 : 1.4)
          }))
        );
      } else if (bp.id === 'toxic_shaman') {
        // Erupción de Miasma: 6.0s burn 75 DPS to all enemies
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            burnUntil: 6.0,
            burnDps: 75,
            armor: Math.floor(e.armor * 0.5)
          }))
        );
      } else if (bp.id === 'mecha_artillery') {
        // Bombardeo de Racimo: 600 damage to all enemies
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 600)
          }))
        );
      } else if (bp.id === 'shadow_assassin') {
        // Danza de las Sombras: 1400 damage to strongest enemy
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        setActiveEnemies((prevEnemies) => {
          if (prevEnemies.length === 0) return prevEnemies;
          let strongest = prevEnemies[0];
          for (const e of prevEnemies) {
            if (e.currentHealth > strongest.currentHealth) strongest = e;
          }
          return prevEnemies.map((e) =>
            e.instanceId === strongest.instanceId
              ? { ...e, currentHealth: Math.max(0, e.currentHealth - 1400) }
              : e
          );
        });
      } else if (bp.id === 'plasma_gunner') {
        // Hiper-Ráfaga de Plasma: 750 damage to all enemies + slow
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 750),
            slowUntil: 3.5,
            slowMultiplier: 0.4
          }))
        );
      } else if (bp.id === 'paladin_aegis') {
        // Baluarte Sagrado: +2 base lives + pushes back
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        setBaseHealth((hp) => Math.min(maxBaseHealth, hp + 2));
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            distanceTraveled: Math.max(0, e.distanceTraveled - 90)
          }))
        );
      } else if (bp.id === 'geomancer_titan') {
        // Fisura Sísmica: 650 damage and 1.6s stun (0.8s boss)
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 650),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.8 : 1.6)
          }))
        );
      } else if (bp.id === 'arcane_witch') {
        // Vórtice Espacio-Temporal: 950 massive cosmic damage
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 950),
            slowUntil: 5.0,
            slowMultiplier: 0.25
          }))
        );
      } else if (bp.id === 'inferno_dragon') {
        // Aliento Primigenio: 750 damage and 5s burn
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 750),
            burnUntil: 5.0,
            burnDps: 35
          }))
        );
      } else if (bp.id === 'electro_wizard') {
        // Tormenta Galvánica: 480 electric damage and 1.4s stun (0.7s boss)
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 480),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.7 : 1.4)
          }))
        );
      } else if (bp.id === 'goblin_demolitionist') {
        // Bombardeo en Racimo: 450 explosion damage
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 450)
          }))
        );
      } else if (bp.id === 'valkyrie_blade') {
        // Torbellino Inmortal: 560 damage and 1.1s stun
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 560),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.5 : 1.1)
          }))
        );
      } else if (bp.id === 'lunar_huntress') {
        // Lluvia de Flechas Lunares: 680 piercing damage
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 680)
          }))
        );
      } else if (bp.id === 'golem_sentinel') {
        // Pulso Telúrico Cuántico: 820 damage and 1.6s stun
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 820),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.8 : 1.6)
          }))
        );
      } else if (bp.id === 'aureon_sun_king') {
        // Divinidad Arena 1: Aureon, el Rey Solar — Corona del Sol
        // Duplica (+100% daño y cadencia) a tropas aliadas en radio 260px por 8s (11s en tier 3) y ciega a enemigos
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playShowdown();
        const boostDuration = unit.level >= 3 ? 11.0 : 8.0;
        const auraRadius = 260;
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 650),
            slowUntil: 5.0,
            slowMultiplier: 0.5
          }))
        );
        return prevUnits.map((u) => {
          if (u.instanceId === instanceId) {
            return {
              ...u,
              boostedUntil: boostDuration,
              showdownReady: false,
              showdownCooldownTimer: bp.showdownCooldown * mastery.showdownCdMult * SHOWDOWN_COOLDOWN_SCALE
            };
          }
          const dx = u.pixelX - unit.pixelX;
          const dy = u.pixelY - unit.pixelY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= auraRadius) {
            return { ...u, boostedUntil: boostDuration };
          }
          return u;
        });
      } else if (bp.id === 'vulcanox_magma_lord') {
        // Divinidad Arena 2: Vulcanox, el Titán de Magma — Erupción Cataclísmica
        // Inunda todo el sendero con lava incandescente: 850 daño inicial, 120 DPS de quemadura continua por 7s y -50% velocidad
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playShoot('fireball');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 850),
            slowUntil: 7.0,
            slowMultiplier: 0.5,
            burnUntil: 7.0,
            burnDps: 120
          }))
        );
      } else if (bp.id === 'cygnus_prime_ai') {
        // Divinidad Arena 3: Cygnus-0, la IA Suprema — Sobrecarga EMP Global
        // Paraliza brevemente (2.0s / 1.0s jefes), anula armadura y desata 700 daño
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('laser');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 700),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 1.0 : 2.0),
            armor: 0
          }))
        );
      } else if (bp.id === 'chronax_time_guardian') {
        // Divinidad Arena 4: Chronax, el Guardián del Tiempo — Tiempo Cero
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        sounds.playShoot('beam');
        const freezeSec = unit.level >= 2 ? 2.6 : 2.0;
        const rewindDist = unit.level >= 3 ? 200 : 140;
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => {
            const newDist = Math.max(0, e.distanceTraveled - rewindDist);
            if (e.isBoss) {
              return {
                ...e,
                distanceTraveled: newDist,
                slowUntil: freezeSec + 2.0,
                slowMultiplier: 0.2
              };
            }
            return {
              ...e,
              distanceTraveled: newDist,
              freezeUntil: Math.max(e.freezeUntil, freezeSec)
            };
          })
        );
      } else if (bp.id === 'eclipse_divided') {
        // Divinidad Arena 5: Eclipse, la Dualidad Suprema — Paradoja Luminar
        // Haz estelar bipolar cósmico que inflige 1100 (1600 nivel 3) de daño masivo y distorsiona el espacio (-50% vel)
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('resonance');
        const paradoxDamage = unit.level >= 3 ? 1600 : 1100;
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - paradoxDamage),
            slowUntil: 4.5,
            slowMultiplier: 0.5
          }))
        );
      } else if (bp.id === 'ymir_frost_sovereign') {
        // Divinidad Arena 6: Ymir, Soberano del Hielo Eterno — Cero Absoluto
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        sounds.playShoot('ice');
        const freezeDuration = unit.level >= 3 ? 3.2 : 2.4;
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 750),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? freezeDuration * 0.5 : freezeDuration),
            slowUntil: freezeDuration + 3.0,
            slowMultiplier: 0.35
          }))
        );
      } else if (bp.id === 'kira_synthwave_empress') {
        // Divinidad Arena 7: Kira, la Emperatriz Synthwave — Sobrecarga Neón
        // Ráfaga continua de 16 haces láser prismáticos que rebotan con 950 (1450 nivel 3) de daño fulminante
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        sounds.playShoot('laser');
        const neonDamage = unit.level >= 3 ? 1450 : 950;
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - neonDamage),
            slowUntil: 4.0,
            slowMultiplier: 0.6
          }))
        );
      } else if (bp.id === 'nacar_abyssal_fish') {
        // Divinidad Arena 8: Nácar, el Pez Abisal — Vórtice Abisal
        // Remolino abisal gravitatorio que atrae a los enemigos 180px atrás e inflige 1000 (1500 nivel 3) de daño
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('ice');
        const abyssDmg = unit.level >= 3 ? 1500 : 1000;
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            distanceTraveled: Math.max(0, e.distanceTraveled - 180),
            currentHealth: Math.max(0, e.currentHealth - abyssDmg),
            slowUntil: 10.0,
            slowMultiplier: 0.45,
            burnUntil: 8.0,
            burnDps: 45
          }))
        );
      } else if (bp.id === 'seraphina_dawn_archon') {
        // Divinidad Arena 9: Seraphina, la Serafín de la Aurora — Luz Trascendente
        // 5 pilares celestiales que fulminan con 1250 (1800 nivel 3) de daño sagrado y curan +2 vidas al Núcleo
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playWaveClear();
        const holyDmg = unit.level >= 3 ? 1800 : 1250;
        setBaseHealth((hp) => Math.min(maxBaseHealth, hp + 2));
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - holyDmg),
            slowUntil: 4.0,
            slowMultiplier: 0.5
          }))
        );
      } else if (bp.id === 'thorin_storm_overlord') {
        // Divinidad Arena 10: Thorin, Señor del Trueno Primigenio — Tormenta Cataclísmica
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        sounds.playShoot('resonance');
        const stormDmg = unit.level >= 3 ? 1900 : 1350;
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - stormDmg),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.9 : 1.8)
          }))
        );
      } else if (bp.id === 'gaia_world_heart') {
        // Divinidad Arena 11: Gaia, el Corazón Primordial — Ira de la Tierra
        setActiveShowdownVFX({ type: 'hyperdrive', progress: 0 });
        sounds.playCoin();
        const extractedGold = unit.level >= 3 ? 280 : 180;
        setGold((g) => g + extractedGold);
        setTotalGoldEarned((g) => g + extractedGold);
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 700),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 1.2 : 2.5)
          }))
        );
      } else if (bp.id === 'ignis_tartarus_colossus') {
        // Divinidad Arena 12: Ignis, el Coloso del Tártaro — Fundición del Tártaro
        // Bombardeo de meteoros fundidos que derriten armadura a 0 por 10s + 850 daño + 100 DPS quemadura
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playShoot('fireball');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 850),
            armor: 0,
            burnUntil: 8.0,
            burnDps: 100
          }))
        );
      } else if (bp.id === 'astrea_constellation_weaver') {
        // Divinidad Arena 13: Astrea, Tejedora Astral — Supernova Estelar
        // Supernova gigante: 1600 (2200 nivel 3) de daño cósmico y reinicia enfriamientos de torres aliadas
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playShoot('resonance');
        const novaDmg = unit.level >= 3 ? 2200 : 1600;
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - novaDmg),
            slowUntil: 4.0,
            slowMultiplier: 0.5
          }))
        );
        // Refresh ally attack cooldowns
        return prevUnits.map((u) => ({
          ...u,
          attackCooldown: 0.05
        }));
      } else if (bp.id === 'thanatos_underworld_herald') {
        // Divinidad Arena 14: Thanatos, Heraldo de las Sombras — Cosecha de Almas
        // Ejecuta al instante a cualquier no-jefe con <35% HP (<45% nivel 3), y 1800 de daño de sombra a jefes
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('resonance');
        const executeThreshold = unit.level >= 3 ? 0.45 : 0.35;
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => {
            if (!e.isBoss && e.currentHealth / e.maxHealth <= executeThreshold) {
              return { ...e, currentHealth: 0 };
            }
            return {
              ...e,
              currentHealth: Math.max(0, e.currentHealth - (e.isBoss ? 1800 : 900))
            };
          })
        );
      } else if (bp.id === 'fenix_golden_phoenix') {
        // Divinidad Suprema Arena 15: Fénix Áureo, el Renacido — Resurrección del Valhalla
        // +260 oro (+500 en jefes), restaura +3 vidas al Núcleo y desata llamarada purificadora de 1500 de daño
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playCoin();
        const isBossRound = getWaveConfig(currentWave).isBossWave;
        const bonusGold = isBossRound ? 500 : 260;
        const healAmt = unit.level >= 3 ? 4 : 3;
        setGold((g) => g + bonusGold);
        setTotalGoldEarned((g) => g + bonusGold);
        setBaseHealth((hp) => Math.min(maxBaseHealth, hp + healAmt));
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 1500),
            burnUntil: 8.0,
            burnDps: 60
          }))
        );
      } else if (bp.id === 'espadachin_hierro') {
        // Tempestad de Acero: 340 daño a todos los enemigos circundantes en 220px
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('bullet');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => {
            const dx = e.x - unit.pixelX;
            const dy = e.y - unit.pixelY;
            if (dx * dx + dy * dy <= 220 * 220) {
              return { ...e, currentHealth: Math.max(0, e.currentHealth - 340) };
            }
            return e;
          })
        );
      } else if (bp.id === 'arquera_elfica') {
        // Lluvia Esmeralda: 380 daño perforante en línea recta
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('beam');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 380)
          }))
        );
      } else if (bp.id === 'artillero_pesado') {
        // Sobrecarga de Tambor: 620 daño concentrado al enemigo con más vida
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        sounds.playShoot('bullet');
        setActiveEnemies((prevEnemies) => {
          if (prevEnemies.length === 0) return prevEnemies;
          const strongest = prevEnemies.reduce((max, e) => (e.currentHealth > max.currentHealth ? e : max));
          return prevEnemies.map((e) =>
            e.instanceId === strongest.instanceId
              ? { ...e, currentHealth: Math.max(0, e.currentHealth - 620) }
              : e
          );
        });
      } else if (bp.id === 'mago_fuego') {
        // Vórtice Piroclástico: 520 de daño masivo y quemadura continua
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playShoot('fireball');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 520),
            burnUntil: 5.0,
            burnDps: 35
          }))
        );
      } else if (bp.id === 'francotirador_fantasma') {
        // Disparo Espectral Mortal: 1600 daño letal al más avanzado
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('beam');
        setActiveEnemies((prevEnemies) => {
          if (prevEnemies.length === 0) return prevEnemies;
          const foremost = prevEnemies.reduce((max, e) => (e.distanceTraveled > max.distanceTraveled ? e : max));
          return prevEnemies.map((e) =>
            e.instanceId === foremost.instanceId
              ? { ...e, currentHealth: Math.max(0, e.currentHealth - 1600) }
              : e
          );
        });
      } else if (bp.id === 'ingeniero_mecanico') {
        // Despliegue de Centinelas: 450 daño de ráfagas automáticas
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        sounds.playShoot('laser');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 450)
          }))
        );
      } else if (bp.id === 'medico_combate') {
        // Inyección de Adrenalina: +2 vidas al Núcleo y +60% cadencia aliada por 6s
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        sounds.playPlace();
        setBaseHealth((hp) => Math.min(maxBaseHealth, hp + 2));
        return prevUnits.map((u) => ({
          ...u,
          boostedUntil: 6.0,
          showdownReady: u.instanceId === instanceId ? false : u.showdownReady,
          showdownCooldownTimer:
            u.instanceId === instanceId ? bp.showdownCooldown * mastery.showdownCdMult * SHOWDOWN_COOLDOWN_SCALE : u.showdownCooldownTimer
        }));
      } else if (bp.id === 'ninja_sombrio') {
        // Shuriken Umbrío Gigante: 580 daño puro sin reducción de armadura
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('bullet');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 580)
          }))
        );
      } else if (bp.id === 'caballero_cristal') {
        // Bastión Prisma: 350 daño y congela/detiene brevemente por 1.5s (0.7s boss)
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        sounds.playShoot('ice');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 350),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.7 : 1.5)
          }))
        );
      } else if (bp.id === 'lanzacohetes') {
        // Bombardeo de Salva: 460 daño en radio masivo
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        sounds.playShoot('fireball');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 460)
          }))
        );
      } else if (bp.id === 'druida_bosque') {
        // Enredo Milenario: inmoviliza por 1.6s y 320 daño
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        sounds.playShoot('ice');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 320),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.8 : 1.6)
          }))
        );
      } else if (bp.id === 'invocador_golems') {
        // Monolito Despertado: 650 daño y aturdimiento 1.5s
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('bullet');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 650),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.7 : 1.5)
          }))
        );
      } else if (bp.id === 'alquimista_dorado') {
        // Toque de Midas: +280 oro inmediato y 300 daño
        setActiveShowdownVFX({ type: 'hyperdrive', progress: 0 });
        sounds.playCoin();
        setGold((g) => g + 280);
        setTotalGoldEarned((g) => g + 280);
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 300)
          }))
        );
      } else if (bp.id === 'canonero_pirata') {
        // Andanada de Babor: 480 daño y empuja 80px atrás a todos
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        sounds.playShoot('bullet');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 480),
            distanceTraveled: Math.max(0, e.distanceTraveled - 80)
          }))
        );
      } else if (bp.id === 'guardian_hielo') {
        // Ola de Frío Polar: 420 daño y congela 1.5s (0.7s boss)
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        sounds.playShoot('ice');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 420),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.7 : 1.5),
            slowUntil: 5.0,
            slowMultiplier: 0.35
          }))
        );
      } else if (bp.id === 'samurai_carmesi') {
        // Corte del Dragón Carmesí: 850 daño letal y sangrado
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('bullet');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 850),
            burnUntil: 5.0,
            burnDps: 45
          }))
        );
      } else if (bp.id === 'cientifico_nuclear') {
        // Colapso de Fisión: 560 daño y 65 DPS de radiación por 6s
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playShoot('laser');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 560),
            burnUntil: 6.0,
            burnDps: 65,
            armor: Math.max(0, e.armor - 8)
          }))
        );
      } else if (bp.id === 'robot_centinela') {
        // Modo Tormenta Balística: 420 daño de ráfaga
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        sounds.playShoot('laser');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 420)
          }))
        );
      } else if (bp.id === 'chaman_electrico') {
        // Cólera del Rayo Esmeralda: 540 daño eléctrico en cadena
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('beam');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 540),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.5 : 1.0)
          }))
        );
      } else if (bp.id === 'asesina_carmesi') {
        // Sentencia Ejecutora: 1100 daño al objetivo más fuerte o jefe
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('bullet');
        setActiveEnemies((prevEnemies) => {
          if (prevEnemies.length === 0) return prevEnemies;
          const bossOrStrongest =
            prevEnemies.find((e) => e.isBoss) ||
            prevEnemies.reduce((max, e) => (e.currentHealth > max.currentHealth ? e : max));
          return prevEnemies.map((e) =>
            e.instanceId === bossOrStrongest.instanceId
              ? { ...e, currentHealth: Math.max(0, e.currentHealth - 1100) }
              : e
          );
        });
      } else if (bp.id === 'dragon_mecanico') {
        // Infierno Termonuclear: 880 daño y 50 DPS de quemadura por 6s
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playShoot('fireball');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 880),
            burnUntil: 6.0,
            burnDps: 50
          }))
        );
      } else if (bp.id === 'rey_slimes') {
        // Inundación Gelatinosa: 480 daño y 60% slow por 5s
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        sounds.playShoot('coin');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 480),
            slowUntil: 5.0,
            slowMultiplier: 0.4
          }))
        );
      } else if (bp.id === 'domador_bestias') {
        // Carga de la Manada: 500 daño de embestida
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        sounds.playShoot('bullet');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 500)
          }))
        );
      } else if (bp.id === 'sacerdote_solar') {
        // Bendición del Astro Rey: duplica cadencia a todas las torres por 7s
        setActiveShowdownVFX({ type: 'hyperdrive', progress: 0 });
        sounds.playShowdown();
        return prevUnits.map((u) => ({
          ...u,
          boostedUntil: 7.0,
          showdownReady: u.instanceId === instanceId ? false : u.showdownReady,
          showdownCooldownTimer:
            u.instanceId === instanceId ? bp.showdownCooldown * mastery.showdownCdMult * SHOWDOWN_COOLDOWN_SCALE : u.showdownCooldownTimer
        }));
      } else if (bp.id === 'viajero_tiempo') {
        // Colapso del Tiempo: congela 2.0s y rebobina 100px
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        sounds.playShoot('beam');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 1.0 : 2.0),
            distanceTraveled: Math.max(0, e.distanceTraveled - 100)
          }))
        );
      } else if (bp.id === 'reina_espinas') {
        // Jardín Mortífero: 520 daño y 40 DPS de veneno
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        sounds.playShoot('bullet');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 520),
            burnUntil: 5.0,
            burnDps: 40
          }))
        );
      } else if (bp.id === 'golem_magma') {
        // Fisura Volcánica: 680 daño magmático y aturdimiento 1.5s
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playShoot('fireball');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 680),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.7 : 1.5)
          }))
        );
      } else if (bp.id === 'hacker_cibernetico') {
        // Pulso Electromagnético Total (PEM): suprime auras y elimina armadura
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('laser');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 450),
            armor: 0,
            elementalAura: undefined,
            slowUntil: 4.0,
            slowMultiplier: 0.5
          }))
        );
      } else if (bp.id === 'titan_tormenta') {
        // Cataclismo del Relámpago: 920 daño total masivo de rayos
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        sounds.playShoot('beam');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 920),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.6 : 1.2)
          }))
        );
      } else if (bp.id === 'kronos_dimensiones') {
        // Fractura Multidimensional: 1500 daño masivo y congelación breve
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playShowdown();
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 1500),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 1.2 : 2.4),
            distanceTraveled: Math.max(0, e.distanceTraveled - 120)
          }))
        );
      } else if (bp.id === 'centinela_acero') {
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        sounds.playShoot('bullet');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({ ...e, currentHealth: Math.max(0, e.currentHealth - 240) }))
        );
      } else if (bp.id === 'ballestero_real') {
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('beam');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({ ...e, currentHealth: Math.max(0, e.currentHealth - 290) }))
        );
      } else if (bp.id === 'granadero_tactico') {
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playShoot('fireball');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({ ...e, currentHealth: Math.max(0, e.currentHealth - 310) }))
        );
      } else if (bp.id === 'vigia_bosque') {
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        sounds.playShoot('spore');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 210),
            slowUntil: 4.0,
            slowMultiplier: 0.45
          }))
        );
      } else if (bp.id === 'mercader_rondas') {
        setActiveShowdownVFX({ type: 'hyperdrive', progress: 0 });
        sounds.playCoin();
        setGold((g) => g + 70);
        setTotalGoldEarned((g) => g + 70);
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.3 : 0.6)
          }))
        );
      } else if (bp.id === 'soldado_plasma') {
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('laser');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({ ...e, currentHealth: Math.max(0, e.currentHealth - 260) }))
        );
      } else if (bp.id === 'zapador_mina') {
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        sounds.playShoot('missile');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 300),
            distanceTraveled: Math.max(0, e.distanceTraveled - 55)
          }))
        );
      } else if (bp.id === 'escudero_luz') {
        setActiveShowdownVFX({ type: 'hyperdrive', progress: 0 });
        sounds.playPlace();
        setBaseHealth((hp) => Math.min(maxBaseHealth, hp + 1));
        return prevUnits.map((u) => ({
          ...u,
          boostedUntil: 5.0,
          showdownReady: u.instanceId === instanceId ? false : u.showdownReady,
          showdownCooldownTimer:
            u.instanceId === instanceId ? bp.showdownCooldown * mastery.showdownCdMult * SHOWDOWN_COOLDOWN_SCALE : u.showdownCooldownTimer
        }));
      } else if (bp.id === 'lancero_solar') {
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('beam');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 460),
            burnUntil: 4.0,
            burnDps: 25
          }))
        );
      } else if (bp.id === 'cazador_sombras') {
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('laser');
        setActiveEnemies((prevEnemies) => {
          if (prevEnemies.length === 0) return prevEnemies;
          const foremost = prevEnemies.reduce((max, e) => (e.distanceTraveled > max.distanceTraveled ? e : max));
          return prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - (e.instanceId === foremost.instanceId ? 650 : 300))
          }));
        });
      } else if (bp.id === 'pirotecnico_brasa') {
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playShoot('fireball');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 430),
            burnUntil: 5.0,
            burnDps: 35
          }))
        );
      } else if (bp.id === 'torre_tesla_v2') {
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('laser');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 390),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.4 : 0.8)
          }))
        );
      } else if (bp.id === 'botanico_veneno') {
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        sounds.playShoot('spore');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 330),
            burnUntil: 6.0,
            burnDps: 35
          }))
        );
      } else if (bp.id === 'banquero_crono') {
        setActiveShowdownVFX({ type: 'hyperdrive', progress: 0 });
        sounds.playCoin();
        setGold((g) => g + 135);
        setTotalGoldEarned((g) => g + 135);
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            slowUntil: 3.0,
            slowMultiplier: 0.65
          }))
        );
      } else if (bp.id === 'artillero_doble') {
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        sounds.playShoot('multishot');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({ ...e, currentHealth: Math.max(0, e.currentHealth - 420) }))
        );
      } else if (bp.id === 'paladin_estelar') {
        setActiveShowdownVFX({ type: 'hyperdrive', progress: 0 });
        sounds.playShowdown();
        setBaseHealth((hp) => Math.min(maxBaseHealth, hp + 2));
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({ ...e, currentHealth: Math.max(0, e.currentHealth - 540) }))
        );
        return prevUnits.map((u) => ({
          ...u,
          boostedUntil: 6.0,
          showdownReady: u.instanceId === instanceId ? false : u.showdownReady,
          showdownCooldownTimer:
            u.instanceId === instanceId ? bp.showdownCooldown * mastery.showdownCdMult * SHOWDOWN_COOLDOWN_SCALE : u.showdownCooldownTimer
        }));
      } else if (bp.id === 'asesino_espectral') {
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('beam');
        setActiveEnemies((prevEnemies) => {
          if (prevEnemies.length === 0) return prevEnemies;
          const bossOrStrongest =
            prevEnemies.find((e) => e.isBoss) ||
            prevEnemies.reduce((max, e) => (e.currentHealth > max.currentHealth ? e : max));
          return prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - (e.instanceId === bossOrStrongest.instanceId ? 1250 : 520))
          }));
        });
      } else if (bp.id === 'criomante_abismo') {
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        sounds.playShoot('ice');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 560),
            armor: Math.max(0, e.armor - 6),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.5 : 1.2)
          }))
        );
      } else if (bp.id === 'bombardero_orbital') {
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        sounds.playShoot('missile');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({ ...e, currentHealth: Math.max(0, e.currentHealth - 760) }))
        );
      } else if (bp.id === 'maestro_runas') {
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('resonance');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 640),
            armor: Math.max(0, e.armor - 10)
          }))
        );
      } else if (bp.id === 'forjador_titanio') {
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        sounds.playShoot('fireball');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 680),
            armor: 0,
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.5 : 1.1)
          }))
        );
      } else if (bp.id === 'cazadora_viento') {
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        sounds.playShoot('bullet');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 580),
            distanceTraveled: Math.max(0, e.distanceTraveled - 90)
          }))
        );
      } else if (bp.id === 'alquimista_esmeralda') {
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        sounds.playShoot('spore');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 520),
            armor: Math.max(0, e.armor - 8),
            burnUntil: 6.0,
            burnDps: 60
          }))
        );
      } else if (bp.id === 'emperador_rayo') {
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShowdown();
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 1050),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.5 : 1.1)
          }))
        );
      } else if (bp.id === 'senor_cenizas') {
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playShowdown();
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 1120),
            burnUntil: 7.0,
            burnDps: 85
          }))
        );
      } else if (bp.id === 'arquitecto_vacio') {
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShoot('portal');
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 1050),
            distanceTraveled: Math.max(0, e.distanceTraveled - 130)
          }))
        );
      } else if (bp.id === 'valquiria_aurora') {
        setActiveShowdownVFX({ type: 'hyperdrive', progress: 0 });
        sounds.playShowdown();
        setBaseHealth((hp) => Math.min(maxBaseHealth, hp + 2));
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({ ...e, currentHealth: Math.max(0, e.currentHealth - 820) }))
        );
        return prevUnits.map((u) => ({
          ...u,
          boostedUntil: 7.0,
          showdownReady: u.instanceId === instanceId ? false : u.showdownReady,
          showdownCooldownTimer:
            u.instanceId === instanceId ? bp.showdownCooldown * mastery.showdownCdMult * SHOWDOWN_COOLDOWN_SCALE : u.showdownCooldownTimer
        }));
      } else if (bp.id === 'coloso_obsidiana') {
        setActiveShowdownVFX({ type: 'meteor', progress: 0 });
        sounds.playShowdown();
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 1180),
            armor: Math.max(0, e.armor - 12),
            freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.5 : 1.2)
          }))
        );
      } else if (bp.id === 'francotirador_pulsar') {
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShowdown();
        setActiveEnemies((prevEnemies) => {
          if (prevEnemies.length === 0) return prevEnemies;
          const bossOrStrongest =
            prevEnemies.find((e) => e.isBoss) ||
            prevEnemies.reduce((max, e) => (e.currentHealth > max.currentHealth ? e : max));
          return prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - (e.instanceId === bossOrStrongest.instanceId ? 2400 : 700))
          }));
        });
      } else if (bp.id === 'invocador_fenix') {
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playCoin();
        setGold((g) => g + 120);
        setTotalGoldEarned((g) => g + 120);
        setBaseHealth((hp) => Math.min(maxBaseHealth, hp + 1));
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 1050),
            burnUntil: 5.0,
            burnDps: 45
          }))
        );
      } else if (bp.id === 'maestro_tormenta') {
        setActiveShowdownVFX({ type: 'blizzard', progress: 0 });
        sounds.playShowdown();
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 940),
            distanceTraveled: Math.max(0, e.distanceTraveled - 100),
            slowUntil: 5.0,
            slowMultiplier: 0.45
          }))
        );
      } else if (bp.id === 'helios_celestial') {
        setActiveShowdownVFX({ type: 'supernova', progress: 0 });
        sounds.playShowdown();
        setBaseHealth((hp) => Math.min(maxBaseHealth, hp + 2));
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => ({
            ...e,
            currentHealth: Math.max(0, e.currentHealth - 1650),
            armor: 0,
            burnUntil: 7.0,
            burnDps: 90
          }))
        );
      } else if (bp.id === 'nyx_abismo_eterno') {
        setActiveShowdownVFX({ type: 'orbital', progress: 0 });
        sounds.playShowdown();
        setActiveEnemies((prevEnemies) =>
          prevEnemies.map((e) => {
            if (!e.isBoss && e.currentHealth / e.maxHealth <= 0.35) {
              return { ...e, currentHealth: 0 };
            }
            return {
              ...e,
              currentHealth: Math.max(0, e.currentHealth - (e.isBoss ? 1750 : 950)),
              freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.7 : 1.5)
            };
          })
        );
      }

      // Reset unit cooldown
      return prevUnits.map((u) =>
        u.instanceId === instanceId
          ? {
              ...u,
              showdownReady: false,
              showdownCooldownTimer: bp.showdownCooldown * mastery.showdownCdMult * SHOWDOWN_COOLDOWN_SCALE
            }
          : u
      );
    });
  }, [maxBaseHealth, progression.cardMasteryLevels]);

  const handleTriggerAllReadyShowdowns = useCallback(() => {
    const readyUnits = stateRef.current.placedUnits.filter((u) => {
      const cardLv = progression.cardMasteryLevels[u.blueprintId] || 1;
      return u.showdownReady && canUseUnitShowdown(cardLv, u.level);
    });
    readyUnits.forEach((u) => handleTriggerShowdown(u.instanceId));
  }, [progression.cardMasteryLevels, handleTriggerShowdown]);

  // Auto-Showdown triggers ready abilities automatically during active waves when enemies are present
  useEffect(() => {
    if (!autoShowdown || !isWaveActive || activeEnemies.length === 0) return;
    const readyUnit = placedUnits.find((u) => {
      const cardLv = progression.cardMasteryLevels[u.blueprintId] || 1;
      return u.showdownReady && canUseUnitShowdown(cardLv, u.level);
    });
    if (readyUnit) {
      handleTriggerShowdown(readyUnit.instanceId);
    }
  }, [autoShowdown, isWaveActive, activeEnemies.length, placedUnits, progression.cardMasteryLevels, handleTriggerShowdown]);

  // Select Tactical Tool
  const handleSelectTool = useCallback(
    (toolId: TacticalToolId) => {
      const tool = TACTICAL_TOOL_MAP[toolId];
      if (!tool) return;
      if ((progression.highestArenaUnlocked || 1) < tool.unlockArena) return;
      if ((toolCooldowns[toolId] || 0) > 0) return;

      if (toolId === 'core_shield') {
        if (baseHealth >= maxBaseHealth) {
          setKillToast(`❤️ El Núcleo ya tiene todas sus vidas (${baseHealth}/${maxBaseHealth}).`);
          setTimeout(() => setKillToast(null), 2600);
          return;
        }
        sounds.playGiftReveal();
        setBaseHealth((hp) => Math.min(maxBaseHealth, hp + 2));
        setToolCooldowns((prev) => ({ ...prev, core_shield: tool.cooldownRounds }));
        setActiveToolId(null);
        setKillToast('🛡️ ¡Sello del Núcleo activado! +2 Vidas restauradas.');
        setTimeout(() => setKillToast(null), 3000);
        return;
      }

      setSelectedBlueprintId(null);
      setSelectedUnitId(null);
      setActiveToolId((prev) => (prev === toolId ? null : toolId));
    },
    [progression.highestArenaUnlocked, toolCooldowns, baseHealth, maxBaseHealth]
  );

  // Place unit or apply active Tactical Tool
  const handleTileClick = (gridX: number, gridY: number) => {
    if (activeToolId) {
      const tool = TACTICAL_TOOL_MAP[activeToolId];
      if (activeToolId === 'shovel') {
        const targetUnit = placedUnits.find((u) => u.gridX === gridX && u.gridY === gridY);
        if (!targetUnit) {
          setKillToast('🪏 Haz clic sobre una carta colocada para retirarla y recuperar 100% del oro.');
          setTimeout(() => setKillToast(null), 2800);
          return;
        }
        const bpTarget = UNITS[targetUnit.blueprintId];
        const refund = targetUnit.totalInvestment;
        setGold((g) => g + refund);
        sounds.playShovelDig();
        setPlacedUnits((prev) => prev.filter((u) => u.instanceId !== targetUnit.instanceId));
        if (selectedUnitId === targetUnit.instanceId) setSelectedUnitId(null);
        setParticles((prev) => [
          ...prev,
          ...Array.from({ length: 10 }).map((_, idx) => {
            const a = (idx / 10) * Math.PI * 2;
            return {
              x: targetUnit.pixelX,
              y: targetUnit.pixelY,
              vx: Math.cos(a) * 65,
              vy: Math.sin(a) * 65,
              life: 0.45,
              maxLife: 0.45,
              size: 3.5,
              color: '#FACC15',
              alpha: 1
            };
          })
        ]);
        setToolCooldowns((prev) => ({ ...prev, shovel: tool.cooldownRounds }));
        setActiveToolId(null);
        setKillToast(`🪏 ¡${bpTarget?.name || 'Carta'} retirada con Pala! Recuperaste +${refund} oro (100%).`);
        setTimeout(() => setKillToast(null), 3200);
        return;
      }

      if (activeToolId === 'hammer') {
        if (!isObstacleTile(effectiveMap, gridX, gridY)) {
          setKillToast('🔨 Haz clic sobre una piedra del mapa para destruirla.');
          setTimeout(() => setKillToast(null), 2800);
          return;
        }
        const px = gridX * effectiveMap.tileSize + effectiveMap.tileSize / 2;
        const py = gridY * effectiveMap.tileSize + effectiveMap.tileSize / 2;
        sounds.playHammerSmash();
        setRemovedObstacles((prev) => [...prev, { x: gridX, y: gridY }]);
        setParticles((prev) => [
          ...prev,
          ...Array.from({ length: 14 }).map((_, idx) => {
            const a = (idx / 14) * Math.PI * 2;
            const spd = 45 + (idx % 3) * 28;
            return {
              x: px,
              y: py,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              life: 0.5,
              maxLife: 0.5,
              size: 4,
              color: idx % 2 === 0 ? '#94A3B8' : '#FB923C',
              alpha: 1,
              shape: 'square' as const
            };
          })
        ]);
        setToolCooldowns((prev) => ({ ...prev, hammer: tool.cooldownRounds }));
        setActiveToolId(null);
        setKillToast('🔨 ¡Piedra destruida! Nueva casilla liberada (Martillo listo en 5 rondas).');
        setTimeout(() => setKillToast(null), 3400);
        return;
      }

      if (activeToolId === 'battery') {
        const targetUnit = placedUnits.find((u) => u.gridX === gridX && u.gridY === gridY);
        if (!targetUnit) {
          setKillToast('🔋 Haz clic sobre una unidad aliada para recargarla.');
          setTimeout(() => setKillToast(null), 2600);
          return;
        }
        const bpTarget = UNITS[targetUnit.blueprintId];
        const cardLv = progression.cardMasteryLevels[targetUnit.blueprintId] || 1;
        const canSd = canUseUnitShowdown(cardLv, targetUnit.level);
        sounds.playShowdown();
        setPlacedUnits((prev) =>
          prev.map((u) =>
            u.instanceId === targetUnit.instanceId
              ? {
                  ...u,
                  showdownCooldownTimer: canSd ? 0 : u.showdownCooldownTimer,
                  showdownReady: canSd ? true : u.showdownReady,
                  boostedUntil: Math.max(u.boostedUntil || 0, 8.0)
                }
              : u
          )
        );
        setToolCooldowns((prev) => ({ ...prev, battery: tool.cooldownRounds }));
        setActiveToolId(null);
        setKillToast(
          canSd
            ? `🔋 ¡${bpTarget?.name || 'Unidad'} cargada! Showdown listo e iluminación amarilla activa.`
            : `🔋 ¡${bpTarget?.name || 'Unidad'} sobrecargada (+50% vel. 8s)!`
        );
        setTimeout(() => setKillToast(null), 3200);
        return;
      }

      if (activeToolId === 'bomb') {
        const px = gridX * effectiveMap.tileSize + effectiveMap.tileSize / 2;
        const py = gridY * effectiveMap.tileSize + effectiveMap.tileSize / 2;
        const blastDmg = 380 + currentWave * 45;
        sounds.playHit(true);
        setActiveEnemies((prev) =>
          prev.map((e) => {
            const dx = e.x - px;
            const dy = e.y - py;
            if (dx * dx + dy * dy <= 115 * 115) {
              return {
                ...e,
                currentHealth: Math.max(0, e.currentHealth - blastDmg),
                distanceTraveled: Math.max(0, e.distanceTraveled - 60),
                freezeUntil: Math.max(e.freezeUntil, e.isBoss ? 0.45 : 0.9)
              };
            }
            return e;
          })
        );
        setParticles((prev) => [
          ...prev,
          ...Array.from({ length: 16 }).map((_, idx) => {
            const a = (idx / 16) * Math.PI * 2;
            const spd = 60 + (idx % 4) * 35;
            return {
              x: px,
              y: py,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              life: 0.48,
              maxLife: 0.48,
              size: 4.5,
              color: idx % 2 === 0 ? '#EF4444' : '#FACC15',
              alpha: 1
            };
          })
        ]);
        setToolCooldowns((prev) => ({ ...prev, bomb: tool.cooldownRounds }));
        setActiveToolId(null);
        setKillToast(`💣 ¡Carga Sísmica detonada! (-${blastDmg} daño en área)`);
        setTimeout(() => setKillToast(null), 3000);
        return;
      }

      if (activeToolId === 'wrench') {
        const targetUnit = placedUnits.find((u) => u.gridX === gridX && u.gridY === gridY);
        if (!targetUnit || targetUnit.level >= MAX_IN_MATCH_LEVEL) {
          setKillToast(`🔧 Selecciona una unidad aliada por debajo de Nivel ${MAX_IN_MATCH_LEVEL}.`);
          setTimeout(() => setKillToast(null), 2800);
          return;
        }
        const bpTarget = UNITS[targetUnit.blueprintId];
        const nextLv = targetUnit.level + 1;
        sounds.playUpgrade();
        setPlacedUnits((prev) =>
          prev.map((u) => (u.instanceId === targetUnit.instanceId ? { ...u, level: nextLv } : u))
        );
        setToolCooldowns((prev) => ({ ...prev, wrench: tool.cooldownRounds }));
        setActiveToolId(null);
        setKillToast(`🔧 ¡${bpTarget?.name || 'Unidad'} mejorada GRATIS a Nivel ${nextLv}!`);
        setTimeout(() => setKillToast(null), 3200);
        return;
      }
    }

    if (!selectedBlueprintId) {
      // Check if clicked placed unit
      const unit = placedUnits.find((u) => u.gridX === gridX && u.gridY === gridY);
      setSelectedUnitId(unit ? unit.instanceId : null);
      return;
    }

    // Must be unlocked in player's Story Mode deck
    if (!progression.unlockedCardIds.includes(selectedBlueprintId)) {
      return;
    }

    const bp = UNITS[selectedBlueprintId];
    if (!bp) return;

    // User requirement: "recuerda un divino solo se puede poner una vez y tiene una habilidad super unica"
    if (bp.rarity === 'divinidad') {
      const alreadyPlacedDivine = placedUnits.find((u) => UNITS[u.blueprintId]?.rarity === 'divinidad');
      if (alreadyPlacedDivine) {
        setKillToast('⚡ ¡Límite Divino! Solo puedes tener 1 Personaje Divino desplegado en el campo a la vez.');
        sounds.playSell();
        setTimeout(() => setKillToast(null), 3500);
        return;
      }
    }

    // Check validity
    const isPath = isPathTile(effectiveMap, gridX, gridY);
    const isObstacle = isObstacleTile(effectiveMap, gridX, gridY);
    const isOccupied = placedUnits.some((u) => u.gridX === gridX && u.gridY === gridY);

    if (isPath || isObstacle || isOccupied) {
      return;
    }

    if (gold < bp.cost) {
      return;
    }

    // Deduct gold
    setGold((g) => g - bp.cost);
    sounds.playPlace();

    const cardLevel = progression.cardMasteryLevels[bp.id] || 1;
    const mastery = getLevelStatMultiplier(cardLevel);

    const newUnit: PlacedUnit = {
      instanceId: `unit_${Date.now()}_${Math.random()}`,
      blueprintId: bp.id,
      gridX,
      gridY,
      pixelX: gridX * effectiveMap.tileSize + effectiveMap.tileSize / 2,
      pixelY: gridY * effectiveMap.tileSize + effectiveMap.tileSize / 2,
      level: 1,
      totalInvestment: bp.cost,
      damageDealt: 0,
      kills: 0,
      targetStrategy: 'first',
      attackCooldown: 0,
      showdownCooldownTimer: bp.showdownCooldown * mastery.showdownCdMult * 1.35,
      showdownReady: false,
      angle: 0,
      lastTargetId: null
    };

    const unitsToAdd: PlacedUnit[] = [newUnit];

    // Special Divinity Mechanic — Eclipse, el Ser Dividido:
    // Habilidad "Paradoja": al colocarlo, crea automáticamente una copia de sí mismo
    // en una casilla válida cercana. La copia tiene el 60% de las capacidades de la original.
    if (bp.id === 'eclipse_divided') {
      const neighbors = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
        { dx: 1, dy: 1 },
        { dx: -1, dy: -1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: 1 }
      ];
      for (const offset of neighbors) {
        const nx = gridX + offset.dx;
        const ny = gridY + offset.dy;
        if (nx >= 0 && nx < effectiveMap.cols && ny >= 0 && ny < effectiveMap.rows) {
          const pathCheck = isPathTile(effectiveMap, nx, ny);
          const obsCheck = isObstacleTile(effectiveMap, nx, ny);
          const occCheck = placedUnits.some((u) => u.gridX === nx && u.gridY === ny);
          if (!pathCheck && !obsCheck && !occCheck) {
            unitsToAdd.push({
              instanceId: `unit_clone_${Date.now()}_${Math.random()}`,
              blueprintId: bp.id,
              gridX: nx,
              gridY: ny,
              pixelX: nx * effectiveMap.tileSize + effectiveMap.tileSize / 2,
              pixelY: ny * effectiveMap.tileSize + effectiveMap.tileSize / 2,
              level: 1,
              totalInvestment: 0,
              damageDealt: 0,
              kills: 0,
              targetStrategy: 'first',
              attackCooldown: 0.2,
              showdownCooldownTimer: bp.showdownCooldown * mastery.showdownCdMult * 1.35,
              showdownReady: false,
              angle: 0,
              lastTargetId: null
            });
            break;
          }
        }
      }
    }

    setPlacedUnits((prev) => [...prev, ...unitsToAdd]);
    setSelectedUnitId(newUnit.instanceId);
    setSelectedBlueprintId(null);

    setMissions((missionsList) =>
      missionsList.map((m) => {
        if (m.id === 'mission_deploy_units_50') {
          const nextCount = m.currentCount + 1;
          return { ...m, currentCount: nextCount, completed: m.completed || nextCount >= m.targetCount };
        }
        return m;
      })
    );
  };

  // Upgrade unit inside match (Tier 1 -> 2 -> 3 -> 4 -> 5 -> 6)
  const handleUpgradeUnit = (instanceId: string) => {
    setPlacedUnits((prev) =>
      prev.map((u) => {
        if (u.instanceId !== instanceId) return u;
        const bp = UNITS[u.blueprintId];
        if (!bp || u.level >= MAX_IN_MATCH_LEVEL) return u;
        const nextTier = getInMatchUnitTier(bp, u.level + 1);
        if (gold < nextTier.cost) return u;

        setGold((g) => g - nextTier.cost);
        sounds.playUpgrade();

        return {
          ...u,
          level: u.level + 1,
          totalInvestment: u.totalInvestment + nextTier.cost
        };
      })
    );
  };

  // Sell unit
  const handleSellUnit = (instanceId: string) => {
    const unit = placedUnits.find((u) => u.instanceId === instanceId);
    if (!unit) return;

    const refund = Math.floor(unit.totalInvestment * 0.7);
    setGold((g) => g + refund);
    sounds.playCoin();

    setPlacedUnits((prev) => prev.filter((u) => u.instanceId !== instanceId));
    setSelectedUnitId(null);
  };

  // Change targeting strategy
  const handleChangeStrategy = (instanceId: string, strategy: TargetStrategy) => {
    setPlacedUnits((prev) =>
      prev.map((u) => (u.instanceId === instanceId ? { ...u, targetStrategy: strategy } : u))
    );
  };

  // Story Mode: Claim Mission Reward
  const handleClaimMission = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission || !mission.completed || mission.claimed) return;

    sounds.playCoin();

    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, claimed: true } : m))
    );

    setProgression((prev) => ({
      ...prev,
      unopenedPacks: prev.unopenedPacks + mission.rewardPacks,
      savedCoins: (prev.savedCoins ?? 0) + (mission.rewardCoins || 0),
      skillPoints: prev.skillPoints + (mission.rewardSkillPoints || 0),
      claimedMissionIds: [...prev.claimedMissionIds, missionId]
    }));
  };

  // Claim all completed unclaimed missions at once
  const handleClaimAllMissions = () => {
    const claimable = missions.filter((m) => m.completed && !m.claimed);
    if (claimable.length === 0) return;

    sounds.playUpgrade();

    let totalPacks = 0;
    let totalCoins = 0;
    let totalSp = 0;
    const idsToClaim = new Set<string>();

    claimable.forEach((m) => {
      totalPacks += m.rewardPacks;
      totalCoins += m.rewardCoins || 0;
      totalSp += m.rewardSkillPoints || 0;
      idsToClaim.add(m.id);
    });

    setMissions((prev) =>
      prev.map((m) => (idsToClaim.has(m.id) ? { ...m, claimed: true } : m))
    );

    setProgression((prev) => ({
      ...prev,
      unopenedPacks: prev.unopenedPacks + totalPacks,
      savedCoins: (prev.savedCoins ?? 0) + totalCoins,
      skillPoints: prev.skillPoints + totalSp,
      claimedMissionIds: Array.from(new Set([...prev.claimedMissionIds, ...idsToClaim]))
    }));

    setKillToast(
      `🏆 ¡${claimable.length} misiones reclamadas! +${totalPacks} Sobres${totalCoins > 0 ? ` · +${totalCoins} mon.` : ''}${totalSp > 0 ? ` · +${totalSp} PH` : ''}`
    );
    setTimeout(() => setKillToast(null), 4000);
  };

  // Story Mode: Open Pack with Clash Royale drop rates & automatic deck slotting
  const handleOpenPack = (): PackReward[] => {
    if (progression.unopenedPacks <= 0) return [];

    const rewards = openBoosterPack(progression.unlockedCardIds, progression.highestArenaUnlocked || 1);

    setProgression((prev) => {
      let updatedUnlocked = [...prev.unlockedCardIds];
      let updatedDeck = [...(prev.activeDeckCardIds || [])];
      let bonusSkillPoints = prev.skillPoints;

      rewards.forEach((r) => {
        if (r.type === 'card' && r.cardId && !updatedUnlocked.includes(r.cardId)) {
          updatedUnlocked.push(r.cardId);
          // If active deck has space (less than 7 cards), auto-equip new card!
          if (updatedDeck.length < 7 && !updatedDeck.includes(r.cardId)) {
            updatedDeck.push(r.cardId);
          }
        } else if (r.type === 'skill_points' && r.skillPoints) {
          bonusSkillPoints += r.skillPoints;
        }
      });

      return {
        ...prev,
        unopenedPacks: Math.max(0, prev.unopenedPacks - 1),
        unlockedCardIds: updatedUnlocked,
        activeDeckCardIds: updatedDeck,
        skillPoints: bonusSkillPoints
      };
    });

    setMissions((missionsList) =>
      missionsList.map((m) => {
        if (m.id === 'mission_open_packs_10') {
          const nextCount = m.currentCount + 1;
          return { ...m, currentCount: nextCount, completed: m.completed || nextCount >= m.targetCount };
        }
        return m;
      })
    );

    return rewards;
  };

  // Clash Royale 7-Card Battle Deck Customizer (equip / unequip / swap)
  const handleToggleDeckCard = useCallback((cardId: string) => {
    setProgression((prev) => {
      const currentDeck = prev.activeDeckCardIds || [];
      const isAlreadyInDeck = currentDeck.includes(cardId);

      if (isAlreadyInDeck) {
        // Keep at least 1 card in deck
        if (currentDeck.length <= 1) return prev;
        return {
          ...prev,
          activeDeckCardIds: currentDeck.filter((id) => id !== cardId)
        };
      } else {
        // Can only equip if unlocked and deck has < 7 cards
        if (!prev.unlockedCardIds.includes(cardId)) return prev;
        if (currentDeck.length >= 7) return prev;
        return {
          ...prev,
          activeDeckCardIds: [...currentDeck, cardId]
        };
      }
    });
  }, []);

  // Story Mode: Upgrade Character Card with Skill Points (Level 1 to 10)
  const handleUpgradeCharacter = (unitId: string) => {
    const currentLv = progression.cardMasteryLevels[unitId] || 1;
    if (currentLv >= 10) return;

    const cost = LEVEL_UP_COSTS[currentLv];
    if (progression.skillPoints < cost) return;

    sounds.playUpgrade();

    setProgression((prev) => ({
      ...prev,
      skillPoints: prev.skillPoints - cost,
      cardMasteryLevels: {
        ...prev.cardMasteryLevels,
        [unitId]: currentLv + 1
      }
    }));
  };

  // Bank 50% of earned match gold into persistent saved Coins mid-arena (other 50% stays in match funds)
  const handleBankMatchCoins = useCallback(() => {
    const rawBankable = Math.min(stateRef.current.gold, stateRef.current.earnedGoldInMatch);
    const transferCoins = Math.floor(rawBankable * 0.5);
    if (transferCoins <= 0) return;

    sounds.playCoin();
    setGold((g) => Math.max(0, g - transferCoins));
    setEarnedGoldInMatch(0);
    setProgression((prev) => ({
      ...prev,
      savedCoins: (prev.savedCoins ?? 0) + transferCoins
    }));
    setKillToast(`💰 ¡+${transferCoins} monedas (50%) guardadas en tu Bóveda permanente!`);
    setTimeout(() => setKillToast(null), 3200);
  }, []);

  // Card Shop: Direct card purchase with saved Coins (cards require unlocking their Arena; Divinities require completing it)
  const handleBuyCardWithCoins = useCallback((unitId: string) => {
    const unit = UNITS[unitId];
    if (!unit) return;
    const isFreeNow = stateRef.current.freeShopUntil > Date.now();
    const price = isFreeNow ? 0 : getCardShopPrice(unit);

    setProgression((prev) => {
      if (prev.unlockedCardIds.includes(unitId)) return prev;
      const eligibility = canBuyCardInShop(unit, prev);
      if (!eligibility.allowed) {
        setKillToast(
          eligibility.reason === 'beat_arena'
            ? `🔒 Completa la Arena ${eligibility.requiredArena} para desbloquear la Divinidad ${unit.name}.`
            : `🔒 Desbloquea la Arena ${eligibility.requiredArena} para poder comprar a ${unit.name}.`
        );
        setTimeout(() => setKillToast(null), 3500);
        return prev;
      }
      if ((prev.savedCoins ?? 0) < price) return prev;

      sounds.playUpgrade();
      const nextUnlocked = [...prev.unlockedCardIds, unitId];
      const currentDeck = prev.activeDeckCardIds || [];
      const nextDeck = currentDeck.length < 7 && !currentDeck.includes(unitId)
        ? [...currentDeck, unitId]
        : currentDeck;

      setKillToast(
        isFreeNow
          ? `⚡ ¡${unit.name} reclutado GRATIS por código de hackeo!`
          : `🎴 ¡Compraste a ${unit.name}! Agregado a tu colección.`
      );
      setTimeout(() => setKillToast(null), 3500);

      return {
        ...prev,
        savedCoins: (prev.savedCoins ?? 0) - price,
        unlockedCardIds: nextUnlocked,
        activeDeckCardIds: nextDeck
      };
    });
  }, []);

  // Card Shop: Buy Chrono Booster Pack with saved Coins (stockpile into unopenedPacks)
  const handleBuyPackWithCoins = useCallback(() => {
    const isFreeNow = stateRef.current.freeShopUntil > Date.now();
    const price = isFreeNow ? 0 : SHOP_PACK_COIN_PRICE;
    setProgression((prev) => {
      if ((prev.savedCoins ?? 0) < price) return prev;
      sounds.playCoin();
      setKillToast(
        isFreeNow
          ? '⚡ ¡+1 Sobre Crono GRATIS agregado a Abrir Sobres!'
          : '📦 ¡+1 Sobre Crono guardado! Puedes abrirlo cuando quieras en Abrir Sobres.'
      );
      setTimeout(() => setKillToast(null), 3200);
      return {
        ...prev,
        savedCoins: (prev.savedCoins ?? 0) - price,
        unopenedPacks: prev.unopenedPacks + 1
      };
    });
  }, []);

  // Card Shop: Buy Bundle of 3 Classic Booster Packs at a discount
  const handleBuyPackBundleWithCoins = useCallback(() => {
    const isFreeNow = stateRef.current.freeShopUntil > Date.now();
    const price = isFreeNow ? 0 : SHOP_BUNDLE_3_PACKS_PRICE;
    setProgression((prev) => {
      if ((prev.savedCoins ?? 0) < price) return prev;
      sounds.playUpgrade();
      setKillToast(
        isFreeNow
          ? '⚡ ¡Lote x3 Sobres Crono reclamado GRATIS!'
          : '🎁 ¡Lote de 3 Sobres Crono comprado! Ábrelos en Abrir Sobres.'
      );
      setTimeout(() => setKillToast(null), 3500);
      return {
        ...prev,
        savedCoins: (prev.savedCoins ?? 0) - price,
        unopenedPacks: prev.unopenedPacks + 3
      };
    });
  }, []);

  // Card Shop: Buy & immediately open any Shop Pack Tier (Classic, Elite, Royal, Cosmic)
  const handleBuyAndOpenPackTier = useCallback((tierId: ShopPackTierId): PackReward[] => {
    const tierDef = SHOP_PACK_TIERS.find((t) => t.id === tierId);
    const currentProg = stateRef.current.progression;
    const isFreeNow = stateRef.current.freeShopUntil > Date.now();
    const tierPrice = tierDef ? (isFreeNow ? 0 : tierDef.priceCoins) : 0;
    if (!tierDef || (currentProg.savedCoins ?? 0) < tierPrice) {
      return [];
    }

    const rewards = openShopTierPack(
      tierId,
      currentProg.unlockedCardIds,
      currentProg.highestArenaUnlocked || 1,
      currentProg.completedArenaLevels || []
    );

    sounds.playWaveClear();

    setProgression((prev) => {
      if ((prev.savedCoins ?? 0) < tierPrice) return prev;
      const updatedUnlocked = [...prev.unlockedCardIds];
      const updatedDeck = [...(prev.activeDeckCardIds || [])];
      let bonusSp = prev.skillPoints;

      rewards.forEach((r) => {
        if (r.type === 'card' && r.cardId && !updatedUnlocked.includes(r.cardId)) {
          updatedUnlocked.push(r.cardId);
          if (updatedDeck.length < 7 && !updatedDeck.includes(r.cardId)) {
            updatedDeck.push(r.cardId);
          }
        } else if (r.type === 'skill_points' && r.skillPoints) {
          bonusSp += r.skillPoints;
        }
      });

      return {
        ...prev,
        savedCoins: (prev.savedCoins ?? 0) - tierPrice,
        unlockedCardIds: updatedUnlocked,
        activeDeckCardIds: updatedDeck,
        skillPoints: bonusSp
      };
    });

    setMissions((missionsList) =>
      missionsList.map((m) => {
        if (m.id === 'mission_open_packs_10') {
          const nextCount = m.currentCount + 1;
          return { ...m, currentCount: nextCount, completed: m.completed || nextCount >= m.targetCount };
        }
        return m;
      })
    );

    return rewards;
  }, []);

  // Card Shop: Buy Skill Points bundle with saved Coins
  const handleBuySkillPointsWithCoins = useCallback(() => {
    const isFreeNow = stateRef.current.freeShopUntil > Date.now();
    const price = isFreeNow ? 0 : SHOP_SP_COIN_PRICE;
    setProgression((prev) => {
      if ((prev.savedCoins ?? 0) < price) return prev;
      sounds.playUpgrade();
      setKillToast(
        isFreeNow
          ? `⚡ ¡+${SHOP_SP_BUNDLE_AMOUNT} Puntos de Habilidad GRATIS!`
          : `⚡ ¡+${SHOP_SP_BUNDLE_AMOUNT} Puntos de Habilidad agregados!`
      );
      setTimeout(() => setKillToast(null), 3200);
      return {
        ...prev,
        savedCoins: (prev.savedCoins ?? 0) - price,
        skillPoints: prev.skillPoints + SHOP_SP_BUNDLE_AMOUNT
      };
    });
  }, []);

  // Redeem hack / cheat code in Shop (one-time use per code)
  const handleRedeemCheatCode = useCallback((rawCode: string): { success: boolean; title?: string; message: string } => {
    const def = findCheatCode(rawCode);
    if (!def) {
      return {
        success: false,
        message: 'Código inválido o inexistente.'
      };
    }

    const codeKey = def.code.toLowerCase();
    const alreadySaved = (stateRef.current.progression.redeemedCheatCodes || []).includes(codeKey);
    if (alreadySaved || redeemedCodesGuardRef.current.has(codeKey)) {
      return {
        success: false,
        message: 'Este código ya fue canjeado anteriormente. Solo se puede usar una vez.'
      };
    }

    redeemedCodesGuardRef.current.add(codeKey);
    const markRedeemed = () => {
      setProgression((prev) => ({
        ...prev,
        redeemedCheatCodes: Array.from(new Set([...(prev.redeemedCheatCodes || []), codeKey]))
      }));
    };

    sounds.playShowdown();

    let response: { success: boolean; title?: string; message: string };
    switch (def.effectId) {
      case 'FREE_STORE_60S': {
        setFreeShopUntil(Date.now() + 60_000);
        setKillToast('⚡ CÓDIGO ACTIVADO: ¡Toda la Tienda GRATIS durante 60 segundos!');
        setTimeout(() => setKillToast(null), 4500);
        response = { success: true, title: def.title, message: def.description };
        break;
      }

      case 'SKIP_ARENA': {
        const currentArena = getArenaByMapId(currentMap.id);
        const nextLevel = Math.min(ARENAS.length, currentArena.arenaLevel + 1);
        const nextArena = ARENAS.find((a) => a.arenaLevel === nextLevel) || currentArena;
        const rawBankableRemaining = Math.min(stateRef.current.gold, stateRef.current.earnedGoldInMatch);
        const bankableRemaining = Math.floor(rawBankableRemaining * 0.5);
        const arenaBonusCoins = 120 + currentArena.arenaLevel * 40;
        const totalAddedCoins = bankableRemaining + arenaBonusCoins;

        setIsWaveActive(false);
        setActiveEnemies([]);
        setProjectiles([]);
        setActiveShowdownVFX(null);
        setSummaryData(null);
        setGold((g) => Math.max(0, g - bankableRemaining));
        setEarnedGoldInMatch(0);

        const currentProg = stateRef.current.progression;
        const alreadyGifted = (currentProg.giftedArenaLevels || [1]).includes(nextLevel);
        const giftedUnit =
          nextLevel > currentArena.arenaLevel && !alreadyGifted
            ? getArenaGiftCharacter(nextLevel, currentProg.unlockedCardIds)
            : null;

        setProgression((p) => {
          const nextCompleted = Array.from(new Set([...(p.completedArenaLevels || []), currentArena.arenaLevel]));
          const nextGifted = giftedUnit
            ? Array.from(new Set([...(p.giftedArenaLevels || [1]), nextLevel]))
            : p.giftedArenaLevels || [1];

          let nextUnlocked = p.unlockedCardIds;
          let nextDeck = p.activeDeckCardIds || [];
          if (giftedUnit && !nextUnlocked.includes(giftedUnit.id)) {
            nextUnlocked = [...nextUnlocked, giftedUnit.id];
            if (nextDeck.length < 7 && !nextDeck.includes(giftedUnit.id)) {
              nextDeck = [...nextDeck, giftedUnit.id];
            }
          }

          return {
            ...p,
            highestArenaUnlocked: Math.max(p.highestArenaUnlocked || 1, nextLevel),
            completedArenaLevels: nextCompleted,
            giftedArenaLevels: nextGifted,
            unlockedCardIds: nextUnlocked,
            activeDeckCardIds: nextDeck,
            unopenedPacks: p.unopenedPacks + 1,
            skillPoints: p.skillPoints + 60,
            savedCoins: (p.savedCoins ?? 0) + totalAddedCoins
          };
        });

        sounds.playVictory();
        setArenaPromotion({
          arena: nextArena,
          completedArenaLevel: currentArena.arenaLevel,
          wave: currentArena.roundsRequired,
          giftedUnit,
          coinsEarned: totalAddedCoins
        });
        setActiveBottomTab('BATTLE');
        setKillToast(`⏩ ¡Arena ${currentArena.arenaLevel} completada automáticamente! +${totalAddedCoins} monedas.`);
        setTimeout(() => setKillToast(null), 4500);
        response = { success: true, title: def.title, message: `¡Arena ${currentArena.arenaLevel} superada! Abriendo ceremonia de desbloqueo...` };
        break;
      }

      case 'UNLOCK_ALL_CARDS': {
        const allIds = Object.keys(UNITS);
        setProgression((prev) => {
          const updatedMastery = { ...prev.cardMasteryLevels };
          allIds.forEach((id) => {
            if ((updatedMastery[id] || 1) < 3) {
              updatedMastery[id] = 3;
            }
          });
          return {
            ...prev,
            unlockedCardIds: allIds,
            cardMasteryLevels: updatedMastery
          };
        });
        setKillToast(`🃏 ¡Todas las ${allIds.length} cartas desbloqueadas con Showdown activo!`);
        setTimeout(() => setKillToast(null), 4500);
        response = { success: true, title: def.title, message: `¡Colección 100% desbloqueada (${allIds.length} cartas)!` };
        break;
      }

      case 'MEGA_VAULT': {
        setProgression((prev) => ({
          ...prev,
          savedCoins: (prev.savedCoins ?? 0) + 100_000,
          skillPoints: prev.skillPoints + 5_000
        }));
        setKillToast('💎 ¡+100,000 monedas en Bóveda y +5,000 PH acreditados!');
        setTimeout(() => setKillToast(null), 4500);
        response = { success: true, title: def.title, message: def.description };
        break;
      }

      case 'COSMIC_PACKS': {
        const recruitedNames: string[] = [];
        setProgression((prev) => {
          const missingHighRarity = UNIT_LIST
            .filter((u) => !prev.unlockedCardIds.includes(u.id))
            .sort((a, b) => compareRarities(b.rarity, a.rarity))
            .slice(0, 3);
          const newIds = missingHighRarity.map((u) => {
            recruitedNames.push(u.name);
            return u.id;
          });
          const nextUnlocked = [...prev.unlockedCardIds, ...newIds];
          let nextDeck = [...(prev.activeDeckCardIds || [])];
          newIds.forEach((id) => {
            if (nextDeck.length < 7 && !nextDeck.includes(id)) nextDeck.push(id);
          });
          return {
            ...prev,
            unopenedPacks: prev.unopenedPacks + 25,
            unlockedCardIds: nextUnlocked,
            activeDeckCardIds: nextDeck
          };
        });
        const extraMsg = recruitedNames.length > 0 ? ` Reclutadas: ${recruitedNames.join(', ')}.` : '';
        setKillToast(`🌌 ¡+25 Sobres Crono entregados!${extraMsg}`);
        setTimeout(() => setKillToast(null), 4500);
        response = { success: true, title: def.title, message: `+25 Sobres agregados.${extraMsg}` };
        break;
      }

      case 'MAX_LEVEL_CARDS': {
        setProgression((prev) => {
          const upgraded: Record<string, number> = { ...prev.cardMasteryLevels };
          prev.unlockedCardIds.forEach((id) => {
            upgraded[id] = 10;
          });
          return { ...prev, cardMasteryLevels: upgraded };
        });
        setKillToast('⭐ ¡Todas tus cartas desbloqueadas subieron a Maestría Nivel 10!');
        setTimeout(() => setKillToast(null), 4500);
        response = { success: true, title: def.title, message: def.description };
        break;
      }

      case 'UNLOCK_ALL_ARENAS': {
        const allArenaLevels = ARENAS.map((a) => a.arenaLevel);
        setProgression((prev) => ({
          ...prev,
          highestArenaUnlocked: ARENAS.length,
          completedArenaLevels: allArenaLevels,
          giftedArenaLevels: allArenaLevels
        }));
        setKillToast('🗺️ ¡Las 15 Arenas, Herramientas y Divinidades desbloqueadas!');
        setTimeout(() => setKillToast(null), 4500);
        response = { success: true, title: def.title, message: def.description };
        break;
      }

      case 'GOD_MATCH': {
        setGold((g) => g + 50_000);
        setTotalGoldEarned((g) => g + 50_000);
        setBaseHealth((hp) => Math.max(hp, maxBaseHealth, 10));
        setPlacedUnits((prev) =>
          prev.map((u) => ({
            ...u,
            level: MAX_IN_MATCH_LEVEL,
            showdownReady: true,
            showdownCooldownTimer: 0
          }))
        );
        setToolCooldowns(INITIAL_TOOL_COOLDOWNS);
        setKillToast('🔥 ¡Sobrecarga Divina: +50,000 oro, torres Nv.6 y Showdowns listos!');
        setTimeout(() => setKillToast(null), 4500);
        response = { success: true, title: def.title, message: def.description };
        break;
      }

      case 'NUKE_WAVE': {
        const targets = [...stateRef.current.activeEnemies];
        targets.forEach((enemy) => registerEnemyKill(enemy));
        setActiveEnemies([]);
        setProjectiles([]);
        setMaxBaseHealth(25);
        setBaseHealth(25);
        setKillToast(`☢️ ¡Aniquilación Orbital! ${targets.length} enemigos eliminados y Núcleo 25/25.`);
        setTimeout(() => setKillToast(null), 4500);
        response = {
          success: true,
          title: def.title,
          message: `Núcleo potenciado a 25/25 Vidas${targets.length > 0 ? ` y ${targets.length} enemigos aniquilados` : ''}.`
        };
        break;
      }

      case 'CHRONO_TOOLS': {
        setRemovedObstacles(currentMap.obstacles.map((o) => ({ x: o.x, y: o.y })));
        setToolCooldowns(INITIAL_TOOL_COOLDOWNS);
        setProgression((prev) => ({
          ...prev,
          savedCoins: (prev.savedCoins ?? 0) + 15_000,
          skillPoints: prev.skillPoints + 250
        }));
        setKillToast('🛠️ ¡Mapa despejado sin piedras, herramientas cargadas y +15,000 mon. +250 PH!');
        setTimeout(() => setKillToast(null), 4500);
        response = { success: true, title: def.title, message: def.description };
        break;
      }

      case 'NORMAL_RECRUIT_1':
      case 'NORMAL_RECRUIT_2':
      case 'NORMAL_ELITE_TRAINING': {
        const countToUnlock = def.effectId === 'NORMAL_RECRUIT_2' ? 2 : 1;
        const bonusSp = def.effectId === 'NORMAL_RECRUIT_1' ? 80 : def.effectId === 'NORMAL_ELITE_TRAINING' ? 400 : 0;
        const pickedNames: string[] = [];

        setProgression((prev) => {
          const eligiblePool = UNIT_LIST.filter(
            (u) => !prev.unlockedCardIds.includes(u.id) && u.rarity !== 'divinidad'
          );
          const fallbackPool = eligiblePool.length > 0
            ? eligiblePool
            : UNIT_LIST.filter((u) => !prev.unlockedCardIds.includes(u.id));
          const shuffled = [...fallbackPool].sort(() => Math.random() - 0.5).slice(0, countToUnlock);
          const newIds = shuffled.map((u) => {
            pickedNames.push(u.name);
            return u.id;
          });
          const nextUnlocked = [...prev.unlockedCardIds, ...newIds];
          const nextDeck = [...(prev.activeDeckCardIds || [])];
          newIds.forEach((id) => {
            if (nextDeck.length < 7 && !nextDeck.includes(id)) nextDeck.push(id);
          });
          return {
            ...prev,
            unlockedCardIds: nextUnlocked,
            activeDeckCardIds: nextDeck,
            skillPoints: prev.skillPoints + bonusSp
          };
        });

        const msgParts: string[] = [];
        if (pickedNames.length > 0) msgParts.push(`Reclutado: ${pickedNames.join(', ')}`);
        if (bonusSp > 0) msgParts.push(`+${bonusSp} PH`);
        const summaryMsg = msgParts.length > 0 ? msgParts.join(' · ') : 'Colección completa: recompensa de fuerza aplicada.';
        setKillToast(`🎖️ ${def.title}: ${summaryMsg}`);
        setTimeout(() => setKillToast(null), 4200);
        response = { success: true, title: def.title, message: summaryMsg };
        break;
      }

      case 'NORMAL_STRENGTH_250': {
        setProgression((prev) => ({
          ...prev,
          skillPoints: prev.skillPoints + 250
        }));
        setKillToast('⚡ ¡+250 Puntos de Fuerza (PH) agregados para subir de nivel!');
        setTimeout(() => setKillToast(null), 4000);
        response = { success: true, title: def.title, message: def.description };
        break;
      }

      case 'NORMAL_VAULT_SUPPLY': {
        setProgression((prev) => ({
          ...prev,
          savedCoins: (prev.savedCoins ?? 0) + 950,
          unopenedPacks: prev.unopenedPacks + 1
        }));
        setKillToast('💰 ¡+950 monedas en Bóveda y +1 Sobre Crono acreditados!');
        setTimeout(() => setKillToast(null), 4000);
        response = { success: true, title: def.title, message: def.description };
        break;
      }

      case 'NORMAL_FIELD_BONUS': {
        setGold((g) => g + 1_500);
        setTotalGoldEarned((g) => g + 1_500);
        setProgression((prev) => ({
          ...prev,
          unopenedPacks: prev.unopenedPacks + 2
        }));
        setKillToast('⚔️ ¡+1,500 de oro en batalla y +2 Sobres Crono!');
        setTimeout(() => setKillToast(null), 4000);
        response = { success: true, title: def.title, message: def.description };
        break;
      }
    }

    markRedeemed();
    return response;
  }, [currentMap.id, currentMap.obstacles, maxBaseHealth, registerEnemyKill]);

  // Key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedBlueprintId(null);
        setSelectedUnitId(null);
        setActiveToolId(null);
      } else if (e.key === ' ') {
        e.preventDefault();
        if (!isWaveActive && viewState === 'PLAYING') {
          handleStartWave();
        } else if (viewState === 'PLAYING') {
          setGameSpeed((s) => (s === 0 ? 1 : 0));
        }
      } else if (e.key === '1') {
        setGameSpeed(1);
      } else if (e.key === '2') {
        setGameSpeed(2);
      } else if (e.key === '3') {
        setGameSpeed(3);
      } else if (e.key === 'q' || e.key === 'Q') {
        if (viewState === 'PLAYING' && activeBottomTab === 'BATTLE') {
          if (e.shiftKey) {
            handleTriggerAllReadyShowdowns();
          } else {
            const firstReady = stateRef.current.placedUnits.find((u) => {
              const cLv = progression.cardMasteryLevels[u.blueprintId] || 1;
              return u.showdownReady && canUseUnitShowdown(cLv, u.level);
            });
            if (firstReady) {
              handleTriggerShowdown(firstReady.instanceId);
            }
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isWaveActive,
    viewState,
    activeBottomTab,
    handleStartWave,
    handleTriggerShowdown,
    handleTriggerAllReadyShowdowns,
    progression.cardMasteryLevels
  ]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const dt = Math.min(rawDt, 0.1) * stateRef.current.gameSpeed;

      // Advance active Showdown VFX smoothly using real wall-clock dt (~0.6s duration, never stuck if paused)
      if (stateRef.current.activeShowdownVFX) {
        const vfxStep = Math.min(Math.max(rawDt, 0.016), 0.1) * 1.7;
        setActiveShowdownVFX((vfx) => {
          if (!vfx) return null;
          const nextProg = vfx.progress + vfxStep;
          return nextProg >= 1 ? null : { ...vfx, progress: nextProg };
        });
      }

      if (dt > 0 && viewState === 'PLAYING') {
        updateSimulation(dt);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    const updateSimulation = (dt: number) => {
      const state = stateRef.current;
      const path = detailedPathRef.current;

      // 1. Spawning Enemies
      if (state.isWaveActive) {
        const spawner = waveSpawnerRef.current;
        spawner.elapsed += dt;

        let allSegmentsFinished = true;

        spawner.config.segments.forEach((seg, idx) => {
          if (spawner.elapsed >= seg.initialDelay) {
            const timeSinceStart = spawner.elapsed - seg.initialDelay;
            const targetSpawns = Math.min(
              seg.count,
              Math.floor(timeSinceStart / seg.interval) + 1
            );

            if (spawner.spawnedCounts[idx] < targetSpawns) {
              // Spawn enemy with progressive Wave + Arena scaling and kinetic shields on elites/bosses
              const bp = ENEMIES[seg.enemyType] || ENEMIES.soldier;
              const arenaInfo = getArenaByMapId(state.map.id);
              const aLevel = arenaInfo.arenaLevel;
              const scaling = getWaveScaling(spawner.waveNumber, aLevel, state.difficulty);
              const scaledMaxHp = Math.round(bp.baseHealth * scaling.hpMult);
              const scaledSpeed = Math.round(bp.speed * scaling.speedMult);
              const hasKineticShield =
                scaling.shieldRatio > 0 &&
                (bp.isBoss ||
                  seg.enemyType === 'special' ||
                  seg.enemyType === 'void_reaver' ||
                  seg.enemyType === 'cyber_dreadnought' ||
                  seg.enemyType === 'tank' ||
                  seg.enemyType === 'pyro_golem');
              const maxShield = hasKineticShield ? Math.round(scaledMaxHp * scaling.shieldRatio) : 0;

              const newEnemy: ActiveEnemy = {
                instanceId: `enemy_${Date.now()}_${Math.random()}`,
                type: seg.enemyType,
                name: bp.name,
                currentHealth: scaledMaxHp,
                maxHealth: scaledMaxHp,
                shield: maxShield,
                maxShield,
                speed: scaledSpeed,
                baseSpeed: scaledSpeed,
                armor: bp.armor + scaling.armorBonus,
                goldReward: bp.goldReward + scaling.goldBonus,
                coreDamage: bp.coreDamage,
                size: bp.size + (aLevel > 1 ? 1 : 0),
                color: bp.color,
                accentColor: bp.accentColor,
                isBoss: !!bp.isBoss,
                waypointIndex: 0,
                x: path.points[0].x,
                y: path.points[0].y,
                distanceTraveled: 0,
                slowUntil: 0,
                slowMultiplier: 1,
                freezeUntil: 0,
                cryoParalyzed: false,
                burnUntil: 0,
                burnDps: 0,
                angle: 0,
                elementalAura: aLevel >= 2 ? (aLevel === 2 ? 'fire' : aLevel === 3 ? 'cyber' : 'void') : undefined,
                arenaLevel: aLevel
              };

              setActiveEnemies((prev) => [...prev, newEnemy]);
              spawner.spawnedCounts[idx]++;
            }

            if (spawner.spawnedCounts[idx] < seg.count) {
              allSegmentsFinished = false;
            }
          } else {
            allSegmentsFinished = false;
          }
        });

        spawner.isDoneSpawning = allSegmentsFinished;
      }

      // 2. Update Enemies (Movement, Status effects)
      let baseDamageTaken = 0;

      setActiveEnemies((prevEnemies) => {
        const remaining: ActiveEnemy[] = [];

        for (const enemy of prevEnemies) {
          // Status effects
          let currentHp = enemy.currentHealth;
          let freezeRemaining = Math.max(0, enemy.freezeUntil - dt);
          let slowRemaining = Math.max(0, enemy.slowUntil - dt);
          let burnRemaining = Math.max(0, enemy.burnUntil - dt);

          if (burnRemaining > 0) {
            currentHp -= enemy.burnDps * dt;
          }

          if (currentHp <= 0) {
            // Died from burn
            sounds.playHit();
            registerEnemyKill(enemy);
            continue;
          }

          // Speed calculation
          const effectiveSpeed =
            freezeRemaining > 0
              ? 0
              : slowRemaining > 0
              ? enemy.speed * enemy.slowMultiplier
              : enemy.speed;

          const newDist = enemy.distanceTraveled + effectiveSpeed * dt;
          const pos = getPositionAlongPath(path, newDist);

          if (pos.reachedEnd) {
            // Reached Core Base!
            // User rule: "contador de enemigos de 10, si 10 personajes llegan al final sin ser derrotados, el jugador pierde"
            const escapedDamage = enemy.isBoss ? 2 : 1;
            sounds.playBaseHit();

            setBaseHealth((hp) => {
              const nextHp = Math.max(0, hp - escapedDamage);
              if (nextHp <= 0) {
                const rawBankableOnEnd = Math.min(stateRef.current.gold, stateRef.current.earnedGoldInMatch);
                const bankableOnEnd = Math.floor(rawBankableOnEnd * 0.5);
                if (bankableOnEnd > 0) {
                  setAutoBankedCoinsInMatch(bankableOnEnd);
                  setGold((g) => Math.max(0, g - bankableOnEnd));
                }
                setEarnedGoldInMatch(0);
                setViewState('GAME_OVER');
                setProgression((p) => {
                  const currentWaveReached = currentWave;
                  const nextHigh = Math.max(p.highScoreWave || 0, currentWaveReached);
                  const currentArenaBests = p.arenaBestWaves || {};
                  return {
                    ...p,
                    savedCoins: (p.savedCoins ?? 0) + bankableOnEnd,
                    highScoreWave: nextHigh,
                    arenaBestWaves: {
                      ...currentArenaBests,
                      [stateRef.current.map.id]: Math.max(
                        currentArenaBests[stateRef.current.map.id] || 0,
                        currentWaveReached
                      )
                    },
                    totalMatchesPlayed: (p.totalMatchesPlayed || 0) + 1
                  };
                });
              }
              return nextHp;
            });

            const lastWp = currentMap.pathWaypoints[currentMap.pathWaypoints.length - 1];
            if (lastWp) {
              const coreX = (lastWp.x + 0.5) * currentMap.tileSize;
              const coreY = (lastWp.y + 0.5) * currentMap.tileSize;
              setDamageNumbers((prev) => [
                ...prev.slice(-25),
                {
                  id: `base_leak_${Date.now()}_${Math.random()}`,
                  x: coreX + (Math.random() * 24 - 12),
                  y: coreY - 12,
                  value: escapedDamage,
                  life: 1.0,
                  maxLife: 1.0,
                  color: '#EF4444',
                  isCrit: true
                }
              ]);
            }
            continue;
          }

          remaining.push({
            ...enemy,
            currentHealth: currentHp,
            distanceTraveled: newDist,
            x: pos.x,
            y: pos.y,
            angle: pos.angle,
            freezeUntil: freezeRemaining,
            slowUntil: slowRemaining,
            burnUntil: burnRemaining
          });
        }

        return remaining;
      });

      // 4. Update Units (Cooldowns, Targeting, Shooting)
      setPlacedUnits((prevUnits) => {
        const currentEnemies = stateRef.current.activeEnemies;
        const currentProgression = stateRef.current.progression;
        const newProjectiles: Projectile[] = [];

        const updatedUnits = prevUnits.map((unit) => {
          const bp = UNITS[unit.blueprintId];
          if (!bp) return unit;

          const tier = getInMatchUnitTier(bp, unit.level);

          // Story Mode Card Mastery Level (1 to 10)
          const cardLevel = currentProgression.cardMasteryLevels[unit.blueprintId] || 1;
          const mastery = getLevelStatMultiplier(cardLevel);

          let cd = Math.max(0, unit.attackCooldown - dt);
          const cdChargeMult = unit.level >= 6 ? 0.92 : 0.72;
          let showdownCd = Math.max(0, unit.showdownCooldownTimer - dt * cdChargeMult);

          // Showdown unlocks from Card Nv.3 OR Match Unit Nv.3!
          const isShowdownReady = canUseUnitShowdown(cardLevel, unit.level) && showdownCd <= 0;

          // Check if boosted by Resonator
          const isBoosted = (unit.boostedUntil ?? 0) > 0;
          const boostedTime = Math.max(0, (unit.boostedUntil ?? 0) - dt);

          // Support unit auras (Sacerdote Solar, Médico de Combate)
          const hasSolarPriest = prevUnits.some((other) => {
            if (other.instanceId === unit.instanceId) return false;
            if (other.blueprintId !== 'sacerdote_solar') return false;
            const dx = other.pixelX - unit.pixelX;
            const dy = other.pixelY - unit.pixelY;
            return dx * dx + dy * dy <= 160 * 160;
          });
          const hasCombatMedic = prevUnits.some((other) => {
            if (other.instanceId === unit.instanceId) return false;
            if (other.blueprintId !== 'medico_combate') return false;
            const dx = other.pixelX - unit.pixelX;
            const dy = other.pixelY - unit.pixelY;
            return dx * dx + dy * dy <= 150 * 150;
          });

          const supportRangeMult = hasSolarPriest ? 1.25 : 1.0;
          const supportSpeedMult = (hasSolarPriest ? 1.2 : 1.0) * (hasCombatMedic ? 1.25 : 1.0);
          const supportDamageMult = hasSolarPriest ? 1.15 : 1.0;

          const effectiveRange = tier.range * supportRangeMult;
          const baseAtkSpeed = tier.attackSpeed * mastery.speedMult * supportSpeedMult;
          const effectiveAtkSpeed = isBoosted ? baseAtkSpeed * 1.5 : baseAtkSpeed;
          const baseDamage = tier.damage * mastery.damageMult * supportDamageMult;
          const effectiveDamage = isBoosted ? baseDamage * 1.6 : baseDamage;

          // Find valid targets within range
          const inRange = currentEnemies.filter((e) => {
            const dx = e.x - unit.pixelX;
            const dy = e.y - unit.pixelY;
            return dx * dx + dy * dy <= effectiveRange * effectiveRange;
          });

          let target: ActiveEnemy | null = null;
          if (inRange.length > 0) {
            if (unit.targetStrategy === 'first') {
              target = inRange.reduce((max, e) => (e.distanceTraveled > max.distanceTraveled ? e : max));
            } else if (unit.targetStrategy === 'last') {
              target = inRange.reduce((min, e) => (e.distanceTraveled < min.distanceTraveled ? e : min));
            } else if (unit.targetStrategy === 'strongest') {
              target = inRange.reduce((max, e) => (e.currentHealth > max.currentHealth ? e : max));
            } else {
              target = inRange.reduce((min, e) => (e.currentHealth < min.currentHealth ? e : min));
            }
          }

          let angle = unit.angle;
          if (target) {
            angle = Math.atan2(target.y - unit.pixelY, target.x - unit.pixelX);

            if (cd <= 0) {
              // Fire!
              cd = 1 / effectiveAtkSpeed;
              sounds.playShoot(bp.projectileType);

              const isSplash = bp.role === 'area' || bp.projectileType === 'shockwave' || bp.projectileType === 'stun';
              const splashRadius = isSplash ? (bp.projectileType === 'shockwave' ? 70 + (unit.level - 1) * 20 : 55 + (unit.level - 1) * 16) : 0;
              const isStunner = bp.projectileType === 'stun' || bp.id === 'golem_magma' || bp.id === 'caballero_cristal';
              const stunDuration = isStunner ? (unit.level >= 3 ? 0.75 : 0.45) : undefined;

              if (bp.projectileType === 'multishot' || bp.id === 'artillero_pesado') {
                // Fire a volley of 3 staggered rounds
                for (let s = -1; s <= 1; s++) {
                  const spreadAngle = angle + s * 0.12;
                  const spreadTargetX = unit.pixelX + Math.cos(spreadAngle) * (effectiveRange * 0.9);
                  const spreadTargetY = unit.pixelY + Math.sin(spreadAngle) * (effectiveRange * 0.9);
                  newProjectiles.push({
                    id: `proj_${Date.now()}_${Math.random()}`,
                    sourceUnitId: unit.instanceId,
                    targetEnemyId: target.instanceId,
                    x: unit.pixelX,
                    y: unit.pixelY,
                    startX: unit.pixelX,
                    startY: unit.pixelY,
                    targetX: s === 0 ? target.x : spreadTargetX,
                    targetY: s === 0 ? target.y : spreadTargetY,
                    speed: 560,
                    damage: Math.round(effectiveDamage * 0.42),
                    splashRadius: 0,
                    type: 'multishot',
                    color: bp.projectileColor
                  });
                }
              } else {
                newProjectiles.push({
                  id: `proj_${Date.now()}_${Math.random()}`,
                  sourceUnitId: unit.instanceId,
                  targetEnemyId: target.instanceId,
                  x: unit.pixelX,
                  y: unit.pixelY,
                  startX: unit.pixelX,
                  startY: unit.pixelY,
                  targetX: target.x,
                  targetY: target.y,
                  speed: bp.projectileType === 'beam' || bp.projectileType === 'lightning' ? 9999 : bp.projectileType === 'arrow' ? 620 : bp.projectileType === 'slash' ? 380 : 450,
                  damage: effectiveDamage,
                  splashRadius,
                  type: bp.projectileType,
                  color: bp.projectileColor,
                  slowDuration:
                    bp.id === 'cryo_mage'
                      ? 2.2
                      : bp.role === 'control' || bp.projectileType === 'spore'
                      ? 2.5
                      : undefined,
                  slowFactor:
                    bp.id === 'cryo_mage'
                      ? unit.level === 1
                        ? 0.65
                        : unit.level === 2
                        ? 0.5
                        : 0.4
                      : bp.role === 'control'
                      ? unit.level >= 3
                        ? 0.3
                        : 0.5
                      : bp.projectileType === 'spore'
                      ? 0.6
                      : undefined,
                  freezeDuration:
                    bp.id === 'cryo_mage'
                      ? unit.level >= 3
                        ? 0.6
                        : undefined
                      : (bp.role === 'control' && unit.level >= 3) || bp.projectileType === 'ice'
                      ? 0.65
                      : undefined,
                  fromCryoMage: bp.id === 'cryo_mage',
                  stunDuration,
                  burnDuration: (bp.role === 'area' && unit.level >= 2) || bp.projectileType === 'fireball' ? 4.0 : undefined,
                  burnDps: (bp.role === 'area' && unit.level >= 2) || bp.projectileType === 'fireball' ? 18 : undefined
                });
              }
            }
          }

          return {
            ...unit,
            angle,
            attackCooldown: cd,
            showdownCooldownTimer: showdownCd,
            showdownReady: isShowdownReady,
            boostedUntil: boostedTime,
            lastTargetId: target ? target.instanceId : null
          };
        });

        if (newProjectiles.length > 0) {
          setProjectiles((prev) => [...prev, ...newProjectiles]);
        }

        return updatedUnits;
      });

      // 5. Update Projectiles
      setProjectiles((prevProj) => {
        const remaining: Projectile[] = [];
        const currentEnemies = stateRef.current.activeEnemies;

        for (const p of prevProj) {
          // If beam (railgun), hits instantly
          if (p.type === 'beam') {
            applyHit(p, p.targetX, p.targetY);
            continue;
          }

          // Find current position of target if still alive
          const target = currentEnemies.find((e) => e.instanceId === p.targetEnemyId);
          const destX = target ? target.x : p.targetX;
          const destY = target ? target.y : p.targetY;

          const dx = destX - p.x;
          const dy = destY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const step = p.speed * dt;

          if (dist <= step || dist < 12) {
            // Hit!
            applyHit(p, destX, destY);
          } else {
            remaining.push({
              ...p,
              x: p.x + (dx / dist) * step,
              y: p.y + (dy / dist) * step,
              targetX: destX,
              targetY: destY
            });
          }
        }

        return remaining;
      });

      // 6. Projectile Hit & Enemy Health Application
      const applyHit = (proj: Projectile, hitX: number, hitY: number) => {
        sounds.playHit(proj.splashRadius > 0);

        // Spawn hit particles
        const newParticles: Particle[] = [];
        for (let i = 0; i < 6; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 30 + Math.random() * 80;
          newParticles.push({
            x: hitX,
            y: hitY,
            vx: Math.cos(a) * spd,
            vy: Math.sin(a) * spd,
            life: 0.35,
            maxLife: 0.35,
            size: 2.5 + Math.random() * 3,
            color: proj.color,
            alpha: 1
          });
        }
        setParticles((p) => [...p, ...newParticles]);

        // Identify the firing unit
        const sourceUnit = stateRef.current.placedUnits.find((u) => u.instanceId === proj.sourceUnitId);
        const sourceBp = sourceUnit ? UNITS[sourceUnit.blueprintId] : null;

        setActiveEnemies((prevEnemies) =>
          prevEnemies
            .map((enemy) => {
              const dx = enemy.x - hitX;
              const dy = enemy.y - hitY;
              const distSq = dx * dx + dy * dy;

              const isDirect = enemy.instanceId === proj.targetEnemyId;
              const inSplash = proj.splashRadius > 0 && distSq <= proj.splashRadius * proj.splashRadius;

              if (isDirect || inSplash) {
                let hitDamage = proj.damage;
                // Asesina Carmesí deals bonus damage against bosses and high-health targets
                if (sourceBp?.id === 'asesina_carmesi' && (enemy.isBoss || enemy.currentHealth > 500)) {
                  hitDamage *= 1.75;
                }

                // Ninja Sombrío ignores 75% enemy armor
                const effectiveArmor = sourceBp?.id === 'ninja_sombrio' ? Math.floor(enemy.armor * 0.25) : enemy.armor;
                const netDamage = Math.max(2, hitDamage - effectiveArmor);

                // Kinetic shield absorbs damage first; Hacker Cibernético strips shields 2.2x faster
                const prevShield = enemy.shield || 0;
                const shieldBreakMult = sourceBp?.id === 'hacker_cibernetico' ? 2.2 : 1.0;
                const shieldDamage = prevShield > 0 ? Math.min(prevShield, netDamage * shieldBreakMult) : 0;
                const nextShield = Math.max(0, prevShield - shieldDamage);
                const overflowDamage = prevShield > 0 ? Math.max(0, netDamage - shieldDamage / shieldBreakMult) : netDamage;
                const nextHp = enemy.currentHealth - overflowDamage;

                // Add damage number
                setDamageNumbers((nums) => [
                  ...nums,
                  {
                    id: `num_${Date.now()}_${Math.random()}`,
                    x: enemy.x + (Math.random() * 16 - 8),
                    y: enemy.y - 12,
                    value: Math.round(netDamage),
                    life: 0.6,
                    maxLife: 0.6,
                    color: prevShield > 0 ? '#38BDF8' : proj.color,
                    isCrit: netDamage > 80
                  }
                ]);

                // Update unit stats
                setPlacedUnits((units) =>
                  units.map((u) =>
                    u.instanceId === proj.sourceUnitId
                      ? {
                          ...u,
                          damageDealt: u.damageDealt + netDamage,
                          kills: nextHp <= 0 ? u.kills + 1 : u.kills
                        }
                      : u
                  )
                );

                if (nextHp <= 0) {
                  registerEnemyKill(enemy);
                  // Alquimista Dorado generates +2 bonus gold per kill
                  if (sourceBp?.id === 'alquimista_dorado') {
                    setGold((g) => g + 2);
                    setEarnedGoldInMatch((e) => e + 2);
                    setTotalGoldEarned((g) => g + 2);
                  }
                }

                // Knockback for Cañonero Pirata
                let newDist = enemy.distanceTraveled;
                if (sourceBp?.id === 'canonero_pirata') {
                  const pushback = 20 + (sourceUnit ? sourceUnit.level * 8 : 0);
                  newDist = Math.max(0, enemy.distanceTraveled - pushback);
                }

                // Armor strip and elemental cancellation for Hacker Cibernético
                let newArmor = enemy.armor;
                let newAura = enemy.elementalAura;
                if (sourceBp?.id === 'hacker_cibernetico') {
                  newArmor = Math.max(0, enemy.armor - 4);
                  newAura = undefined;
                }

                // Guardian de Hielo freezes on hit; bosses resist 65% of hard stun/freeze duration
                // Criomago Glacial can only paralyze/freeze each enemy ONCE and for shorter duration
                const isCryoShot = !!proj.fromCryoMage || sourceBp?.id === 'cryo_mage';
                const extraFreeze = sourceBp?.id === 'guardian_hielo' ? 0.55 : 0;
                const ccResistance = enemy.isBoss ? 0.35 : 1.0;

                const rawFreezeFromProj = isCryoShot
                  ? !enemy.cryoParalyzed
                    ? proj.freezeDuration || 0
                    : 0
                  : Math.max(extraFreeze, proj.freezeDuration || 0);

                // Stun / freeze duration from projectile
                const effectiveFreeze = Math.max(rawFreezeFromProj, proj.stunDuration || 0) * ccResistance;
                const appliedCryoFreeze = isCryoShot && !enemy.cryoParalyzed && (proj.freezeDuration || 0) > 0;

                return {
                  ...enemy,
                  currentHealth: nextHp,
                  shield: nextShield,
                  armor: newArmor,
                  elementalAura: newAura,
                  distanceTraveled: newDist,
                  slowUntil: proj.slowDuration ? Math.max(enemy.slowUntil, proj.slowDuration) : enemy.slowUntil,
                  slowMultiplier: proj.slowFactor ? proj.slowFactor : enemy.slowMultiplier,
                  freezeUntil: effectiveFreeze > 0 ? Math.max(enemy.freezeUntil, effectiveFreeze) : enemy.freezeUntil,
                  cryoParalyzed: enemy.cryoParalyzed || appliedCryoFreeze,
                  burnUntil: proj.burnDuration ? Math.max(enemy.burnUntil, proj.burnDuration) : enemy.burnUntil,
                  burnDps: proj.burnDps ? proj.burnDps : enemy.burnDps
                };
              }

              return enemy;
            })
            .filter((e) => e.currentHealth > 0)
        );
      };

      // 7. Update Particles
      setParticles((prevP) =>
        prevP
          .map((p) => ({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt,
            life: p.life - dt,
            alpha: Math.max(0, (p.life - dt) / p.maxLife)
          }))
          .filter((p) => p.life > 0)
      );

      // 8. Update Damage Numbers
      setDamageNumbers((prevNums) =>
        prevNums
          .map((n) => ({
            ...n,
            y: n.y - 30 * dt,
            life: n.life - dt
          }))
          .filter((n) => n.life > 0)
      );

      // 9. Check Wave Completion
      if (state.isWaveActive) {
        const spawner = waveSpawnerRef.current;
        if (spawner.isDoneSpawning && stateRef.current.activeEnemies.length === 0) {
          // Wave Complete!
          setIsWaveActive(false);
          sounds.playWaveClear();

          // Calculate economic yields from placed economy units (Alchemists & Fénix Áureo)
          const isBossWaveNow = getWaveConfig(currentWave).isBossWave;
          const isToughWave = currentWave >= 8;
          let alchemistYield = 0;
          stateRef.current.placedUnits.forEach((u) => {
            const bp = UNITS[u.blueprintId];
            if (bp && bp.role === 'economia') {
              const tier = getInMatchUnitTier(bp, u.level);
              let yieldVal = tier.ecoYield || 0;
              // Fénix Áureo, el Renacido — Habilidad Tributo de Ceniza:
              // Produce recompensas mayores en rondas difíciles (+50%) y de jefe (+150%)
              if (bp.id === 'fenix_golden_phoenix') {
                if (isBossWaveNow) {
                  yieldVal = Math.floor(yieldVal * 2.5); // Bonificación masiva de jefe
                } else if (isToughWave) {
                  yieldVal = Math.floor(yieldVal * 1.5); // Bonificación de ronda difícil
                }
              }
              alchemistYield += yieldVal;
            }
          });

          const rewardGold = spawner.config.rewardGold;
          const totalRoundGold = rewardGold + alchemistYield;

          // Nanobots de Médico de Combate: restaura +1 vida al Núcleo al terminar la oleada
          const hasCombatMedicPlaced = stateRef.current.placedUnits.some(
            (u) => UNITS[u.blueprintId]?.id === 'medico_combate'
          );
          if (hasCombatMedicPlaced) {
            setBaseHealth((hp) => Math.min(maxBaseHealth, hp + 1));
          }

          setGold((g) => g + totalRoundGold);
          setEarnedGoldInMatch((e) => e + totalRoundGold);
          setTotalGoldEarned((g) => g + totalRoundGold);

          // Automatically save balanced Vault Coins reward on every completed wave (keeps arena gold intact too)
          const savedCoinsEarned = Math.max(10, Math.round(totalRoundGold * 0.25)) + (isBossWaveNow ? 20 : 0);

          // Update Story Mode Missions on Wave Clear
          setMissions((missionsList) =>
            missionsList.map((m) => {
              if (
                m.id === 'mission_first_battle' ||
                m.id === 'mission_wave_5' ||
                m.id === 'mission_wave_15' ||
                m.id === 'mission_eclipse_victory'
              ) {
                const nextCount = Math.max(m.currentCount, currentWave);
                return { ...m, currentCount: nextCount, completed: nextCount >= m.targetCount };
              }
              if (m.id === 'mission_wealth') {
                const nextCount = m.currentCount + totalRoundGold;
                return { ...m, currentCount: nextCount, completed: nextCount >= m.targetCount };
              }
              return m;
            })
          );

          // Update persistent lifetime stats, Vault Coins, wave records, and milestones on user's device
          setProgression((p) => {
            const nextWaves = (p.lifetimeWaves || 0) + 1;
            const nextGold = (p.lifetimeGold || 0) + totalRoundGold;
            const nextHighScore = Math.max(p.highScoreWave || 0, currentWave);
            const currentArenaBests = p.arenaBestWaves || {};
            const nextArenaBests = {
              ...currentArenaBests,
              [currentMap.id]: Math.max(currentArenaBests[currentMap.id] || 0, currentWave)
            };
            // User request: Ganas 1 sobre por cada 10 rondas!
            const bonusPacks = currentWave % 10 === 0 ? 1 : 0;
            const bonusSkillPoints = currentWave % 10 === 0 ? 40 : 0;

            return {
              ...p,
              savedCoins: (p.savedCoins ?? 0) + savedCoinsEarned,
              lifetimeWaves: nextWaves,
              lifetimeGold: nextGold,
              highScoreWave: nextHighScore,
              arenaBestWaves: nextArenaBests,
              unopenedPacks: p.unopenedPacks + bonusPacks,
              skillPoints: p.skillPoints + bonusSkillPoints
            };
          });

          // User request: Partida Infinita (sin corte de victoria)
          setSummaryData({
            waveNumber: currentWave,
            rewardGold,
            alchemistYield,
            enemiesDefeated: spawner.waveKills,
            savedCoinsEarned
          });
        }
      }
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [viewState, currentWave, totalWaves, autoWave]);

  const selectedUnit = placedUnits.find((u) => u.instanceId === selectedUnitId) || null;
  const currentBlueprint = selectedBlueprintId ? UNITS[selectedBlueprintId] : null;
  const canAffordPlacement = currentBlueprint ? gold >= currentBlueprint.cost : false;

  const claimableMissionsCount = missions.filter((m) => m.completed && !m.claimed).length;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-1 sm:p-2.5 md:p-3.5 pb-6 select-none font-sans">
      {/* 100-Kill Milestone Toast Notification */}
      {killToast && (
        <div className="fixed top-4 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 border-2 border-amber-300 text-white font-black text-sm shadow-2xl shadow-purple-950/80 animate-bounce flex items-center gap-2.5">
          <span className="text-xl">🎁</span>
          <span>{killToast}</span>
        </div>
      )}

      {/* Dynamic View: Top Navigation between Cartas and Jugar */}
      {activeBottomTab === 'CARDS' ? (
        /* CARTAS, TIENDA, MAZO, SOBRES, MISIONES, CÓDICE */
        <CardsHub
          progression={progression}
          missions={missions}
          currentWave={currentWave}
          requestedSubTab={cardsHubSubTab}
          onConsumeRequestedSubTab={() => setCardsHubSubTab(null)}
          onUpgradeCharacter={handleUpgradeCharacter}
          onClaimMission={handleClaimMission}
          onClaimAllMissions={handleClaimAllMissions}
          onOpenPack={handleOpenPack}
          onToggleDeckCard={handleToggleDeckCard}
          onBuyCardWithCoins={handleBuyCardWithCoins}
          onBuyPackWithCoins={handleBuyPackWithCoins}
          onBuyPackBundleWithCoins={handleBuyPackBundleWithCoins}
          onBuyAndOpenPackTier={handleBuyAndOpenPackTier}
          onBuySkillPointsWithCoins={handleBuySkillPointsWithCoins}
          freeShopUntil={freeShopUntil}
          onRedeemCheatCode={handleRedeemCheatCode}
          onSwitchToBattle={() => {
            setActiveBottomTab('BATTLE');
            setShowMapSelectModal(true);
          }}
        />
      ) : (
        /* RIGHT MENU: JUGAR / BATALLA (ARENA DE COMBATE INFINITA) */
        <div className="w-full max-w-[1680px] flex flex-col gap-2.5">
          {/* Top HUD with Story Mode and in-game controls */}
          <HUD
            baseHealth={baseHealth}
            maxBaseHealth={maxBaseHealth}
            gold={gold}
            savedCoins={progression.savedCoins ?? 0}
            bankableGold={Math.floor(Math.min(gold, earnedGoldInMatch) * 0.5)}
            waveHpMult={getWaveScaling(currentWave, getArenaByMapId(currentMap.id).arenaLevel, difficulty).hpMult}
            currentWave={currentWave}
            totalWaves={totalWaves}
            isWaveActive={isWaveActive}
            enemiesRemaining={activeEnemies.length}
            gameSpeed={gameSpeed}
            isBossWave={getWaveConfig(currentWave).isBossWave}
            mapName={currentMap.name}
            arenaName={getArenaByMapId(currentMap.id).name}
            arenaBadge={getArenaByMapId(currentMap.id).badge}
            arenaRoundsRequired={getArenaByMapId(currentMap.id).roundsRequired}
            arenaDifficulty={`Tier ${getArenaByMapId(currentMap.id).arenaLevel}`}
            killsTowardsNextPack={progression.killsTowardsNextPack || 0}
            killsRequiredForNextPack={getKillsRequiredForPack(progression.packsClaimedFromKills || 0)}
            packsClaimed={progression.packsClaimedFromKills || 0}
            unopenedPacks={progression.unopenedPacks}
            skillPoints={progression.skillPoints}
            claimableMissionsCount={claimableMissionsCount}
            totalKills={totalKills}
            activeBottomTab={activeBottomTab}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            onSelectTab={setActiveBottomTab}
            onOpenMapSelect={() => setShowMapSelectModal(true)}
            onStartWave={handleStartWave}
            onSetGameSpeed={setGameSpeed}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            isMusicMuted={isMusicMuted}
            onToggleMusic={handleToggleMusic}
            autoWave={autoWave}
            onToggleAutoWave={() => setAutoWave(!autoWave)}
            onOpenAlmanac={() => {
              setCardsHubSubTab('ALMANAC');
              setActiveBottomTab('CARDS');
            }}
            onOpenArmory={() => {
              setCardsHubSubTab('DECK');
              setActiveBottomTab('CARDS');
            }}
            onOpenMissions={() => {
              setCardsHubSubTab('MISSIONS');
              setActiveBottomTab('CARDS');
            }}
            onOpenPacks={() => {
              setCardsHubSubTab('PACKS');
              setActiveBottomTab('CARDS');
            }}
            onOpenShop={() => {
              setCardsHubSubTab('SHOP');
              setActiveBottomTab('CARDS');
            }}
            onBankCoins={handleBankMatchCoins}
            onOpenMenu={() => setShowMapSelectModal(true)}
          />

          {/* Central Arena Canvas */}
          <div className="w-full flex flex-col items-center justify-center relative">
            <GameCanvas
              map={effectiveMap}
              placedUnits={placedUnits}
              activeEnemies={activeEnemies}
              projectiles={projectiles}
              particles={particles}
              damageNumbers={damageNumbers}
              selectedUnit={selectedUnit}
              placementBlueprintId={selectedBlueprintId}
              activeToolId={activeToolId}
              hoverTile={hoverTile}
              baseHealth={baseHealth}
              maxBaseHealth={maxBaseHealth}
              activeShowdownVFX={activeShowdownVFX}
              onTileClick={handleTileClick}
              onSelectUnit={(u) => setSelectedUnitId(u ? u.instanceId : null)}
              onTriggerShowdown={handleTriggerShowdown}
              onHoverTileChange={setHoverTile}
              canAffordPlacement={canAffordPlacement}
            />
          </div>

          {/* Tactical Tools Bar (unlocked progressively by Arena) */}
          <ToolsBar
            highestArenaUnlocked={progression.highestArenaUnlocked || 1}
            activeToolId={activeToolId}
            toolCooldowns={toolCooldowns}
            onSelectTool={handleSelectTool}
            onCancelTool={() => setActiveToolId(null)}
          />

          {/* Quick-Cast Showdown Bar: 1-Click activation + [Q] + Auto-Showdown */}
          {placedUnits.length > 0 && (() => {
            const showdownCapable = placedUnits
              .map((u) => {
                const bp = UNITS[u.blueprintId];
                const cardLv = progression.cardMasteryLevels[u.blueprintId] || 1;
                const unlocked = canUseUnitShowdown(cardLv, u.level);
                return { u, bp, unlocked };
              })
              .filter((item) => item.bp && item.unlocked)
              .sort((a, b) => {
                if (a.u.showdownReady !== b.u.showdownReady) return a.u.showdownReady ? -1 : 1;
                return a.u.showdownCooldownTimer - b.u.showdownCooldownTimer;
              });

            const readyCount = showdownCapable.filter((x) => x.u.showdownReady).length;

            return (
              <div className="w-full bg-slate-900/95 border border-slate-800 rounded-2xl px-3 py-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 shrink-0 whitespace-nowrap">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Showdowns [Q]</span>
                  </div>

                  {showdownCapable.length === 0 ? (
                    <span className="text-[11px] text-slate-400 truncate">
                      Sube una unidad a Nivel 3 en la arena (o su carta a Nv.3) para lanzar su Showdown en un clic.
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      {showdownCapable.map(({ u, bp }) => (
                        <button
                          key={`qs_${u.instanceId}`}
                          onClick={() => {
                            if (u.showdownReady) {
                              handleTriggerShowdown(u.instanceId);
                            } else {
                              setSelectedUnitId(u.instanceId);
                            }
                          }}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                            u.showdownReady
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-sm'
                              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                          }`}
                          title={
                            u.showdownReady
                              ? `Activar ${bp!.showdownName} ahora`
                              : `${bp!.showdownName} recargando (${Math.ceil(u.showdownCooldownTimer)}s)`
                          }
                        >
                          <span className="truncate max-w-[115px]">{bp!.name}</span>
                          <span className="font-mono tabular-nums opacity-85">
                            {u.showdownReady ? '¡LISTO!' : `${Math.ceil(u.showdownCooldownTimer)}s`}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {showdownCapable.length > 0 && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {readyCount >= 2 && (
                      <button
                        onClick={handleTriggerAllReadyShowdowns}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-[11px] cursor-pointer whitespace-nowrap"
                      >
                        Lanzar Todos ({readyCount})
                      </button>
                    )}

                    <button
                      onClick={() => setAutoShowdown((v) => !v)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                        autoShowdown
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                      title="Activa automáticamente los Showdowns cuando estén listos en combate"
                    >
                      {autoShowdown ? 'Auto: ON' : 'Auto: OFF'}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Dynamic Context Panel: Inspector if a unit is clicked, otherwise Unit Shop */}
          {selectedUnit ? (
            <UnitInspector
              unit={selectedUnit}
              cardLevel={progression.cardMasteryLevels[selectedUnit.blueprintId] || 1}
              currentGold={gold}
              onUpgradeUnit={handleUpgradeUnit}
              onSellUnit={handleSellUnit}
              onChangeStrategy={handleChangeStrategy}
              onTriggerShowdown={handleTriggerShowdown}
              onClose={() => setSelectedUnitId(null)}
              onOpenArmory={() => setActiveBottomTab('CARDS')}
            />
          ) : (
            <UnitShop
              currentGold={gold}
              selectedBlueprintId={selectedBlueprintId}
              activeDeckCardIds={progression.activeDeckCardIds || progression.unlockedCardIds.slice(0, 7)}
              cardMasteryLevels={progression.cardMasteryLevels}
              placedUnits={placedUnits}
              onSelectBlueprint={(id) => {
                setSelectedBlueprintId(id);
                setSelectedUnitId(null);
                setActiveToolId(null);
              }}
              onOpenArmory={() => setActiveBottomTab('CARDS')}
            />
          )}
        </div>
      )}

      {/* Modals: Clean 2-screen architecture */}
      {summaryData && (
        <RoundSummaryModal
          waveNumber={summaryData.waveNumber}
          rewardGold={summaryData.rewardGold}
          alchemistYield={summaryData.alchemistYield}
          enemiesDefeated={summaryData.enemiesDefeated}
          savedCoinsEarned={summaryData.savedCoinsEarned}
          packRewardGranted={summaryData.waveNumber % 10 === 0}
          onNextRound={handleNextRound}
        />
      )}

      {/* Animated Arena Unlock Ceremony: Arenas Menu Slide + Padlock Vibration/Break + Message + Gift Character -> Continue Playing */}
      {arenaPromotion && (
        <ArenaUnlockCeremonyModal
          arena={arenaPromotion.arena}
          completedArena={
            ARENAS.find((a) => a.arenaLevel === arenaPromotion.completedArenaLevel) || ARENAS[0]
          }
          giftedUnit={arenaPromotion.giftedUnit}
          divinityUnit={getDivinityForArena(arenaPromotion.completedArenaLevel) || null}
          unlockedTool={getToolUnlockedAtArena(arenaPromotion.arena.arenaLevel)}
          coinsEarned={arenaPromotion.coinsEarned}
          onContinuePlaying={() => handleProceedToNextArena(arenaPromotion.arena)}
        />
      )}

      {/* 15 Arenas Carousel Menu Modal */}
      {showMapSelectModal && (
        <MapSelectModal
          currentMapId={currentMap.id}
          highestArenaUnlocked={progression.highestArenaUnlocked || 1}
          onSelectAndStart={(selectedArena, chosenDifficulty) => {
            setShowMapSelectModal(false);
            if (selectedArena.map.id !== currentMap.id) {
              // Automatically bank 50% of earned gold from previous arena and gift new-arena hero if not yet claimed
              const rawBankableSwitch = Math.min(gold, earnedGoldInMatch);
              const bankableSwitch = Math.floor(rawBankableSwitch * 0.5);
              const targetLvl = selectedArena.arenaLevel;
              const notYetGifted = targetLvl > 1 && !(progression.giftedArenaLevels || [1]).includes(targetLvl);
              const arrivalGift = notYetGifted ? getArenaGiftCharacter(targetLvl, progression.unlockedCardIds) : null;

              if (bankableSwitch > 0 || arrivalGift) {
                setProgression((p) => {
                  let nextUnlocked = p.unlockedCardIds;
                  let nextDeck = p.activeDeckCardIds || [];
                  const nextGifted = arrivalGift
                    ? Array.from(new Set([...(p.giftedArenaLevels || [1]), targetLvl]))
                    : p.giftedArenaLevels || [1];

                  if (arrivalGift && !nextUnlocked.includes(arrivalGift.id)) {
                    nextUnlocked = [...nextUnlocked, arrivalGift.id];
                    if (nextDeck.length < 7 && !nextDeck.includes(arrivalGift.id)) {
                      nextDeck = [...nextDeck, arrivalGift.id];
                    }
                  }

                  return {
                    ...p,
                    savedCoins: (p.savedCoins ?? 0) + bankableSwitch,
                    unlockedCardIds: nextUnlocked,
                    activeDeckCardIds: nextDeck,
                    giftedArenaLevels: nextGifted
                  };
                });

                if (arrivalGift) {
                  setKillToast(`🎁 ¡Llegaste a ${selectedArena.name}! Recibes gratis a ${arrivalGift.name}.`);
                  setTimeout(() => setKillToast(null), 4200);
                } else if (bankableSwitch > 0) {
                  setKillToast(`💰 ¡+${bankableSwitch} monedas guardadas en tu Bóveda al cambiar de arena!`);
                  setTimeout(() => setKillToast(null), 3200);
                }
              }
              setCurrentMap(selectedArena.map);
              detailedPathRef.current = calculateDetailedPath(selectedArena.map);
              // User request: "Cada vez que pazes de arena, se reinician tus rondas y los personajes que tenias"
              setCurrentWave(1);
              setPlacedUnits([]);
              setActiveEnemies([]);
              setProjectiles([]);
              setParticles([]);
              setDamageNumbers([]);
              setSelectedBlueprintId(null);
              setSelectedUnitId(null);
              setHoverTile(null);
              setActiveToolId(null);
              setRemovedObstacles([]);
              setToolCooldowns(INITIAL_TOOL_COOLDOWNS);
              setBaseHealth(10);
              setMaxBaseHealth(10);
              setGold(260 + (selectedArena.arenaLevel - 1) * 35);
              setEarnedGoldInMatch(0);
              setAutoBankedCoinsInMatch(0);
            }
            setDifficulty(chosenDifficulty);
            setActiveBottomTab('BATTLE');
            sounds.playWaveStart();
          }}
          onClose={() => setShowMapSelectModal(false)}
        />
      )}

      {viewState === 'GAME_OVER' && (
        <GameOverModal
          isVictory={false}
          waveReached={currentWave}
          totalWaves={totalWaves}
          totalKills={totalKills}
          totalGoldEarned={totalGoldEarned}
          savedCoinsBalance={progression.savedCoins ?? 0}
          autoBankedCoins={autoBankedCoinsInMatch}
          mapName={currentMap.name}
          highScoreWave={progression.highScoreWave || currentWave}
          onRestart={handleRestartInfiniteMatch}
          onGoToCards={() => {
            setViewState('PLAYING');
            setCardsHubSubTab('SHOP');
            setActiveBottomTab('CARDS');
          }}
        />
      )}
    </div>
  );
}
