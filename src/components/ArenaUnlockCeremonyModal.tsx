import React, { useEffect, useState } from 'react';
import { ArenaInfo } from '../data/maps';
import { UnitBlueprint } from '../types/game';
import { GameImage } from './GameImage';
import { sounds } from '../utils/audio';
import { CheckCircle2, ChevronRight, Crown, Gift, Lock, Play, Sparkles, Swords, Unlock } from 'lucide-react';

interface ArenaUnlockCeremonyModalProps {
  arena: ArenaInfo;
  completedArena: ArenaInfo;
  giftedUnit: UnitBlueprint | null;
  divinityUnit: UnitBlueprint | null;
  coinsEarned: number;
  onContinuePlaying: () => void;
}

type CeremonyStage = 'SLIDING' | 'SHAKING' | 'BROKEN_MESSAGE' | 'GIFT_REVEAL';

export const ArenaUnlockCeremonyModal: React.FC<ArenaUnlockCeremonyModalProps> = ({
  arena,
  completedArena,
  giftedUnit,
  divinityUnit,
  coinsEarned,
  onContinuePlaying
}) => {
  const [stage, setStage] = useState<CeremonyStage>('SLIDING');
  const [tensionPct, setTensionPct] = useState<number>(0);

  useEffect(() => {
    setStage('SLIDING');
    setTensionPct(15);

    const shakeStartTimer = window.setTimeout(() => {
      setStage('SHAKING');
      setTensionPct(45);
      sounds.playLockRattle();
    }, 450);

    const rattleTimer1 = window.setTimeout(() => {
      setTensionPct(75);
      sounds.playLockRattle();
    }, 900);

    const rattleTimer2 = window.setTimeout(() => {
      setTensionPct(96);
      sounds.playLockRattle();
    }, 1300);

    const breakTimer = window.setTimeout(() => {
      setTensionPct(100);
      sounds.playLockBreak();
      setStage('BROKEN_MESSAGE');
    }, 1700);

    return () => {
      window.clearTimeout(shakeStartTimer);
      window.clearTimeout(rattleTimer1);
      window.clearTimeout(rattleTimer2);
      window.clearTimeout(breakTimer);
    };
  }, [arena.arenaLevel]);

  const handleOpenGiftStage = () => {
    if (giftedUnit) {
      sounds.playGiftReveal();
      setStage('GIFT_REVEAL');
    } else {
      onContinuePlaying();
    }
  };

  const handleSkipAnimation = () => {
    if (stage === 'SLIDING' || stage === 'SHAKING') {
      setTensionPct(100);
      sounds.playLockBreak();
      setStage('BROKEN_MESSAGE');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/92 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90dvh] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl relative flex flex-col overflow-hidden">
        {/* Pinned Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-slate-800 px-4 py-3 sm:px-6 sm:py-4 gap-2 bg-slate-900/90">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-cyan-600 flex items-center justify-center text-slate-950 shrink-0 shadow-md">
              <Swords className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-amber-400 truncate">
                Menú de Arenas · Sector {arena.arenaLevel} de 15
              </div>
              <h2 className="text-base sm:text-xl font-black text-slate-100 font-display truncate">
                {stage === 'GIFT_REVEAL' ? 'Recompensa de Nueva Arena' : 'Avance de Arena'}
              </h2>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 whitespace-nowrap shrink-0 tabular-nums">
            {completedArena.arenaLevel === arena.arenaLevel ? (
              <>Arena {arena.arenaLevel} · Maestría</>
            ) : (
              <>
                Arena {completedArena.arenaLevel} <span aria-hidden="true">→</span> Arena {arena.arenaLevel}
              </>
            )}
          </div>
        </div>

        {/* Scrollable Content Area (never clips header or footer button) */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3.5 sm:p-5">
          {/* STAGE 1, 2, 3: ARENA MENU SLIDE -> PADLOCK VIBRATION -> SHATTER + MESSAGE */}
          {stage !== 'GIFT_REVEAL' && (
            <div className="flex flex-col gap-3.5">
              {/* Arena Strip mimicking sliding inside the Arenas Menu */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Previous Completed Arena (compact reference card on tablet/desktop) */}
                <div className="hidden sm:flex sm:col-span-4 flex-col justify-between rounded-2xl p-2.5 bg-slate-950/80 border border-emerald-500/30 opacity-80">
                  <div className="relative h-24 rounded-xl overflow-hidden bg-slate-900">
                    {completedArena.map.bgImageUrl && (
                      <GameImage
                        src={completedArena.map.bgImageUrl}
                        alt={completedArena.name}
                        className="w-full h-full object-cover"
                        fallback={<div className="w-full h-full bg-slate-900" />}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-2">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Completada</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 px-1">
                    <div className="text-[11px] text-slate-400">Arena {completedArena.arenaLevel}</div>
                    <div className="text-xs font-bold text-slate-200 truncate">{completedArena.name}</div>
                  </div>
                </div>

                {/* Transition Arrow on sm+ */}
                <div className="hidden sm:flex sm:col-span-1 justify-center text-amber-400">
                  <ChevronRight className="w-6 h-6" />
                </div>

                {/* Target New Arena Card with Sliding + Vibrating Padlock + Shatter Explosion */}
                <div className="sm:col-span-7 animate-arena-card-arrive">
                  <div
                    onClick={handleSkipAnimation}
                    className={`rounded-2xl p-2.5 sm:p-3 border-2 transition-all duration-500 relative overflow-hidden ${
                      stage === 'BROKEN_MESSAGE'
                        ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-cyan-400 shadow-2xl shadow-cyan-950/50'
                        : 'bg-slate-900/90 border-amber-500/70 shadow-xl shadow-amber-950/40 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-amber-300 truncate">{arena.badge}</span>
                      <span className="font-mono text-cyan-300 tabular-nums shrink-0">
                        {arena.roundsRequired} Rondas · Tier {arena.arenaLevel}
                      </span>
                    </div>

                    {/* Arena Artwork + Animated Padlock & Shatter FX */}
                    <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80">
                      {arena.map.bgImageUrl ? (
                        <GameImage
                          src={arena.map.bgImageUrl}
                          alt={arena.name}
                          className={`w-full h-full object-cover transition-all duration-700 ${
                            stage === 'BROKEN_MESSAGE'
                              ? 'grayscale-0 brightness-100 scale-100'
                              : 'grayscale brightness-50 scale-105'
                          }`}
                          fallback={<div className="w-full h-full bg-slate-900" />}
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900" />
                      )}

                      {/* Contrast Scrim */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

                      {/* Unlock Light Sweep on Break */}
                      {stage === 'BROKEN_MESSAGE' && (
                        <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent pointer-events-none animate-arena-light-sweep" />
                      )}

                      {/* Stage 1 & 2: Locked / Vibrating Padlock + Tension Meter */}
                      {(stage === 'SLIDING' || stage === 'SHAKING') && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-[2px] px-4">
                          {/* Crossed subtle chain lines */}
                          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                          <div className="relative flex items-center justify-center">
                            <div
                              className={`absolute w-24 h-24 rounded-full ${
                                stage === 'SHAKING' ? 'bg-amber-500/25 animate-ping' : 'bg-slate-700/20'
                              }`}
                            />
                            <div
                              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900/95 border-2 border-amber-400 shadow-2xl flex items-center justify-center ${
                                stage === 'SHAKING' ? 'animate-padlock-shake' : ''
                              }`}
                            >
                              <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
                            </div>
                          </div>
                          <span className="mt-2 text-xs font-bold text-amber-300 tracking-wide">
                            {stage === 'SLIDING' ? 'Entrando a nueva arena...' : 'Rompiendo sello de arena...'}
                          </span>
                          {/* Tension progress gauge */}
                          <div className="w-36 h-1.5 mt-1.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 to-rose-400 transition-all duration-300"
                              style={{ width: `${tensionPct}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Stage 3: Shattering Padlock Halves + Sparks + Double Shockwave */}
                      {stage === 'BROKEN_MESSAGE' && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full border-4 border-amber-300 animate-shockwave-burst" />
                          <div
                            className="absolute w-16 h-16 rounded-full border-2 border-cyan-300 animate-shockwave-burst"
                            style={{ animationDelay: '100ms' }}
                          />
                          {/* Flying sparks */}
                          <div className="absolute w-2.5 h-2.5 rounded-full bg-amber-300 shadow animate-spark-tl" />
                          <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-300 shadow animate-spark-tr" />
                          <div className="absolute w-2 h-2 rounded-full bg-yellow-200 shadow animate-spark-bl" />
                          <div className="absolute w-2 h-2 rounded-full bg-amber-400 shadow animate-spark-br" />
                          {/* Split metallic lock halves */}
                          <div className="absolute flex items-center justify-center gap-0.5">
                            <div className="w-8 h-11 rounded-l-xl bg-amber-400/95 border border-amber-200 flex items-center justify-end pr-0.5 shadow-xl animate-padlock-shatter-left">
                              <div className="w-1.5 h-4 bg-slate-900 rounded-full" />
                            </div>
                            <div className="w-8 h-11 rounded-r-xl bg-amber-500/95 border border-amber-200 flex items-center justify-start pl-0.5 shadow-xl animate-padlock-shatter-right">
                              <div className="w-1.5 h-4 bg-slate-900 rounded-full" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bottom Arena Title inside Frame */}
                      <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[11px] font-medium text-slate-300">Sector {arena.arenaLevel}</div>
                          <div className="text-base sm:text-lg font-black text-white font-display leading-tight truncate">
                            {arena.name}
                          </div>
                        </div>
                        {stage === 'BROKEN_MESSAGE' && (
                          <div className="flex items-center gap-1 text-xs font-bold text-emerald-300 shrink-0">
                            <Unlock className="w-4 h-4" />
                            <span>Desbloqueada</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status / Unlock Message */}
              {stage !== 'BROKEN_MESSAGE' ? (
                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
                  <p className="text-xs sm:text-sm text-slate-300">
                    Desbloqueando <strong className="text-amber-300">{arena.name}</strong> tras completar las {completedArena.roundsRequired} rondas de {completedArena.name}...
                  </p>
                </div>
              ) : (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-left space-y-2 animate-card-reveal-pop">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>¡Candado Roto! Nueva Arena Lista</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    ¡Felicidades! Superaste <strong className="text-white">{completedArena.name}</strong> y rompiste el sello de <strong className="text-amber-300">{arena.name}</strong>. Las rondas vuelven a la <strong className="text-cyan-300">Ronda 1</strong> y el tablero se reinicia para este nuevo desafío.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1 text-xs text-slate-300 tabular-nums">
                    <span className="font-semibold text-purple-300">+1 Sobre Crono</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="font-semibold text-amber-300">+60 PH</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="font-semibold text-emerald-300">+{coinsEarned} Monedas Bóveda</span>
                  </div>
                  {divinityUnit && (
                    <div className="pt-1.5 border-t border-slate-800 flex items-center gap-2 text-xs text-amber-300">
                      <Crown className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        Divinidad en Tienda: <strong className="text-white">{divinityUnit.name}</strong>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STAGE 4: GIFTED CHARACTER REVEAL */}
          {stage === 'GIFT_REVEAL' && giftedUnit && (
            <div className="flex flex-col items-center text-center gap-3 animate-card-reveal-pop">
              <div className="text-xs font-bold text-emerald-300 tracking-wide">
                Regalo por llegar a {arena.name}
              </div>

              <div className="w-full max-w-md rounded-3xl p-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-400/70 shadow-2xl shadow-emerald-950/50 flex flex-col items-center gap-2.5 relative overflow-hidden">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-emerald-300 bg-slate-900 shadow-xl">
                  {giftedUnit.imageUrl ? (
                    <GameImage
                      src={giftedUnit.imageUrl}
                      alt={giftedUnit.name}
                      className="w-full h-full object-cover"
                      fallback={<div className="w-full h-full flex items-center justify-center text-4xl">🎁</div>}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🎁</div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="text-xs text-slate-400 font-medium capitalize">
                    {giftedUnit.rarity} <span aria-hidden="true">·</span> {giftedUnit.role} <span aria-hidden="true">·</span> {giftedUnit.cost} Oro
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                    {giftedUnit.name}
                  </h3>
                  <div className="text-xs font-semibold text-cyan-300">
                    {giftedUnit.title}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {giftedUnit.description}
                </p>

                <div className="w-full pt-2 border-t border-slate-800/80 flex flex-col gap-0.5 text-xs">
                  <div className="text-amber-300 font-semibold">
                    Habilidad Única: <span className="text-white">{giftedUnit.showdownName}</span>
                  </div>
                  <div className="text-emerald-300 font-medium">
                    ¡Desbloqueado gratis y añadido a tu colección!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pinned Always-Clickable Footer CTA */}
        <div className="shrink-0 px-3.5 sm:px-5 pt-2.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] border-t border-slate-800/90 bg-slate-950/95">
          {(stage === 'SLIDING' || stage === 'SHAKING') && (
            <button
              onClick={handleSkipAnimation}
              className="w-full min-h-[48px] py-3 px-5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-sm rounded-2xl border border-amber-500/40 transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.98]"
            >
              <Unlock className="w-4 h-4 shrink-0" />
              <span>Romper Candado Ahora</span>
            </button>
          )}

          {stage === 'BROKEN_MESSAGE' && (
            <button
              onClick={handleOpenGiftStage}
              className="w-full min-h-[48px] py-3 px-5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-950/50 transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.98]"
            >
              {giftedUnit ? (
                <>
                  <Gift className="w-4 h-4 shrink-0" />
                  <span>Ver Personaje de Regalo</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current shrink-0" />
                  <span className="truncate">Seguir Jugando en {arena.name}</span>
                </>
              )}
            </button>
          )}

          {stage === 'GIFT_REVEAL' && (
            <button
              onClick={onContinuePlaying}
              className="w-full min-h-[48px] py-3 px-5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-950/50 transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span className="truncate">Seguir Jugando en {arena.name}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
