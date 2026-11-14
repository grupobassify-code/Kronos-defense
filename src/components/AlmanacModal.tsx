import React, { useState } from 'react';
import { UNIT_LIST } from '../data/units';
import { ENEMY_LIST } from '../data/enemies';
import {
  X,
  Shield,
  Zap,
  Flame,
  Snowflake,
  Coins,
  Sparkles,
  Crosshair,
  Heart,
  Gauge,
  Skull
} from 'lucide-react';
import { UnitRole } from '../types/game';
import { GameImage } from './GameImage';

interface AlmanacModalProps {
  onClose: () => void;
}

export const AlmanacModal: React.FC<AlmanacModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'units' | 'enemies' | 'spritesheets'>('units');
  const [selectedUnitId, setSelectedUnitId] = useState<string>(UNIT_LIST[0].id);

  const selectedUnit = UNIT_LIST.find((u) => u.id === selectedUnitId) || UNIT_LIST[0];

  const getRoleIcon = (role: UnitRole) => {
    switch (role) {
      case 'ataque':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'area':
        return <Flame className="w-3.5 h-3.5 text-red-400" />;
      case 'control':
        return <Snowflake className="w-3.5 h-3.5 text-cyan-400" />;
      case 'economia':
        return <Coins className="w-3.5 h-3.5 text-yellow-400" />;
      case 'soporte':
        return <Shield className="w-3.5 h-3.5 text-emerald-400" />;
      case 'especial':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-display">
              Códice Táctico de Chronos
            </h2>
            <p className="text-xs text-slate-400">
              Enciclopedia oficial de unidades heroicas, bestiario hostil y hojas maestras de sprites.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab switch */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('units')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'units'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Unidades ({UNIT_LIST.length})
              </button>
              <button
                onClick={() => setActiveTab('enemies')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'enemies'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Bestiario ({ENEMY_LIST.length})
              </button>
              <button
                onClick={() => setActiveTab('spritesheets')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'spritesheets'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hojas de Sprites
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'spritesheets' ? (
            /* Sprite Sheets Gallery Showcase */
            <div className="space-y-6">
              {/* Section 1: Hero Roster Sprite Sheet */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Hoja de Sprites Maestra: Escuadrón de Héroes
                    </h3>
                    <p className="text-xs text-slate-400">
                      Roster completo con los 7 personajes tácticos (Sol, Pyra, Boreas, Aethel, Kora, Nova, Chronos) con animaciones de reposo, marcha, ataque y habilidades especiales.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/60 text-blue-300">
                    7 HÉROES · COHESIVO
                  </span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black">
                  <GameImage
                    src="/assets/images/spritesheet_heroes_roster_1791484962258.jpg"
                    alt="Hoja de Sprites de Héroes Chronos Defense"
                    className="w-full h-auto object-contain hover:scale-[1.01] transition-transform duration-200"
                  />
                </div>
              </div>

              {/* Section 2: Enemy Horde Sprite Sheet */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <Skull className="w-4 h-4 text-red-400" />
                      Hoja de Sprites Maestra: Horda Enemiga y Jefes
                    </h3>
                    <p className="text-xs text-slate-400">
                      Bestiario unificado con Soldados Autómatas, Vipers Rápidos, Colosos Blindados, Enjambres, Caminantes de Fase, y los Jefes Supremos Goliath y Señor del Eclipse.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 border border-red-800/60 text-red-300">
                    7 ARQUETIPOS HOSTILES
                  </span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black">
                  <GameImage
                    src="/assets/images/spritesheet_enemies_horde_1791484974731.jpg"
                    alt="Hoja de Sprites de Enemigos Chronos Defense"
                    loading="lazy"
                    className="w-full h-auto object-contain hover:scale-[1.01] transition-transform duration-200"
                  />
                </div>
              </div>

              {/* Section 3: Combat VFX & Showdown Matrix */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      Matriz de Ataques, Proyectiles y Habilidades Showdown
                    </h3>
                    <p className="text-xs text-slate-400">
                      Iconografía de combate coherente: Proyectiles de Plasma, Orbe de Fuego, Esquirlas de Escarcha, Moneda de Alquimia, Pulso Armónico, Cañón de Riel, Lluvia de Meteoros, Supernova y Rayo Orbital.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/60 text-amber-300">
                    9 ICONOS TÁCTICOS
                  </span>
                </div>
                <div className="max-w-md mx-auto rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black">
                  <GameImage
                    src="/assets/images/spritesheet_tactical_vfx_1791484983154.jpg"
                    alt="Matriz de Ataques y Habilidades Chronos Defense"
                    loading="lazy"
                    className="w-full h-auto object-contain hover:scale-[1.01] transition-transform duration-200"
                  />
                </div>
              </div>
            </div>
          ) : activeTab === 'units' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Unit List selector */}
              <div className="md:col-span-4 space-y-2">
                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                  Selecciona una Unidad
                </div>
                {UNIT_LIST.map((unit) => {
                  const isSelected = unit.id === selectedUnitId;
                  return (
                    <button
                      key={unit.id}
                      onClick={() => setSelectedUnitId(unit.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-blue-950/60 border-blue-500 shadow-md ring-1 ring-blue-500/40'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border shadow-sm relative"
                          style={{
                            backgroundColor: unit.colorTheme.bg,
                            borderColor: unit.colorTheme.primary
                          }}
                        >
                          {unit.imageUrl ? (
                            <GameImage
                              src={unit.imageUrl}
                              alt={unit.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                              fallback={
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: unit.colorTheme.primary }}
                                />
                              }
                            />
                          ) : (
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: unit.colorTheme.primary }}
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-100 truncate">
                            {unit.name}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 capitalize">
                            {getRoleIcon(unit.role)}
                            <span>{unit.role}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300 shrink-0">
                        {unit.cost}g
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Unit Full Inspector & 3-Tier Upgrades */}
              <div className="md:col-span-8 space-y-4">
                {/* Header Card */}
                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border shadow-md relative"
                        style={{
                          backgroundColor: selectedUnit.colorTheme.bg,
                          borderColor: selectedUnit.colorTheme.primary
                        }}
                      >
                        {selectedUnit.imageUrl ? (
                          <GameImage
                            src={selectedUnit.imageUrl}
                            alt={selectedUnit.name}
                            className="w-full h-full object-cover"
                            fallback={
                              <div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: selectedUnit.colorTheme.primary }}
                              />
                            }
                          />
                        ) : (
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: selectedUnit.colorTheme.primary }}
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-extrabold text-slate-100 font-display">
                            {selectedUnit.name}
                          </h3>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full uppercase font-mono tracking-wider bg-slate-800 text-slate-300">
                            {selectedUnit.rarity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{selectedUnit.description}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-400">Costo Base</div>
                      <div className="text-lg font-bold font-mono text-amber-300">
                        {selectedUnit.cost} oro
                      </div>
                    </div>
                  </div>

                  {/* Showdown Ability Spotlight */}
                  <div className="mt-3 p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl relative overflow-hidden">
                    {selectedUnit.showdownImageUrl && (
                      <div className="w-full h-20 rounded-lg overflow-hidden border border-amber-800/40 mb-2 relative">
                        <GameImage
                          src={selectedUnit.showdownImageUrl}
                          alt={selectedUnit.showdownName}
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Habilidad Showdown: {selectedUnit.showdownName}
                      </span>
                      <span className="text-amber-300/80 font-mono text-[11px]">
                        Cooldown: {selectedUnit.showdownCooldown}s
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedUnit.showdownDescription}
                    </p>
                  </div>
                </div>

                {/* 3 Upgrade Tiers */}
                <div className="space-y-2">
                  <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Línea de Evolución y Mejoras
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {selectedUnit.tiers.map((tier, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-slate-200">Nivel {idx + 1}</span>
                            <span className="font-mono text-amber-400 text-[11px]">
                              {tier.cost === 0 ? 'Base' : `+${tier.cost}g`}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-blue-300 mb-1.5">
                            {tier.name}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight mb-2">
                            {tier.description}
                          </p>
                          {tier.bonusEffect && (
                            <div className="text-[10px] text-emerald-400 font-medium mb-2">
                              ✦ {tier.bonusEffect}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono space-y-0.5 text-slate-400">
                          <div>Daño: <span className="text-slate-200 font-semibold">{tier.damage}</span></div>
                          <div>Alcance: <span className="text-slate-200 font-semibold">{tier.range}px</span></div>
                          <div>Cadencia: <span className="text-slate-200 font-semibold">{tier.attackSpeed}/s</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Enemy Bestiary */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ENEMY_LIST.map((enemy) => (
                <div
                  key={enemy.id}
                  className={`bg-slate-950/70 border rounded-2xl p-4 flex flex-col justify-between ${
                    enemy.isBoss
                      ? 'border-red-700/80 shadow-lg shadow-red-950/30'
                      : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {enemy.imageUrl ? (
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-red-500/50 shrink-0">
                            <GameImage
                              src={enemy.imageUrl}
                              alt={enemy.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                              fallback={
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: enemy.accentColor }}
                                />
                              }
                            />
                          </div>
                        ) : (
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: enemy.accentColor }}
                          />
                        )}
                        <h4 className="font-bold text-sm text-slate-100">{enemy.name}</h4>
                      </div>
                      {enemy.isBoss && (
                        <span className="text-[10px] uppercase font-bold text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/60">
                          Jefe
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {enemy.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-xs grid grid-cols-2 gap-2 text-slate-300 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-red-400" />
                      <span>{enemy.baseHealth} HP</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{enemy.speed} vel</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-blue-400" />
                      <span>{enemy.armor} armad</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>+{enemy.goldReward} oro</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
