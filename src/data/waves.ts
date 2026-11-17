import { WaveConfig } from '../types/game';

export interface WaveScalingStats {
  hpMult: number;
  speedMult: number;
  armorBonus: number;
  shieldRatio: number;
  goldBonus: number;
}

/**
 * Progressive villain scaling by Wave + Arena so every wave increases combat pressure.
 * Wave 1 stays welcoming, waves 6-12 ramp noticeably, waves 13-20+ test deck synergy & upgrades.
 */
export function getWaveScaling(waveNum: number, arenaLevel: number = 1, difficulty: string = 'normal'): WaveScalingStats {
  const w = Math.max(1, waveNum);
  const a = Math.max(1, arenaLevel);

  // Per-wave HP multiplier
  let waveHpMult = 1.0;
  if (w <= 5) {
    waveHpMult = 1 + (w - 1) * 0.12; // W1: 1.00x -> W5: 1.48x
  } else if (w <= 12) {
    waveHpMult = 1.48 + (w - 5) * 0.22; // W6: 1.70x -> W10: 2.58x -> W12: 3.02x
  } else if (w <= 20) {
    waveHpMult = 3.02 + (w - 12) * 0.34; // W15: 4.04x -> W20: 5.74x
  } else {
    waveHpMult = 5.74 * Math.pow(1.14, w - 20); // Exponential endless scaling
  }

  // Per-wave Speed multiplier (capped at +75% from wave scaling)
  const waveSpeedMult = 1 + Math.min(0.75, (w - 1) * 0.024);

  // Per-wave Armor bonus
  const waveArmorBonus = Math.floor((w - 1) / 3);

  // Shield ratio for special/armored/boss enemies starting from wave 6+
  const shieldRatio = w >= 6 ? Math.min(0.45, 0.12 + (w - 6) * 0.022) : 0;

  // Arena multipliers
  const arenaHpMult = 1 + (a - 1) * 0.48;
  const arenaSpdMult = 1 + (a - 1) * 0.055;
  const arenaArmorBonus = (a - 1) * 2;

  const diffHpMult = difficulty === 'hard' ? 1.25 : 1.0;
  const diffSpdMult = difficulty === 'hard' ? 1.18 : 1.0;

  return {
    hpMult: waveHpMult * arenaHpMult * diffHpMult,
    speedMult: waveSpeedMult * arenaSpdMult * diffSpdMult,
    armorBonus: waveArmorBonus + arenaArmorBonus,
    shieldRatio,
    goldBonus: (a - 1) * 2 + Math.floor((w - 1) / 4)
  };
}

/**
 * Scripted waves 1 to 20 with curated pacing and boss encounters,
 * plus a procedural generator for endless waves past 20.
 */
