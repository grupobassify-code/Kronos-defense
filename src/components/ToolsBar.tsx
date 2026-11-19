import React from 'react';
import { TacticalToolId } from '../types/game';
import { TACTICAL_TOOLS, TACTICAL_TOOL_MAP } from '../data/tools';
import {
  Shovel,
  Hammer,
  BatteryCharging,
  Bomb,
  ShieldPlus,
  Wrench,
  Lock,
  X
} from 'lucide-react';

interface ToolsBarProps {
  highestArenaUnlocked: number;
  activeToolId: TacticalToolId | null;
  toolCooldowns: Record<TacticalToolId, number>;
  onSelectTool: (toolId: TacticalToolId) => void;
  onCancelTool: () => void;
}

export const ToolsBar: React.FC<ToolsBarProps> = ({
  highestArenaUnlocked,
  activeToolId,
  toolCooldowns,
  onSelectTool,
  onCancelTool
}) => {
  const activeTool = activeToolId ? TACTICAL_TOOL_MAP[activeToolId] : null;

  const renderIcon = (id: TacticalToolId, isUnlocked: boolean, isReady: boolean, isActive: boolean) => {
    const colorClass = !isUnlocked
      ? 'text-slate-600'
      : isActive
      ? 'text-slate-950'
      : isReady
      ? id === 'shovel'
        ? 'text-amber-400'
        : id === 'hammer'
        ? 'text-orange-400'
        : id === 'battery'
        ? 'text-cyan-400'
        : id === 'bomb'
        ? 'text-rose-400'
        : id === 'core_shield'
        ? 'text-emerald-400'
        : 'text-violet-400'
      : 'text-slate-500';

    const cls = `w-4 h-4 shrink-0 ${colorClass}`;
    switch (id) {
      case 'shovel':
        return <Shovel className={cls} />;
      case 'hammer':
        return <Hammer className={cls} />;
      case 'battery':
        return <BatteryCharging className={cls} />;
      case 'bomb':
        return <Bomb className={cls} />;
      case 'core_shield':
        return <ShieldPlus className={cls} />;
      case 'wrench':
        return <Wrench className={cls} />;
    }
  };

  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-2xl px-3 py-2 flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 min-w-0">
          <span className="text-xs font-black text-cyan-300 shrink-0 whitespace-nowrap">
            Herramientas
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {TACTICAL_TOOLS.map((tool) => {
              const isUnlocked = highestArenaUnlocked >= tool.unlockArena;
              const cooldown = toolCooldowns[tool.id] || 0;
              const isReady = isUnlocked && cooldown === 0;
              const isActive = activeToolId === tool.id;

              return (
                <button
                  key={tool.id}
                  onClick={() => isUnlocked && isReady && onSelectTool(tool.id)}
                  disabled={!isUnlocked || !isReady}
                  title={
                    !isUnlocked
                      ? `${tool.name} — Se desbloquea en Arena ${tool.unlockArena}. ${tool.description}`
                      : cooldown > 0
                      ? `${tool.name} — Disponible en ${cooldown} ${cooldown === 1 ? 'ronda' : 'rondas'}. ${tool.description}`
                      : `${tool.name} (cada ${tool.cooldownRounds} ${tool.cooldownRounds === 1 ? 'ronda' : 'rondas'}) — ${tool.description}`
                  }
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 border transition-all ${
                    !isUnlocked
                      ? 'bg-slate-950/60 border-slate-900 text-slate-500 cursor-not-allowed opacity-65'
                      : isActive
                      ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-md cursor-pointer'
                      : isReady
                      ? 'bg-slate-950 hover:bg-slate-800 border-slate-700 hover:border-cyan-400 text-slate-100 cursor-pointer active:scale-95'
                      : 'bg-slate-950/70 border-slate-800/80 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {renderIcon(tool.id, isUnlocked, isReady, isActive)}
                  <span>{tool.shortName}</span>
                  {!isUnlocked ? (
                    <span className="flex items-center gap-0.5 text-[10px] text-slate-500 font-mono tabular-nums">
                      <Lock className="w-3 h-3" />
                      A{tool.unlockArena}
                    </span>
                  ) : cooldown > 0 ? (
                    <span className="text-[10px] font-mono tabular-nums text-amber-400/90">
                      {cooldown}r
                    </span>
                  ) : isActive ? (
                    <span className="text-[10px] font-black">Activa</span>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-400">Listo</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {activeTool && (
          <button
            onClick={onCancelTool}
            className="px-2.5 py-1.5 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-700/60 text-red-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancelar [ESC]</span>
          </button>
        )}
      </div>

      {activeTool && (
        <div className="text-[11px] text-amber-300 font-medium flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
          <span>
            <strong className="text-amber-200">{activeTool.name}:</strong> {activeTool.usageHint}
          </span>
        </div>
      )}
    </div>
  );
};
