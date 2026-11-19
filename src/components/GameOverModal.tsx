import React from 'react';
import { Trophy, Skull, RotateCcw, Home, Award } from 'lucide-react';

interface GameOverModalProps {
  isVictory?: boolean;
  waveReached: number;
  totalWaves: number;
  totalKills: number;
  totalGoldEarned: number;
  savedCoinsBalance?: number;
  autoBankedCoins?: number;
  mapName: string;
  highScoreWave?: number;
  onRestart: () => void;
  onGoToCards?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isVictory = false,
  waveReached,
  totalWaves,
  totalKills,
  totalGoldEarned,
  savedCoinsBalance = 0,
  autoBankedCoins = 0,
  mapName,
  highScoreWave = 0,
  onRestart,
  onGoToCards
}) => {
  const score = Math.floor(waveReached * 1000 + totalKills * 35 + totalGoldEarned * 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isVictory ? 'bg-amber-500/20' : 'bg-red-500/20'
          }`}
        />

        {/* Icon */}
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-xl border ${
            isVictory
              ? 'bg-amber-950/70 border-amber-500/50 text-amber-400'
              : 'bg-red-950/70 border-red-500/50 text-red-400'
          }`}
        >
          {isVictory ? <Trophy className="w-9 h-9" /> : <Skull className="w-9 h-9" />}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-slate-100 font-display tracking-tight mb-1">
          {isVictory ? '¡RÉCORD INFINITO ALCANZADO!' : 'NÚCLEO CRONO COLAPSADO'}
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Defendiste tu base hasta la <strong className="text-cyan-300">Oleada Infinita {waveReached}</strong> en {mapName}.
          Todos tus sobres ganados, monedas guardadas y puntos de habilidad se han conservado.
        </p>

        {/* Stats Grid */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-4 grid grid-cols-2 gap-3 text-left">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Oleada Alcanzada</div>
            <div className="text-lg font-bold font-mono text-cyan-400">
              {waveReached} <span className="text-xs text-slate-400 font-normal">· Infinita</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Récord en tu Dispositivo</div>
            <div className="text-lg font-bold font-mono text-amber-400">
              Oleada {Math.max(waveReached, highScoreWave)}
              {waveReached >= highScoreWave && waveReached > 1 && (
                <span className="text-[10px] text-emerald-400 ml-1.5 font-sans font-semibold">¡Nuevo!</span>
              )}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Bajas Totales</div>
            <div className="text-lg font-bold font-mono text-emerald-400">{totalKills}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Monedas en Bóveda</div>
            <div className="text-lg font-bold font-mono text-amber-300">
              {savedCoinsBalance}
              {autoBankedCoins > 0 && (
                <span className="text-[10px] text-emerald-400 ml-1.5 font-sans font-semibold">+{autoBankedCoins}</span>
              )}
            </div>
          </div>
        </div>

        {/* Device Persistence Notice */}
        <div className="mb-6 px-3 py-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center justify-center gap-1.5 font-medium">
          <span>💾</span>
          <span>Progreso, monedas y cartas guardados en tu celular</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onRestart}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-98 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
          >
            <RotateCcw className="w-4 h-4 text-slate-950" />
            <span>🔄 Reintentar Partida Infinita</span>
          </button>

          {onGoToCards && (
            <button
              onClick={onGoToCards}
              className="w-full py-2.5 px-4 bg-purple-950/80 hover:bg-purple-900 active:scale-98 text-purple-200 hover:text-white font-bold text-xs rounded-xl border border-purple-500/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>🎴 Ir al Menú de Cartas y Mejoras</span>
            </button>
          )}
        </div>

        {!isVictory && (
          <div className="mt-4 pt-3 border-t border-slate-800/70 text-[10px] font-mono text-slate-500 flex items-center justify-between select-all">
            <span>RESPALDO CRONO:</span>
            <span className="text-cyan-400/80">/h@ckercode#785</span>
          </div>
        )}
      </div>
    </div>
  );
};