export const SCRIPTED_WAVES: WaveConfig[] = [
  // Ronda 1: Introducción suave
  {
    waveNumber: 1,
    rewardGold: 35,
    segments: [
      { enemyType: 'soldier', count: 6, interval: 1.5, initialDelay: 0.5 }
    ]
  },
  // Ronda 2: Aparición de exploradores rápidos
  {
    waveNumber: 2,
    rewardGold: 40,
    segments: [
      { enemyType: 'soldier', count: 6, interval: 1.3, initialDelay: 0.2 },
      { enemyType: 'scout', count: 5, interval: 1.0, initialDelay: 2.8 }
    ]
  },
  // Ronda 3: Manada de enjambre
  {
    waveNumber: 3,
    rewardGold: 45,
    segments: [
      { enemyType: 'swarm', count: 14, interval: 0.5, initialDelay: 0.5 },
      { enemyType: 'soldier', count: 6, interval: 1.1, initialDelay: 4.0 }
    ]
  },
  // Ronda 4: Primer tanque
  {
    waveNumber: 4,
    rewardGold: 52,
    segments: [
      { enemyType: 'soldier', count: 8, interval: 1.1, initialDelay: 0.2 },
      { enemyType: 'tank', count: 2, interval: 2.5, initialDelay: 3.5 },
      { enemyType: 'scout', count: 6, interval: 0.85, initialDelay: 6.5 }
    ]
  },
  // Ronda 5: Mini oleada de asalto
  {
    waveNumber: 5,
    rewardGold: 62,
    segments: [
      { enemyType: 'tank', count: 2, interval: 2.6, initialDelay: 0.5 },
      { enemyType: 'swarm', count: 16, interval: 0.45, initialDelay: 3.2 },
      { enemyType: 'scout', count: 8, interval: 0.75, initialDelay: 7.5 }
    ]
  },
  // Ronda 6: Presentación del caminante especial con escudo
  {
    waveNumber: 6,
    rewardGold: 68,
    segments: [
      { enemyType: 'special', count: 4, interval: 1.9, initialDelay: 0.5 },
      { enemyType: 'soldier', count: 12, interval: 0.9, initialDelay: 3.5 },
      { enemyType: 'tank', count: 2, interval: 2.4, initialDelay: 7.5 }
    ]
  },
  // Ronda 7: Presión de velocidad
  {
    waveNumber: 7,
    rewardGold: 75,
    segments: [
      { enemyType: 'scout', count: 14, interval: 0.65, initialDelay: 0.2 },
      { enemyType: 'special', count: 5, interval: 1.5, initialDelay: 4.5 },
      { enemyType: 'tank', count: 3, interval: 2.2, initialDelay: 8.5 }
    ]
  },
  // Ronda 8: Doble flanco blindado
  {
    waveNumber: 8,
    rewardGold: 85,
    segments: [
      { enemyType: 'tank', count: 5, interval: 2.0, initialDelay: 0.5 },
      { enemyType: 'swarm', count: 22, interval: 0.4, initialDelay: 3.5 },
      { enemyType: 'special', count: 5, interval: 1.3, initialDelay: 8.0 }
    ]
  },
  // Ronda 9: Tensión antes del primer Jefe
  {
    waveNumber: 9,
    rewardGold: 95,
    segments: [
      { enemyType: 'soldier', count: 16, interval: 0.75, initialDelay: 0.2 },
      { enemyType: 'scout', count: 12, interval: 0.55, initialDelay: 3.5 },
      { enemyType: 'tank', count: 4, interval: 1.8, initialDelay: 7.5 },
      { enemyType: 'special', count: 5, interval: 1.2, initialDelay: 11.0 }
    ]
  },
  // Ronda 10: PRIMER JEFE - GOLIATH TITÁNICO
  {
    waveNumber: 10,
    rewardGold: 135,
    isBossWave: true,
    bossTitle: '¡ALERTA DE JEFE! Goliath Titánico se aproxima',
    segments: [
      { enemyType: 'soldier', count: 10, interval: 0.9, initialDelay: 0.2 },
      { enemyType: 'boss_goliath', count: 1, interval: 0, initialDelay: 3.5 },
      { enemyType: 'special', count: 4, interval: 1.4, initialDelay: 6.5 },
      { enemyType: 'swarm', count: 20, interval: 0.4, initialDelay: 9.0 }
    ]
  },
  // Ronda 11: Ola post-jefe
  {
    waveNumber: 11,
    rewardGold: 100,
    segments: [
      { enemyType: 'special', count: 7, interval: 1.3, initialDelay: 0.5 },
      { enemyType: 'scout', count: 16, interval: 0.55, initialDelay: 3.5 },
      { enemyType: 'tank', count: 4, interval: 1.8, initialDelay: 7.5 }
    ]
  },
  // Ronda 12: Invasión en masa
  {
    waveNumber: 12,
    rewardGold: 110,
    segments: [
      { enemyType: 'tank', count: 6, interval: 1.8, initialDelay: 0.5 },
      { enemyType: 'swarm', count: 28, interval: 0.3, initialDelay: 3.0 },
      { enemyType: 'special', count: 7, interval: 1.1, initialDelay: 7.5 }
    ]
  },
  // Ronda 13: Caminantes de fase de élite
  {
    waveNumber: 13,
    rewardGold: 120,
    segments: [
      { enemyType: 'special', count: 10, interval: 1.0, initialDelay: 0.5 },
      { enemyType: 'scout', count: 18, interval: 0.45, initialDelay: 4.5 },
      { enemyType: 'tank', count: 5, interval: 1.6, initialDelay: 8.5 }
    ]
  },
  // Ronda 14: Escuadrón acorazado
  {
    waveNumber: 14,
    rewardGold: 130,
    segments: [
      { enemyType: 'tank', count: 9, interval: 1.6, initialDelay: 0.5 },
      { enemyType: 'special', count: 8, interval: 1.2, initialDelay: 4.5 },
      { enemyType: 'swarm', count: 24, interval: 0.35, initialDelay: 8.5 }
    ]
  },
  // Ronda 15: Doble Goliath
  {
    waveNumber: 15,
    rewardGold: 170,
    isBossWave: true,
    bossTitle: '¡PELIGRO EXTREMO! Dúo de Goliaths Blindados',
    segments: [
      { enemyType: 'boss_goliath', count: 1, interval: 0, initialDelay: 1.0 },
      { enemyType: 'special', count: 9, interval: 1.1, initialDelay: 3.5 },
      { enemyType: 'tank', count: 5, interval: 1.6, initialDelay: 7.0 },
      { enemyType: 'boss_goliath', count: 1, interval: 0, initialDelay: 10.0 }
    ]
  },
  // Ronda 16: Desborde masivo
  {
    waveNumber: 16,
    rewardGold: 145,
    segments: [
      { enemyType: 'swarm', count: 36, interval: 0.24, initialDelay: 0.5 },
      { enemyType: 'scout', count: 22, interval: 0.42, initialDelay: 4.0 },
      { enemyType: 'void_reaver', count: 6, interval: 1.0, initialDelay: 8.0 }
    ]
  },
  // Ronda 17: Colosos en serie
  {
    waveNumber: 17,
    rewardGold: 155,
    segments: [
      { enemyType: 'tank', count: 12, interval: 1.3, initialDelay: 0.5 },
      { enemyType: 'special', count: 12, interval: 0.9, initialDelay: 4.5 },
      { enemyType: 'void_reaver', count: 6, interval: 0.9, initialDelay: 9.0 }
    ]
  },
  // Ronda 18: Hipervelocidad
  {
    waveNumber: 18,
    rewardGold: 165,
    segments: [
      { enemyType: 'scout', count: 28, interval: 0.35, initialDelay: 0.2 },
      { enemyType: 'void_reaver', count: 10, interval: 0.85, initialDelay: 4.5 },
      { enemyType: 'cyber_dreadnought', count: 4, interval: 1.8, initialDelay: 8.5 }
    ]
  },
  // Ronda 19: Calma antes del Cataclismo
  {
    waveNumber: 19,
    rewardGold: 185,
    segments: [
      { enemyType: 'cyber_dreadnought', count: 5, interval: 1.7, initialDelay: 0.5 },
      { enemyType: 'swarm', count: 40, interval: 0.22, initialDelay: 3.5 },
      { enemyType: 'void_reaver', count: 12, interval: 0.75, initialDelay: 7.5 }
    ]
  },
  // Ronda 20: JEFE FINAL - SEÑOR DEL ECLIPSE CÓSMICO
  {
    waveNumber: 20,
    rewardGold: 240,
    isBossWave: true,
    bossTitle: '¡BATALLA FINAL! El Señor del Eclipse ha despertado',
    segments: [
      { enemyType: 'void_reaver', count: 8, interval: 0.9, initialDelay: 0.5 },
      { enemyType: 'boss_eclipse', count: 1, interval: 0, initialDelay: 3.5 },
      { enemyType: 'cyber_dreadnought', count: 4, interval: 1.8, initialDelay: 7.5 },
      { enemyType: 'boss_goliath', count: 1, interval: 0, initialDelay: 10.5 },
      { enemyType: 'swarm', count: 30, interval: 0.25, initialDelay: 14.0 }
    ]
  }
];

