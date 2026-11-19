import React from 'react';
import { PlacedUnit, TargetStrategy } from '../types/game';
import { UNITS } from '../data/units';
import {
  getLevelStatMultiplier,
  getInMatchUnitTier,
  canUseUnitShowdown,
  MAX_IN_MATCH_LEVEL
} from '../utils/progression';
import {
  Sparkles,
  ArrowUpCircle,
  DollarSign,
  Crosshair,
  X,
  Zap,
  Target,
  Flame,
  Snowflake,
  Shield,
  Coins,
  Lock,
  Star
} from 'lucide-react';
import { GameImage } from './GameImage';

interface UnitInspectorProps {
  unit: PlacedUnit;
  cardLevel?: number;
  currentGold: number;
  onUpgradeUnit: (instanceId: string) => void;
  onSellUnit: (instanceId: string) => void;
  onChangeStrategy: (instanceId: string, strategy: TargetStrategy) => void;
  onTriggerShowdown: (instanceId: string) => void;
  onClose: () => void;
  onOpenArmory?: () => void;
}

export const UnitInspector: React.FC<UnitInspectorProps> = ({
  unit,
  cardLevel = 1,
  currentGold,
  onUpgradeUnit,
  onSellUnit,
  onChangeStrategy,
  onTriggerShowdown,
  onClose,
  onOpenArmory
}) => {
  const bp = UNITS[unit.blueprintId];
  if (!bp) return null;

  const currentTier = getInMatchUnitTier(bp, unit.level);
  const nextTier = unit.level < MAX_IN_MATCH_LEVEL ? getInMatchUnitTier(bp, unit.level + 1) : null;
  const canAffordUpgrade = nextTier ? currentGold >= nextTier.cost : false;
  const refundAmount = Math.floor(unit.totalInvestment * 0.7);

  const masteryMultiplier = getLevelStatMultiplier(cardLevel);
  const isShowdownUnlocked = canUseUnitShowdown(cardLevel, unit.level);

  // Effective stats with card mastery
  const effectiveDamage = Math.round(currentTier.damage * masteryMultiplier.damageMult);
  const effectiveAtkSpeed = (currentTier.attackSpeed * masteryMultiplier.speedMult).toFixed(2);

  const getRoleIcon = () => {
    switch (bp.role) {
      case 'ataque':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'area':
        return <Flame className="w-4 h-4 text-red-400" />;
      case 'control':
        return <Snowflake className="w-4 h-4 text-cyan-400" />;
      case 'economia':
        return <Coins className="w-4 h-4 text-yellow-400" />;
      case 'soporte':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'invocador':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'multiplicador':
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case 'especial':
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl transition-all">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border shadow-lg relative"
            style={{
              backgroundColor: bp.colorTheme.bg,
              borderColor: bp.colorTheme.primary
            }}
          >
            {bp.imageUrl ? (
              <GameImage
                src={bp.imageUrl}
                alt={bp.name}
                className="w-full h-full object-cover"
                fallback={
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: bp.colorTheme.primary }}
                  />
                }
              />
            ) : (
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: bp.colorTheme.primary }}
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base text-slate-100">{bp.name}</h3>
              <span className="text-xs font-mono tabular-nums text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/50">
                Nivel {unit.level} / {MAX_IN_MATCH_LEVEL}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                {getRoleIcon()}
                <span className="capitalize">{bp.role}</span>
              </span>
              <span>·</span>
              <span className="text-slate-400 font-mono">
                Casilla ({unit.gridX}, {unit.gridY})
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          title="Cerrar panel (ESC)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Column 1: Current Stats & Performance */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="uppercase tracking-wider">Estadísticas</span>
            <span className="text-[10px] text-cyan-400 font-mono">
              Carta Nv.{cardLevel}/10 {cardLevel > 1 && `(+${Math.round((masteryMultiplier.damageMult - 1) * 100)}% daño)`}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Daño Efectivo</div>
              <div className="font-bold font-mono text-slate-100 text-sm">
                {effectiveDamage}{' '}
                {cardLevel > 1 && (
                  <span className="text-[10px] text-emerald-400 font-normal">
                    (base {currentTier.damage})
                  </span>
                )}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Alcance</div>
              <div className="font-bold font-mono text-slate-100 text-sm">{currentTier.range} px</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Cadencia</div>
              <div className="font-bold font-mono text-slate-100 text-sm">
                {effectiveAtkSpeed}/s
              </div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Bajas / Kills</div>
              <div className="font-bold font-mono text-emerald-400 text-sm">{unit.kills}</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
            <span>Daño Total:</span>
            <span className="font-mono text-slate-200 font-semibold">{Math.floor(unit.damageDealt)}</span>
          </div>
        </div>

        {/* Column 2: Targeting Strategy & Showdown Ability */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase font-bold text-slate-400 tracking-wider mb-1.5">
              <Crosshair className="w-3.5 h-3.5 text-blue-400" /> Prioridad de Objetivo
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {(['first', 'last', 'strongest', 'weakest'] as TargetStrategy[]).map((strat) => {
                const labelMap: Record<TargetStrategy, string> = {
                  first: 'Primero',
                  last: 'Último',
                  strongest: 'Más Fuerte',
                  weakest: 'Más Débil'
                };
                const isActive = unit.targetStrategy === strat;
                return (
                  <button
                    key={strat}
                    onClick={() => onChangeStrategy(unit.instanceId, strat)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/90 text-white border-blue-400 shadow-sm'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {labelMap[strat]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Showdown Ability Box */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {bp.showdownName}
              </span>
              {isShowdownUnlocked ? (
                <span className="text-[10px] text-amber-300 font-mono font-bold">
                  {unit.showdownReady ? '¡LISTO!' : `${Math.ceil(unit.showdownCooldownTimer)}s CD`}
                </span>
              ) : (
                <span className="text-[10px] text-red-400 font-mono font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Bloqueado
                </span>
              )}
            </div>

            {bp.showdownImageUrl && (
              <div className="w-full h-14 rounded-lg overflow-hidden border border-amber-800/40 mb-1.5 relative">
                <GameImage
                  src={bp.showdownImageUrl}
                  alt={bp.showdownName}
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              </div>
            )}

            <p className="text-[11px] text-slate-400 leading-tight mb-2">
              {bp.showdownDescription}
            </p>

            {isShowdownUnlocked ? (
              <button
                onClick={() => onTriggerShowdown(unit.instanceId)}
                disabled={!unit.showdownReady}
                title="También puedes mantener presionado 2 segundos sobre el personaje en la arena para lanzarlo"
                className={`w-full py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  unit.showdownReady
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer ring-2 ring-amber-300'
                    : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {unit.showdownReady
                    ? '¡Activar Showdown! [Q]'
                    : `Recargando (${Math.ceil(unit.showdownCooldownTimer)}s)`}
                </span>
              </button>
            ) : (
              <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-2.5 text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-amber-300 font-bold mb-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Showdown en Arena Nv.3 o Carta Nv.3</span>
                </div>
                <p className="text-[10px] text-slate-400 mb-2">
                  Sube esta unidad al Nivel 3 durante la partida o sube la carta a Nv.3 para activar su habilidad definitiva.
                </p>
                {onOpenArmory && (
                  <button
                    onClick={onOpenArmory}
                    className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/50 text-amber-300 hover:bg-amber-900 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Mejorar Carta (Nv. {cardLevel}/10)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Upgrade & Sell */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Mejora de Unidad
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: MAX_IN_MATCH_LEVEL }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-3 h-1.5 rounded-full ${
                      idx < unit.level
                        ? unit.level >= 6
                          ? 'bg-pink-400'
                          : unit.level >= 4
                          ? 'bg-emerald-400'
                          : 'bg-amber-400'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
            {nextTier ? (
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-200">
                  Nv.{unit.level + 1}: {nextTier.name}
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  {nextTier.description}
                </div>
                {nextTier.bonusEffect && (
                  <div className="text-[11px] text-emerald-400 font-medium">
                    ✦ {nextTier.bonusEffect}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs font-mono tabular-nums pt-1 text-slate-300">
                  <span>Daño: {currentTier.damage} → <span className="text-emerald-400 font-bold">{nextTier.damage}</span></span>
                  <span>Alcance: {currentTier.range} → <span className="text-blue-400 font-bold">{nextTier.range}</span></span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-amber-300 py-4 text-center font-bold">
                ✦ Nivel {MAX_IN_MATCH_LEVEL} Trascendencia Máxima ✦
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {nextTier && (
              <button
                onClick={() => onUpgradeUnit(unit.instanceId)}
                disabled={!canAffordUpgrade}
                className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  canAffordUpgrade
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md active:scale-95 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                }`}
              >
                <ArrowUpCircle className="w-4 h-4" />
                <span>Mejorar ({nextTier.cost} oro)</span>
              </button>
            )}

            <button
              onClick={() => onSellUnit(unit.instanceId)}
              className="w-full py-1.5 px-3 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Vender Unidad (+{refundAmount} oro)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
