import { PlayerProgression, PackReward, Mission, UnitBlueprint, UpgradeTier, ShopPackDefinition, ShopPackTierId } from '../types/game';
import { UNITS } from '../data/units';
import { INITIAL_MISSIONS } from '../data/missions';

const STORAGE_KEY = 'chronos_defense_save_v1';

export const LEVEL_UP_COSTS: Record<number, number> = {
  1: 20,
  2: 30,
  3: 45,
  4: 60,
  5: 80,
  6: 105,
  7: 135,
  8: 170,
  9: 220
};

/**
 * User request:
 * "haz que los sobres tipo el primero ocupo 100 enemigos derrotados el 2 200 el 3 250, que se vallan aumentando un poco mas"
 * Progressive kills required for each consecutive booster pack:
 */
export const PACK_KILL_REQUIREMENTS: number[] = [
  100, 200, 250, 310, 380, 460, 550, 650, 760, 880, 1010, 1150, 1300, 1460, 1630
];

export function getKillsRequiredForPack(packIndex: number): number {
  const safeIdx = Math.max(0, packIndex);
  if (safeIdx < PACK_KILL_REQUIREMENTS.length) {
    return PACK_KILL_REQUIREMENTS[safeIdx];
  }
  const last = PACK_KILL_REQUIREMENTS[PACK_KILL_REQUIREMENTS.length - 1];
  const extraPacks = safeIdx - PACK_KILL_REQUIREMENTS.length + 1;
  return last + extraPacks * 180;
}

const defaultMasteryLevels: Record<string, number> = Object.keys(UNITS).reduce((acc, id) => {
  acc[id] = 1;
  return acc;
}, {} as Record<string, number>);

export const INITIAL_PROGRESSION: PlayerProgression = {
  // Starts with Vanguardia Solar, Piromante, Criomago and Zeker
  unlockedCardIds: ['vanguard_solar', 'pyromancer', 'cryo_mage', 'zeker'],
  // Battle deck holds up to 7 cards (starts with the 4 starter heroes)
  activeDeckCardIds: ['vanguard_solar', 'pyromancer', 'cryo_mage', 'zeker'],
  cardMasteryLevels: defaultMasteryLevels,
  skillPoints: 50,
  savedCoins: 180,
  unopenedPacks: 2, // Welcome packs so player can test pulling new cards immediately
  completedMissionIds: [],
  claimedMissionIds: [],
  lifetimeKills: 0,
  lifetimeWaves: 0,
  lifetimeGold: 0,
  currentStoryChapter: 1,
  highestArenaUnlocked: 1, // Arena 1 initially; Arena 2 requires passing Arena 1!
  completedArenaLevels: [],
  giftedArenaLevels: [1],
  killsTowardsNextPack: 0, // Kills accumulated for current pack
  packsClaimedFromKills: 0, // Total packs earned via kill milestones
  highScoreWave: 0,
  arenaBestWaves: {},
  totalMatchesPlayed: 0,
  lastSavedTimestamp: Date.now(),
  settings: {
    musicEnabled: true,
    musicVolume: 0.35,
    sfxMuted: false,
    autoWave: false,
    gameSpeed: 1
  }
};

