import { EnemyBlueprint, EnemyType } from '../types/game';

export const ENEMIES: Record<EnemyType, EnemyBlueprint> = {
  soldier: {
    id: 'soldier',
    name: 'Autómata Soldado',
    description: 'Unidad de choque equilibrada con blindaje estándar y velocidad moderada.',
    baseHealth: 72,
    speed: 70,
    armor: 2,
    goldReward: 5,
    coreDamage: 8,
    size: 14,
    color: '#64748B',
    accentColor: '#38BDF8',
    imageUrl: '/assets/images/enemy_automata_soldier_1794952310511.jpg'
  },

  scout: {
    id: 'scout',
    name: 'Viper Veloz',
    description: 'Nave de reconocimiento ligera y ultra rápida. Baja resistencia pero difícil de interceptar.',
    baseHealth: 44,
    speed: 132,
    armor: 0,
    goldReward: 4,
    coreDamage: 6,
    size: 11,
    color: '#F97316',
    accentColor: '#FDE047',
    imageUrl: '/assets/images/enemy_viper_scout_1794952311285.jpg'
  },

  tank: {
    id: 'tank',
    name: 'Coloso Blindado',
    description: 'Armadura pesada de titanio que mitiga daño plano. Enorme reserva de vida y paso implacable.',
    baseHealth: 310,
    speed: 44,
    armor: 10,
    goldReward: 14,
    coreDamage: 22,
    size: 18,
    color: '#475569',
    accentColor: '#DC2626',
    imageUrl: '/assets/images/enemy_coloso_tank_1794952311724.jpg'
  },

  swarm: {
    id: 'swarm',
    name: 'Dron Enjambre',
    description: 'Micro-cápsulas rápidas que avanzan en grupos densos para saturar las defensas individuales.',
    baseHealth: 26,
    speed: 96,
    armor: 0,
    goldReward: 2,
    coreDamage: 3,
    size: 9,
    color: '#10B981',
    accentColor: '#6EE7B7',
    imageUrl: '/assets/images/enemy_dron_enjambre_1794952312396.jpg'
  },

  special: {
    id: 'special',
    name: 'Caminante de Fase',
    description: 'Genera un escudo cinético protector que absorbe los primeros impactos antes de dañar su casco.',
    baseHealth: 165,
    speed: 68,
    armor: 5,
    goldReward: 9,
    coreDamage: 12,
    size: 15,
    color: '#8B5CF6',
    accentColor: '#C084FC',
    imageUrl: '/assets/images/enemy_caminante_fase_1794952416363.jpg',
    specialAbility: 'Escudo de fase cinético'
  },

  boss_goliath: {
    id: 'boss_goliath',
    name: 'Goliath Titánico (Jefe)',
    description: 'Jefe masivo de asedio. Cuenta con blindaje colosal, resistencia al aturdimiento y causa daño crítico al Núcleo.',
    baseHealth: 1850,
    speed: 35,
    armor: 14,
    goldReward: 65,
    coreDamage: 45,
    size: 26,
    color: '#E11D48',
    accentColor: '#FDA4AF',
    imageUrl: '/assets/images/boss_goliath_1791483684669.jpg',
    isBoss: true,
    specialAbility: 'Resistente a CC duro · Daño devastador a la base'
  },

  boss_eclipse: {
    id: 'boss_eclipse',
    name: 'Señor del Eclipse Cósmico (Jefe Final)',
    description: 'Gobernante sombrío interdimensional. Protegido por escudo estelar y pulsos de interferencia.',
    baseHealth: 4800,
    speed: 32,
    armor: 20,
    goldReward: 120,
    coreDamage: 60,
    size: 32,
    color: '#4C1D95',
    accentColor: '#F43F5E',
    imageUrl: '/assets/images/boss_eclipse_1791483718360.jpg',
    isBoss: true,
    specialAbility: 'Escudo estelar y resistencia al control de masas'
  },

  // Arena 2+: Volcanic & High Tier Heavy Enemies
  pyro_golem: {
    id: 'pyro_golem',
    name: 'Gólem de Magma',
    description: 'Enorme elemental de roca volcánica y fuego fundido. Armadura extrema y resistencia térmica colosal.',
    baseHealth: 540,
    speed: 40,
    armor: 15,
    goldReward: 18,
    coreDamage: 25,
    size: 21,
    color: '#B91C1C',
    accentColor: '#F59E0B',
    imageUrl: '/assets/images/enemy_pyro_golem_1794952313032.jpg',
    specialAbility: 'Blindaje ígneo de magma refractario'
  },

  magma_fiend: {
    id: 'magma_fiend',
    name: 'Demonio de Fuego',
    description: 'Criatura rápida nacida de las calderas del Volcán. Se abalanza a gran velocidad por el camino.',
    baseHealth: 185,
    speed: 102,
    armor: 5,
    goldReward: 10,
    coreDamage: 14,
    size: 13,
    color: '#DC2626',
    accentColor: '#FBBF24',
    imageUrl: '/assets/images/enemy_magma_fiend_1794952313345.jpg',
    specialAbility: 'Paso ardiente veloz'
  },

  cyber_dreadnought: {
    id: 'cyber_dreadnought',
    name: 'Acorazado Cibernético',
    description: 'Titán mecánico pesado de las arenas cibernéticas. Equipado con coraza y escudo deflector de iones.',
    baseHealth: 860,
    speed: 38,
    armor: 18,
    goldReward: 25,
    coreDamage: 30,
    size: 23,
    color: '#1E3A8A',
    accentColor: '#38BDF8',
    imageUrl: '/assets/images/enemy_cyber_dreadnought_1794952315248.jpg',
    specialAbility: 'Escudo electrodinámico superconductor'
  },

  void_reaver: {
    id: 'void_reaver',
    name: 'Segador del Vacío',
    description: 'Asesino interdimensional etéreo. Desplaza su cuerpo con escudo cuántico y altísima velocidad.',
    baseHealth: 320,
    speed: 116,
    armor: 7,
    goldReward: 16,
    coreDamage: 20,
    size: 14,
    color: '#581C87',
    accentColor: '#C084FC',
    imageUrl: '/assets/images/enemy_void_reaver_1794952314682.jpg',
    specialAbility: 'Escudo y evasión de fase cuántica'
  },

  boss_infernal: {
    id: 'boss_infernal',
    name: 'Señor del Núcleo Volcánico (Jefe Magmático)',
    description: 'Gigante ancestral de magma que domina el Cañón y la Fragua. Desata calor extremo y es resistente al control de masas.',
    baseHealth: 3300,
    speed: 34,
    armor: 18,
    goldReward: 90,
    coreDamage: 55,
    size: 28,
    color: '#991B1B',
    accentColor: '#F97316',
    imageUrl: '/assets/images/boss_volcanic_lord_1794952277929.jpg',
    isBoss: true,
    specialAbility: 'Resistencia al aturdimiento · Escudo magmático'
  }
};

export const ENEMY_LIST = Object.values(ENEMIES);
