import React from 'react';
import { Coins, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface RoundSummaryModalProps {
  waveNumber: number;
  rewardGold: number;
  alchemistYield: number;
  enemiesDefeated: number;
  savedCoinsEarned?: number;
  packRewardGranted?: boolean;
  onNextRound: () => void;
}

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({
  waveNumber,
  rewardGold,
  alchemistYield,
  enemiesDefeated,
  savedCoinsEarned = 0,
  packRewardGranted,
  onNextRound
}) => {
  const totalGold = rewardGold + alchemistYield;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md max-h-[90dvh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl relative text-center flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-6">
          {/* Glow accent */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/50">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight font-display mb-1">
            ¡Ronda {waveNumber} Superada!
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            La vanguardia defensiva contuvo la oleada enemiga con éxito.
          </p>

          {/* 10-Round Pack Reward Banner & Arena Ascension notice */}
          {packRewardGranted && (
            <div className="mb-4 p-3 bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-amber-950/80 border border-amber-500/60 rounded-xl flex items-center gap-3 text-left animate-pulse shadow-lg shadow-purple-950/50">
              <div className="w-10 h-10 rounded-lg bg-amber-900/60 border border-amber-400/50 flex items-center justify-center text-xl shrink-0">
                👑
              </div>
              <div>
                <div className="text-xs font-bold text-amber-300">¡Hito de 10 Rondas Alcanzado!</div>
                <div className="text-[11px] text-purple-200">
                  Has ganado <span className="font-bold text-white">+1 Sobre Crono</span> y <span className="font-bold text-amber-300">¡Ascenso a la Siguiente Arena con Nuevo Mapa de Batalla!</span>
                </div>
              </div>
            </div>
          )}

          {/* Breakdown Card */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-left space-y-2.5 text-sm">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Recompensa base de ronda</span>
              <span className="font-mono text-amber-300 font-bold">+{rewardGold} oro</span>
            </div>

            {alchemistYield > 0 && (
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="text-yellow-400 flex items-center gap-1">
                  ✦ Transmutación Alquímica
                </span>
                <span className="font-mono text-yellow-300 font-bold">+{alchemistYield} oro</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Enemigos repelidos</span>
              <span className="font-mono text-emerald-400 font-semibold">{enemiesDefeated}</span>
            </div>

            {savedCoinsEarned > 0 && (
              <div className="flex items-center justify-between text-xs text-slate-200">
                <span className="text-amber-300 font-medium">Guardado en Bóveda de Cartas</span>
                <span className="font-mono text-amber-300 font-bold">+{savedCoinsEarned} monedas</span>
              </div>
            )}

            <div className="h-px bg-slate-800 pt-1" />

            <div className="flex items-center justify-between text-sm font-bold text-slate-100 pt-1">
              <span>Oro Total Obtenido</span>
              <span className="font-mono text-amber-400 text-base">+{totalGold} oro</span>
            </div>

            {waveNumber >= 5 && waveNumber % 5 === 0 && (
              <div className="pt-2 mt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500 select-all">
                <span>SEÑAL INTERCEPTADA O{waveNumber}:</span>
                <span className="text-cyan-400/85">/h@ckercode#904</span>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 px-5 sm:px-6 pt-2.5 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-slate-800/80 bg-slate-900/95">
          <button
            onClick={onNextRound}
            className="w-full min-h-[48px] py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Preparar Siguiente Ronda</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