export function loadProgression(): { progression: PlayerProgression; missions: Mission[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return { progression: INITIAL_PROGRESSION, missions: INITIAL_MISSIONS };
      }

      const rawProg = parsed.progression && typeof parsed.progression === 'object' ? parsed.progression : {};
      const validUnlocked = Array.isArray(rawProg.unlockedCardIds)
        ? rawProg.unlockedCardIds.filter((id: unknown): id is string => typeof id === 'string' && Boolean(UNITS[id]))
        : [];
      const unlockedBase = validUnlocked.length > 0 ? validUnlocked : INITIAL_PROGRESSION.unlockedCardIds;
      // Ensure starter hero 'zeker' is unlocked for all players from the start
      const unlocked = unlockedBase.includes('zeker') ? unlockedBase : [...unlockedBase, 'zeker'];

      const rawDeck = Array.isArray(rawProg.activeDeckCardIds)
        ? rawProg.activeDeckCardIds.filter((id: unknown): id is string => typeof id === 'string' && unlocked.includes(id)).slice(0, 7)
        : [];
      const activeDeck =
        rawDeck.length > 0
          ? !rawDeck.includes('zeker') && !validUnlocked.includes('zeker') && rawDeck.length < 7
            ? [...rawDeck, 'zeker']
            : rawDeck
          : unlocked.slice(0, 7);

      const highestArena = Math.max(1, Number(rawProg.highestArenaUnlocked) || 1);
      const savedCompleted = Array.isArray(rawProg.completedArenaLevels)
        ? rawProg.completedArenaLevels.filter((n: unknown): n is number => typeof n === 'number' && n >= 1 && n <= 15)
        : [];
      const migratedCompleted = new Set<number>(savedCompleted);
      for (let lvl = 1; lvl < highestArena; lvl++) {
        migratedCompleted.add(lvl);
      }

      const savedGifted = Array.isArray(rawProg.giftedArenaLevels)
        ? rawProg.giftedArenaLevels.filter((n: unknown): n is number => typeof n === 'number' && n >= 1 && n <= 15)
        : [];
      const migratedGifted = Array.from(new Set<number>([1, ...savedGifted]));

      const prog: PlayerProgression = {
        ...INITIAL_PROGRESSION,
        ...rawProg,
        highestArenaUnlocked: highestArena,
        completedArenaLevels: Array.from(migratedCompleted),
        giftedArenaLevels: migratedGifted,
        savedCoins:
          typeof rawProg.savedCoins === 'number' && !Number.isNaN(rawProg.savedCoins)
            ? Math.max(0, Math.floor(rawProg.savedCoins))
            : Math.max(180, Math.min(800, Math.floor((Number(rawProg.lifetimeGold) || 0) * 0.25))),
        killsTowardsNextPack: Number(rawProg.killsTowardsNextPack) || 0,
        packsClaimedFromKills: Number(rawProg.packsClaimedFromKills) || 0,
        lifetimeKills: Number(rawProg.lifetimeKills) || 0,
        lifetimeWaves: Number(rawProg.lifetimeWaves) || 0,
        lifetimeGold: Number(rawProg.lifetimeGold) || 0,
        highScoreWave: Number(rawProg.highScoreWave) || 0,
        arenaBestWaves: rawProg.arenaBestWaves && typeof rawProg.arenaBestWaves === 'object' ? rawProg.arenaBestWaves : {},
        totalMatchesPlayed: Number(rawProg.totalMatchesPlayed) || 0,
        lastSavedTimestamp: Number(rawProg.lastSavedTimestamp) || Date.now(),
        settings: {
          ...INITIAL_PROGRESSION.settings,
          ...(rawProg.settings && typeof rawProg.settings === 'object' ? rawProg.settings : {})
        },
        unlockedCardIds: unlocked,
        activeDeckCardIds: activeDeck,
        cardMasteryLevels: {
          ...INITIAL_PROGRESSION.cardMasteryLevels,
          ...(rawProg.cardMasteryLevels && typeof rawProg.cardMasteryLevels === 'object' ? rawProg.cardMasteryLevels : {})
        }
      };

      const savedMissionsList = Array.isArray(parsed.missions) ? parsed.missions : [];
      const missions: Mission[] = INITIAL_MISSIONS.map((m) => {
        const saved = savedMissionsList.find((sm: Mission) => sm && sm.id === m.id);
        if (saved) {
          return {
            ...m,
            currentCount: Number(saved.currentCount) || 0,
            completed: Boolean(saved.completed),
            claimed: Boolean(saved.claimed)
          };
        }
        return m;
      });

      const syncedMissions = syncMissionsWithProgression(missions, prog);
      return { progression: prog, missions: syncedMissions };
    }
  } catch (err) {
    console.error('Failed to load progression from localStorage:', err);
  }

  return { progression: INITIAL_PROGRESSION, missions: INITIAL_MISSIONS };
}

export function saveProgression(progression: PlayerProgression, missions: Mission[]) {
  try {
    const stampedProgression: PlayerProgression = {
      ...progression,
      lastSavedTimestamp: Date.now()
    };
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        progression: stampedProgression,
        missions,
        savedAt: new Date().toISOString()
      })
    );
  } catch (err) {
    console.error('Failed to save progression to localStorage:', err);
  }
}

/**
 * Resets local game progression back to default factory state
 */
export function resetLocalProgression(): { progression: PlayerProgression; missions: Mission[] } {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
  return { progression: INITIAL_PROGRESSION, missions: INITIAL_MISSIONS };
}

export const MAX_IN_MATCH_LEVEL = 6;

/**
 * Checks if a placed unit can activate Showdown (Card Lv.3+ OR upgraded to Lv.3+ in arena).
 */
