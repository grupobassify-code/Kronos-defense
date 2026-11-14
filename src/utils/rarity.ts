import { UnitRarity } from '../types/game';

export interface RarityMeta {
  key: UnitRarity;
  order: number; // 1 (común) -> 5 (divinidad)
  label: string;
  badgeLabel: string;
  badgeClass: string;
  cardBorder: string;
  cardBg: string;
  cardHover: string;
  cardSelected: string;
  glowClass: string;
  textColor: string;
  primaryHex: string;
  accentHex: string;
}

export const RARITY_ORDER: Record<string, number> = {
  comun: 1,
  especial: 2,
  rara: 2, // normalizada a especial
  epica: 3,
  legendaria: 4,
  divinidad: 5
};

export const RARITY_LIST: { key: UnitRarity | 'all'; label: string; order: number }[] = [
  { key: 'all', label: 'Todas', order: 0 },
  { key: 'comun', label: 'Comunes', order: 1 },
  { key: 'especial', label: 'Especiales', order: 2 },
  { key: 'epica', label: 'Épicas', order: 3 },
  { key: 'legendaria', label: 'Legendarias', order: 4 },
  { key: 'divinidad', label: 'Divinidad', order: 5 }
];

export function compareRarities(aRarity: UnitRarity | string, bRarity: UnitRarity | string): number {
  const aNorm = aRarity === 'rara' ? 'especial' : aRarity;
  const bNorm = bRarity === 'rara' ? 'especial' : bRarity;
  return (RARITY_ORDER[aNorm] || 1) - (RARITY_ORDER[bNorm] || 1);
}

export function getRarityMeta(rarity?: UnitRarity | string): RarityMeta {
  const norm = rarity === 'rara' ? 'especial' : rarity;

  switch (norm) {
    case 'divinidad':
      return {
        key: 'divinidad',
        order: 5,
        label: 'Divinidad',
        badgeLabel: '✨ DIVINIDAD ✨',
        badgeClass: 'bg-gradient-to-r from-amber-300 via-rose-400 to-indigo-300 text-slate-950 border border-amber-200 shadow-md font-black tracking-wider animate-pulse',
        cardBorder: 'border-amber-300 ring-2 ring-rose-400/80 shadow-lg shadow-amber-500/30',
        cardBg: 'bg-gradient-to-b from-amber-950/70 via-purple-950/60 to-slate-950',
        cardHover: 'hover:border-yellow-200 hover:ring-2 hover:ring-amber-300 hover:shadow-2xl hover:shadow-amber-400/50',
        cardSelected: 'bg-gradient-to-b from-amber-900/90 via-purple-900/80 to-slate-950 border-amber-200 ring-4 ring-amber-300 shadow-2xl shadow-amber-500/80',
        glowClass: 'shadow-amber-400/60 ring-2 ring-amber-300',
        textColor: 'text-amber-200 font-black',
        primaryHex: '#FBBF24',
        accentHex: '#F43F5E'
      };

    case 'legendaria':
      return {
        key: 'legendaria',
        order: 4,
        label: 'Legendaria',
        badgeLabel: '★ LEGENDARIA ★',
        badgeClass: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-300 text-slate-950 border border-amber-200 shadow-md font-black',
        cardBorder: 'border-cyan-400 ring-1 ring-amber-400/80',
        cardBg: 'bg-gradient-to-b from-cyan-950/50 via-purple-950/40 to-slate-950',
        cardHover: 'hover:border-cyan-300 hover:ring-2 hover:ring-amber-300 hover:shadow-xl hover:shadow-cyan-400/40',
        cardSelected: 'bg-cyan-950/90 border-cyan-300 ring-2 ring-amber-400 shadow-2xl shadow-cyan-900/90',
        glowClass: 'shadow-cyan-400/50',
        textColor: 'text-cyan-300',
        primaryHex: '#06B6D4',
        accentHex: '#FBBF24'
      };

    case 'epica':
      return {
        key: 'epica',
        order: 3,
        label: 'Épica',
        badgeLabel: 'ÉPICA',
        badgeClass: 'bg-purple-950/90 text-purple-300 border border-purple-500/80 shadow-sm font-black',
        cardBorder: 'border-purple-500/80',
        cardBg: 'bg-gradient-to-b from-purple-950/40 via-slate-900/90 to-slate-950',
        cardHover: 'hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30',
        cardSelected: 'bg-purple-950/80 border-purple-400 ring-2 ring-purple-400 shadow-xl shadow-purple-950/80',
        glowClass: 'shadow-purple-500/40',
        textColor: 'text-purple-400',
        primaryHex: '#A855F7',
        accentHex: '#E9D5FF'
      };

    case 'especial':
      return {
        key: 'especial',
        order: 2,
        label: 'Especial',
        badgeLabel: 'ESPECIAL',
        badgeClass: 'bg-amber-950/90 text-amber-300 border border-amber-500/80 shadow-sm font-black',
        cardBorder: 'border-amber-500/80',
        cardBg: 'bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-slate-950',
        cardHover: 'hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20',
        cardSelected: 'bg-amber-950/80 border-amber-400 ring-2 ring-amber-400 shadow-xl shadow-amber-950/80',
        glowClass: 'shadow-amber-500/30',
        textColor: 'text-amber-400',
        primaryHex: '#F59E0B',
        accentHex: '#FCD34D'
      };

    case 'comun':
    default:
      return {
        key: 'comun',
        order: 1,
        label: 'Común',
        badgeLabel: 'COMÚN',
        badgeClass: 'bg-slate-800 text-slate-200 border border-slate-600/80 font-bold',
        cardBorder: 'border-slate-600/80',
        cardBg: 'bg-gradient-to-b from-slate-800/60 via-slate-900/90 to-slate-950',
        cardHover: 'hover:border-slate-400 hover:shadow-md hover:shadow-slate-800/40',
        cardSelected: 'bg-slate-800 border-slate-300 ring-2 ring-slate-400 shadow-xl shadow-slate-950/80',
        glowClass: 'shadow-slate-500/20',
        textColor: 'text-slate-300',
        primaryHex: '#94A3B8',
        accentHex: '#E2E8F0'
      };
  }
}
