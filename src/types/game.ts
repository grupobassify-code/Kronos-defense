export type UnitRole = 'ataque' | 'area' | 'control' | 'economia' | 'soporte' | 'invocador' | 'multiplicador' | 'especial';

export type UnitRarity = 'comun' | 'especial' | 'rara' | 'epica' | 'legendaria' | 'divinidad';

export type TargetStrategy = 'first' | 'last' | 'strongest' | 'weakest';

export interface UpgradeTier {
  name: string;
  cost: number;
  damage: number;
  range: number;
  attackSpeed: number; // Attacks per second
  description: string;
  bonusEffect?: string;
  ecoYield?: number; // For economic units: gold per round
}

export interface UnitBlueprint {
  id: string;
  name: string;
  title: string;
  role: UnitRole;
  rarity: UnitRarity;
  cost: number;
  baseDamage: number;
  baseRange: number; // in pixels
  baseAttackSpeed: number; // shots per sec
  projectileType:
    | 'laser'
    | 'bullet'
    | 'fireball'
    | 'ice'
    | 'beam'
    | 'coin'
    | 'resonance'
    | 'stun'
    | 'multishot'
    | 'shockwave'
    | 'slash'
    | 'arrow'
    | 'lightning'
    | 'spore'
    | 'missile'
    | 'portal';
  projectileColor: string;
  description: string;
  showdownName: string;
  showdownDescription: string;
  showdownCooldown: number; // in seconds
  imageUrl?: string;
  showdownImageUrl?: string;
  tiers: [UpgradeTier, UpgradeTier, UpgradeTier]; // Level 1 (base), Level 2, Level 3
  arenaUnlockLevel?: number; // Minimum arena level required to unlock this card (e.g. 1 to 15 for Divinities)
  colorTheme: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
  };
}

export interface PlacedUnit {
  instanceId: string;
  blueprintId: string;
  gridX: number;
  gridY: number;
  pixelX: number;
  pixelY: number;
  level: number; // 1, 2, or 3
  totalInvestment: number;
  damageDealt: number;
  kills: number;
  targetStrategy: TargetStrategy;
  attackCooldown: number; // timer in seconds
  showdownCooldownTimer: number; // seconds remaining, 0 when ready
  showdownReady: boolean;
  angle: number; // radians facing target
  lastTargetId: string | null;
  boostedUntil?: number; // timestamp or remaining sec
}

export type EnemyType =
  | 'scout'
  | 'soldier'
  | 'tank'
  | 'swarm'
  | 'special'
  | 'boss_goliath'
  | 'boss_eclipse'
  | 'pyro_golem'
  | 'magma_fiend'
  | 'cyber_dreadnought'
  | 'void_reaver'
  | 'boss_infernal';

export interface EnemyBlueprint {
  id: EnemyType;
  name: string;
  description: string;
  baseHealth: number;
  speed: number; // pixels per sec
  armor: number; // flat damage reduction
  goldReward: number;
  coreDamage: number; // damage to base
  size: number; // radius in px
  color: string;
  accentColor: string;
  isBoss?: boolean;
  specialAbility?: string;
  imageUrl?: string;
}

export interface ActiveEnemy {
  instanceId: string;
  type: EnemyType;
  name: string;
  currentHealth: number;
  maxHealth: number;
  speed: number;
  baseSpeed: number;
  armor: number;
  goldReward: number;
  coreDamage: number;
  size: number;
  color: string;
  accentColor: string;
  isBoss: boolean;
  // Navigation along path
  waypointIndex: number;
  x: number;
  y: number;
  distanceTraveled: number;
  // Status effects
  slowUntil: number; // seconds remaining
  slowMultiplier: number;
  freezeUntil: number; // seconds remaining
  burnUntil: number; // seconds remaining
  burnDps: number;
  shield?: number;
  angle: number;
  elementalAura?: 'fire' | 'cyber' | 'void' | 'ice';
  arenaLevel?: number;
}

