import { Mission } from '../types/game';

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mission_first_battle',
    title: 'Bautismo de Fuego',
    description: 'Comienza tu andadura en el Modo Historia y supera la Ronda 3 en cualquier sector.',
    targetCount: 3,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardPacks: 1,
    category: 'story'
  },
  {
    id: 'mission_recon_kills',
    title: 'Limpieza de Vanguardia',
    description: 'Elimina a un total de 40 invasores hostiles con tus 3 cartas iniciales.',
    targetCount: 40,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardPacks: 1,
    category: 'combat'
  },
  {
    id: 'mission_wave_5',
    title: 'Resistencia Firme',
    description: 'Defiende el Núcleo Crono y supera la Ronda 5 en el Valle Esmeralda.',
    targetCount: 5,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardPacks: 1,
    category: 'story'
  },
  {
    id: 'mission_defeat_boss',
    title: 'Caída del Titán',
    description: 'Derrota a tu primer Jefe (Goliath Titánico en la Ronda 10) para asegurar el sector.',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardPacks: 2,
    category: 'story'
  },
  {
    id: 'mission_slayer_150',
    title: 'Maestro Defensor',
    description: 'Aniquila 150 enemigos en combate acumulado a lo largo de tus incursiones.',
    targetCount: 150,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardPacks: 2,
    category: 'combat'
  },
  {
    id: 'mission_wealth',
    title: 'Cofre de Guerra',
    description: 'Acumula un total de 2,000 monedas de oro en recompensas de combate.',
    targetCount: 2000,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardPacks: 1,
    category: 'economy'
  },
  {
    id: 'mission_wave_15',
    title: 'Presión Crítica',
    description: 'Resiste la embestida hostil y alcanza la Ronda 15 en cualquier mapa.',
    targetCount: 15,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardPacks: 2,
    category: 'story'
  },
  {
    id: 'mission_eclipse_victory',
    title: 'Fin del Eclipse Cósmico',
    description: 'Derrota al Señor del Eclipse en la Ronda 20 y completa la campaña de la historia.',
    targetCount: 20,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardPacks: 3,
    category: 'story'
  }
];
