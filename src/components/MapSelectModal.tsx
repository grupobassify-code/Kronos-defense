import React, { useRef, useState } from 'react';
import { ARENAS, ArenaInfo } from '../data/maps';
import { getDivinityForArena } from '../data/units';
import { MapData } from '../types/game';
import { Play, ChevronLeft, ChevronRight, Swords, Trophy, Lock, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { GameImage } from './GameImage';

interface MapSelectModalProps {
  currentMapId: string;
  highestArenaUnlocked?: number;
  onSelectAndStart: (arena: ArenaInfo, difficulty: 'normal' | 'hard' | 'infinite') => void;
  onClose?: () => void;
}

export const MapSelectModal: React.FC<MapSelectModalProps> = ({
  currentMapId,
  highestArenaUnlocked = 1,
  onSelectAndStart,
  onClose
}) => {
  const initialIndex = Math.max(
    0,
    ARENAS.findIndex((a) => a.map.id === currentMapId)
  );

  const [activeArenaIndex, setActiveArenaIndex] = useState<number>(initialIndex);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'normal' | 'hard' | 'infinite'>('infinite');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeArena = ARENAS[activeArenaIndex] || ARENAS[0];
  const isLocked = activeArena.arenaLevel > highestArenaUnlocked;

  const handleScrollToArena = (index: number) => {
    const clamped = Math.max(0, Math.min(ARENAS.length - 1, index));
    setActiveArenaIndex(clamped);
    if (scrollContainerRef.current) {
      const card = scrollContainerRef.current.children[clamped] as HTMLElement;
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  };

  const handleNext = () => handleScrollToArena(activeArenaIndex + 1);
  const handlePrev = () => handleScrollToArena(activeArenaIndex - 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-5xl max-h-[92dvh] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Pinned Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-slate-800 px-3.5 py-3 sm:px-6 sm:py-4 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-950/50 shrink-0">
              <Swords className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-wider text-amber-400 truncate">
                  SELECCIONADOR DE ARENAS (15)
                </span>
                <span className="text-[11px] text-cyan-300 font-bold tabular-nums">
                  Arena {activeArenaIndex + 1} de 15
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-100 font-display truncate">
                Arenas de Combate Táctico
              </h2>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[36px]"
            >
              Cerrar (✕)
            </button>
          )}
        </div>

        {/* Scrollable Middle Viewport */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 sm:px-6 py-2.5">
        {/* Horizontal Carousel Viewport with 15 Arenas (AI scenery) */}
        <div className="relative w-full flex flex-col justify-center">
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            disabled={activeArenaIndex === 0}
            className={`absolute -left-2 sm:-left-3 z-20 w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-2xl ${
              activeArenaIndex === 0
                ? 'bg-slate-900/60 border-slate-800 text-slate-600 cursor-not-allowed opacity-40'
                : 'bg-slate-900/90 border-slate-700 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 hover:scale-110 active:scale-95'
            }`}
            title="Arena Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            disabled={activeArenaIndex === ARENAS.length - 1}
            className={`absolute -right-2 sm:-right-3 z-20 w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-2xl ${
              activeArenaIndex === ARENAS.length - 1
                ? 'bg-slate-900/60 border-slate-800 text-slate-600 cursor-not-allowed opacity-40'
                : 'bg-slate-900/90 border-slate-700 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 hover:scale-110 active:scale-95'
            }`}
            title="Siguiente Arena (Deslizar hacia la izquierda)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="w-full flex items-center gap-4 overflow-x-auto py-3 px-6 no-scrollbar snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {ARENAS.map((arena, idx) => {
              const isCurrentActive = idx === activeArenaIndex;
              const isArenaLocked = arena.arenaLevel > highestArenaUnlocked;

              return (
                <div
                  key={arena.name}
                  onClick={() => handleScrollToArena(idx)}
                  className={`snap-center shrink-0 w-[280px] sm:w-[330px] rounded-3xl p-3 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between select-none relative overflow-hidden group ${
                    isCurrentActive
                      ? 'bg-gradient-to-b from-blue-950/80 via-slate-900 to-slate-950 border-cyan-400 ring-4 ring-cyan-500/30 scale-100 shadow-2xl shadow-cyan-950/70'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 scale-95 opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-amber-300 shadow">
                      {arena.badge}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/60 font-bold">
                      {arena.roundsRequired} Rondas
                    </span>
                  </div>

                  {/* AI Generated Arena Artwork (16:9 widescreen) */}
                  <div className="relative w-full h-36 sm:h-48 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-inner my-1">
                    {arena.map.bgImageUrl ? (
                      <GameImage
                        src={arena.map.bgImageUrl}
                        alt={arena.name}
                        loading={idx <= 2 ? 'eager' : 'lazy'}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                          isArenaLocked ? 'grayscale opacity-40' : ''
                        }`}
                        fallback={
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold bg-slate-900">
                            {arena.name}
                          </div>
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                        {arena.name}
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                    {/* Lock Badge if not unlocked */}
                    {isArenaLocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-xs text-center p-3">
                        <Lock className="w-8 h-8 text-amber-400 mb-1 animate-pulse" />
                        <span className="text-xs font-black text-amber-300">BLOQUEADA</span>
                        <span className="text-[10px] text-slate-300">
                          Supera la Arena {arena.arenaLevel - 1} para acceder
                        </span>
                      </div>
                    )}

                    {/* Arena Tag in Image */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700 text-[10px] text-slate-200 font-mono">
                      Sector {arena.arenaLevel} / 15
                    </div>

                    {/* Waves Range Pill */}
                    <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-slate-950/90 border border-cyan-800 text-[10px] text-cyan-300 font-mono font-bold flex items-center gap-1">
                      <span>Rondas {arena.minWave} — {arena.maxWave === Infinity ? '∞' : arena.maxWave}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-2 text-left">
                    <h3 className="text-base font-black text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {arena.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {arena.map.description}
                    </p>
                  </div>

                  {/* Arena Exclusive Divinity */}
                  {(() => {
                    const divUnit = getDivinityForArena(arena.arenaLevel);
                    if (!divUnit) return null;
                    return (
                      <div className="mt-2 p-1.5 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between gap-1.5 text-left">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs">👑</span>
                          <span className="text-[10px] font-bold text-amber-300 truncate">
                            {divUnit.name}
                          </span>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono shrink-0 ${isArenaLocked ? 'text-slate-500 bg-slate-900' : 'text-emerald-300 bg-emerald-950/80'}`}>
                          {isArenaLocked ? 'Bloqueado' : 'Disponible'}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Status Indicator at bottom */}
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Requisito de avance:</span>
                    <span className="font-bold text-amber-400 font-mono">
                      +{arena.roundsRequired} rondas superadas
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Pagination Dots for all 15 arenas */}
          <div className="flex items-center justify-center gap-1.5 mt-2 overflow-x-auto py-1">
            {ARENAS.map((_, idx) => (
              <button
                key={`dot_${idx}`}
                onClick={() => handleScrollToArena(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === activeArenaIndex
                    ? 'w-6 h-2 bg-gradient-to-r from-cyan-400 to-blue-500'
                    : 'w-2 h-2 bg-slate-800 hover:bg-slate-600'
                }`}
                title={`Ir a Arena ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        </div>

        {/* Pinned Selected Arena Action Card (always visible and tappable at bottom) */}
        <div className="shrink-0 bg-slate-950 border-t border-slate-800 px-3.5 sm:px-6 pt-3 pb-[max(0.875rem,env(safe-area-inset-bottom))] flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-xl">
          <div className="text-left w-full sm:w-auto min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black text-amber-300 font-display truncate">
                {activeArena.name}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {activeArena.badge}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 line-clamp-2">
              {isLocked
                ? activeArena.arenaLevel === 2
                  ? '🔒 La Arena 2 (Cañón de Magma) está bloqueada. Completa las 20 rondas de la Arena 1 para desbloquearla.'
                  : `🔒 Debes superar las ${ARENAS[activeArena.arenaLevel - 2]?.roundsRequired || 20} rondas de la Arena ${activeArena.arenaLevel - 1}.`
                : `Rondas requeridas: ${activeArena.roundsRequired} · Tier ${activeArena.arenaLevel} (+${(activeArena.arenaLevel - 1) * 45}% dificultad).`}
            </p>
            {(() => {
              const divUnit = getDivinityForArena(activeArena.arenaLevel);
              if (!divUnit) return null;
              return (
                <div className="mt-1 text-[11px] flex items-center gap-1.5 text-amber-300 font-medium flex-wrap">
                  <span>👑 Divinidad:</span>
                  <strong className="text-white">{divUnit.name}</strong>
                  <span className="text-slate-400">·</span>
                  {isLocked ? (
                    <span className="text-[10px] text-amber-400">
                      Bloqueada hasta esta arena
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-300">
                      Disponible en Sobres
                    </span>
                  )}
                </div>
              );
            })()}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <button
              disabled={isLocked}
              onClick={() => onSelectAndStart(activeArena, selectedDifficulty)}
              className={`w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer whitespace-nowrap ${
                isLocked
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-950/60 active:scale-95'
              }`}
            >
              {isLocked ? (
                <>
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {activeArena.arenaLevel === 2
                      ? 'Bloqueada (Termina Arena 1)'
                      : `Bloqueada (Supera Arena ${activeArena.arenaLevel - 1})`}
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current shrink-0" />
                  <span>JUGAR EN ESTA ARENA</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
