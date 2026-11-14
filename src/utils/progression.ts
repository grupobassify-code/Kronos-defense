import { PlayerProgression, PackReward, Mission } from '../types/game';
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
  // Starts with EXACTLY 3 cards as requested
  unlockedCardIds: ['vanguard_solar', 'pyromancer', 'cryo_mage'],
  // Battle deck holds up to 7 cards (starts with the 3 unlocked)
  activeDeckCardIds: ['vanguard_solar', 'pyromancer', 'cryo_mage'],
  cardMasteryLevels: defaultMasteryLevels,
  skillPoints: 50,
  unopenedPacks: 2, // Welcome packs so player can test pulling new cards immediately
  completedMissionIds: [],
  claimedMissionIds: [],
  lifetimeKills: 0,
  lifetimeWaves: 0,
  lifetimeGold: 0,
  currentStoryChapter: 1,
  highestArenaUnlocked: 1, // Arena 1 initially; Arena 2 requires passing Arena 1!
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
      const unlocked = validUnlocked.length > 0 ? validUnlocked : INITIAL_PROGRESSION.unlockedCardIds;

      const rawDeck = Array.isArray(rawProg.activeDeckCardIds)
        ? rawProg.activeDeckCardIds.filter((id: unknown): id is string => typeof id === 'string' && unlocked.includes(id)).slice(0, 7)
        : [];

      const prog: PlayerProgression = {
        ...INITIAL_PROGRESSION,
        ...rawProg,
        highestArenaUnlocked: Math.max(1, Number(rawProg.highestArenaUnlocked) || 1),
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
        activeDeckCardIds: rawDeck.length > 0 ? rawDeck : unlocked.slice(0, 7),
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

      return { progression: prog, missions };
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

/**
 * Calculates balanced stat multiplier for level 1 to 10
 * Lv 1: 1.0 (base)
 * Lv 10: 1.315 (+31.5% balanced damage, not overpowered)
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
    damageMult: 1 + bonusSteps * 0.035, // +3.5% damage per level
    speedMult: 1 + bonusSteps * 0.025, // +2.5% attack speed per level
    showdownCdMult: 1 - bonusSteps * 0.025, // -2.5% cooldown per level
    isShowdownUnlocked: safeLevel >= 10 // Showdown ONLY unlocks at level 10!
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
