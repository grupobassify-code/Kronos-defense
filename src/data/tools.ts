import { TacticalToolDefinition, TacticalToolId } from '../types/game';

export const TACTICAL_TOOLS: TacticalToolDefinition[] = [
  {
    id: 'shovel',
    name: 'Pala Táctica',
    shortName: 'Pala',
    unlockArena: 1,
    cooldownRounds: 1,
    requiresMapTarget: true,
    description: 'Retira una unidad de su casilla y recupera el 100% del oro invertido.',
    usageHint: 'Haz clic en una unidad colocada para retirarla y recuperar el 100% de su oro.'
  },
  {
    id: 'hammer',
    name: 'Martillo Rompepiedras',
    shortName: 'Martillo',
    unlockArena: 2,
    cooldownRounds: 5,
    requiresMapTarget: true,
    description: 'Destruye 1 piedra del mapa para liberar una nueva casilla construible (cada 5 rondas).',
    usageHint: 'Haz clic sobre cualquier piedra del mapa para destruirla y poder construir ahí.'
  },
  {
    id: 'battery',
    name: 'Batería Crono',
    shortName: 'Batería',
    unlockArena: 3,
    cooldownRounds: 4,
    requiresMapTarget: true,
    description: 'Recarga al instante el Showdown de una unidad y le da +50% velocidad por 8s.',
    usageHint: 'Haz clic sobre una unidad aliada para recargar su Showdown de inmediato.'
  },
  {
    id: 'bomb',
    name: 'Carga Sísmica',
    shortName: 'Bomba',
    unlockArena: 4,
    cooldownRounds: 3,
    requiresMapTarget: true,
    description: 'Explota un área de 115px dañando, aturdiendo y empujando atrás a los enemigos.',
    usageHint: 'Haz clic en cualquier zona del mapa para detonar la carga explosiva.'
  },
  {
    id: 'core_shield',
    name: 'Sello del Núcleo',
    shortName: 'Escudo',
    unlockArena: 5,
    cooldownRounds: 6,
    requiresMapTarget: false,
    description: 'Repara +2 Vidas del Núcleo Crono al instante sin costo de oro.',
    usageHint: 'Uso inmediato: restaura +2 Vidas al Núcleo.'
  },
  {
    id: 'wrench',
    name: 'Llave Maestra',
    shortName: 'Llave',
    unlockArena: 6,
    cooldownRounds: 7,
    requiresMapTarget: true,
    description: 'Sube +1 Nivel en Arena GRATIS a cualquier unidad colocada (hasta Nv.6).',
    usageHint: 'Haz clic sobre una unidad aliada (Nv.1 a 5) para mejorarla +1 Nivel gratis.'
  }
];

export const TACTICAL_TOOL_MAP: Record<TacticalToolId, TacticalToolDefinition> = TACTICAL_TOOLS.reduce(
  (acc, tool) => {
    acc[tool.id] = tool;
    return acc;
  },
  {} as Record<TacticalToolId, TacticalToolDefinition>
);

export function getToolUnlockedAtArena(arenaLevel: number): TacticalToolDefinition | null {
  return TACTICAL_TOOLS.find((t) => t.unlockArena === arenaLevel) || null;
}
