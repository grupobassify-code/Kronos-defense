import React from 'react';
import { Mission } from '../types/game';
import { X, Trophy, CheckCircle, PackageOpen, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MissionsModalProps {
  missions: Mission[];
  onClaimMission: (missionId: string) => void;
  onClose: () => void;
  onOpenPacks: () => void;
  unopenedPacks: number;
}

export const MissionsModal: React.FC<MissionsModalProps> = ({
  missions,
  onClaimMission,
  onClose,
  onOpenPacks,
  unopenedPacks
}) => {
  const claimableCount = missions.filter((m) => m.completed && !m.claimed).length;

  const handleClaim = (id: string) => {
    sounds.playCoin();
    onClaimMission(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 font-display">
                Misiones del Modo Historia
              </h2>
              <p className="text-xs text-slate-400">
                Cumple objetivos en batalla para ganar Sobres Crono y desbloquear cartas heroicas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {unopenedPacks > 0 && (
              <button
                onClick={onOpenPacks}
                className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/50 text-purple-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-purple-900 animate-pulse"
              >
                <PackageOpen className="w-4 h-4" />
                <span>Sobres ({unopenedPacks})</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Missions List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {missions.map((mission) => {
            const progressRatio = Math.min(1, mission.currentCount / mission.targetCount);

            return (
              <div
                key={mission.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  mission.claimed
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : mission.completed
                    ? 'bg-gradient-to-r from-purple-950/60 to-slate-900 border-purple-500/70 shadow-lg ring-1 ring-purple-500/40'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-slate-100">{mission.title}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${
                        mission.category === 'story'
                          ? 'bg-blue-950 text-blue-400 border border-blue-900'
                          : mission.category === 'combat'
                          ? 'bg-red-950 text-red-400 border border-red-900'
                          : 'bg-amber-950 text-amber-400 border border-amber-900'
                      }`}
                    >
                      {mission.category === 'story' ? 'Historia' : mission.category === 'combat' ? 'Combate' : 'Economía'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-2">
                    {mission.description}
                  </p>

                  {/* Progress bar */}
                  <div className="flex items-center gap-3">
                    <div className="w-36 sm:w-48 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                      <div
                        className={`h-full transition-all duration-300 ${
                          mission.completed ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${progressRatio * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-slate-300">
                      {Math.min(mission.currentCount, mission.targetCount)} / {mission.targetCount}
                    </span>
                  </div>
                </div>

                {/* Reward & Claim button */}
                <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Recompensa</div>
                    <div className="text-xs font-bold text-purple-300 flex items-center gap-1">
                      <PackageOpen className="w-3.5 h-3.5 text-purple-400" />
                      <span>+{mission.rewardPacks} {mission.rewardPacks === 1 ? 'Sobre' : 'Sobres'}</span>
                    </div>
                  </div>

                  {mission.claimed ? (
                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-900/50">
                      <CheckCircle className="w-4 h-4" />
                      <span>Reclamado</span>
                    </div>
                  ) : mission.completed ? (
                    <button
                      onClick={() => handleClaim(mission.id)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-900/40 cursor-pointer transition-all animate-bounce"
                    >
                      ¡Reclamar Recompensa!
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900">
                      En progreso
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
