import React, { useState, useEffect } from 'react';
import { PlayerProgression, Mission, PackReward } from '../types/game';
import { UNITS, UNIT_LIST, isCardLockedByArena } from '../data/units';
import { ENEMY_LIST } from '../data/enemies';
import { getArenaForWave, getArenaByLevel } from '../data/maps';
import {
  LEVEL_UP_COSTS,
  getLevelStatMultiplier,
  getKillsRequiredForPack,
  getCardShopPrice,
  canBuyCardInShop,
  SHOP_PACK_COIN_PRICE,
  SHOP_SP_COIN_PRICE,
  SHOP_SP_BUNDLE_AMOUNT
} from '../utils/progression';
import { getRarityMeta, RARITY_LIST, compareRarities } from '../utils/rarity';
import { sounds } from '../utils/audio';
import {
  Layers,
  Swords,
  PackageOpen,
  Trophy,
  BookOpen,
  Zap,
  Lock,
  Sparkles,
  ArrowUp,
  Star,
  Coins,
  CheckCircle2,
  Skull,
  Plus,
  Search,
  X,
  Music,
  HardDrive,
  ShoppingBag,
  Wallet
} from 'lucide-react';
import { music } from '../utils/music';
import { saveProgression } from '../utils/progression';
import { GameImage } from './GameImage';

type SubTabKey = 'DECK' | 'SHOP' | 'PACKS' | 'MISSIONS' | 'ALMANAC';

interface CardsHubProps {
  progression: PlayerProgression;
  missions: Mission[];
  onUpgradeCharacter: (unitId: string) => void;
  onClaimMission: (missionId: string) => void;
  onOpenPack: () => PackReward[];
  onSwitchToBattle: () => void;
  onToggleDeckCard?: (unitId: string) => void;
  onBuyCardWithCoins?: (unitId: string) => void;
  onBuyPackWithCoins?: () => void;
  onBuySkillPointsWithCoins?: () => void;
  requestedSubTab?: SubTabKey | null;
  onConsumeRequestedSubTab?: () => void;
  currentWave?: number;
}

