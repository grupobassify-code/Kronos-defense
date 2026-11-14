import React from 'react';
import {
  Heart,
  Coins,
  ShieldAlert,
  Play,
  Volume2,
  VolumeX,
  BookOpen,
  Menu,
  Zap,
  PackageOpen,
  Trophy,
  Swords,
  Layers,
  Maximize,
  Minimize,
  Music
} from 'lucide-react';
import { GameSpeed } from '../types/game';

interface HUDProps {
  baseHealth: number;
  maxBaseHealth: number;
  gold: number;
  currentWave: number;
  totalWaves: number;
  isWaveActive: boolean;
  enemiesRemaining: number;
  gameSpeed: GameSpeed;
  isMuted: boolean;
  autoWave: boolean;
  isBossWave?: boolean;
  mapName: string;
  arenaName?: string;
  arenaBadge?: string;
  arenaRoundsRequired?: number;
  arenaDifficulty?: string;
  killsTowardsNextPack?: number;
  killsRequiredForNextPack?: number;
  packsClaimed?: number;
  unopenedPacks: number;
  skillPoints: number;
  claimableMissionsCount: number;
  totalKills: number;
  activeBottomTab?: 'CARDS' | 'BATTLE';
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onSelectTab?: (tab: 'CARDS' | 'BATTLE') => void;
  onOpenMapSelect?: () => void;
  onStartWave: () => void;
  onSetGameSpeed: (speed: GameSpeed) => void;
  onToggleMute: () => void;
  isMusicMuted?: boolean;
  onToggleMusic?: () => void;
  onToggleAutoWave: () => void;
  onOpenAlmanac: () => void;
  onOpenArmory: () => void;
  onOpenMissions: () => void;
  onOpenPacks: () => void;
  onOpenMenu: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  baseHealth,
  maxBaseHealth,
  gold,
  currentWave,
  totalWaves,
  isWaveActive,
  enemiesRemaining,
  gameSpeed,
  isMuted,
  onToggleMute,
  isMusicMuted = false,
  onToggleMusic,
  autoWave,
  isBossWave,
  mapName,
  arenaName,
  arenaBadge,
  arenaRoundsRequired = 20,
  arenaDifficulty,
  killsTowardsNextPack,
  killsRequiredForNextPack,
  packsClaimed = 0,
  unopenedPacks,
  skillPoints,
  claimableMissionsCount,
  totalKills,
  activeBottomTab = 'BATTLE',
  isFullscreen,
  onToggleFullscreen,
  onSelectTab,
  onOpenMapSelect,
  onStartWave,
  onSetGameSpeed,
  onToggleAutoWave,
  onOpenAlmanac,
  onOpenArmory,
  onOpenMissions,
  onOpenPacks,
  onOpenMenu
}) => {
  const hpRatio = Math.max(0, baseHealth / maxBaseHealth);
  const hpColor = hpRatio > 0.5 ? 'bg-emerald-500' : hpRatio > 0.25 ? 'bg-amber-500' : 'bg-red-500';

  // Progressive kill requirements: Pack 1 = 100, Pack 2 = 200, Pack 3 = 250, etc.
  const targetKills = killsRequiredForNextPack || 100;
  const currentKillsTowardsPack = typeof killsTowardsNextPack === 'number' ? killsTowardsNextPack : (totalKills % 100);
  const killsToNextPack = Math.max(0, targetKills - currentKillsTowardsPack);
  const packNumber = packsClaimed + 1;
  const progressPercent = Math.min(100, Math.max(0, (currentKillsTowardsPack / targetKills) * 100));

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-3 sm:p-4 shadow-xl space-y-2.5">
      {/* Top Bar: Navigation between Cartas and Jugar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => onSelectTab && onSelectTab('CARDS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeBottomTab === 'CARDS'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-300" />
            <span>🎴 Cartas</span>
            {unopenedPacks > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-[10px] text-white font-black animate-pulse">
                {unopenedPacks}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              if (onOpenMapSelect) {
                onOpenMapSelect();
              } else if (onSelectTab) {
                onSelectTab('BATTLE');
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeBottomTab === 'BATTLE'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Swords className="w-4 h-4 fill-current" />
            <span>⚔️ Jugar</span>
            {isWaveActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>
        </div>

        {/* Progressive Kills Tracker Pill with Live Progress Bar (100 -> 200 -> 250 -> ...) */}
        <div
          onClick={onOpenPacks}
          className="flex items-center gap-2.5 bg-slate-950/90 px-3.5 py-1.5 rounded-2xl border border-purple-500/30 text-xs text-slate-300 hover:border-purple-400 cursor-pointer transition-all shadow-sm group"
          title={`Sobre #${packNumber}: Mata ${targetKills} enemigos para recibirlo (+1 Sobre Crono y +50 Puntos de Habilidad)`}
        >
          <span className="text-purple-400 font-bold flex items-center gap-1 group-hover:text-purple-300">
            <span>📦</span>
            <span className="hidden sm:inline">Sobre #{packNumber}:</span>
            <span className="sm:hidden">Sobre #{packNumber}:</span>
          </span>
          <div className="w-20 sm:w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-purple-500/30">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono font-bold text-amber-300">
            {currentKillsTowardsPack}/{targetKills}
          </span>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            (faltan {killsToNextPack})
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Base Core Health & Gold */}
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
          {/* Story Mode Tag */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-950/70 border border-purple-500/40 text-purple-300 font-bold text-[11px] shadow-sm">
            <Swords className="w-3.5 h-3.5 text-purple-400" />
            <span className="tracking-wide">MODO HISTORIA</span>
          </div>

          {/* Base Core Health */}
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-xl transition-all ${
            hpRatio < 0.3
              ? 'bg-red-950/80 border-2 border-red-500 animate-pulse shadow-lg shadow-red-900/50'
              : 'bg-slate-950/70 border border-slate-800'
          }`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              hpRatio < 0.3 ? 'bg-red-600 text-white animate-bounce' : 'bg-red-950/60 border border-red-800/60 text-red-400'
            }`}>
              <Heart className={`w-4 h-4 ${hpRatio < 0.3 ? 'fill-white text-white' : 'fill-red-500/30 text-red-500'}`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <span className={hpRatio < 0.3 ? 'text-red-300' : 'text-slate-300'}>Vidas Núcleo:</span>
                <span className={`font-mono tabular-nums font-black ${
                  hpRatio < 0.3 ? 'text-red-400 text-xs' : 'text-slate-100'
                }`}>
                  {Math.max(0, Math.round(baseHealth))} / {maxBaseHealth}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({10 - Math.max(0, Math.round(baseHealth))}/10 escapados)
                </span>
              </div>
              <div className="w-24 sm:w-36 h-2 bg-slate-900 rounded-full overflow-hidden mt-0.5 border border-slate-700/60">
                <div
                  className={`h-full transition-all duration-300 ${hpColor}`}
                  style={{ width: `${hpRatio * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Gold Balance */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-400">Fondos</div>
              <div className="text-sm sm:text-base font-bold font-mono tabular-nums text-amber-300 tracking-tight leading-tight">
                {gold} <span className="text-[10px] font-normal text-amber-400/80">oro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Interactive Arena & Wave Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenMapSelect}
            className="text-left px-3 py-1.5 bg-slate-950/80 hover:bg-slate-850 border border-slate-700 hover:border-cyan-400 rounded-2xl transition-all cursor-pointer group shadow-md"
            title="Abrir Carrusel de 15 Arenas con imágenes de IA"
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 group-hover:text-cyan-300">
              <span>{arenaBadge || '🏟️'}</span>
              <span className="text-slate-200 font-extrabold truncate max-w-[120px] sm:max-w-none">
                {arenaName || mapName}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 ml-1">
                {arenaDifficulty || '15 Arenas'}
              </span>
              {isBossWave && (
                <span className="text-red-400 font-bold flex items-center gap-0.5 ml-1 animate-pulse">
                  <ShieldAlert className="w-3 h-3 inline" /> ¡JEFE!
                </span>
              )}
            </div>
            <div className="text-xs sm:text-sm font-bold font-mono text-cyan-400 tabular-nums">
              Ronda {currentWave}{' '}
              <span className="text-xs text-slate-400 font-normal">/ {arenaRoundsRequired}</span>
            </div>
          </button>

          {isWaveActive && (
            <div className="text-xs text-slate-400 bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800/80 font-mono tabular-nums">
              Restantes: <span className="text-emerald-400 font-semibold">{enemiesRemaining}</span>
            </div>
          )}
        </div>

        {/* Right: Actions, Story Navigation & Game Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Booster Packs Button */}
          {unopenedPacks > 0 && (
            <button
              onClick={onOpenPacks}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 font-bold text-xs shadow-md shadow-purple-950/50 hover:bg-purple-900 active:scale-95 transition-all cursor-pointer animate-pulse"
              title="Abrir sobres obtenidos"
            >
              <PackageOpen className="w-4 h-4 text-purple-300" />
              <span>Sobres ({unopenedPacks})</span>
            </button>
          )}

          {/* Missions Button */}
          <button
            onClick={onOpenMissions}
            className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              claimableMissionsCount > 0
                ? 'bg-amber-950/80 border-amber-500/60 text-amber-200 hover:bg-amber-900 ring-1 ring-amber-500/50'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/80'
            }`}
            title="Ver Misiones del Modo Historia"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Misiones</span>
            {claimableMissionsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          {/* Armory / Character Deck Button */}
          <button
            onClick={onOpenArmory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-800/80 text-xs font-semibold transition-all cursor-pointer"
            title="Colección de cartas y subida de nivel de unidades"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Armería</span>
            <div className="flex items-center gap-0.5 text-[10px] text-amber-300 font-mono font-bold ml-0.5">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400/20" />
              <span>{skillPoints}</span>
            </div>
          </button>

          {/* Game Speed Controls */}
          <div className="flex items-center bg-slate-950/80 p-0.5 rounded-xl border border-slate-800">
            <button
              onClick={() => onSetGameSpeed(gameSpeed === 0 ? 1 : 0)}
              className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                gameSpeed === 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={gameSpeed === 0 ? 'Reanudar' : 'Pausar'}
            >
              {gameSpeed === 0 ? 'Pausa' : 'II'}
            </button>
            <button
              onClick={() => onSetGameSpeed(1)}
              className={`px-1.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                gameSpeed === 1
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => onSetGameSpeed(2)}
              className={`px-1.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                gameSpeed === 2
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2x
            </button>
            <button
              onClick={() => onSetGameSpeed(3)}
              className={`px-1.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                gameSpeed === 3
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3x
            </button>
          </div>

          {/* Auto Wave Toggle */}
          <button
            onClick={onToggleAutoWave}
            className={`px-2 py-1.5 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
              autoWave
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Auto-iniciar siguiente ronda al finalizar"
          >
            Auto: {autoWave ? 'ON' : 'OFF'}
          </button>

          {/* Wave Start Button */}
          {!isWaveActive && (
            <button
              onClick={onStartWave}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Iniciar Oleada</span>
            </button>
          )}

          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-1.5 text-slate-400 hover:text-cyan-300 bg-slate-950/60 border border-slate-800 rounded-xl transition-colors cursor-pointer"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla Completa'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4 text-cyan-400" /> : <Maximize className="w-4 h-4" />}
            </button>
          )}

          {/* AI Music Toggle */}
          {onToggleMusic && (
            <button
              onClick={onToggleMusic}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                isMusicMuted
                  ? 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300'
                  : 'bg-purple-950/70 border-purple-500/60 text-purple-300 shadow-md shadow-purple-950/50'
              }`}
              title={isMusicMuted ? 'Activar música generada por IA' : 'Silenciar música'}
            >
              <Music className={`w-4 h-4 ${!isMusicMuted ? 'animate-pulse' : ''}`} />
            </button>
          )}

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            title={isMuted ? 'Activar efectos de sonido' : 'Silenciar efectos'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Almanac / Guide - takes directly to Cards / Codice */}
          <button
            onClick={() => onSelectTab && onSelectTab('CARDS')}
            className="p-1.5 text-slate-400 hover:text-amber-300 bg-slate-950/60 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Ver Cartas y Códice Táctico"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
