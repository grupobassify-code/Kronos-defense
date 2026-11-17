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

type CeremonyStage = 'SHAKING' | 'BROKEN_MESSAGE' | 'GIFT_REVEAL';

export const ArenaUnlockCeremonyModal: React.FC<ArenaUnlockCeremonyModalProps> = ({
  arena,
  completedArena,
  giftedUnit,
  divinityUnit,
  coinsEarned,
  onContinuePlaying
}) => {
  const [stage, setStage] = useState<CeremonyStage>('SHAKING');

  useEffect(() => {
    setStage('SHAKING');
    sounds.playLockRattle();

    const rattleTimer1 = window.setTimeout(() => sounds.playLockRattle(), 450);
    const rattleTimer2 = window.setTimeout(() => sounds.playLockRattle(), 900);
    const breakTimer = window.setTimeout(() => {
      sounds.playLockBreak();
      setStage('BROKEN_MESSAGE');
    }, 1350);

    return () => {
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

  const handleSkipShake = () => {
    if (stage === 'SHAKING') {
      sounds.playLockBreak();
      setStage('BROKEN_MESSAGE');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/92 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-2xl relative flex flex-col max-h-[94dvh] overflow-y-auto">
        {/* Top Arena Menu Bar Context */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-cyan-600 flex items-center justify-center text-slate-950 shrink-0 shadow-md">
              <Swords className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-amber-400 truncate">
                Menú de Arenas · Sector {arena.arenaLevel} de 15
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-100 font-display truncate">
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

        {/* STAGE 1 & 2: ARENA MENU CAROUSEL VIEW + PADLOCK VIBRATION -> BREAK -> MESSAGE */}
        {stage !== 'GIFT_REVEAL' && (
          <div className="flex flex-col gap-4">
            {/* Arena Strip mimicking the Arenas Menu transition */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Previous Completed Arena (compact left reference card on desktop/tablet) */}
              <div className="hidden sm:flex sm:col-span-4 flex-col justify-between rounded-2xl p-2.5 bg-slate-950/80 border border-emerald-500/30 opacity-75">
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

              {/* Arrow indicator between arenas on sm+ */}
              <div className="hidden sm:flex sm:col-span-1 justify-center text-amber-400">
                <ChevronRight className="w-6 h-6" />
              </div>

              {/* Target New Arena Card with Padlock Shake & Shatter */}
              <div className="sm:col-span-7 animate-arena-card-arrive">
                <div
                  onClick={handleSkipShake}
                  className={`rounded-2xl p-3 border-2 transition-all duration-500 relative overflow-hidden ${
                    stage === 'SHAKING'
                      ? 'bg-slate-900/90 border-amber-500/70 shadow-xl shadow-amber-950/40 cursor-pointer'
                      : 'bg-gradient-to-b from-slate-900 to-slate-950 border-cyan-400 shadow-2xl shadow-cyan-950/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-amber-300">{arena.badge}</span>
                    <span className="font-mono text-cyan-300 tabular-nums">
                      {arena.roundsRequired} Rondas · Tier {arena.arenaLevel}
                    </span>
                  </div>

                  {/* Arena Artwork + Animated Padlock Overlay */}
                  <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80">
                    {arena.map.bgImageUrl ? (
                      <GameImage
                        src={arena.map.bgImageUrl}
                        alt={arena.name}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          stage === 'SHAKING' ? 'grayscale brightness-50 scale-105' : 'grayscale-0 brightness-100 scale-100'
                        }`}
                        fallback={<div className="w-full h-full bg-slate-900" />}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900" />
                    )}

                    {/* Contrast Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

                    {/* Stage 1: Vibrating Padlock */}
                    {stage === 'SHAKING' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/55 backdrop-blur-[2px]">
                        <div className="relative flex items-center justify-center">
                          <div className="absolute w-24 h-24 rounded-full bg-amber-500/20 animate-ping" />
                          <div className="w-20 h-20 rounded-2xl bg-slate-900/95 border-2 border-amber-400 shadow-2xl flex items-center justify-center animate-padlock-shake">
                            <Lock className="w-10 h-10 text-amber-400" />
                          </div>
                        </div>
                        <span className="mt-3 text-xs font-bold text-amber-300 tracking-wide">
                          Rompiendo sello de arena...
                        </span>
                      </div>
                    )}

                    {/* Stage 2: Shattering Padlock Halves + Shockwave Burst */}
                    {stage === 'BROKEN_MESSAGE' && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border-4 border-amber-300 animate-shockwave-burst" />
                        <div className="absolute flex items-center justify-center gap-0.5">
                          <div className="w-9 h-12 rounded-l-xl bg-amber-400/90 border border-amber-200 flex items-center justify-end pr-0.5 shadow-xl animate-padlock-shatter-left">
                            <div className="w-1.5 h-4 bg-slate-900 rounded-full" />
                          </div>
                          <div className="w-9 h-12 rounded-r-xl bg-amber-500/90 border border-amber-200 flex items-center justify-start pl-0.5 shadow-xl animate-padlock-shatter-right">
                            <div className="w-1.5 h-4 bg-slate-900 rounded-full" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bottom Arena Title inside Frame */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-medium text-slate-300">Sector {arena.arenaLevel}</div>
                        <div className="text-lg font-black text-white font-display leading-tight">
                          {arena.name}
                        </div>
                      </div>
                      {stage === 'BROKEN_MESSAGE' && (
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-300">
                          <Unlock className="w-4 h-4" />
                          <span>Desbloqueada</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 2 Message Box & Rewards after Lock Breaks */}
            {stage === 'SHAKING' ? (
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
                <p className="text-sm text-slate-300">
                  Desbloqueando <strong className="text-amber-300">{arena.name}</strong> tras superar las {completedArena.roundsRequired} rondas de {completedArena.name}...
                </p>
              </div>
            ) : (
              <div className="space-y-3 animate-card-reveal-pop">
                {/* Main Unlock Message */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-left space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>¡Sello Roto! Nueva Arena Lista para Defender</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    ¡Felicidades, Comandante! Superaste <strong className="text-white">{completedArena.name}</strong> y rompiste el candado de <strong className="text-amber-300">{arena.name}</strong>. Las rondas vuelven a la <strong className="text-cyan-300">Ronda 1</strong> y el tablero se reinicia para este nuevo campo de batalla.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-slate-300 tabular-nums">
                    <span className="font-semibold text-purple-300">+1 Sobre Crono</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="font-semibold text-amber-300">+60 Puntos de Habilidad</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="font-semibold text-emerald-300">+{coinsEarned} Monedas en Bóveda</span>
                  </div>
                  {divinityUnit && (
                    <div className="pt-1 border-t border-slate-800 flex items-center gap-2 text-xs text-amber-300">
                      <Crown className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Divinidad desbloqueada en Tienda: <strong className="text-white">{divinityUnit.name}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Primary CTA */}
                <button
                  onClick={handleOpenGiftStage}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-950/50 transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.98]"
                >
                  {giftedUnit ? (
                    <>
                      <Gift className="w-4 h-4" />
                      <span>Ver Personaje de Regalo</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Seguir Jugando en {arena.name}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* STAGE 3: GIFTED CHARACTER REVEAL -> CONTINUE PLAYING */}
        {stage === 'GIFT_REVEAL' && giftedUnit && (
          <div className="flex flex-col items-center text-center gap-4 animate-card-reveal-pop">
            <div className="text-xs font-bold text-emerald-300 tracking-wide">
              Recompensa por llegar a {arena.name}
            </div>

            {/* Hero Spotlight Card */}
            <div className="w-full max-w-md rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-400/70 shadow-2xl shadow-emerald-950/50 flex flex-col items-center gap-3">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-emerald-300 bg-slate-900 shadow-xl">
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

              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium capitalize">
                  {giftedUnit.rarity} <span aria-hidden="true">·</span> {giftedUnit.role} <span aria-hidden="true">·</span> {giftedUnit.cost} Oro
                </div>
                <h3 className="text-2xl font-black text-white font-display">
                  {giftedUnit.name}
                </h3>
                <div className="text-xs font-semibold text-cyan-300">
                  {giftedUnit.title}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {giftedUnit.description}
              </p>

              <div className="w-full pt-2 border-t border-slate-800/80 flex flex-col gap-1 text-xs">
                <div className="text-amber-300 font-semibold">
                  Habilidad Definitiva: <span className="text-white">{giftedUnit.showdownName}</span>
                </div>
                <div className="text-emerald-300 font-medium">
                  ¡Desbloqueado gratis y añadido a tu colección!
                </div>
              </div>
            </div>

            <button
              onClick={onContinuePlaying}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-950/50 transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Seguir Jugando en {arena.name}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
