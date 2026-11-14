import { MapData } from '../types/game';

export const MAPS: MapData[] = [
  // Arena 1
  {
    id: 'emerald_valley',
    name: 'Valle Esmeralda',
    difficultyRating: 'Tier 1',
    description: 'Ruta abierta con curvas suaves rodeada de colinas fértiles. Excelente para aprender y optimizar líneas de fuego.',
    cols: 18,
    rows: 11,
    tileSize: 52,
    bgImageUrl: '/src/assets/images/map_emerald_valley_1791483583627.jpg',
    pathWaypoints: [
      { x: 0, y: 2 },
      { x: 5, y: 2 },
      { x: 5, y: 6 },
      { x: 10, y: 6 },
      { x: 10, y: 3 },
      { x: 14, y: 3 },
      { x: 14, y: 8 },
      { x: 17, y: 8 }
    ],
    obstacles: [
      { x: 2, y: 4 },
      { x: 3, y: 8 },
      { x: 8, y: 1 },
      { x: 12, y: 1 },
      { x: 16, y: 4 }
    ],
    theme: {
      bg: '#0F172A',
      pathColor: '#334155',
      pathBorder: '#475569',
      gridLine: 'rgba(51, 65, 85, 0.35)',
      buildableBg: '#1E293B',
      buildableHover: 'rgba(34, 197, 94, 0.25)'
    }
  },

  // Arena 2
  {
    id: 'magma_canyon',
    name: 'Cañón de Magma',
    difficultyRating: 'Tier 2',
    description: 'Garganta volcánica de altas temperaturas con curvas cerradas en horquilla que favorecen el daño en área y control.',
    cols: 18,
    rows: 11,
    tileSize: 52,
    bgImageUrl: '/src/assets/images/map_magma_canyon_1791483594170.jpg',
    pathWaypoints: [
      { x: 0, y: 5 },
      { x: 3, y: 5 },
      { x: 3, y: 1 },
      { x: 8, y: 1 },
      { x: 8, y: 9 },
      { x: 12, y: 9 },
      { x: 12, y: 4 },
      { x: 17, y: 4 }
    ],
    obstacles: [
      { x: 1, y: 2 },
      { x: 6, y: 6 },
      { x: 10, y: 2 },
      { x: 15, y: 8 },
      { x: 15, y: 1 }
    ],
    theme: {
      bg: '#180B0F',
      pathColor: '#3F1820',
      pathBorder: '#772432',
      gridLine: 'rgba(120, 40, 50, 0.35)',
      buildableBg: '#2A1118',
      buildableHover: 'rgba(239, 68, 68, 0.25)'
    }
  },

  // Arena 3
  {
    id: 'cyber_bastion',
    name: 'Bastión Cibernético',
    difficultyRating: 'Tier 3',
    description: 'Complejo tecnológico con nodos entrelazados y plataformas centrales que demandan sinergias de soporte avanzadas.',
    cols: 18,
    rows: 11,
    tileSize: 52,
    bgImageUrl: '/src/assets/images/map_cyber_bastion_1791483604754.jpg',
    pathWaypoints: [
      { x: 0, y: 1 },
      { x: 14, y: 1 },
      { x: 14, y: 4 },
      { x: 3, y: 4 },
      { x: 3, y: 8 },
      { x: 11, y: 8 },
      { x: 11, y: 6 },
      { x: 17, y: 6 }
    ],
    obstacles: [
      { x: 1, y: 6 },
      { x: 8, y: 3 },
      { x: 16, y: 2 },
      { x: 6, y: 10 },
      { x: 15, y: 10 }
    ],
    theme: {
      bg: '#0A0E1A',
      pathColor: '#172554',
      pathBorder: '#1E3A8A',
      gridLine: 'rgba(59, 130, 246, 0.3)',
      buildableBg: '#0F172A',
      buildableHover: 'rgba(59, 130, 246, 0.3)'
    }
  },

  // Arena 4
  {
    id: 'chrono_desert',
    name: 'Desierto de Cronos',
    difficultyRating: 'Tier 4',
    description: 'Dunas de arena temporal con tormentas de viento que aceleran a los exploradores y crean zonas de emboscada.',
    cols: 18,
    rows: 11,
    tileSize: 52,
    bgImageUrl: '/src/assets/images/map_chrono_desert_1791557263959.jpg',
    pathWaypoints: [
      { x: 0, y: 8 },
      { x: 4, y: 8 },
      { x: 4, y: 2 },
      { x: 9, y: 2 },
      { x: 9, y: 7 },
      { x: 13, y: 7 },
      { x: 13, y: 3 },
      { x: 17, y: 3 }
    ],
    obstacles: [
      { x: 2, y: 1 },
      { x: 6, y: 5 },
      { x: 11, y: 1 },
      { x: 15, y: 6 },
      { x: 7, y: 9 }
    ],
    theme: {
      bg: '#1C1307',
      pathColor: '#452A0A',
      pathBorder: '#78350F',
      gridLine: 'rgba(217, 119, 6, 0.3)',
      buildableBg: '#2E1C0A',
      buildableHover: 'rgba(245, 158, 11, 0.3)'
    }
  },

  // Arena 5
  {
    id: 'eclipse_colosseum',
    name: 'Coliseo del Eclipse',
    difficultyRating: 'Tier 5',
    description: 'Santuario cósmico definitivo con distorsiones dimensionales y múltiples intersecciones de alta tensión táctica.',
    cols: 18,
    rows: 11,
    tileSize: 52,
    bgImageUrl: '/src/assets/images/map_eclipse_colosseum_1791557284111.jpg',
    pathWaypoints: [
      { x: 0, y: 4 },
      { x: 6, y: 4 },
      { x: 6, y: 1 },
      { x: 12, y: 1 },
      { x: 12, y: 9 },
      { x: 4, y: 9 },
      { x: 4, y: 6 },
      { x: 17, y: 6 }
    ],
    obstacles: [
      { x: 1, y: 1 },
      { x: 9, y: 4 },
      { x: 15, y: 2 },
      { x: 8, y: 7 },
      { x: 15, y: 9 }
    ],
    theme: {
      bg: '#130A24',
      pathColor: '#2E1065',
      pathBorder: '#581C87',
      gridLine: 'rgba(168, 85, 247, 0.35)',
      buildableBg: '#1E1035',
      buildableHover: 'rgba(192, 132, 252, 0.3)'
    }
  },

  // Arena 6
  {
    id: 'glacier_peaks',
    name: 'Cumbres Glaciares',
    difficultyRating: 'Tier 6',
    description: 'Pasos congelados bajo auroras boreales. El frío glacial ralentiza los proyectiles pero amplifica la magia de escarcha.',
    cols: 18,
    rows: 11,
    tileSize: 52,
    bgImageUrl: '/src/assets/images/arena_glacier_peaks_1791645617666.jpg',
    pathWaypoints: [
      { x: 0, y: 3 },
      { x: 4, y: 3 },
      { x: 4, y: 7 },
      { x: 8, y: 7 },
      { x: 8, y: 2 },
      { x: 13, y: 2 },
      { x: 13, y: 8 },
      { x: 17, y: 8 }
    ],
    obstacles: [
      { x: 2, y: 5 },
      { x: 6, y: 4 },
      { x: 10, y: 5 },
      { x: 15, y: 4 }
    ],
    theme: {
      bg: '#081726',
      pathColor: '#164E63',
      pathBorder: '#06B6D4',
      gridLine: 'rgba(6, 182, 212, 0.35)',
      buildableBg: '#0E2A3A',
      buildableHover: 'rgba(34, 211, 238, 0.3)'
    }
  },

  // Arena 7
  {
    id: 'neon_metropolis',
    name: 'Metrópolis Neón',
    difficultyRating: 'Tier 7',
    description: 'Autopistas elevadas entre rascacielos cibernéticos de alta tecnología con tráfico incesante de oleadas enemigas.',
    cols: 18,
    rows: 11,
    tileSize: 52,
    bgImageUrl: '/src/assets/images/arena_neon_metropolis_1791645633582.jpg',
    pathWaypoints: [
      { x: 0, y: 6 },
      { x: 7, y: 6 },
      { x: 7, y: 2 },
      { x: 11, y: 2 },
      { x: 11, y: 8 },
      { x: 15, y: 8 },
      { x: 15, y: 4 },
      { x: 17, y: 4 }
    ],
    obstacles: [
      { x: 3, y: 3 },
      { x: 5, y: 8 },
      { x: 9, y: 5 },
      { x: 13, y: 5 }
    ],
    theme: {
      bg: '#0F0926',
      pathColor: '#581C87',
      pathBorder: '#C084FC',
      gridLine: 'rgba(192, 132, 252, 0.35)',
      buildableBg: '#1E1238',
      buildableHover: 'rgba(232, 121, 249, 0.3)'
    }
  },

  // Arena 8
  {
    id: 'void_abyss',
    name: 'Abismo del Vacío',
    difficultyRating: 'Tier 8',
    description: 'Islas de obsidiana suspendidas alrededor de un vórtice cósmico donde el espacio y la materia se pliegan.',
    cols: 18,
    rows: 11,
    tileSize: 52,
    bgImageUrl: '/src/assets/images/arena_void_abyss_1791645656970.jpg',
    pathWaypoints: [
      { x: 0, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 9 },
      { x: 10, y: 9 },
      { x: 10, y: 3 },
      { x: 14, y: 3 },
      { x: 14, y: 7 },
      { x: 17, y: 7 }
    ],
    obstacles: [
      { x: 1, y: 5 },
      { x: 6, y: 6 },
      { x: 12, y: 6 },
      { x: 16, y: 2 }
    ],
    theme: {
      bg: '#0B051D',
      pathColor: '#3B0764',
      pathBorder: '#7E22CE',
      gridLine: 'rgba(126, 34, 206, 0.35)',
      buildableBg: '#170B2C',
      buildableHover: 'rgba(168, 85, 247, 0.3)'
    }
  },

  // Arena 9
  {
    id: 'celestial_sanctum',
    name: 'Santuario Celestial',
    difficultyRating: 'Tier 9',
    description: 'Palacio dorado entre las nubes con columnas de mármol y arcos sagrados bendecidos por la luz solar primordial.',
    cols: 18,
    rows: 11,
    tileSize: 52,
    bgImageUrl: '/src/assets/images/arena_celestial_sanctum_1791645674094.jpg',
    pathWaypoints: [
      { x: 0, y: 8 },
      { x: 5, y: 8 },
      { x: 5, y: 3 },
      { x: 12, y: 3 },
      { x: 12, y: 7 },
      { x: 17, y: 7 }
    ],
    obstacles: [
      { x: 2, y: 4 },
      { x: 8, y: 5 },
      { x: 8, y: 1 },
      { x: 15, y: 4 }
    ],
    theme: {
      bg: '#231505',
      pathColor: '#78350F',
      pathBorder: '#F59E0B',
      gridLine: 'rgba(245, 158, 11, 0.35)',
      buildableBg: '#361F08',
      buildableHover: 'rgba(251, 191, 36, 0.3)'
    }
  },

  // Arena 10
  {
    id: 'storm_citadel',
    name: 'Ciudadela de las Tormentas',
    difficultyRating: 'Tier 10',
    description: 'Fortaleza aérea asediada por relámpagos torrenciales y vientos huracanados que desafían la resistencia de tus tropas.',
    cols: 18,
    rows: 11,
    tileSize: 52,
    bgImageUrl: '/src/assets/images/arena_storm_citadel_1791645689441.jpg',
    pathWaypoints: [
      { x: 0, y: 5 },
      { x: 4, y: 5 },
      { x: 4, y: 1 },
      { x: 9, y: 1 },
      { x: 9, y: 9 },
      { x: 14, y: 9 },
      { x: 14, y: 4 },
      { x: 17, y: 4 }
    ],
    obstacles: [
      { x: 2, y: 2 },
      { x: 6, y: 6 },
      { x: 11, y: 5 },
      { x: 16, y: 7 }
    ],
    theme: {
      bg: '#0B1120',
      pathColor: '#1E293B',
      pathBorder: '#38BDF8',
      gridLine: 'rgba(56, 189, 248, 0.35)',
      buildableBg: '#131D31',
      buildableHover: 'rgba(14, 165, 233, 0.3)'
    }
  },

  // Arena 11
  {
    id: 'emerald_jungle',
    name: 'Selva Primordial Tóxica',
    difficultyRating: 'Tier 11',
    description: 'Ruinas místicas mayas cubiertas de enredaderas bioluminiscentes y esporas venenosas de alta letalidad.',
    cols: 18,
    rows: 11,
    tileSize: 52,
    bgImageUrl: '/src/assets/images/arena_emerald_jungle_1791645706880.jpg',
    pathWaypoints: [
      { x: 0, y: 1 },
      { x: 6, y: 1 },
      { x: 6, y: 7 },
      { x: 2, y: 7 },
      { x: 2, y: 9 },
      { x: 12, y: 9 },
      { x: 12, y: 4 },
      { x: 17, y: 4 }
    ],
    obstacles: [
      { x: 4, y: 4 },
      { x: 8, y: 5 },
      { x: 9, y: 2 },
      { x: 15, y: 8 }
    ],
    theme: {
      bg: '#051810',
      pathColor: '#064E3B',
      pathBorder: '#10B981',
      gridLine: 'rgba(16, 185, 129, 0.35)',
      buildableBg: '#0A261A',
      buildableHover: 'rgba(52, 211, 153, 0.3)'
    }
  },

  // Arena 12
  {
    id: 'infernal_forge',
    name: 'Fragua Infernal',
    difficultyRating: 'Tier 12',
    description: 'Profundas cavernas volcánicas enanas donde ríos de oro líquido y magma alimentan hornos milenarios.',
    cols: 18,
    rows: 11,
    tileSize: 52,
    bgImageUrl: '/src/assets/images/arena_infernal_forge_1791645728799.jpg',
    pathWaypoints: [
      { x: 0, y: 7 },
      { x: 5, y: 7 },
      { x: 5, y: 2 },
      { x: 10, y: 2 },
      { x: 10, y: 8 },
      { x: 14, y: 8 },
      { x: 14, y: 3 },
      { x: 17, y: 3 }
    ],
    obstacles: [
      { x: 2, y: 4 },
      { x: 7, y: 5 },
      { x: 12, y: 5 },
      { x: 16, y: 1 }
    ],
    theme: {
      bg: '#200806',
      pathColor: '#7C2D12',
      pathBorder: '#EA580C',
      gridLine: 'rgba(234, 88, 12, 0.35)',
      buildableBg: '#300D09',
      buildableHover: 'rgba(249, 115, 22, 0.3)'
    }
  },

  // Arena 13
  {
    id: 'astral_nexus',
    name: 'Nexo Astral del Zodíaco',
    difficultyRating: 'Tier 13',
    description: 'Anillos celestes giratorios y puentes de cristal flotante que canalizan la energía de las constelaciones.',
    cols: 18,
    rows: 11,
    tileSize: 52,
    bgImageUrl: '/src/assets/images/arena_astral_nexus_1791645751961.jpg',
    pathWaypoints: [
      { x: 0, y: 4 },
      { x: 4, y: 4 },
      { x: 4, y: 8 },
      { x: 9, y: 8 },
      { x: 9, y: 1 },
      { x: 14, y: 1 },
      { x: 14, y: 6 },
      { x: 17, y: 6 }
    ],
    obstacles: [
      { x: 2, y: 1 },
      { x: 6, y: 4 },
      { x: 11, y: 4 },
      { x: 15, y: 9 }
    ],
    theme: {
      bg: '#120726',
      pathColor: '#4C1D95',
      pathBorder: '#8B5CF6',
      gridLine: 'rgba(139, 92, 246, 0.35)',
      buildableBg: '#1F0C3E',
      buildableHover: 'rgba(167, 139, 250, 0.3)'
    }
  },

  // Arena 14
  {
    id: 'shadow_crypt',
    name: 'Cripta de las Sombras',
    difficultyRating: 'Tier 14',
    description: 'Catedral gótica subterránea iluminada por fuego espectral verdoso donde habitan las almas de los caídos.',
    cols: 18,
    rows: 11,
    tileSize: 52,
    bgImageUrl: '/src/assets/images/arena_shadow_crypt_1791645769745.jpg',
    pathWaypoints: [
      { x: 0, y: 9 },
      { x: 4, y: 9 },
      { x: 4, y: 3 },
      { x: 8, y: 3 },
      { x: 8, y: 8 },
      { x: 13, y: 8 },
      { x: 13, y: 2 },
      { x: 17, y: 2 }
    ],
    obstacles: [
      { x: 2, y: 6 },
      { x: 6, y: 5 },
      { x: 10, y: 5 },
      { x: 15, y: 6 }
    ],
    theme: {
      bg: '#041512',
      pathColor: '#064E3B',
      pathBorder: '#34D399',
      gridLine: 'rgba(52, 211, 153, 0.35)',
      buildableBg: '#09231E',
      buildableHover: 'rgba(110, 231, 183, 0.3)'
    }
  },

  // Arena 15 (Suprema)
  {
    id: 'valhalla_throne',
    name: 'Trono del Valhalla',
    difficultyRating: 'Suprema',
    description: 'Salón mitológico supremo con runas nórdicas doradas y arcoíris celestiales. La cúspide absoluta del combate táctico.',
    cols: 18,
    rows: 11,
    tileSize: 52,
    bgImageUrl: '/src/assets/images/arena_valhalla_throne_1791645790729.jpg',
    pathWaypoints: [
      { x: 0, y: 5 },
      { x: 3, y: 5 },
      { x: 3, y: 1 },
      { x: 7, y: 1 },
      { x: 7, y: 9 },
      { x: 11, y: 9 },
      { x: 11, y: 2 },
      { x: 14, y: 2 },
      { x: 14, y: 7 },
      { x: 17, y: 7 }
    ],
    obstacles: [
      { x: 1, y: 2 },
      { x: 5, y: 5 },
      { x: 9, y: 5 },
      { x: 13, y: 5 },
      { x: 16, y: 3 }
    ],
    theme: {
      bg: '#1F1303',
      pathColor: '#78350F',
      pathBorder: '#FBBF24',
      gridLine: 'rgba(251, 191, 36, 0.4)',
      buildableBg: '#311F06',
      buildableHover: 'rgba(253, 224, 71, 0.4)'
    }
  }
];