export function canUseUnitShowdown(cardLevel: number, inMatchLevel: number = 1): boolean {
  return cardLevel >= 3 || inMatchLevel >= 3;
}

/**
 * Returns the UpgradeTier stats for any in-match level from 1 to 6.
 * Levels 1-3 use bp.tiers[0..2]; Levels 4-6 dynamically scale from Tier 3.
 */
export function getInMatchUnitTier(bp: UnitBlueprint, level: number): UpgradeTier {
  const safeLv = Math.max(1, Math.min(MAX_IN_MATCH_LEVEL, level));
  if (safeLv <= 3) {
    return bp.tiers[safeLv - 1] || bp.tiers[0];
  }

  const tier3 = bp.tiers[2] || bp.tiers[bp.tiers.length - 1];
  const baseTier3Cost = Math.max(120, tier3.cost || Math.round(bp.cost * 1.5));

  if (safeLv === 4) {
    return {
      name: `${tier3.name} · Sobrecarga`,
      cost: Math.round((baseTier3Cost * 1.55) / 5) * 5,
      damage: Math.round(tier3.damage * 1.45),
      range: Math.round(tier3.range + 16),
      attackSpeed: Number((tier3.attackSpeed * 1.15).toFixed(2)),
      description: 'Sobrecarga táctica en arena: +45% daño, +15% cadencia y +16px alcance.',
      bonusEffect: 'Showdown +25% más potente',
      ecoYield: tier3.ecoYield ? Math.round(tier3.ecoYield * 1.5) : undefined
    };
  }

  if (safeLv === 5) {
    const tier4Cost = Math.round((baseTier3Cost * 1.55) / 5) * 5;
    return {
      name: `${tier3.name} · Ascensión`,
      cost: Math.round((tier4Cost * 1.65) / 5) * 5,
      damage: Math.round(tier3.damage * 2.1),
      range: Math.round(tier3.range + 32),
      attackSpeed: Number((tier3.attackSpeed * 1.32).toFixed(2)),
      description: 'Ascensión de élite: supera el doble de daño de Nivel 3 y +32% cadencia.',
      bonusEffect: 'Recarga Showdown acelerada y +32px alcance',
      ecoYield: tier3.ecoYield ? Math.round(tier3.ecoYield * 2.2) : undefined
    };
  }

  const tier4Cost = Math.round((baseTier3Cost * 1.55) / 5) * 5;
  const tier5Cost = Math.round((tier4Cost * 1.65) / 5) * 5;
  return {
    name: `${tier3.name} · Trascendencia`,
    cost: Math.round((tier5Cost * 1.75) / 5) * 5,
    damage: Math.round(tier3.damage * 3.1),
    range: Math.round(tier3.range + 52),
    attackSpeed: Number((tier3.attackSpeed * 1.55).toFixed(2)),
    description: 'Forma Suprema Nivel 6: x3.1 daño sobre Nivel 3, +52px alcance y máxima cadencia.',
    bonusEffect: 'Showdown recarga 50% más rápido y potencia extrema',
    ecoYield: tier3.ecoYield ? Math.round(tier3.ecoYield * 3.2) : undefined
  };
}

/**
 * Calculates balanced stat multiplier for card mastery level 1 to 10.
 * Showdown now unlocks starting at Card Lv.3 (or Match Unit Lv.3) for smoother usability!
 */
export function getLevelStatMultiplier(level: number): {
  damageMult: number;
  speedMult: number;
  showdownCdMult: number;
  isShowdownUnlocked: boolean;
} {
  const safeLevel = Math.max(1, Math.min(10, level));
  const bonusSteps = safeLevel - 1; // 0 to 9

  return {
    damageMult: 1 + bonusSteps * 0.04, // +4% damage per card level
    speedMult: 1 + bonusSteps * 0.025, // +2.5% attack speed per level
    showdownCdMult: Math.max(0.65, 1 - bonusSteps * 0.035), // Up to -31.5% cooldown reduction
    isShowdownUnlocked: safeLevel >= 3
  };
}

/**
 * Generates 3 rewards when opening a booster pack:
 * User rules:
 * - "los personajes no puedan salir repetidos en sobre": Only UNOWNED characters can drop (no duplicates!).
 * - "pero que haya menos probabilidad de personajes": Character drop chance reduced to 30% (70% bonus skill points).
 */
