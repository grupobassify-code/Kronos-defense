export type CheatCodeEffectId =
  | 'FREE_STORE_60S'
  | 'SKIP_ARENA'
  | 'UNLOCK_ALL_CARDS'
  | 'MEGA_VAULT'
  | 'COSMIC_PACKS'
  | 'MAX_LEVEL_CARDS'
  | 'UNLOCK_ALL_ARENAS'
  | 'GOD_MATCH'
  | 'NUKE_WAVE'
  | 'CHRONO_TOOLS'
  | 'NORMAL_RECRUIT_1'
  | 'NORMAL_RECRUIT_2'
  | 'NORMAL_STRENGTH_250'
  | 'NORMAL_VAULT_SUPPLY'
  | 'NORMAL_ELITE_TRAINING'
  | 'NORMAL_FIELD_BONUS';

export interface CheatCodeDefinition {
  code: string;
  tier: 'op' | 'normal';
  effectId: CheatCodeEffectId;
  title: string;
  description: string;
}

export const CHEAT_CODES: CheatCodeDefinition[] = [
  // 10 Códigos de Hackeo Chetados (ocultos)
  {
    code: '/com@nd981#freestore',
    tier: 'op',
    effectId: 'FREE_STORE_60S',
    title: 'Tienda Gratis (1 Minuto)',
    description: 'Todas las cartas, sobres, cofres, lotes y PH de la tienda cuestan 0 monedas durante 60 segundos.'
  },
  {
    code: '/com@nd742#skiparena',
    tier: 'op',
    effectId: 'SKIP_ARENA',
    title: 'Salto Cuántico de Arena',
    description: 'Completa automáticamente tu arena actual, rompe el candado de la siguiente y otorga sus recompensas.'
  },
  {
    code: '/com@nd404#allcards',
    tier: 'op',
    effectId: 'UNLOCK_ALL_CARDS',
    title: 'Colección Completa (100 Cartas)',
    description: 'Desbloquea todas las cartas existentes (incluidas Legendarias y Divinidades) con Showdown habilitado.'
  },
  {
    code: '/com@nd999#megavault',
    tier: 'op',
    effectId: 'MEGA_VAULT',
    title: 'Bóveda Infinita',
    description: 'Agrega +100,000 monedas a tu Bóveda y +5,000 Puntos de Habilidad al instante.'
  },
  {
    code: '/com@nd616#cosmicdrop',
    tier: 'op',
    effectId: 'COSMIC_PACKS',
    title: 'Lluvia Cósmica de Sobres',
    description: 'Otorga +25 Sobres Crono y recluta al instante 3 cartas nuevas de máxima rareza.'
  },
  {
    code: '/com@nd314#maxpower',
    tier: 'op',
    effectId: 'MAX_LEVEL_CARDS',
    title: 'Maestría Nivel 10',
    description: 'Sube automáticamente todas tus cartas desbloqueadas al Nivel 10 Máximo.'
  },
  {
    code: '/com@nd555#arenapass',
    tier: 'op',
    effectId: 'UNLOCK_ALL_ARENAS',
    title: 'Pase Total 15 Arenas',
    description: 'Desbloquea las 15 Arenas, todas las Herramientas Tácticas y las 15 Divinidades en la Tienda.'
  },
  {
    code: '/com@nd777#godmatch',
    tier: 'op',
    effectId: 'GOD_MATCH',
    title: 'Sobrecarga Divina en Partida',
    description: '+50,000 oro en arena, todas tus unidades colocadas suben a Nivel 6 con Showdown listo y herramientas cargadas.'
  },
  {
    code: '/com@nd207#nukewave',
    tier: 'op',
    effectId: 'NUKE_WAVE',
    title: 'Aniquilación Orbital',
    description: 'Elimina al instante toda la oleada enemiga cobrando su oro y eleva el Núcleo a 25/25 Vidas.'
  },
  {
    code: '/com@nd888#chronotools',
    tier: 'op',
    effectId: 'CHRONO_TOOLS',
    title: 'Arsenal Hackeado',
    description: 'Destruye todas las piedras del mapa, recarga todas las Herramientas y otorga +15,000 monedas + 250 PH.'
  },

  // 6 Códigos Normales (/h@ckercode#XXX) ocultos en puntos específicos del juego
  {
    code: '/h@ckercode#231',
    tier: 'normal',
    effectId: 'NORMAL_RECRUIT_1',
    title: 'Recluta Táctico',
    description: 'Desbloquea 1 personaje nuevo de tu colección pendiente y otorga +80 Puntos de Fuerza (PH).'
  },
  {
    code: '/h@ckercode#407',
    tier: 'normal',
    effectId: 'NORMAL_RECRUIT_2',
    title: 'Refuerzo Doble',
    description: 'Desbloquea 2 personajes nuevos al azar para reforzar tu mazo táctico.'
  },
  {
    code: '/h@ckercode#518',
    tier: 'normal',
    effectId: 'NORMAL_STRENGTH_250',
    title: 'Inyección de Fuerza',
    description: 'Otorga +250 Puntos de Fuerza (PH) para potenciar el nivel de tus personajes.'
  },
  {
    code: '/h@ckercode#642',
    tier: 'normal',
    effectId: 'NORMAL_VAULT_SUPPLY',
    title: 'Suministros de Bóveda',
    description: 'Agrega +950 monedas a tu Bóveda y +1 Sobre Crono.'
  },
  {
    code: '/h@ckercode#785',
    tier: 'normal',
    effectId: 'NORMAL_ELITE_TRAINING',
    title: 'Entrenamiento de Élite',
    description: 'Otorga +400 Puntos de Fuerza (PH) y recluta 1 personaje nuevo.'
  },
  {
    code: '/h@ckercode#904',
    tier: 'normal',
    effectId: 'NORMAL_FIELD_BONUS',
    title: 'Bono de Campo',
    description: 'Otorga +1,500 de oro en tu batalla actual y +2 Sobres Crono.'
  }
];

export function findCheatCode(rawInput: string): CheatCodeDefinition | null {
  const normalized = rawInput.trim().toLowerCase();
  if (!normalized) return null;
  return CHEAT_CODES.find((c) => c.code.toLowerCase() === normalized) || null;
}