export interface Projectile {
  id: string;
  sourceUnitId: string;
  targetEnemyId: string;
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  speed: number;
  damage: number;
  splashRadius: number; // 0 if single target
  type:
    | 'laser'
    | 'bullet'
    | 'fireball'
    | 'ice'
    | 'beam'
    | 'coin'
    | 'resonance'
    | 'stun'
    | 'multishot'
    | 'shockwave'
    | 'slash'
    | 'arrow'
    | 'lightning'
    | 'spore'
    | 'missile'
    | 'portal';
  color: string;
  // Effects to apply
  slowDuration?: number;
  slowFactor?: number;
  freezeDuration?: number;
  burnDuration?: number;
  burnDps?: number;
  stunDuration?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  shape?: 'circle' | 'square' | 'spark' | 'ring';
}

export interface DamageNumber {
  id: string;
  x: number;
  y: number;
  value: number;
  life: number;
  maxLife: number;
  color: string;
  isCrit?: boolean;
}

export interface GridTile {
  x: number;
  y: number;
  type: 'path' | 'buildable' | 'obstacle' | 'spawn' | 'base';
  pathIndex?: number;
}

export interface MapData {
  id: string;
  name: string;
  difficultyRating: string;
  description: string;
  cols: number;
  rows: number;
  tileSize: number;
  bgImageUrl?: string;
  pathWaypoints: { x: number; y: number }[]; // Grid coordinates
  obstacles: { x: number; y: number }[];
  theme: {
    bg: string;
    pathColor: string;
    pathBorder: string;
    gridLine: string;
    buildableBg: string;
    buildableHover: string;
  };
}

export interface WaveSegment {
  enemyType: EnemyType;
  count: number;
  interval: number; // delay between spawns in seconds
  initialDelay: number; // delay before this segment starts in seconds
}

export interface WaveConfig {
  waveNumber: number;
  rewardGold: number;
  segments: WaveSegment[];
  isBossWave?: boolean;
  bossTitle?: string;
}

export type GameSpeed = 0 | 1 | 2 | 3; // 0 = Paused, 1x, 2x, 3x

export type ViewState =
  | 'MENU'
  | 'PLAYING'
  | 'WAVE_CLEAR'
  | 'GAME_OVER'
  | 'VICTORY'
  | 'ALMANAC'
  | 'ARMORY'
  | 'PACK_OPEN'
  | 'MISSIONS';

export interface Mission {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  claimed: boolean;
  rewardPacks: number;
  category: 'story' | 'combat' | 'economy';
}

export interface PackReward {
  type: 'card' | 'skill_points';
  cardId?: string;
  cardName?: string;
  rarity?: UnitRarity;
  skillPoints?: number;
  isDuplicate?: boolean;
}

export interface PlayerProgression {
  unlockedCardIds: string[]; // Initially ['vanguard_solar', 'pyromancer', 'cryo_mage']
  activeDeckCardIds: string[]; // Battle deck of up to 7 cards selected by the player
  cardMasteryLevels: Record<string, number>; // Level 1 to 10
  skillPoints: number; // For upgrading levels
  unopenedPacks: number; // Number of booster packs
  completedMissionIds: string[];
  claimedMissionIds: string[];
  lifetimeKills: number;
  lifetimeWaves: number;
  lifetimeGold: number;
  currentStoryChapter: number;
  highestArenaUnlocked: number; // 1 to 15 (Arena 1 initially unlocked, Arena 2 requires passing Arena 1)
  killsTowardsNextPack: number; // Progress towards current booster pack (100, 200, 250, etc.)
  packsClaimedFromKills: number; // Total booster packs awarded via kill milestones
  highScoreWave?: number; // Highest wave reached across all matches
  arenaBestWaves?: Record<string, number>; // Highest wave record per arena map id
  totalMatchesPlayed?: number; // Total matches initiated
  lastSavedTimestamp?: number; // Timestamp of last local save
  settings?: {
    musicEnabled: boolean;
    musicVolume: number;
    sfxMuted: boolean;
    autoWave: boolean;
    gameSpeed: number;
  };
}