export function openBoosterPack(currentUnlockedIds: string[], highestArenaUnlocked: number = 1): PackReward[] {
  const allCardIds = Object.keys(UNITS);
  const rewards: PackReward[] = [];

  // Slot 1: Primary Skill Points bundle (guaranteed)
  const pts1 = 25 + Math.floor(Math.random() * 5) * 5; // 25, 30, 35, 40, 45
  rewards.push({
    type: 'skill_points',
    skillPoints: pts1
  });

  // Slot 2: Secondary Skill Points bundle (guaranteed)
  const pts2 = 20 + Math.floor(Math.random() * 4) * 5; // 20, 25, 30, 35
  rewards.push({
    type: 'skill_points',
    skillPoints: pts2
  });

  // Filter cards unlocked by current arena tier
  const eligibleCards = allCardIds.filter((id) => {
    const u = UNITS[id];
    if (!u) return false;
    if (u.arenaUnlockLevel && u.arenaUnlockLevel > highestArenaUnlocked) {
      return false; // Locked until reaching this arena tier!
    }
    return true;
  });

  // STRICT DUPLICATE PREVENTION: Filter out already unlocked characters
  const unownedCards = eligibleCards.filter((id) => !currentUnlockedIds.includes(id));

  // Reduced probability of character cards (30% chance instead of 65%)
  const rollsCharacter = Math.random() < 0.30 && unownedCards.length > 0;

  if (rollsCharacter) {
    // Clash Royale style Rarity Tier Probability:
    // 48% Común, 32% Especial, 13% Épica, 5% Legendaria, 2% Divinidad
    const rarityRoll = Math.random();
    let targetRarity: 'comun' | 'especial' | 'rara' | 'epica' | 'legendaria' | 'divinidad';

    if (rarityRoll < 0.48) {
      targetRarity = 'comun';
    } else if (rarityRoll < 0.80) {
      targetRarity = 'especial';
    } else if (rarityRoll < 0.93) {
      targetRarity = 'epica';
    } else if (rarityRoll < 0.98) {
      targetRarity = 'legendaria';
    } else {
      targetRarity = 'divinidad';
    }

    // Filter unowned cards matching target rarity
    let candidateCards = unownedCards.filter((id) => {
      const u = UNITS[id];
      if (!u) return false;
      const r = u.rarity;
      if (targetRarity === 'especial') {
        return r === 'especial' || r === 'rara';
      }
      return r === targetRarity;
    });

    // Fallback to any available unowned eligible card
    if (candidateCards.length === 0) {
      candidateCards = unownedCards;
    }

    const chosenCardId = candidateCards[Math.floor(Math.random() * candidateCards.length)];
    const unitBlueprint = UNITS[chosenCardId];
    const unitRarity = (unitBlueprint?.rarity === 'rara' ? 'especial' : unitBlueprint?.rarity) || 'comun';

    // Guaranteed brand new unique character (NEVER DUPLICATE!)
    rewards.push({
      type: 'card',
      cardId: chosenCardId,
      cardName: unitBlueprint?.name || 'Nueva Carta',
      rarity: unitRarity,
      isDuplicate: false
    });
  } else {
    // Did not roll a character (or player already owns all available cards in this arena tier):
    // Large bonus bundle of Skill Points for deck upgrades
    const pts3 = 35 + Math.floor(Math.random() * 6) * 5; // 35 to 60 pts
    rewards.push({
      type: 'skill_points',
      skillPoints: pts3
    });
  }

  return rewards;
}

export const SHOP_PACK_COIN_PRICE = 750;
export const SHOP_BUNDLE_3_PACKS_PRICE = 1950;
export const SHOP_SP_COIN_PRICE = 480;
export const SHOP_SP_BUNDLE_AMOUNT = 100;

export const SHOP_PACK_TIERS: ShopPackDefinition[] = [
  {
    id: 'classic',
    name: 'Sobre Crono Clásico',
    subtitle: 'Ideal para sumar PH y cazar cartas de tu arena actual.',
    priceCoins: 750,
    cardsSummary: '35% Carta Nueva + 2x PH',
    spRangeLabel: '45 - 80 PH',
    guaranteeLabel: 'Sin repetidos',
    badgeText: 'Estándar'
  },
  {
    id: 'elite',
    name: 'Sobre Élite de Batalla',
    subtitle: 'Asegura 1 héroe nuevo y reserva sólida de Puntos de Habilidad.',
    priceCoins: 1650,
    cardsSummary: '1 Carta Garantizada (Esp.+)',
    spRangeLabel: '75 - 115 PH',
    guaranteeLabel: '100% Héroe Nuevo',
    badgeText: 'Garantizado'
  },
  {
    id: 'royal',
    name: 'Cofre Real Táctico',
    subtitle: 'Doble reclutamiento con al menos 1 Épica o superior garantizada.',
    priceCoins: 3200,
    cardsSummary: '2 Cartas (1 Épica+ segura)',
    spRangeLabel: '130 - 190 PH',
    guaranteeLabel: 'Épica o Superior',
    badgeText: 'Alto Valor'
  },
  {
    id: 'cosmic',
    name: 'Megacaja Cósmica',
    subtitle: 'Botín máximo con 3 cartas nuevas y Legendaria o Divinidad segura.',
    priceCoins: 5900,
    cardsSummary: '3 Cartas (1 Legendaria/Divina)',
    spRangeLabel: '250 - 350 PH',
    guaranteeLabel: 'Legendaria / Divina',
    badgeText: 'Supremo'
  }
];

