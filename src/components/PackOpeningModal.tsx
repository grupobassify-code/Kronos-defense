import React, { useState } from 'react';
import { PackReward } from '../types/game';
import { UNITS } from '../data/units';
import { sounds } from '../utils/audio';
import { Sparkles, Coins, Zap, Check, ArrowRight, PackageOpen } from 'lucide-react';

interface PackOpeningModalProps {
  unopenedCount: number;
  onOpenPack: () => PackReward[];
  onFinish: () => void;
  onGoToArmory: () => void;
}

export const PackOpeningModal: React.FC<PackOpeningModalProps> = ({
  unopenedCount,
  onOpenPack,
  onFinish,
  onGoToArmory
}) => {
  const [openedRewards, setOpenedRewards] = useState<PackReward[] | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening || unopenedCount <= 0) return;
    setIsOpening(true);
    sounds.playShowdown();

    setTimeout(() => {
      const rewards = onOpenPack();
      setOpenedRewards(rewards);
      setIsOpening(false);
      sounds.playWaveClear();
    }, 700);
  };

  const handleOpenAnother = () => {
    setOpenedRewards(null);
    handleOpen();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden flex flex-col items-center">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-2">
            <PackageOpen className="w-3.5 h-3.5" />
            <span>Sobre Táctico Holográfico</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 font-display tracking-tight">
            Apertura de Sobres Crono
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sobres restantes en tu inventario:{' '}
            <span className="font-bold text-amber-300 font-mono text-sm">{unopenedCount}</span>
          </p>
        </div>

        {/* Content state */}
        {!openedRewards ? (
          /* Unopened Booster Pack Presentation */
          <div className="flex flex-col items-center my-3">
            <div
              className={`w-48 sm:w-56 h-60 sm:h-72 rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-300 relative cursor-pointer group ${
                isOpening
                  ? 'scale-110 rotate-2 border-yellow-400 shadow-yellow-500/40 animate-pulse'
                  : 'border-purple-500/60 hover:border-purple-400 hover:scale-105 shadow-purple-950/60'
              }`}
              onClick={handleOpen}
            >
              <img
                src="/assets/images/card_pack_booster_1791485514522.jpg"
                alt="Sobre Crono"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-center p-3">
                <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider group-hover:scale-105 transition-transform">
                  {isOpening ? '¡Desbloqueando...!' : 'Toca para Abrir'}
                </span>
              </div>
            </div>

            <button
              onClick={handleOpen}
              disabled={isOpening || unopenedCount <= 0}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-purple-900/40 transition-all cursor-pointer disabled:opacity-50"
            >
              {isOpening ? 'Abriendo Sobre...' : 'Abrir Sobre (1)'}
            </button>
          </div>
        ) : (
          /* Revealed Cards / Rewards Presentation */
          <div className="w-full my-3 space-y-5 animate-fade-in">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              ¡Recompensas Obtenidas!
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {openedRewards.map((reward, idx) => {
                const isCard = reward.type === 'card' && reward.cardId;
                const unit = isCard ? UNITS[reward.cardId!] : null;

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-between transition-all shadow-lg ${
                      isCard
                        ? 'bg-gradient-to-b from-purple-950/60 to-slate-950/90 border-purple-500/70 ring-1 ring-purple-400/40'
                        : 'bg-slate-950/80 border-amber-500/50'
                    }`}
                  >
                    {isCard && unit ? (
                      <>
                        <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1">
                          ¡NUEVA CARTA!
                        </div>
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-purple-400 my-1 shadow-md">
                          {unit.imageUrl ? (
                            <img
                              src={unit.imageUrl}
                              alt={unit.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-purple-600" />
                          )}
                        </div>
                        <div className="font-bold text-sm text-slate-100 mt-1 truncate max-w-full">
                          {unit.name}
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize">{unit.role}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                          PUNTOS DE HABILIDAD
                        </div>
                        <div className="w-16 h-16 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-center justify-center my-1 text-amber-300 shadow-md">
                          <Zap className="w-8 h-8 fill-amber-400/20" />
                        </div>
                        <div className="font-black text-xl font-mono text-amber-300 mt-1">
                          +{reward.skillPoints} pts
                        </div>
                        <div className="text-[10px] text-slate-400">Para Mejoras</div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions after opening */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {unopenedCount > 0 && (
                <button
                  onClick={handleOpenAnother}
                  className="w-full sm:w-auto px-5 py-2.5 bg-purple-700 hover:bg-purple-600 active:scale-95 text-white font-bold text-xs rounded-xl border border-purple-500/40 transition-all cursor-pointer"
                >
                  Abrir Siguiente ({unopenedCount})
                </button>
              )}

              <button
                onClick={onGoToArmory}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Ir a la Armería / Mejorar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onFinish}
                className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Listo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