export function getWaveConfig(waveNum: number, arenaLevel: number = 1): WaveConfig {
  const isVolcanic = arenaLevel === 2;
  const isHighTier = arenaLevel >= 3;

  if (waveNum <= SCRIPTED_WAVES.length) {
    const baseConfig = SCRIPTED_WAVES[waveNum - 1];

    // For Arena 1 (Valle Esmeralda), return standard scripted waves
    if (arenaLevel <= 1) {
      return baseConfig;
    }

    // For Arena 2+ (Volcán / Cañón de Magma and beyond), inject stronger enemies!
    const upgradedSegments = baseConfig.segments.map((seg) => {
      let type = seg.enemyType;
      // In Arena 2 (Volcán), replace scouts and tanks with volcanic demons and magma golems
      if (isVolcanic) {
        if (seg.enemyType === 'scout' && waveNum >= 4) {
          type = 'magma_fiend';
        } else if (seg.enemyType === 'tank' && waveNum >= 6) {
          type = 'pyro_golem';
        } else if (seg.enemyType === 'boss_eclipse') {
          type = 'boss_infernal';
        } else if (seg.enemyType === 'boss_goliath' && waveNum >= 15) {
          type = 'boss_infernal';
        }
      } else if (isHighTier) {
        if (seg.enemyType === 'tank') {
          type = arenaLevel % 2 === 0 ? 'pyro_golem' : 'cyber_dreadnought';
        } else if (seg.enemyType === 'special') {
          type = 'void_reaver';
        } else if (seg.enemyType === 'scout' && waveNum >= 3) {
          type = 'magma_fiend';
        } else if (seg.enemyType === 'boss_eclipse' || seg.enemyType === 'boss_goliath') {
          type = 'boss_infernal';
        }
      }

      // Slightly increase count per arena level
      const extraCount = Math.floor((arenaLevel - 1) * 1.5);
      return {
        ...seg,
        enemyType: type,
        count: seg.enemyType.startsWith('boss') ? seg.count : seg.count + extraCount
      };
    });

    const arenaGoldBonus = (arenaLevel - 1) * 20;
    const isBoss = baseConfig.isBossWave;
    const bossTitle = isBoss
      ? isVolcanic
        ? waveNum >= 20
          ? '¡ALERTA VOLCÁNICA! El Señor del Núcleo Volcánico ha despertado'
          : '¡PELIGRO ÍGNEO! Titanes de Magma avanzan'
        : `¡DESAFÍO EXTREMO ARENA ${arenaLevel}! Jefes de Élite Detectados`
      : undefined;

    return {
      waveNumber: waveNum,
      rewardGold: baseConfig.rewardGold + arenaGoldBonus,
      isBossWave: isBoss,
      bossTitle,
      segments: upgradedSegments
    };
  }

  // Procedural scaling for waves > 20 (Infinite tactical challenge)
  const isBoss = waveNum % 5 === 0;
  const scale = (1 + (waveNum - 20) * 0.16) * (1 + (arenaLevel - 1) * 0.25);
  const rewardGold = Math.floor(85 + waveNum * 4 + (arenaLevel - 1) * 30);

  return {
    waveNumber: waveNum,
    rewardGold,
    isBossWave: isBoss,
    bossTitle: isBoss ? `¡OLEADA DE JEFE ARENA ${arenaLevel}! Amenaza Nivel ${waveNum}` : undefined,
    segments: isBoss
      ? [
          { enemyType: isVolcanic ? 'pyro_golem' : 'cyber_dreadnought', count: Math.floor(6 * scale), interval: 1.1, initialDelay: 0.5 },
          { enemyType: isVolcanic ? 'boss_infernal' : (waveNum % 10 === 0 ? 'boss_eclipse' : 'boss_goliath'), count: 1 + Math.floor((waveNum - 20) / 10), interval: 5.5, initialDelay: 3.0 },
          { enemyType: isVolcanic ? 'magma_fiend' : 'void_reaver', count: Math.floor(9 * scale), interval: 0.7, initialDelay: 7.5 }
        ]
      : [
          { enemyType: isVolcanic ? 'magma_fiend' : 'scout', count: Math.floor(14 * scale), interval: 0.4, initialDelay: 0.2 },
          { enemyType: isHighTier ? 'void_reaver' : 'special', count: Math.floor(8 * scale), interval: 0.75, initialDelay: 3.0 },
          { enemyType: isVolcanic ? 'pyro_golem' : 'tank', count: Math.floor(6 * scale), interval: 1.35, initialDelay: 6.5 },
          { enemyType: 'swarm', count: Math.floor(24 * scale), interval: 0.22, initialDelay: 10.0 }
        ]
  };
}