/**
 * Generates rewards for a specific Shop Pack Tier without duplicate cards.
 */
export function openShopTierPack(
  tierId: ShopPackTierId,
  currentUnlockedIds: string[],
  highestArenaUnlocked: number = 1,
  completedArenaLevels: number[] = []
): PackReward[] {
  if (tierId === 'classic') {
    return openBoosterPack(currentUnlockedIds, highestArenaUnlocked);
  }

  const rewards: PackReward[] = [];
  const allCardIds = Object.keys(UNITS);

  const isEligibleUnowned = (id: string, taken: Set<string>) => {
    if (taken.has(id) || currentUnlockedIds.includes(id)) return false;
    const u = UNITS[id];
    if (!u) return false;
    if (u.arenaUnlockLevel && u.arenaUnlockLevel > highestArenaUnlocked) return false;
    if (u.rarity === 'divinidad') {
      const reqArena = u.arenaUnlockLevel || 1;
      const done = reqArena < highestArenaUnlocked || completedArenaLevels.includes(reqArena);
      if (!done) return false;
    }
    return true;
  };

  const takenIds = new Set<string>();

  const pickCardByRarities = (preferredRarities: string[], fallbackAll = true): PackReward => {
    let candidates = allCardIds.filter((id) => {
      if (!isEligibleUnowned(id, takenIds)) return false;
      const u = UNITS[id];
      return u && preferredRarities.includes(u.rarity);
    });

    if (candidates.length === 0 && fallbackAll) {
      candidates = allCardIds.filter((id) => isEligibleUnowned(id, takenIds));
    }

    if (candidates.length === 0) {
      const fallbackSp = tierId === 'cosmic' ? 180 : tierId === 'royal' ? 140 : 110;
      return { type: 'skill_points', skillPoints: fallbackSp };
    }

    const chosenId = candidates[Math.floor(Math.random() * candidates.length)];
    takenIds.add(chosenId);
    const bp = UNITS[chosenId];
    return {
      type: 'card',
      cardId: chosenId,
      cardName: bp?.name || 'Nueva Carta',
      rarity: bp?.rarity || 'especial',
      isDuplicate: false
    };
  };

  if (tierId === 'elite') {
    const spAmount = 75 + Math.floor(Math.random() * 9) * 5; // 75-115
    rewards.push({ type: 'skill_points', skillPoints: spAmount });
    const roll = Math.random();
    const target =
      roll < 0.55
        ? ['especial', 'rara']
        : roll < 0.88
        ? ['epica']
        : ['legendaria', 'divinidad'];
    rewards.push(pickCardByRarities(target));
    rewards.push({ type: 'skill_points', skillPoints: 30 + Math.floor(Math.random() * 4) * 5 });
  } else if (tierId === 'royal') {
    const spAmount = 130 + Math.floor(Math.random() * 13) * 5; // 130-190
    rewards.push({ type: 'skill_points', skillPoints: spAmount });
    // Slot 2: Guaranteed Epic or higher
    const rollHigh = Math.random();
    rewards.push(
      pickCardByRarities(rollHigh < 0.72 ? ['epica'] : rollHigh < 0.93 ? ['legendaria'] : ['divinidad'])
    );
    // Slot 3: Second guaranteed card (any rarity, leaning especial/epica)
    rewards.push(pickCardByRarities(['especial', 'rara', 'epica', 'comun', 'legendaria']));
  } else {
    // Cosmic Megacaja: 1 SP cache + 3 guaranteed cards (1 Legendary/Divinity + 1 Epic+ + 1 any)
    const spAmount = 250 + Math.floor(Math.random() * 21) * 5; // 250-350
    rewards.push({ type: 'skill_points', skillPoints: spAmount });
    rewards.push(
      pickCardByRarities(Math.random() < 0.72 ? ['legendaria'] : ['divinidad', 'legendaria'])
    );
    rewards.push(pickCardByRarities(['epica', 'legendaria', 'divinidad']));
    rewards.push(pickCardByRarities(['especial', 'rara', 'epica', 'comun', 'legendaria']));
  }

  return rewards;
}

