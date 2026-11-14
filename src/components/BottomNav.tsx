import React from 'react';
import { Layers, Swords, PackageOpen } from 'lucide-react';
import { sounds } from '../utils/audio';

interface BottomNavProps {
  activeTab: 'CARDS' | 'BATTLE';
  onSelectTab: (tab: 'CARDS' | 'BATTLE') => void;
  unopenedPacks: number;
  claimableMissions: number;
  isWaveActive: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  unopenedPacks,
  claimableMissions,
  isWaveActive
}) => {
  const handleTabChange = (tab: 'CARDS' | 'BATTLE') => {
    if (tab !== activeTab) {
      sounds.playPlace();
      onSelectTab(tab);
    }
  };

  const hasCardNotifs = unopenedPacks > 0 || claimableMissions > 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t-2 border-slate-800 shadow-[0_-10px_35px_rgba(0,0,0,0.9)] py-2.5 px-4 sm:px-8">
      <div className="max-w-xl mx-auto grid grid-cols-2 gap-3 sm:gap-6">
        {/* MENÚ IZQUIERDO: CARTAS Y MÁS */}
        <button
          onClick={() => handleTabChange('CARDS')}
          className={`relative group flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'CARDS'
              ? 'bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-900 border-purple-400 shadow-xl shadow-purple-950/70 ring-2 ring-purple-500/50 scale-[1.03]'
              : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 hover:bg-slate-800/80'
          }`}
        >
          {/* Active Glow Bar */}
          {activeTab === 'CARDS' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-purple-400 rounded-full shadow-[0_0_12px_#c084fc]" />
          )}

          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-105 ${
              activeTab === 'CARDS'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                : 'bg-slate-800 text-slate-400 group-hover:text-purple-300'
            }`}
          >
            <Layers className="w-5 h-5" />
          </div>

          <div className="text-left flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-wider uppercase text-purple-400">
                Menú Izquierdo
              </span>
            </div>
            <div
              className={`text-sm sm:text-base font-black tracking-tight leading-tight truncate ${
                activeTab === 'CARDS' ? 'text-white' : 'text-slate-200'
              }`}
            >
              🎴 CARTAS
            </div>
            <div className="text-[11px] text-slate-400 leading-none truncate mt-0.5">
              Mazo · Sobres · Mejoras
            </div>
          </div>

          {/* Notification Badge */}
          {hasCardNotifs && (
            <div className="absolute -top-2 -right-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 border-2 border-slate-950 text-white text-[11px] font-black shadow-lg animate-bounce">
              {unopenedPacks > 0 ? (
                <span className="flex items-center gap-1">
                  <PackageOpen className="w-3 h-3" />
                  <span>{unopenedPacks}</span>
                </span>
              ) : (
                <span>!</span>
              )}
            </div>
          )}
        </button>

        {/* MENÚ DERECHO: JUGAR / BATALLA */}
        <button
          onClick={() => handleTabChange('BATTLE')}
          className={`relative group flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'BATTLE'
              ? 'bg-gradient-to-r from-cyan-950 via-blue-950 to-cyan-900 border-cyan-400 shadow-xl shadow-cyan-950/70 ring-2 ring-cyan-500/50 scale-[1.03]'
              : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 hover:bg-slate-800/80'
          }`}
        >
          {/* Active Glow Bar */}
          {activeTab === 'BATTLE' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_12px_#38bdf8]" />
          )}

          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-105 ${
              activeTab === 'BATTLE'
                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-cyan-900/50'
                : 'bg-slate-800 text-slate-400 group-hover:text-cyan-300'
            }`}
          >
            <Swords className="w-5 h-5 fill-current" />
          </div>

          <div className="text-left flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-wider uppercase text-cyan-400">
                Menú Derecho
              </span>
            </div>
            <div
              className={`text-sm sm:text-base font-black tracking-tight leading-tight truncate ${
                activeTab === 'BATTLE' ? 'text-white' : 'text-slate-200'
              }`}
            >
              ⚔️ JUGAR
            </div>
            <div className="text-[11px] text-slate-400 leading-none truncate mt-0.5">
              {isWaveActive ? (
                <span className="text-emerald-400 font-bold animate-pulse">● En Combate</span>
              ) : (
                'Partida Infinita'
              )}
            </div>
          </div>
        </button>
      </div>
    </nav>
  );
};

