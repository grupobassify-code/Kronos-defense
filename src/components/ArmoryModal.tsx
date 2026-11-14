import React, { useState } from 'react';
import { PlayerProgression } from '../types/game';
import { UNITS } from '../data/units';
import { LEVEL_UP_COSTS, getLevelStatMultiplier } from '../utils/progression';
import { sounds } from '../utils/audio';
import {
  X,
  Zap,
  Lock,
  Sparkles,
  ArrowUp,
  Shield,
  Flame,
  Snowflake,
  Coins,
  CheckCircle2
} from 'lucide-react';
import { GameImage } from './GameImage';

interface ArmoryModalProps {
  progression: PlayerProgression;
  onUpgradeCharacter: (unitId: string) => void;
  onClose: () => void;
  onOpenPacks: () => void;
}

export const ArmoryModal: React.FC<ArmoryModalProps> = ({
  progression,
  onUpgradeCharacter,
  onClose,
  onOpenPacks
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>(
    progression.unlockedCardIds[0] || 'vanguard_solar'
  );

  const allUnits = Object.values(UNITS);
  const selectedUnit = UNITS[selectedCardId] || allUnits[0];
  const isUnlocked = progression.unlockedCardIds.includes(selectedCardId);
  const currentLevel = progression.cardMasteryLevels[selectedCardId] || 1;
  const nextLevelCost = LEVEL_UP_COSTS[currentLevel] || null;
  const canAfford = nextLevelCost !== null && progression.skillPoints >= nextLevelCost;

  const currentStats = getLevelStatMultiplier(currentLevel);
  const nextStats = currentLevel < 10 ? getLevelStatMultiplier(currentLevel + 1) : null;

  const handleUpgrade = (unitId: string) => {
    if (!canAfford) return;
    sounds.playUpgrade();
    onUpgradeCharacter(unitId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-100 font-display">
                Colección de Cartas y Armería
              </h2>
              <p className="text-xs text-slate-400">
                Mejora a tus héroes hasta Nivel 10 para desbloquear su Showdown definitivo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Skill Points & Unopened packs badge */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold font-mono">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                <span>{progression.skillPoints} pts</span>
              </div>

              {progression.unopenedPacks > 0 && (
                <button
                  onClick={onOpenPacks}
                  className="ml-2 px-2.5 py-0.5 rounded-lg bg-purple-950/80 border border-purple-500/50 text-purple-300 font-bold text-[11px] animate-pulse cursor-pointer hover:bg-purple-900"
                >
                  Abrir Sobres ({progression.unopenedPacks})
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left: Card Selection Roster */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Cartas del Reino</span>
              <span>
                {progression.unlockedCardIds.length} / {allUnits.length} Desbloqueadas
              </span>
            </div>

            <div className="space-y-2">
              {allUnits.map((unit) => {
                const unlocked = progression.unlockedCardIds.includes(unit.id);
                const level = progression.cardMasteryLevels[unit.id] || 1;
                const isSelected = unit.id === selectedCardId;

                return (
                  <button
                    key={unit.id}
                    onClick={() => setSelectedCardId(unit.id)}
                    className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/70 border-blue-500 ring-2 ring-blue-500/40 shadow-lg'
                        : unlocked
                        ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                        : 'bg-slate-950/30 border-slate-900 opacity-60 hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border relative"
                        style={{
                          backgroundColor: unit.colorTheme.bg,
                          borderColor: unit.colorTheme.primary
                        }}
                      >
                        {unit.imageUrl ? (
                          <GameImage
                            src={unit.imageUrl}
                            alt={unit.name}
                            loading="lazy"
                            className={`w-full h-full object-cover ${!unlocked ? 'grayscale' : ''}`}
                            fallback={
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: unit.colorTheme.primary }}
                              />
                            }
                          />
                        ) : (
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: unit.colorTheme.primary }}
                          />
                        )}

                        {!unlocked && (
                          <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-100 truncate">
                          {unit.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span className="capitalize">{unit.role}</span>
                          {unlocked && (
                            <span className="text-amber-400 font-mono font-semibold">
                              Nv. {level}/10
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {unlocked ? (
                      <div className="text-right shrink-0">
                        {level >= 10 ? (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                            ★ MAESTRO
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">
                            Nv. {level}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono px-2 py-0.5 rounded border border-slate-800">
                        Bloqueada en Sobres
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Card Inspector & 10-Level Progression Tree */}
          <div className="md:col-span-7 space-y-4">
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 shadow-xl relative"
                    style={{
                      borderColor: selectedUnit.colorTheme.primary,
                      backgroundColor: selectedUnit.colorTheme.bg
                    }}
                  >
                    {selectedUnit.imageUrl ? (
                      <GameImage
                        src={selectedUnit.imageUrl}
                        alt={selectedUnit.name}
                        className={`w-full h-full object-cover ${!isUnlocked ? 'grayscale' : ''}`}
                        fallback={<div className="w-full h-full bg-slate-800" />}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-100 font-display">
                        {selectedUnit.name}
                      </h3>
                      {isUnlocked && (
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/50 text-blue-300">
                          Nivel {currentLevel}/10
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedUnit.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs uppercase font-mono tracking-wider px-2 py-0.5 rounded border bg-slate-900 border-slate-800 text-slate-300">
                    {selectedUnit.rarity}
                  </span>
                </div>
              </div>

              {!isUnlocked ? (
                /* Locked State Notice */
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center my-4">
                  <Lock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <div className="font-bold text-sm text-slate-200">Carta Bloqueada</div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-3">
                    Cumple misiones en el Modo Historia para ganar Sobres Crono y desbloquear a{' '}
                    <span className="text-slate-200 font-semibold">{selectedUnit.name}</span> para tu escuadrón.
                  </p>
                  {progression.unopenedPacks > 0 && (
                    <button
                      onClick={onOpenPacks}
                      className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                    >
                      Abrir Sobres Ahora ({progression.unopenedPacks})
                    </button>
                  )}
                </div>
              ) : (
                /* Unlocked: Level Mastery Bar & Showdown Status */
                <div className="space-y-4 pt-2">
                  {/* Mastery 10-step progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
                      <span>Progreso de Maestría</span>
                      <span className="text-slate-200 font-bold">{currentLevel} de 10 Niveles</span>
                    </div>
                    <div className="w-full grid grid-cols-10 gap-1 h-3 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                      {Array.from({ length: 10 }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`rounded-sm transition-all ${
                            idx + 1 <= currentLevel
                              ? idx + 1 === 10
                                ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                                : 'bg-blue-500'
                              : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Level Bonuses comparison */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <div className="text-[11px] text-slate-400">Bonus Nivel Actual ({currentLevel})</div>
                      <div className="font-mono text-emerald-400 font-bold mt-0.5">
                        +{((currentStats.damageMult - 1) * 100).toFixed(1)}% Daño
                      </div>
                      <div className="font-mono text-cyan-400 text-[11px]">
                        +{((currentStats.speedMult - 1) * 100).toFixed(1)}% Cadencia
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-slate-400">
                        {currentLevel < 10 ? `Próximo Nivel (${currentLevel + 1})` : 'Maestría Total'}
                      </div>
                      {nextStats ? (
                        <>
                          <div className="font-mono text-emerald-300 font-bold mt-0.5">
                            +{((nextStats.damageMult - 1) * 100).toFixed(1)}% Daño
                          </div>
                          <div className="font-mono text-cyan-300 text-[11px]">
                            +{((nextStats.speedMult - 1) * 100).toFixed(1)}% Cadencia
                          </div>
                        </>
                      ) : (
                        <div className="text-amber-400 font-bold mt-1 text-xs">
                          ★ Máximo Rendimiento
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SHOWDOWN UNLOCK STATUS (LOCKED UNTIL LEVEL 10!) */}
                  <div
                    className={`p-3.5 rounded-xl border transition-all ${
                      currentLevel >= 10
                        ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                        : 'bg-slate-900/90 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold flex items-center gap-1.5 text-slate-200">
                        <Sparkles
                          className={`w-4 h-4 ${
                            currentLevel >= 10 ? 'text-amber-400' : 'text-slate-500'
                          }`}
                        />
                        Habilidad Especial Showdown: {selectedUnit.showdownName}
                      </span>
                      {currentLevel >= 10 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 uppercase font-mono">
                          ¡DESBLOQUEADO!
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1 font-mono">
                          <Lock className="w-3 h-3" /> Requiere Nivel 10
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {selectedUnit.showdownDescription}
                    </p>
                  </div>

                  {/* Upgrade Action Button */}
                  {currentLevel < 10 && nextLevelCost !== null && (
                    <div className="pt-2">
                      <button
                        onClick={() => handleUpgrade(selectedCardId)}
                        disabled={!canAfford}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white shadow-lg shadow-emerald-900/30'
                            : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                        }`}
                      >
                        <ArrowUp className="w-4 h-4" />
                        <span>
                          Subir a Nivel {currentLevel + 1} ({nextLevelCost} Puntos de Habilidad)
                        </span>
                      </button>
                      {!canAfford && (
                        <div className="text-center text-[11px] text-slate-500 mt-1">
                          Te faltan {nextLevelCost - progression.skillPoints} puntos de habilidad (abre sobres para conseguir más).
                        </div>
                      )}
                    </div>
                  )}

                  {currentLevel >= 10 && (
                    <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-center text-xs text-amber-300 font-semibold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      <span>¡Esta carta ha alcanzado su máximo potencial y maestría absoluta!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