export const DEFAULT_MAP = MAPS[0];

export interface ArenaInfo {
  arenaLevel: number;
  name: string;
  minWave: number;
  maxWave: number;
  roundsRequired: number; // rounds required to beat this arena
  map: MapData;
  badge: string;
  subtitle: string;
}

/**
 * 15 Total Arenas with dynamic progressive rounds scaling:
 * - Arena 1: 20 rounds (1 to 20)
 * - Arena 2: 22 rounds (21 to 42)
 * - Arena 3: 24 rounds (43 to 66)
 * - Arena 4: 26 rounds (67 to 92)
 * - Arena 5: 28 rounds (93 to 120)
 * - Arena 6: 30 rounds (121 to 150)
 * - Arena 7: 32 rounds (151 to 182)
 * - Arena 8: 34 rounds (183 to 216)
 * - Arena 9: 36 rounds (217 to 252)
 * - Arena 10: 38 rounds (253 to 290)
 * - Arena 11: 40 rounds (291 to 330)
 * - Arena 12: 42 rounds (331 to 372)
 * - Arena 13: 44 rounds (373 to 416)
 * - Arena 14: 46 rounds (417 to 462)
 * - Arena 15: 50+ rounds (463 to Infinity) - Arena Suprema Infinita
 */
export const ARENA_LEVELS: {
  level: number;
  name: string;
  mapIndex: number;
  badge: string;
  subtitle: string;
  roundsDuration: number;
}[] = [
  { level: 1, name: 'Arena 1: Valle Esmeralda', mapIndex: 0, badge: '🌱 Tier 1', subtitle: 'Inicio de la Incursión', roundsDuration: 20 },
  { level: 2, name: 'Arena 2: Cañón de Magma', mapIndex: 1, badge: '🔥 Tier 2', subtitle: 'Garganta Volcánica', roundsDuration: 22 },
  { level: 3, name: 'Arena 3: Bastión Cibernético', mapIndex: 2, badge: '⚡ Tier 3', subtitle: 'Matriz Tecnológica', roundsDuration: 24 },
  { level: 4, name: 'Arena 4: Desierto de Cronos', mapIndex: 3, badge: '⏳ Tier 4', subtitle: 'Dunas Temporales', roundsDuration: 26 },
  { level: 5, name: 'Arena 5: Coliseo del Eclipse', mapIndex: 4, badge: '🌑 Tier 5', subtitle: 'Santuario Gravitatorio', roundsDuration: 28 },
  { level: 6, name: 'Arena 6: Cumbres Glaciares', mapIndex: 5, badge: '❄️ Tier 6', subtitle: 'Tundra de Cristal', roundsDuration: 30 },
  { level: 7, name: 'Arena 7: Metrópolis Neón', mapIndex: 6, badge: '🏙️ Tier 7', subtitle: 'Autopista Cyberpunk', roundsDuration: 32 },
  { level: 8, name: 'Arena 8: Abismo del Vacío', mapIndex: 7, badge: '🌌 Tier 8', subtitle: 'Vórtice Cósmico', roundsDuration: 34 },
  { level: 9, name: 'Arena 9: Santuario Celestial', mapIndex: 8, badge: '✨ Tier 9', subtitle: 'Palacio en las Nubes', roundsDuration: 36 },
  { level: 10, name: 'Arena 10: Ciudadela de las Tormentas', mapIndex: 9, badge: '🌩️ Tier 10', subtitle: 'Bastión del Trueno', roundsDuration: 38 },
  { level: 11, name: 'Arena 11: Selva Primordial', mapIndex: 10, badge: '🌿 Tier 11', subtitle: 'Ruinas Bioluminiscentes', roundsDuration: 40 },
  { level: 12, name: 'Arena 12: Fragua Infernal', mapIndex: 11, badge: '🌋 Tier 12', subtitle: 'Fundición Primordial', roundsDuration: 42 },
  { level: 13, name: 'Arena 13: Nexo Astral', mapIndex: 12, badge: '🔮 Tier 13', subtitle: 'Ruedas del Zodíaco', roundsDuration: 44 },
  { level: 14, name: 'Arena 14: Cripta de las Sombras', mapIndex: 13, badge: '💀 Tier 14', subtitle: 'Catedral Espectral', roundsDuration: 46 },
  { level: 15, name: 'Arena 15: Trono del Valhalla', mapIndex: 14, badge: '👑 Suprema', subtitle: 'Cúspide de las Divinidades', roundsDuration: 50 }
];

export const ARENAS: ArenaInfo[] = (() => {
  let currentStart = 1;
  return ARENA_LEVELS.map((cfg, idx) => {
    const isLast = idx === ARENA_LEVELS.length - 1;
    const minWave = currentStart;
    const maxWave = isLast ? Infinity : currentStart + cfg.roundsDuration - 1;
    currentStart = maxWave + 1;
    return {
      arenaLevel: cfg.level,
      name: cfg.name,
      minWave,
      maxWave,
      roundsRequired: cfg.roundsDuration,
      map: MAPS[cfg.mapIndex],
      badge: cfg.badge,
      subtitle: cfg.subtitle
    };
  });
})();

export function getArenaForWave(waveNumber: number): ArenaInfo {
  for (const arena of ARENAS) {
    if (waveNumber >= arena.minWave && waveNumber <= arena.maxWave) {
      return arena;
    }
  }
  return ARENAS[ARENAS.length - 1];
}

export function getArenaByLevel(level: number): ArenaInfo {
  const found = ARENAS.find((a) => a.arenaLevel === level);
  return found || ARENAS[0];
}

export function getArenaByMapId(mapId: string): ArenaInfo {
  const found = ARENAS.find((a) => a.map.id === mapId);
  return found || ARENAS[0];
}