export const CardsHub: React.FC<CardsHubProps> = ({
  progression,
  missions,
  onUpgradeCharacter,
  onClaimMission,
  onOpenPack,
  onSwitchToBattle,
  onToggleDeckCard,
  onBuyCardWithCoins,
  onBuyPackWithCoins,
  onBuySkillPointsWithCoins,
  requestedSubTab = null,
  onConsumeRequestedSubTab,
  currentWave = 1
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTabKey>(requestedSubTab || 'DECK');
  const [selectedCardId, setSelectedCardId] = useState<string>(progression.unlockedCardIds[0] || 'vanguard_solar');
  const [selectedRarityFilter, setSelectedRarityFilter] = useState<string>('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [raritySortAsc, setRaritySortAsc] = useState<boolean>(true); // true: Común -> Divinidad, false: Divinidad -> Común

  // Card Shop filters
  const [shopSearch, setShopSearch] = useState<string>('');
  const [shopRarity, setShopRarity] = useState<string>('all');
  const [shopRole, setShopRole] = useState<string>('all');
  const [shopShowMode, setShopShowMode] = useState<'ALL' | 'UNOWNED'>('ALL');

  useEffect(() => {
    if (requestedSubTab) {
      setActiveSubTab(requestedSubTab);
      onConsumeRequestedSubTab?.();
    }
  }, [requestedSubTab, onConsumeRequestedSubTab]);

  // Pack opening sub-state
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  const [lastOpenedRewards, setLastOpenedRewards] = useState<PackReward[] | null>(null);

  const claimableCount = missions.filter((m) => m.completed && !m.claimed).length;

  // Audio & Save modal states
  const [isMusicMuted, setIsMusicMuted] = useState(() => music.getIsMuted());
  const [isSfxMuted, setIsSfxMuted] = useState(() => sounds.getMuted());
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleManualSave = () => {
    saveProgression(progression, missions);
    sounds.playCoin();
    setSaveToast('¡Progreso guardado con éxito en la memoria del dispositivo!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleOpenPackInHub = () => {
    if (isOpeningPack || progression.unopenedPacks <= 0) return;
    setIsOpeningPack(true);
    sounds.playShowdown();

    setTimeout(() => {
      const rewards = onOpenPack();
      setLastOpenedRewards(rewards);
      setIsOpeningPack(false);
      sounds.playWaveClear();
    }, 700);
  };

  const selectedUnit = UNITS[selectedCardId] || UNIT_LIST[0];
  const isSelectedUnlocked = progression.unlockedCardIds.includes(selectedCardId);
  const isSelectedInDeck = (progression.activeDeckCardIds || []).includes(selectedCardId);
  const currentLevel = progression.cardMasteryLevels[selectedCardId] || 1;
  const nextLevelCost = LEVEL_UP_COSTS[currentLevel] || null;
  const canAffordUpgrade = nextLevelCost !== null && progression.skillPoints >= nextLevelCost;
  const currentStats = getLevelStatMultiplier(currentLevel);
  const nextStats = currentLevel < 10 ? getLevelStatMultiplier(currentLevel + 1) : null;
  const currentArena = getArenaForWave(currentWave);

  return (
    <div className="w-full max-w-[1680px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-6 animate-fade-in">
      {/* Top Navigation Bar: Cartas & Jugar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/50 cursor-default"
          >
            <Layers className="w-4 h-4 text-purple-300" />
            <span>🎴 Cartas</span>
            {progression.unopenedPacks > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-[10px] text-white font-black animate-pulse">
                {progression.unopenedPacks}
              </span>
            )}
          </button>
          <button
            onClick={onSwitchToBattle}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Swords className="w-4 h-4 text-cyan-400" />
            <span>⚔️ Jugar</span>
          </button>
        </div>

        {/* Progressive Kills Tracker Pill */}
        {(() => {
          const claimed = progression.packsClaimedFromKills || 0;
          const targetKills = getKillsRequiredForPack(claimed);
          const currentKills = progression.killsTowardsNextPack || 0;
          const pct = Math.min(100, Math.max(0, (currentKills / targetKills) * 100));
          return (
            <div
              onClick={() => setActiveSubTab('PACKS')}
              className="flex items-center gap-2.5 bg-slate-900/90 px-3.5 py-1.5 rounded-2xl border border-purple-500/30 text-xs text-slate-300 shadow-sm cursor-pointer hover:border-purple-400 transition-colors"
            >
              <span className="text-purple-400 font-bold flex items-center gap-1">
                <span>📦</span>
                <span>Sobre #{claimed + 1}:</span>
              </span>
              <div className="w-20 sm:w-24 h-2 bg-slate-950 rounded-full overflow-hidden border border-purple-500/30">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="font-mono tabular-nums font-bold text-amber-300">
                {currentKills}/{targetKills}
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                (faltan {Math.max(0, targetKills - currentKills)})
              </span>
            </div>
          );
        })()}
      </div>

      {/* Clash Royale Header Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-lg shadow-purple-950/40">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-100 font-display tracking-tight flex items-center gap-2 flex-wrap">
              <span>Colección, Tienda & Mazo</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                {currentArena.name}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Compra las cartas que quieras con tus monedas guardadas, equipa hasta 7 héroes y súbelos al Nivel 10.
            </p>
          </div>
        </div>

        {/* Resources Badges & Arena Badge */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-purple-500/40 text-purple-300 font-bold text-xs shadow-inner">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span>{currentArena.badge}</span>
          </div>

          {/* Saved Vault Coins */}
          <button
            onClick={() => setActiveSubTab('SHOP')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900/70 border border-amber-500/50 text-amber-200 font-bold font-mono tabular-nums text-xs shadow-inner cursor-pointer transition-all whitespace-nowrap"
            title="Ir a la Tienda de Cartas"
          >
            <Wallet className="w-4 h-4 text-amber-400" />
            <span>{progression.savedCoins ?? 0} Monedas</span>
          </button>

          {/* Skill Points */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-amber-500/30 text-amber-300 font-bold font-mono tabular-nums text-xs shadow-inner">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span>{progression.skillPoints} pts</span>
          </div>

          {/* Unopened Packs */}
          <button
            onClick={() => setActiveSubTab('PACKS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              progression.unopenedPacks > 0
                ? 'bg-purple-950/90 border-purple-500/60 text-purple-200 animate-pulse hover:bg-purple-900 shadow-md shadow-purple-950/50'
                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <PackageOpen className="w-4 h-4 text-purple-400" />
            <span>{progression.unopenedPacks} Sobres</span>
          </button>

          {/* AI Procedural Music Toggle */}
          <button
            onClick={() => {
              const next = music.toggleMute();
              setIsMusicMuted(next);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              isMusicMuted
                ? 'bg-slate-950/70 border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-purple-950/80 border-purple-500/60 text-purple-300 shadow-md shadow-purple-950/40'
            }`}
            title={isMusicMuted ? 'Activar música generada por IA' : 'Silenciar música'}
          >
            <Music className={`w-3.5 h-3.5 ${!isMusicMuted ? 'animate-pulse' : ''}`} />
            <span>{isMusicMuted ? 'Música: OFF' : 'Música IA'}</span>
          </button>

          {/* Device Save Status Pill */}
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-emerald-300 font-bold text-xs shadow-inner cursor-pointer hover:bg-emerald-950/40 hover:border-emerald-400 transition-all whitespace-nowrap"
            title="Ver datos de progreso guardados en tu dispositivo"
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Guardado en Celular</span>
            <span className="sm:hidden">Guardado</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Secondary Nav Tabs */}
      <div className="flex items-center gap-1.5 p-2 bg-slate-950/70 border-b border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('DECK')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'DECK'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Mazo & Cartas ({progression.activeDeckCardIds?.length || 0}/7)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('SHOP')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'SHOP'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-900/40 font-black'
              : 'text-amber-300 hover:text-amber-200 hover:bg-amber-950/50 border border-amber-500/30'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Tienda de Cartas</span>
        </button>

        <button
          onClick={() => setActiveSubTab('PACKS')}
          className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'PACKS'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <PackageOpen className="w-4 h-4" />
          <span>Abrir Sobres</span>
          {progression.unopenedPacks > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-0.5" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('MISSIONS')}
          className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'MISSIONS'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Misiones</span>
          {claimableCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-[10px] font-bold text-white ml-0.5">
              {claimableCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('ALMANAC')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'ALMANAC'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Códice Táctico</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-4 sm:p-6 overflow-y-auto max-h-[75vh]">
        {/* SUBTAB 1: DECK & CARDS COLLECTION */}
        {activeSubTab === 'DECK' && (
          <div className="space-y-6">
            {/* 7-CARD ACTIVE BATTLE DECK CONTAINER (Clash Royale Style) */}
            <div className="bg-slate-950/90 border-2 border-cyan-500/40 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-black text-cyan-300 flex items-center gap-1.5">
                    <Swords className="w-4 h-4 text-cyan-400" />
                    <span>Mazo de Batalla Activo</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300">
                      {progression.activeDeckCardIds?.length || 0}/7 Cartas
                    </span>
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 hidden sm:block">
                  Solo estas cartas aparecerán en combate (máximo 7)
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {(progression.activeDeckCardIds || []).map((deckCardId) => {
                  const deckUnit = UNITS[deckCardId];
                  if (!deckUnit) return null;
                  const lvl = progression.cardMasteryLevels[deckCardId] || 1;
                  const isSel = selectedCardId === deckCardId;
                  const rMeta = getRarityMeta(deckUnit.rarity);

                  return (
                    <div
                      key={`deck_slot_${deckCardId}`}
                      onClick={() => setSelectedCardId(deckCardId)}
                      className={`relative p-2 rounded-2xl border text-left cursor-pointer transition-all ${
                        isSel
                          ? `${rMeta.cardSelected} scale-[1.03]`
                          : `${rMeta.cardBg} ${rMeta.cardBorder} hover:scale-[1.02] shadow-sm`
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1 font-mono">
                        <span className="text-cyan-300 font-bold">Nv.{lvl}</span>
                        <span className="text-amber-400 font-bold">{deckUnit.cost}o</span>
                      </div>
                      <div className={`w-full h-14 rounded-lg overflow-hidden mb-1.5 border-2 ${rMeta.cardBorder} bg-slate-950`}>
                        {deckUnit.imageUrl && (
                          <GameImage
                            src={deckUnit.imageUrl}
                            alt={deckUnit.name}
                            className="w-full h-full object-cover"
                            fallback={
                              <div className="w-full h-full flex items-center justify-center bg-slate-900 text-xs font-bold text-slate-400">
                                {deckUnit.name.slice(0, 2).toUpperCase()}
                              </div>
                            }
                          />
                        )}
                      </div>
                      <div className="w-full flex items-center justify-between mb-0.5">
                        <span className={`text-[8px] uppercase px-1 py-0.2 rounded ${rMeta.badgeClass}`}>
                          {rMeta.badgeLabel}
                        </span>
                      </div>
                      <div className={`text-[11px] font-bold truncate ${rMeta.textColor}`}>
                        {deckUnit.name}
                      </div>

                      {/* Direct Upgrade Button on Active Deck Card */}
                      {lvl < 10 && LEVEL_UP_COSTS[lvl] !== undefined && (
                        <div className="mt-1.5 w-full pt-1 border-t border-slate-800/80">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (progression.skillPoints >= LEVEL_UP_COSTS[lvl]) {
                                onUpgradeCharacter(deckCardId);
                              } else {
                                setSelectedCardId(deckCardId);
                              }
                            }}
                            disabled={progression.skillPoints < LEVEL_UP_COSTS[lvl]}
                            className={`w-full py-0.5 px-1 rounded-lg text-[9px] font-black uppercase flex items-center justify-center gap-0.5 transition-all cursor-pointer ${
                              progression.skillPoints >= LEVEL_UP_COSTS[lvl]
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 ring-1 ring-emerald-300 animate-pulse hover:scale-105 active:scale-95'
                                : 'bg-slate-900 text-slate-500 border border-slate-800'
                            }`}
                            title={
                              progression.skillPoints >= LEVEL_UP_COSTS[lvl]
                                ? `Subir a Nv.${lvl + 1} (${LEVEL_UP_COSTS[lvl]} PH)`
                                : `Faltan puntos (${progression.skillPoints}/${LEVEL_UP_COSTS[lvl]} PH)`
                            }
                          >
                            <ArrowUp className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">
                              {progression.skillPoints >= LEVEL_UP_COSTS[lvl]
                                ? `Nv.${lvl + 1} (${LEVEL_UP_COSTS[lvl]})`
                                : `Nv.${lvl + 1} (${LEVEL_UP_COSTS[lvl]})`}
                            </span>
                          </button>
                        </div>
                      )}

                      {/* Remove button if deck has > 1 card */}
                      {(progression.activeDeckCardIds || []).length > 1 && onToggleDeckCard && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleDeckCard(deckCardId);
                            sounds.playSell();
                          }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-xs shadow-md transition-transform hover:scale-110 cursor-pointer"
                          title="Quitar de la baraja activa"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* Empty Slots */}
                {Array.from({ length: Math.max(0, 7 - (progression.activeDeckCardIds?.length || 0)) }).map((_, idx) => (
                  <div
                    key={`hub_empty_${idx}`}
                    className="p-2 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center text-center text-slate-500 min-h-[96px]"
                  >
                    <Plus className="w-5 h-5 mb-1 text-slate-600" />
                    <span className="text-[10px] font-bold">Ranura Libre</span>
                    <span className="text-[9px] text-slate-600">Equipa abajo</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TWO COLUMNS: ALL CARDS + SELECTED CARD INSPECTOR */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Left Column: All Cards Grid */}
              <div className="md:col-span-6 lg:col-span-7 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Colección de Cartas
                    </span>
                    <span className="font-mono text-cyan-400 text-xs font-bold">
                      ({progression.unlockedCardIds.length}/{UNIT_LIST.length})
                    </span>
                  </div>

                  {/* Order By Rarity Toggle */}
                  <button
                    onClick={() => setRaritySortAsc(!raritySortAsc)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-500 text-[11px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer self-start sm:self-auto"
                    title="Cambiar orden de rarezas"
                  >
                    <span>Ordenar Rareza:</span>
                    <span className="text-cyan-400 font-extrabold">
                      {raritySortAsc ? 'Común ➔ Divinidad ↑' : 'Divinidad ➔ Común ↓'}
                    </span>
                  </button>
                </div>

                {/* Search & Quick Filters */}
                <div className="space-y-2">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por nombre (ej. Espadachín, Slimes, Kronos, Dragón)..."
                      className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Rarity Filter Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {RARITY_LIST.map((r) => {
                      const isFilterActive = selectedRarityFilter === r.key;
                      return (
                        <button
                          key={r.key}
                          onClick={() => setSelectedRarityFilter(r.key)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                            isFilterActive
                              ? 'bg-cyan-500 text-slate-950 shadow-md font-black shadow-cyan-950/60'
                              : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          {r.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Role Filter Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                    {[
                      { key: 'all', label: 'Todos los Roles' },
                      { key: 'ataque', label: '⚡ Ataque' },
                      { key: 'area', label: '🔥 Área' },
                      { key: 'control', label: '❄️ Control' },
                      { key: 'invocador', label: '✨ Invocador' },
                      { key: 'soporte', label: '🛡️ Soporte' },
                      { key: 'economia', label: '🪙 Economía' }
                    ].map((roleItem) => (
                      <button
                        key={roleItem.key}
                        onClick={() => setSelectedRoleFilter(roleItem.key)}
                        className={`px-2.5 py-0.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                          selectedRoleFilter === roleItem.key
                            ? 'bg-purple-600 text-white shadow'
                            : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                        }`}
                      >
                        {roleItem.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {UNIT_LIST
                    .filter((u) => {
                      if (searchQuery.trim()) {
                        const q = searchQuery.toLowerCase().trim();
                        const matchName = u.name.toLowerCase().includes(q);
                        const matchTitle = u.title.toLowerCase().includes(q);
                        const matchDesc = u.description.toLowerCase().includes(q);
                        if (!matchName && !matchTitle && !matchDesc) return false;
                      }
                      if (selectedRoleFilter !== 'all' && u.role !== selectedRoleFilter) {
                        return false;
                      }
                      if (selectedRarityFilter === 'all') return true;
                      const normRarity = u.rarity === 'rara' ? 'especial' : u.rarity;
                      return normRarity === selectedRarityFilter;
                    })
                    .sort((a, b) => {
                      const diff = compareRarities(a.rarity, b.rarity);
                      return raritySortAsc ? diff : -diff;
                    })
                    .map((unit) => {
                    const isUnlocked = progression.unlockedCardIds.includes(unit.id);
                    const isInDeck = (progression.activeDeckCardIds || []).includes(unit.id);
                    const isSelected = selectedCardId === unit.id;
                    const level = progression.cardMasteryLevels[unit.id] || 1;
                    const isMaxLevel = level >= 10;
                    const cost = LEVEL_UP_COSTS[level] || null;
                    const canUpgrade = isUnlocked && cost !== null && progression.skillPoints >= cost;
                    const rMeta = getRarityMeta(unit.rarity);

                    return (
                      <div
                        key={unit.id}
                        onClick={() => setSelectedCardId(unit.id)}
                        className={`relative p-2.5 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer group ${
                          isSelected
                            ? `${rMeta.cardSelected} scale-[1.03]`
                            : isUnlocked
                            ? `${rMeta.cardBg} ${rMeta.cardBorder} ${rMeta.cardHover}`
                            : 'bg-slate-950/40 border-slate-900 opacity-60 hover:opacity-75'
                        }`}
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between w-full mb-1.5 gap-1">
                          <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-black truncate ${rMeta.badgeClass}`}>
                            {unit.rarity === 'divinidad' ? `👑 Divinidad A${unit.arenaUnlockLevel || 1}` : rMeta.badgeLabel}
                          </span>
                          {isUnlocked ? (
                            <span
                              className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0 ${
                                isMaxLevel
                                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                                  : 'bg-slate-800 text-cyan-300 border border-cyan-800/40'
                              }`}
                            >
                              Nv.{level}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 flex items-center gap-0.5 shrink-0">
                              {unit.arenaUnlockLevel && unit.arenaUnlockLevel > (progression.highestArenaUnlocked || 1) ? (
                                <span className="text-amber-400 font-bold flex items-center gap-0.5 text-[9px] bg-amber-950/80 px-1 py-0.5 rounded border border-amber-500/40">
                                  <Lock className="w-2.5 h-2.5" /> A{unit.arenaUnlockLevel}
                                </span>
                              ) : (
                                <span className="text-slate-400 flex items-center gap-0.5 text-[9px]">
                                  <Lock className="w-2.5 h-2.5" /> Bloqueada
                                </span>
                              )}
                            </span>
                          )}
                        </div>

                        {/* Portrait */}
                        <div className={`relative w-full h-24 sm:h-28 rounded-xl overflow-hidden mb-2 border-2 ${rMeta.cardBorder} bg-slate-900`}>
                          {unit.imageUrl ? (
                            <GameImage
                              src={unit.imageUrl}
                              alt={unit.name}
                              loading="lazy"
                              className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${
                                !isUnlocked ? 'grayscale opacity-40' : ''
                              }`}
                              fallback={
                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-xs font-bold">
                                  {unit.name.slice(0, 2).toUpperCase()}
                                </div>
                              }
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                              No Sprite
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                          {isInDeck && (
                            <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-cyan-400 text-slate-950 text-[9px] font-black shadow-md">
                              EN MAZO
                            </div>
                          )}

                          {isMaxLevel && (
                            <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-amber-500 text-slate-950 shadow">
                              <Star className="w-3 h-3 fill-current" />
                            </div>
                          )}
                        </div>

                        {/* Name & Role */}
                        <div className="w-full min-w-0">
                          <div className={`text-xs font-bold truncate ${rMeta.textColor}`}>
                            {unit.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate capitalize">
                            {unit.role} · {unit.cost} oro
                          </div>
                        </div>

                        {/* Direct Upgrade Button (No need to scroll down to inspector) */}
                        {isUnlocked && !isMaxLevel && cost !== null && (
                          <div className="mt-2 w-full pt-1.5 border-t border-slate-800/80">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (canUpgrade) {
                                  onUpgradeCharacter(unit.id);
                                } else {
                                  setSelectedCardId(unit.id);
                                }
                              }}
                              disabled={!canUpgrade}
                              className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm ${
                                canUpgrade
                                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-950/60 ring-1 ring-emerald-300 animate-pulse hover:scale-[1.02] active:scale-95'
                                  : 'bg-slate-900/90 text-slate-500 border border-slate-800 hover:border-slate-700'
                              }`}
                              title={
                                canUpgrade
                                  ? `Mejorar a Nv.${level + 1} por ${cost} puntos de habilidad`
                                  : `Faltan puntos (${progression.skillPoints}/${cost} PH)`
                              }
                            >
                              <ArrowUp className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">
                                {canUpgrade ? `Mejorar Nv.${level + 1} (${cost} PH)` : `Nv.${level + 1} (${cost} PH)`}
                              </span>
                            </button>
                          </div>
                        )}

                        {isMaxLevel && (
                          <div className="mt-2 w-full py-1 px-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[10px] font-black text-center flex items-center justify-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>Nv.10 Máximo</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Card Detail, Deck Equip & Upgrade Panel */}
              <div className="md:col-span-6 lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  {/* Header with portrait */}
                  {(() => {
                    const selRMeta = getRarityMeta(selectedUnit.rarity);
                    return (
                      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800">
                        <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 ${selRMeta.cardBorder} bg-slate-900 shrink-0 shadow-lg relative`}>
                          {selectedUnit.imageUrl && (
                            <GameImage
                              src={selectedUnit.imageUrl}
                              alt={selectedUnit.name}
                              className={`w-full h-full object-cover ${!isSelectedUnlocked ? 'grayscale opacity-40' : ''}`}
                              fallback={
                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-sm font-bold">
                                  {selectedUnit.name.slice(0, 2).toUpperCase()}
                                </div>
                              }
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-black text-base truncate ${selRMeta.textColor}`}>
                              {selectedUnit.name}
                            </h3>
                            {isSelectedUnlocked && (
                              <span className="text-xs font-bold font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
                                Nv. {currentLevel}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 capitalize flex items-center gap-1.5 mt-0.5">
                            <span>{selectedUnit.title}</span>
                            <span>•</span>
                            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${selRMeta.badgeClass}`}>
                              {selRMeta.badgeLabel}
                            </span>
                          </div>
                          <div className="text-xs text-amber-300 font-mono mt-0.5">Coste de Despliegue: {selectedUnit.cost} oro</div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Deck Equip Toggle Button */}
                  {isSelectedUnlocked && onToggleDeckCard && (
                    <div className="py-3 border-b border-slate-800">
                      {isSelectedInDeck ? (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-cyan-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                            Equipada en tu Mazo (Ranura activa)
                          </span>
                          {(progression.activeDeckCardIds || []).length > 1 && (
                            <button
                              onClick={() => {
                                onToggleDeckCard(selectedUnit.id);
                                sounds.playSell();
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-red-300 bg-red-950/60 border border-red-800/60 hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
                            >
                              Quitar del Mazo
                            </button>
                          )}
                        </div>
                      ) : (
                        (progression.activeDeckCardIds || []).length < 7 ? (
                          <button
                            onClick={() => {
                              onToggleDeckCard(selectedUnit.id);
                              sounds.playPlace();
                            }}
                            className="w-full py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-slate-950 hover:from-cyan-500 hover:to-blue-500 cursor-pointer shadow-md transition-all"
                          >
                            <Plus className="w-4 h-4" />
                            <span>
                              ➕ Equipar a tu Mazo de Batalla ({progression.activeDeckCardIds?.length || 0}/7)
                            </span>
                          </button>
                        ) : (
                          <div className="space-y-1.5 bg-slate-900/90 p-2.5 rounded-xl border border-amber-500/40">
                            <div className="text-[11px] text-amber-300 font-bold flex items-center justify-between">
                              <span>Mazo Lleno (7/7). Toca qué carta sustituir:</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
                              {(progression.activeDeckCardIds || []).map((cardId) => {
                                const u = UNITS[cardId];
                                return (
                                  <button
                                    key={`swap_${cardId}`}
                                    onClick={() => {
                                      onToggleDeckCard(cardId);
                                      setTimeout(() => onToggleDeckCard(selectedUnit.id), 50);
                                      sounds.playPlace();
                                    }}
                                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-[10px] text-slate-200 truncate transition-colors cursor-pointer flex items-center gap-1 text-left"
                                    title={`Reemplazar por ${u?.name || cardId}`}
                                  >
                                    <span className="text-cyan-400">↔</span>
                                    <span className="truncate">{u?.name || cardId}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* Description & Stats */}
                  <div className="py-3 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedUnit.description}
                    </p>

                    {/* Stats Table */}
                    <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Daño Base:</span>
                        <span className="font-mono font-bold text-amber-300">
                          {Math.round(selectedUnit.baseDamage * currentStats.damageMult)}{' '}
                          <span className="text-[10px] text-emerald-400 font-normal">
                            (+{Math.round((currentStats.damageMult - 1) * 100)}%)
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Alcance:</span>
                        <span className="font-mono text-cyan-300">{selectedUnit.baseRange}px</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Cadencia de Ataque:</span>
                        <span className="font-mono text-emerald-300">
                          {(selectedUnit.baseAttackSpeed * currentStats.speedMult).toFixed(2)} /seg
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span>Rareza:</span>
                        {(() => {
                          const rM = getRarityMeta(selectedUnit.rarity);
                          return (
                            <span className={`font-mono uppercase font-black text-xs px-2 py-0.5 rounded ${rM.badgeClass}`}>
                              {rM.badgeLabel}
                            </span>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Showdown Box */}
                    <div className="bg-slate-900/90 rounded-xl p-3 border border-purple-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          <span>Showdown: {selectedUnit.showdownName}</span>
                        </span>
                        {currentStats.isShowdownUnlocked ? (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-1.5 py-0.2 rounded">
                            Desbloqueado
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Nivel 10
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {selectedUnit.showdownDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Upgrade Action / Unlock Information */}
                {isSelectedUnlocked ? (
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    {selectedUnit.rarity === 'divinidad' && (
                      <div className="text-[10px] text-amber-300 font-semibold bg-amber-950/40 p-2 rounded-xl border border-amber-500/40 flex items-center gap-2">
                        <span>👑</span>
                        <span>
                          <strong>Divinidad de Arena {selectedUnit.arenaUnlockLevel}:</strong> Solo puedes desplegar 1 Personaje Divino en el campo de batalla a la vez.
                        </span>
                      </div>
                    )}
                    {currentLevel < 10 ? (
                      <button
                        onClick={() => onUpgradeCharacter(selectedUnit.id)}
                        disabled={!canAffordUpgrade}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          canAffordUpgrade
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/50 active:scale-95'
                            : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                        }`}
                      >
                        <ArrowUp className="w-4 h-4" />
                        <span>
                          Subir a Nivel {currentLevel + 1} ({nextLevelCost} Puntos de Habilidad)
                        </span>
                      </button>
                    ) : (
                      <div className="w-full py-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 font-bold text-xs text-center">
                        ★ Nivel 10 Máximo · Showdown Definitivo Activo ★
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    {selectedUnit.rarity === 'divinidad' ? (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/60 via-purple-950/50 to-slate-950 border-2 border-amber-500/50 text-left space-y-2 shadow-xl">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-black text-amber-300 uppercase tracking-wider">
                            <span>👑</span>
                            <span>Personaje Divino de Arena {selectedUnit.arenaUnlockLevel}</span>
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/50 font-bold">
                            {getArenaByLevel(selectedUnit.arenaUnlockLevel || 1).badge}
                          </span>
                        </div>

                        {isCardLockedByArena(selectedUnit, progression.highestArenaUnlocked || 1) ? (
                          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/40 flex items-start gap-2">
                            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div className="text-[11px] text-slate-300 leading-relaxed">
                              <span className="text-amber-300 font-bold">Bloqueado hasta alcanzar esta arena:</span> Debes superar las arenas anteriores y llegar a la <strong className="text-amber-200">Arena {selectedUnit.arenaUnlockLevel} ({getArenaByLevel(selectedUnit.arenaUnlockLevel || 1).name})</strong> para que esta Divinidad pueda tocarte en tus Sobres Crono.
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div className="text-[11px] text-emerald-200 leading-relaxed">
                              <strong>¡Arena {selectedUnit.arenaUnlockLevel} Alcanzada!</strong> Este Personaje Divino ya está desbloqueado para tu cuenta. ¡Abre sobres con bajas o rondas para que se sume a tu colección!
                            </div>
                          </div>
                        )}

                        <div className="text-[10px] text-purple-200 font-medium bg-purple-950/80 p-2 rounded-xl border border-purple-800/60 flex items-center gap-1.5">
                          <span>⚡</span>
                          <span><strong>Regla de Combate:</strong> Solo se puede poner 1 Personaje Divino en el campo de batalla a la vez.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs text-center flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4 text-slate-500" />
                        <span>Consigue esta carta abriendo Sobres Crono tácticos.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: CARD SHOP (DIRECT PURCHASE WITH SAVED COINS) */}
        {activeSubTab === 'SHOP' && (
          <div className="space-y-5">
            {/* Vault Banner + Coin Bundles */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-5 bg-gradient-to-br from-amber-950/60 via-slate-950 to-slate-900 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/50 flex items-center justify-center shrink-0">
                    <Wallet className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                      Bóveda del Comandante
                    </div>
                    <div className="text-2xl font-black font-mono tabular-nums text-amber-300">
                      {progression.savedCoins ?? 0} <span className="text-xs font-normal text-amber-400/80">monedas</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Gana oro en batalla y guárdalo durante la arena o al completar rondas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bundle 1: Buy Chrono Pack */}
              <div className="lg:col-span-3 bg-slate-950/90 border border-purple-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-2.5">
                <div className="min-w-0">
                  <div className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                    <PackageOpen className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="truncate">+1 Sobre Crono</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Contiene cartas + PH</div>
                </div>
                <button
                  onClick={() => onBuyPackWithCoins?.()}
                  disabled={(progression.savedCoins ?? 0) < SHOP_PACK_COIN_PRICE}
                  className={`px-3 py-2 rounded-xl text-xs font-black font-mono tabular-nums whitespace-nowrap transition-all cursor-pointer ${
                    (progression.savedCoins ?? 0) >= SHOP_PACK_COIN_PRICE
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  🪙 {SHOP_PACK_COIN_PRICE}
                </button>
              </div>

              {/* Bundle 2: Buy Skill Points */}
              <div className="lg:col-span-4 bg-slate-950/90 border border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-2.5">
                <div className="min-w-0">
                  <div className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">+{SHOP_SP_BUNDLE_AMOUNT} Puntos de Habilidad</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Para mejorar tus cartas al Nv.10</div>
                </div>
                <button
                  onClick={() => onBuySkillPointsWithCoins?.()}
                  disabled={(progression.savedCoins ?? 0) < SHOP_SP_COIN_PRICE}
                  className={`px-3 py-2 rounded-xl text-xs font-black font-mono tabular-nums whitespace-nowrap transition-all cursor-pointer ${
                    (progression.savedCoins ?? 0) >= SHOP_SP_COIN_PRICE
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  🪙 {SHOP_SP_COIN_PRICE}
                </button>
              </div>
            </div>

            {/* Shop Search & Filters */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={shopSearch}
                    onChange={(e) => setShopSearch(e.target.value)}
                    placeholder="Busca cualquier carta para comprarla directamente (ej. Kronos, Fénix, Hacker)..."
                    className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  {shopSearch && (
                    <button
                      onClick={() => setShopSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
                  <button
                    onClick={() => setShopShowMode('ALL')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      shopShowMode === 'ALL'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Todas ({UNIT_LIST.length})
                  </button>
                  <button
                    onClick={() => setShopShowMode('UNOWNED')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      shopShowMode === 'UNOWNED'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Solo Faltantes ({UNIT_LIST.filter((u) => !progression.unlockedCardIds.includes(u.id)).length})
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {RARITY_LIST.map((r) => (
                  <button
                    key={`shop_r_${r.key}`}
                    onClick={() => setShopRarity(r.key)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      shopRarity === r.key
                        ? 'bg-amber-500 text-slate-950 font-black shadow'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                {[
                  { key: 'all', label: 'Todos los Roles' },
                  { key: 'ataque', label: '⚡ Ataque' },
                  { key: 'area', label: '🔥 Área' },
                  { key: 'control', label: '❄️ Control' },
                  { key: 'invocador', label: '✨ Invocador' },
                  { key: 'soporte', label: '🛡️ Soporte' },
                  { key: 'economia', label: '🪙 Economía' }
                ].map((roleItem) => (
                  <button
                    key={`shop_role_${roleItem.key}`}
                    onClick={() => setShopRole(roleItem.key)}
                    className={`px-2.5 py-0.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                      shopRole === roleItem.key
                        ? 'bg-purple-600 text-white shadow'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {roleItem.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Card Purchase Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {UNIT_LIST
                .filter((u) => {
                  const owned = progression.unlockedCardIds.includes(u.id);
                  if (shopShowMode === 'UNOWNED' && owned) return false;
                  if (shopSearch.trim()) {
                    const q = shopSearch.toLowerCase().trim();
                    if (
                      !u.name.toLowerCase().includes(q) &&
                      !u.title.toLowerCase().includes(q) &&
                      !u.description.toLowerCase().includes(q)
                    ) {
                      return false;
                    }
                  }
                  if (shopRole !== 'all' && u.role !== shopRole) return false;
                  if (shopRarity === 'all') return true;
                  const normR = u.rarity === 'rara' ? 'especial' : u.rarity;
                  return normR === shopRarity;
                })
                .sort((a, b) => {
                  const aOwned = progression.unlockedCardIds.includes(a.id) ? 1 : 0;
                  const bOwned = progression.unlockedCardIds.includes(b.id) ? 1 : 0;
                  if (aOwned !== bOwned) return aOwned - bOwned; // Show unowned cards first
                  return compareRarities(a.rarity, b.rarity);
                })
                .map((unit) => {
                  const isOwned = progression.unlockedCardIds.includes(unit.id);
                  const isInDeck = (progression.activeDeckCardIds || []).includes(unit.id);
                  const rMeta = getRarityMeta(unit.rarity);
                  const coinPrice = getCardShopPrice(unit);
                  const canAfford = (progression.savedCoins ?? 0) >= coinPrice;
                  const shopEligibility = canBuyCardInShop(unit, progression);
                  const isDivinityLocked = !shopEligibility.allowed;

                  return (
                    <div
                      key={`shop_card_${unit.id}`}
                      className={`p-3 rounded-2xl border flex flex-col justify-between gap-2.5 transition-all ${
                        isOwned
                          ? 'bg-slate-950/60 border-emerald-500/30'
                          : isDivinityLocked
                          ? 'bg-slate-950/80 border-slate-800 opacity-90'
                          : `${rMeta.cardBg} ${rMeta.cardBorder} shadow-lg`
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-black ${rMeta.badgeClass}`}>
                            {unit.rarity === 'divinidad' ? `👑 Divinidad A${unit.arenaUnlockLevel || 1}` : rMeta.badgeLabel}
                          </span>
                          <span className="text-[10px] font-mono text-amber-300 font-bold tabular-nums">
                            {unit.cost} oro arena
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 mb-2">
                          <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${rMeta.cardBorder} bg-slate-900 shrink-0 relative`}>
                            {unit.imageUrl && (
                              <GameImage
                                src={unit.imageUrl}
                                alt={unit.name}
                                loading="lazy"
                                className={`w-full h-full object-cover ${isDivinityLocked && !isOwned ? 'grayscale opacity-50' : ''}`}
                                fallback={
                                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-xs font-bold text-slate-300">
                                    {unit.name.slice(0, 2).toUpperCase()}
                                  </div>
                                }
                              />
                            )}
                            {isDivinityLocked && !isOwned && (
                              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50">
                                <Lock className="w-5 h-5 text-amber-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className={`text-sm font-black truncate ${rMeta.textColor}`}>{unit.name}</div>
                            <div className="text-[11px] text-slate-400 truncate">{unit.title}</div>
                            <div className="text-[10px] text-cyan-300 font-mono mt-0.5 capitalize">
                              {unit.role} · {unit.baseDamage} daño · {unit.baseRange}px
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                          {unit.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                        {isOwned ? (
                          <>
                            <div className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>En Colección</span>
                            </div>
                            {!isInDeck && (progression.activeDeckCardIds?.length || 0) < 7 && onToggleDeckCard && (
                              <button
                                onClick={() => {
                                  onToggleDeckCard(unit.id);
                                  sounds.playPlace();
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black cursor-pointer transition-colors whitespace-nowrap"
                              >
                                Equipar
                              </button>
                            )}
                          </>
                        ) : isDivinityLocked ? (
                          <button
                            disabled
                            className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-slate-900 text-amber-300/80 border border-amber-500/30 cursor-not-allowed whitespace-nowrap"
                            title={`Debes completar la Arena ${shopEligibility.requiredArena} primero para poder comprar este Divino`}
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate font-mono tabular-nums">
                              Completa Arena {shopEligibility.requiredArena} · {coinPrice} mon.
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onBuyCardWithCoins?.(unit.id)}
                            disabled={!canAfford}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                              canAfford
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-md active:scale-95'
                                : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                            }`}
                          >
                            <Coins className="w-3.5 h-3.5 shrink-0" />
                            <span className="font-mono tabular-nums">
                              {canAfford ? `Comprar · ${coinPrice} monedas` : `Faltan monedas (${coinPrice})`}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* SUBTAB 2: PACK OPENING WITH PROBABILITIES */}
        {activeSubTab === 'PACKS' && (
          <div className="flex flex-col items-center text-center py-4 max-w-xl mx-auto space-y-4">
            <div>
              <span className="text-xs uppercase font-bold text-purple-400 tracking-wider">
                Cofres & Sobres Crono
              </span>
              <h3 className="text-2xl font-black text-slate-100 font-display mt-0.5">
                Apertura de Recompensas
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Ganas sobres con bajas enemigas progresivas (1º sobre: 100 bajas, 2º: 200, 3º: 250, etc.), cada 10 rondas y en misiones.
              </p>
            </div>

            {/* Kill Milestones Tracker Card */}
            {(() => {
              const claimed = progression.packsClaimedFromKills || 0;
              const killsTarget = getKillsRequiredForPack(claimed);
              const currentKills = progression.killsTowardsNextPack || 0;
              const killsPct = Math.min(100, Math.max(0, (currentKills / killsTarget) * 100));
              const nextTarget = getKillsRequiredForPack(claimed + 1);

              return (
                <div className="w-full bg-slate-950/90 border border-purple-500/40 rounded-2xl p-3.5 text-left space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-amber-300 flex items-center gap-1.5">
                      <span>📦</span>
                      <span>Progreso del Próximo Sobre (#{claimed + 1})</span>
                    </span>
                    <span className="font-mono font-bold text-cyan-300">
                      {currentKills} / {killsTarget} Bajas
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400 transition-all duration-300"
                      style={{ width: `${killsPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Faltan {Math.max(0, killsTarget - currentKills)} enemigos para este sobre</span>
                    <span className="text-purple-300">Siguiente sobre requerirá {nextTarget} bajas</span>
                  </div>
                </div>
              );
            })()}

            {/* Drop Rates Info Box (as requested: "que los sobres ahora sean por probabilidad") */}
            <div className="w-full bg-slate-950/80 border border-purple-500/30 rounded-2xl p-3 text-left space-y-1.5 shadow-md">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Probabilidades de Recompensa (Rareza Clash Royale):</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300 pt-1">
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-600/70">
                  <div className="text-slate-300 font-bold">Comunes</div>
                  <div className="font-mono font-bold text-slate-200">50% de probabilidad</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-amber-500/70">
                  <div className="text-amber-300 font-bold">Especiales</div>
                  <div className="font-mono font-bold text-amber-300">32% de probabilidad</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-purple-500/70">
                  <div className="text-purple-300 font-bold">Épicas</div>
                  <div className="font-mono font-bold text-purple-300">14% de probabilidad</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-cyan-400 ring-1 ring-amber-400/60">
                  <div className="text-cyan-300 font-bold">★ Legendarias ★</div>
                  <div className="font-mono font-bold text-yellow-300">4% de probabilidad</div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                * 65% de probabilidad por sobre de contener una carta de personaje con los colores y bordes de su rareza. Las cartas repetidas se convierten en valiosos Puntos de Habilidad ⚡.
              </p>
            </div>

            {/* Booster Pack Visual */}
            {!lastOpenedRewards ? (
              <div className="my-2 flex flex-col items-center">
                <div
                  onClick={handleOpenPackInHub}
                  className={`w-52 h-64 rounded-2xl overflow-hidden border-2 shadow-2xl relative cursor-pointer group transition-transform ${
                    progression.unopenedPacks > 0
                      ? 'border-purple-500/70 hover:scale-105 shadow-purple-950/60'
                      : 'border-slate-800 opacity-60 cursor-not-allowed'
                  } ${isOpeningPack ? 'scale-110 rotate-1 animate-pulse border-amber-400' : ''}`}
                >
                  <GameImage
                    src="/assets/images/card_pack_booster_1791485514522.jpg"
                    alt="Sobre Crono"
                    className="w-full h-full object-cover"
                    fallback={<div className="w-full h-full bg-purple-950 flex items-center justify-center text-4xl">🎴</div>}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-center p-3">
                    <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider">
                      {isOpeningPack
                        ? '¡Abriendo...!'
                        : progression.unopenedPacks > 0
                        ? 'Toca para Abrir'
                        : 'Sin Sobres'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="text-xs text-slate-400">
                    Sobres Disponibles:{' '}
                    <span className="font-bold font-mono text-amber-300 text-sm">
                      {progression.unopenedPacks}
                    </span>
                  </div>

                  <button
                    onClick={handleOpenPackInHub}
                    disabled={isOpeningPack || progression.unopenedPacks <= 0}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-900/40 transition-all cursor-pointer disabled:opacity-40"
                  >
                    {isOpeningPack ? 'Abriendo...' : 'Abrir Sobre (1)'}
                  </button>
                </div>
              </div>
            ) : (
              /* Opened Rewards presentation */
              <div className="w-full my-3 space-y-4 animate-fade-in">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  ¡Recompensas Extraídas del Sobre!
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {lastOpenedRewards.map((reward, idx) => {
                    const unit = reward.cardId ? UNITS[reward.cardId] : null;
                    const rMeta = getRarityMeta(reward.rarity || unit?.rarity);

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${
                          reward.type === 'card'
                            ? `${rMeta.cardBg} ${rMeta.cardBorder} ${rMeta.glowClass} shadow-xl`
                            : 'bg-slate-950/80 border-slate-800'
                        }`}
                      >
                        {reward.type === 'card' ? (
                          <>
                            <div className="w-full flex items-center justify-center mb-1.5">
                              <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-black ${rMeta.badgeClass}`}>
                                {rMeta.badgeLabel}
                              </span>
                            </div>

                            <div className={`w-20 h-20 rounded-2xl overflow-hidden border-2 ${rMeta.cardBorder} mb-2 shadow-lg`}>
                              {reward.cardId && UNITS[reward.cardId]?.imageUrl ? (
                                <GameImage
                                  src={UNITS[reward.cardId].imageUrl}
                                  alt={reward.cardName}
                                  className="w-full h-full object-cover"
                                  fallback={
                                    <div className="w-full h-full flex items-center justify-center bg-purple-950">
                                      🎴
                                    </div>
                                  }
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-purple-950">
                                  🎴
                                </div>
                              )}
                            </div>

                            {reward.isDuplicate ? (
                              <>
                                <span className="text-[10px] font-bold text-amber-400 uppercase">
                                  🔄 CARTA DUPLICADA
                                </span>
                                <div className={`text-sm font-black ${rMeta.textColor}`}>{reward.cardName}</div>
                                <div className="text-xs font-bold text-amber-300 font-mono mt-1">
                                  +{reward.skillPoints} pts de Habilidad ⚡
                                </div>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  Convertido en puntos para mejorar a este héroe.
                                </p>
                              </>
                            ) : (
                              <>
                                <span className="text-[10px] font-bold text-emerald-400 uppercase animate-pulse">
                                  🎉 ¡NUEVA CARTA DESBLOQUEADA!
                                </span>
                                <div className={`text-sm font-black ${rMeta.textColor}`}>{reward.cardName}</div>
                                <p className="text-[10px] text-cyan-300 mt-1 font-medium">
                                  ¡Agregada a tu colección! Ya puedes equiparla a tu mazo.
                                </p>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="w-14 h-14 rounded-xl bg-amber-950/70 border border-amber-500/50 flex items-center justify-center text-amber-300 mb-2">
                              <Zap className="w-7 h-7 text-amber-400 fill-amber-400/20" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              Puntos de Habilidad
                            </span>
                            <div className="text-lg font-black text-amber-300 font-mono">
                              +{reward.skillPoints} pts
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">
                              Para subir niveles de personajes del 1 al 10.
                            </p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 flex items-center justify-center gap-3">
                  {progression.unopenedPacks > 0 && (
                    <button
                      onClick={() => {
                        setLastOpenedRewards(null);
                        handleOpenPackInHub();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Abrir Otro Sobre ({progression.unopenedPacks})
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setLastOpenedRewards(null);
                      setActiveSubTab('DECK');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Ver en Mi Baraja
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 3: MISSIONS */}
        {activeSubTab === 'MISSIONS' && (
          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Misiones del Modo Historia</span>
              <span>Gana Sobres Crono</span>
            </div>

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
                      <h4 className="font-bold text-sm text-slate-100">{mission.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase bg-slate-800 text-slate-300">
                        {mission.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-2">
                      {mission.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full max-w-md h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                        style={{ width: `${progressRatio * 100}%` }}
                      />
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      Progreso: {Math.min(mission.currentCount, mission.targetCount)} /{' '}
                      {mission.targetCount}
                    </div>
                  </div>

                  {/* Claim Reward Button */}
                  <div className="shrink-0">
                    {mission.claimed ? (
                      <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-500 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Reclamado
                      </div>
                    ) : mission.completed ? (
                      <button
                        onClick={() => onClaimMission(mission.id)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        Reclamar (+{mission.rewardPacks} {mission.rewardPacks === 1 ? 'Sobre' : 'Sobres'})
                      </button>
                    ) : (
                      <div className="px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs font-medium">
                        Recompensa: +{mission.rewardPacks} {mission.rewardPacks === 1 ? 'Sobre' : 'Sobres'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SUBTAB 4: ALMANAC / BESTIARY */}
        {activeSubTab === 'ALMANAC' && (
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Bestiario de Invasores Hostiles
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ENEMY_LIST.map((enemy) => (
                <div
                  key={enemy.id}
                  className={`p-3.5 rounded-2xl border ${
                    enemy.isBoss
                      ? 'bg-red-950/40 border-red-800/80'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="w-10 h-10 rounded-xl overflow-hidden border flex items-center justify-center shrink-0"
                      style={{ borderColor: enemy.color, backgroundColor: enemy.accentColor + '20' }}
                    >
                      {enemy.imageUrl ? (
                        <GameImage
                          src={enemy.imageUrl}
                          alt={enemy.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          fallback={<Skull className="w-5 h-5 text-red-400" />}
                        />
                      ) : (
                        <Skull className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-100">{enemy.name}</div>
                      <div className="text-[10px] text-slate-400">{enemy.isBoss ? '¡JEFE!' : 'Enemigo'}</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight mb-2">
                    {enemy.description}
                  </p>
                  <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-300">
                    <div className="p-1 rounded bg-slate-900 border border-slate-800">
                      HP: {enemy.baseHealth}
                    </div>
                    <div className="p-1 rounded bg-slate-900 border border-slate-800">
                      Vel: {enemy.speed}
                    </div>
                    <div className="p-1 rounded bg-slate-900 border border-slate-800 text-amber-300">
                      +{enemy.goldReward} oro
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Shortcut to Battle */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400 hidden sm:inline">
          ¿Listo para defender? Vuelve a la arena de combate.
        </span>
        <button
          onClick={onSwitchToBattle}
          className="ml-auto px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Ir a la Batalla</span>
          <span>⚔️</span>
        </button>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-emerald-600 border border-emerald-300 text-white font-bold text-xs shadow-2xl shadow-emerald-950 flex items-center gap-2 animate-bounce">
          <span>💾</span>
          <span>{saveToast}</span>
        </div>
      )}

      {/* Device Save Progress Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-left relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Progreso en tu Dispositivo</h3>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    <span>Almacenamiento Local Activo (Offline)</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-100 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Todos tus personajes desbloqueados, niveles de maestría, sobres pendientes y récords de oleadas se guardan de forma permanente y automática en la memoria de este celular.
            </p>

            <div className="grid grid-cols-2 gap-2.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 mb-4 text-xs font-mono">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">Récord de Oleada</div>
                <div className="text-base font-bold text-amber-300">
                  Oleada {progression.highScoreWave || 1}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">Cartas Obtenidas</div>
                <div className="text-base font-bold text-purple-300">
                  {progression.unlockedCardIds.length} / {UNIT_LIST.length}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">Bajas Totales</div>
                <div className="text-base font-bold text-emerald-300">
                  {progression.lifetimeKills}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">Oleadas Ganadas</div>
                <div className="text-base font-bold text-cyan-300">
                  {progression.lifetimeWaves}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">Monedas en Bóveda</div>
                <div className="text-sm font-bold text-amber-300 tabular-nums">
                  💰 {progression.savedCoins ?? 0}
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">Oro Histórico</div>
                <div className="text-sm font-bold text-amber-400 tabular-nums">
                  🪙 {progression.lifetimeGold}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleManualSave}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>💾 Guardar Ahora</span>
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