/**
 * Synchronizes progression-derived missions with current lifetime stats, arenas beaten, and collection.
 */
export function syncMissionsWithProgression(missions: Mission[], prog: PlayerProgression): Mission[] {
  const completedArenasCount = (prog.completedArenaLevels || []).length;
  const maxLevelCount = Object.values(prog.cardMasteryLevels || {}).filter((lv) => lv >= 10).length;
  const unlockedCount = (prog.unlockedCardIds || []).length;
  const highWave = prog.highScoreWave || 0;
  const totalWaves = prog.lifetimeWaves || 0;
  const totalKills = prog.lifetimeKills || 0;
  const totalGold = prog.lifetimeGold || 0;

  let anyChanged = false;
  const updated = missions.map((m) => {
    let derived: number | null = null;
    switch (m.id) {
      case 'mission_first_battle':
      case 'mission_wave_5':
      case 'mission_wave_15':
      case 'mission_eclipse_victory':
      case 'mission_wave_30':
      case 'mission_wave_45':
      case 'mission_wave_65':
        derived = highWave;
        break;
      case 'mission_total_waves_100':
      case 'mission_total_waves_350':
        derived = totalWaves;
        break;
      case 'mission_recon_kills':
      case 'mission_slayer_150':
      case 'mission_slayer_500':
      case 'mission_slayer_1500':
      case 'mission_slayer_5000':
      case 'mission_slayer_15000':
        derived = totalKills;
        break;
      case 'mission_arena_2':
      case 'mission_arena_4':
      case 'mission_arena_7':
      case 'mission_arena_10':
      case 'mission_arena_13':
      case 'mission_arena_all_15':
        derived = completedArenasCount;
        break;
      case 'mission_wealth':
      case 'mission_wealth_25k':
      case 'mission_wealth_100k':
      case 'mission_wealth_350k':
        derived = totalGold;
        break;
      case 'mission_collect_12':
      case 'mission_collect_30':
      case 'mission_collect_60':
      case 'mission_collect_100':
        derived = unlockedCount;
        break;
      case 'mission_max_level_cards_3':
        derived = maxLevelCount;
        break;
      default:
        break;
    }

    if (derived === null) return m;
    const nextCount = Math.max(m.currentCount, derived);
    const nextCompleted = m.completed || nextCount >= m.targetCount;
    if (nextCount !== m.currentCount || nextCompleted !== m.completed) {
      anyChanged = true;
      return {
        ...m,
        currentCount: nextCount,
        completed: nextCompleted
      };
    }
    return m;
  });

  return anyChanged ? updated : missions;
}

/**
 * Checks whether an arena has been beaten/completed at least once.
 */
export function isArenaCompleted(progression: PlayerProgression, arenaLevel: number): boolean {
  if (arenaLevel < (progression.highestArenaUnlocked || 1)) return true;
  return (progression.completedArenaLevels || []).includes(arenaLevel);
}

/**
 * Validates whether a card can currently be bought directly in the Card Shop.
 * Divinities cannot be purchased until the player has completed their Arena.
 */
export function canBuyCardInShop(
  unit: UnitBlueprint,
  progression: PlayerProgression
): { allowed: boolean; requiredArena?: number } {
  if (unit.rarity === 'divinidad') {
    const reqArena = unit.arenaUnlockLevel || 1;
    if (!isArenaCompleted(progression, reqArena)) {
      return { allowed: false, requiredArena: reqArena };
    }
  }
  return { allowed: true };
}

/**
 * Computes direct Card Shop purchase price in persistent saved Coins.
 */
export function getCardShopPrice(unit: UnitBlueprint): number {
  switch (unit.rarity) {
    case 'comun':
      return 480;
    case 'especial':
    case 'rara':
      return 950;
    case 'epica':
      return 1850;
    case 'legendaria':
      return 3400;
    case 'divinidad':
      return 5500 + Math.max(0, (unit.arenaUnlockLevel || 1) - 1) * 650;
    default:
      return 750;
  }
}
