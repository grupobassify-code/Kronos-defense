import { EnemyBlueprint, EnemyType } from '../types/game';

export const ENEMIES: Record<EnemyType, EnemyBlueprint> = {
  soldier: {
    id: 'soldier',
    name: 'Autómata Soldado',
    description: 'Unidad de choque equilibrada con blindaje estándar y velocidad moderada.',
    baseHealth: 65,
    speed: 68,
    armor: 2,
    goldReward: 5,
    coreDamage: 8,
    size: 14,
    color: '#64748B',
    accentColor: '#38BDF8'
  },

  scout: {
    id: 'scout',
    name: 'Viper Veloz',
    description: 'Nave de reconocimiento ligera y ultra rápida. Baja resistencia pero difícil de interceptar.',
    baseHealth: 38,
    speed: 125,
    armor: 0,
    goldReward: 4,
    coreDamage: 6,
    size: 11,
    color: '#F97316',
    accentColor: '#FDE047'
  },

  tank: {
    id: 'tank',
    name: 'Coloso Blindado',
    description: 'Armadura pesada de titanio que mitiga daño plano. Enorme reserva de vida y paso implacable.',
    baseHealth: 260,
    speed: 42,
    armor: 8,
    goldReward: 14,
    coreDamage: 22,
    size: 18,
    color: '#475569',
    accentColor: '#DC2626'
  },

  swarm: {
    id: 'swarm',
    name: 'Dron Enjambre',
    description: 'Micro-cápsulas rápidas que avanzan en grupos densos para saturar las defensas individuales.',
    baseHealth: 22,
    speed: 92,
    armor: 0,
    goldReward: 2,
    coreDamage: 3,
    size: 9,
    color: '#10B981',
    accentColor: '#6EE7B7'
  },

  special: {
    id: 'special',
    name: 'Caminante de Fase',
    description: 'Genera una barrera de energía reactiva al recibir impactos, disipando un 40% del daño por 2s.',
    baseHealth: 140,
    speed: 64,
    armor: 4,
    goldReward: 9,
    coreDamage: 12,
    size: 15,
    color: '#8B5CF6',
    accentColor: '#C084FC',
    specialAbility: 'Escudo de fase cinético'
  },

  boss_goliath: {
    id: 'boss_goliath',
    name: 'Goliath Titánico (Jefe)',
    description: 'Jefe masivo de asedio. Cuenta con blindaje colosal, inmunidad al congelamiento total y causa daño crítico al Núcleo.',
    baseHealth: 1600,
    speed: 34,
    armor: 12,
    goldReward: 65,
    coreDamage: 45,
    size: 26,
    color: '#E11D48',
    accentColor: '#FDA4AF',
    imageUrl: '/src/assets/images/boss_goliath_1791483684669.jpg',
    isBoss: true,
    specialAbility: 'Inmune a CC duro · Daño devastador a la base'
  },

  boss_eclipse: {
    id: 'boss_eclipse',
    name: 'Señor del Eclipse Cósmico (Jefe Final)',
    description: 'Gobernante sombrío interdimensional. Absorbe energía de ataques y emite pulsos de interferencia periódicos.',
    baseHealth: 4200,
    speed: 30,
    armor: 18,
    goldReward: 120,
    coreDamage: 60,
    size: 32,
    color: '#4C1D95',
    accentColor: '#F43F5E',
    imageUrl: '/src/assets/images/boss_eclipse_1791483718360.jpg',
    isBoss: true,
    specialAbility: 'Aura de anulación y vitalidad estelar'
  },

  // Arena 2+: Volcanic & High Tier Heavy Enemies
  pyro_golem: {
    id: 'pyro_golem',
    name: 'Gólem de Magma',
    description: 'Enorme elemental de roca volcánica y fuego fundido. Armadura extrema y resistencia térmica colosal.',
    baseHealth: 480,
    speed: 38,
    armor: 14,
    goldReward: 18,
    coreDamage: 25,
    size: 21,
    color: '#B91C1C',
    accentColor: '#F59E0B',
    specialAbility: 'Blindaje ígneo de magma refractario'
  },

  magma_fiend: {
    id: 'magma_fiend',
    name: 'Demonio de Fuego',
    description: 'Criatura rápida nacida de las calderas del Volcán. Se abalanza a gran velocidad por el camino.',
    baseHealth: 160,
    speed: 95,
    armor: 4,
    goldReward: 10,
    coreDamage: 14,
    size: 13,
    color: '#DC2626',
    accentColor: '#FBBF24',
    specialAbility: 'Paso ardiente veloz'
  },

  cyber_dreadnought: {
    id: 'cyber_dreadnought',
    name: 'Acorazado Cibernético',
    description: 'Titán mecánico pesado de las arenas cibernéticas. Equipado con coraza deflectora de iones.',
    baseHealth: 750,
    speed: 36,
    armor: 16,
    goldReward: 25,
    coreDamage: 30,
    size: 23,
    color: '#1E3A8A',
    accentColor: '#38BDF8',
    specialAbility: 'Blindaje electrodinámico superconductor'
  },

  void_reaver: {
    id: 'void_reaver',
    name: 'Segador del Vacío',
    description: 'Asesino interdimensional etéreo. Desplaza su cuerpo a través de micro-fallas de la realidad.',
    baseHealth: 280,
    speed: 110,
    armor: 6,
    goldReward: 16,
    coreDamage: 20,
    size: 14,
    color: '#581C87',
    accentColor: '#C084FC',
    specialAbility: 'Evasión de fase cuántica'
  },

  boss_infernal: {
    id: 'boss_infernal',
    name: 'Señor del Núcleo Volcánico (Jefe Magmático)',
    description: 'Gigante ancestral de magma que domina el Cañón y la Fragua. Desata calor extremo y es inmune al control de masas.',
    baseHealth: 2800,
    speed: 32,
    armor: 16,
    goldReward: 90,
    coreDamage: 55,
    size: 28,
    color: '#991B1B',
    accentColor: '#F97316',
    isBoss: true,
    specialAbility: 'Inmunidad al aturdimiento total · Aura térmica corrosiva'
  }
};

export const ENEMY_LIST = Object.values(ENEMIES);
