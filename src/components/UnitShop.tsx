import React from 'react';
import { UnitBlueprint, UnitRole, UnitRarity } from '../types/game';
import { UNIT_LIST, UNITS } from '../data/units';
import { getRarityMeta, compareRarities } from '../utils/rarity';
import { Coins, Zap, Shield, Flame, Snowflake, Sparkles, Lock, Star } from 'lucide-react';

interface UnitShopProps {
  currentGold: number;
  selectedBlueprintId: string | null;
  activeDeckCardIds: string[];
  cardMasteryLevels: Record<string, number>;
  placedUnits?: { blueprintId: string }[];
  onSelectBlueprint: (id: string | null) => void;
  onOpenArmory?: () => void;
}

export const UnitShop: React.FC<UnitShopProps> = ({
  currentGold,
  selectedBlueprintId,
  activeDeckCardIds,
  cardMasteryLevels,
  placedUnits = [],
  onSelectBlueprint,
  onOpenArmory
}) => {
  const safeDeckCards = [...(activeDeckCardIds || [])].sort((aId, bId) => {
    const a = UNITS[aId];
    const b = UNITS[bId];
    if (!a || !b) return 0;
    return compareRarities(a.rarity, b.rarity);
  });

  const getRoleIcon = (role: UnitRole) => {
    switch (role) {
      case 'ataque':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'area':
        return <Flame className="w-3.5 h-3.5 text-red-400" />;
      case 'control':
        return <Snowflake className="w-3.5 h-3.5 text-cyan-400" />;
      case 'economia':
        return <Coins className="w-3.5 h-3.5 text-yellow-400" />;
      case 'soporte':
        return <Shield className="w-3.5 h-3.5 text-emerald-400" />;
      case 'invocador':
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
      case 'multiplicador':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      case 'especial':
      default:
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const getRoleLabel = (role: UnitRole) => {
    switch (role) {
      case 'ataque':
        return 'Ataque';
      case 'area':
        return 'Área';
      case 'control':
        return 'Control';
      case 'economia':
        return 'Economía';
      case 'soporte':
        return 'Soporte';
      case 'invocador':
        return 'Invocador';
      case 'multiplicador':
        return 'Multiplicador';
      case 'especial':
      default:
        return 'Especial';
    }
  };

  const getRarityBadge = (rarity: UnitRarity) => {
    switch (rarity) {
      case 'comun':
        return 'text-slate-400 border-slate-700 bg-slate-800/40';
      case 'rara':
        return 'text-cyan-400 border-cyan-800/50 bg-cyan-950/30';
      case 'epica':
        return 'text-emerald-400 border-emerald-800/50 bg-emerald-950/30';
      case 'legendaria':
        return 'text-purple-400 border-purple-800/50 bg-purple-950/30';
    }
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-black text-cyan-400 flex items-center gap-1.5">
            <span>⚔️ Mazo de Batalla Activo</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300">
              {safeDeckCards.length}/7 Cartas
            </span>
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            (Haz clic en una carta de tu mazo y colócala en una casilla táctica)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedBlueprintId && (
            <button
              onClick={() => onSelectBlueprint(null)}
              className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-0.5 rounded-lg border border-red-900/40 bg-red-950/30 transition-colors cursor-pointer"
            >
              Cancelar (ESC)
            </button>
          )}
          {onOpenArmory && (
            <button
              onClick={onOpenArmory}
              className="text-xs text-purple-300 hover:text-white font-bold px-2.5 py-1 rounded-xl border border-purple-500/50 bg-purple-950/60 hover:bg-purple-900/80 transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span>🎴 Configurar Mazo & Armería</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid or Horizontal Scroll of the 7 Battle Deck Slots */}
      <div className="flex overflow-x-auto pb-1 sm:grid sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-2.5 no-scrollbar scroll-smooth">
        {safeDeckCards.map((cardId) => {
          const unit = UNITS[cardId];
          if (!unit) return null;

          const isDivinity = unit.rarity === 'divinidad';
          // User requirement: "recuerda un divino solo se puede poner una vez"
          // Only ONE Divine character can be deployed on the battlefield at a time!
          const hasAnyDivinityOnField = placedUnits.some((u) => UNITS[u.blueprintId]?.rarity === 'divinidad');
          const isDivinityExhausted = isDivinity && hasAnyDivinityOnField;

          const isSelected = selectedBlueprintId === unit.id;
          const canAfford = currentGold >= unit.cost;
          const level = cardMasteryLevels[unit.id] || 1;
          const isMaxShowdown = level >= 10;
          const rMeta = getRarityMeta(unit.rarity);

          return (
            <button
              key={unit.id}
              disabled={isDivinityExhausted}
              title={
                isDivinityExhausted
                  ? '¡Límite Divino! Solo puedes tener 1 Personaje Divino en el campo de batalla a la vez.'
                  : isDivinity
                  ? 'Personaje Divino Único: Solo puede colocarse 1 Divino a la vez en el campo.'
                  : unit.name
              }
              onClick={() => {
                if (isDivinityExhausted) return;
                if (isSelected) {
                  onSelectBlueprint(null);
                } else {
                  onSelectBlueprint(unit.id);
                }
              }}
              className={`shrink-0 w-[125px] sm:w-auto group relative text-left p-2.5 rounded-2xl border transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                isDivinityExhausted
                  ? 'bg-slate-950/80 border-slate-900 opacity-50 cursor-not-allowed grayscale'
                  : isSelected
                  ? `${rMeta.cardSelected} scale-[1.03]`
                  : canAfford
                  ? `${rMeta.cardBg} ${rMeta.cardBorder} ${rMeta.cardHover} active:scale-95`
                  : 'bg-slate-950/60 border-slate-900 opacity-60 hover:opacity-85'
              }`}
            >
              {/* Unit Header: Role & Card Level Badge */}
              <div className="flex items-center justify-between gap-1 w-full mb-1.5">
                <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-300">
                  {getRoleIcon(unit.role)}
                  <span className="truncate">{getRoleLabel(unit.role)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold font-mono ${
                      isMaxShowdown
                        ? 'bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-300 border border-amber-500/60 shadow-sm'
                        : 'bg-slate-900/90 text-cyan-300 border border-slate-700'
                    }`}
                  >
                    Nv.{level}
                  </span>
                </div>
              </div>

              {/* Rarity Pill Badge */}
              <div className="w-full flex items-center justify-between mb-1.5">
                <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded-md ${rMeta.badgeClass}`}>
                  {rMeta.badgeLabel}
                </span>
              </div>

              {/* Unit Emblem & Name */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border-2 shadow-md relative ${rMeta.cardBorder}`}
                  style={{
                    backgroundColor: unit.colorTheme.bg
                  }}
                >
                  {unit.imageUrl ? (
                    <img
                      src={unit.imageUrl}
                      alt={unit.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: unit.colorTheme.primary }}
                    />
                  )}
                  {isMaxShowdown && (
                    <div className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-0.5 shadow">
                      <Star className="w-2.5 h-2.5 fill-current" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className={`font-bold text-xs truncate ${rMeta.textColor}`}>
                    {unit.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {isMaxShowdown ? '★ Showdown' : `Nv.${level}`}
                  </div>
                </div>
              </div>

              {/* Bottom: Cost & Affordability status */}
              <div className="flex items-center justify-between w-full pt-1.5 border-t border-slate-800/80 text-xs">
                <div
                  className={`flex items-center gap-1 font-mono font-black ${
                    isDivinityExhausted
                      ? 'text-slate-500'
                      : canAfford
                      ? 'text-amber-300'
                      : 'text-red-400'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5 inline text-amber-400" />
                  <span>{unit.cost}</span>
                </div>
                {isDivinityExhausted ? (
                  <span className="text-[8px] text-amber-300 font-extrabold bg-amber-950/90 px-1 py-0.5 rounded border border-amber-500/60 flex items-center gap-0.5" title="Ya tienes 1 Divino en el campo">
                    <span>⚡</span> 1 Divino Max
                  </span>
                ) : !canAfford ? (
                  <span className="text-[10px] text-red-400 font-medium">Falta oro</span>
                ) : isSelected ? (
                  <span className="text-[10px] text-cyan-300 font-black animate-pulse">
                    Listo
                  </span>
                ) : isDivinity ? (
                  <span className="text-[9px] text-amber-300 font-black flex items-center gap-0.5">
                    <span>👑</span> 1x Campo
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}

        {/* Empty Deck Slot Placeholders (if player hasn't unlocked/equipped 7 cards yet) */}
        {Array.from({ length: Math.max(0, 7 - safeDeckCards.length) }).map((_, idx) => (
          <div
            key={`empty_slot_${idx}`}
            onClick={onOpenArmory}
            className="p-2.5 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center text-center p-3 text-slate-500 hover:border-purple-500/40 hover:text-purple-300 transition-colors cursor-pointer select-none min-h-[96px]"
            title="Ranura de Mazo libre. Desbloquea y equipa cartas en el Menú de Cartas."
          >
            <div className="w-7 h-7 rounded-lg border border-dashed border-slate-800 flex items-center justify-center mb-1 text-slate-600">
              +
            </div>
            <div className="text-[10px] font-bold">Ranura Libre</div>
            <div className="text-[9px] text-slate-600">Mazo (Máx 7)</div>
          </div>
        ))}
      </div>
    </div>
  );
};

