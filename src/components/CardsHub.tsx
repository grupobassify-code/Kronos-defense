import React, { useState, useEffect } from 'react';
import { PlayerProgression, Mission, PackReward, ShopPackTierId, MissionCategory, MissionDifficulty } from '../types/game';
import { UNITS, UNIT_LIST, isCardLockedByArena } from '../data/units';
import { ENEMY_LIST } from '../data/enemies';
import { getArenaForWave, getArenaByLevel } from '../data/maps';
import {
  LEVEL_UP_COSTS,
  getLevelStatMultiplier,
  getInMatchUnitTier,
  MAX_IN_MATCH_LEVEL,
  getKillsRequiredForPack,
  getCardShopPrice,
  canBuyCardInShop,
  SHOP_PACK_COIN_PRICE,
  SHOP_PACK_TIERS,
  SHOP_BUNDLE_3_PACKS_PRICE,
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
  Wallet,
  Eye,
  ArrowUpDown,
  SlidersHorizontal
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
  onClaimAllMissions?: () => void;
  onOpenPack: () => PackReward[];
  onSwitchToBattle: () => void;
  onToggleDeckCard?: (unitId: string) => void;
  onBuyCardWithCoins?: (unitId: string) => void;
  onBuyPackWithCoins?: () => void;
  onBuyPackBundleWithCoins?: () => void;
  onBuyAndOpenPackTier?: (tierId: ShopPackTierId) => PackReward[];
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
  onClaimAllMissions,
  onOpenPack,
  onSwitchToBattle,
  onToggleDeckCard,
  onBuyCardWithCoins,
  onBuyPackWithCoins,
  onBuyPackBundleWithCoins,
  onBuyAndOpenPackTier,
  onBuySkillPointsWithCoins,
  requestedSubTab = null,
  onConsumeRequestedSubTab,
  currentWave = 1
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTabKey>(requestedSubTab || 'DECK');
  const [selectedCardId, setSelectedCardId] = useState<string>(progression.unlockedCardIds[0] || 'vanguard_solar');
  const [selectedRarityFilter, setSelectedRarityFilter] = useState<string>('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [deckOwnershipFilter, setDeckOwnershipFilter] = useState<'ALL' | 'UNLOCKED' | 'IN_DECK' | 'UPGRADEABLE' | 'LOCKED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [raritySortAsc, setRaritySortAsc] = useState<boolean>(true); // true: Común -> Divinidad, false: Divinidad -> Común
  const [inspectorTierPreview, setInspectorTierPreview] = useState<number>(0);

  // Card Shop filters
  const [shopSearch, setShopSearch] = useState<string>('');
  const [shopRarity, setShopRarity] = useState<string>('all');
  const [shopRole, setShopRole] = useState<string>('all');
  const [shopShowMode, setShopShowMode] = useState<'ALL' | 'UNOWNED' | 'AFFORDABLE'>('ALL');
  const [shopSort, setShopSort] = useState<'AVAILABLE' | 'PRICE_ASC' | 'PRICE_DESC' | 'RARITY'>('AVAILABLE');
  const [shopPreviewCardId, setShopPreviewCardId] = useState<string | null>(null);
  const [shopPurchaseToast, setShopPurchaseToast] = useState<{ cardId: string; name: string } | null>(null);
  const [shopPackReveal, setShopPackReveal] = useState<{ tierName: string; rewards: PackReward[] } | null>(null);

  // Missions filters
  const [missionCategoryFilter, setMissionCategoryFilter] = useState<'all' | MissionCategory>('all');
  const [missionStatusFilter, setMissionStatusFilter] = useState<'all' | 'claimable' | 'active' | 'hard' | 'claimed'>('all');

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

      {/* Header Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-300 shadow-lg shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-100 font-display tracking-tight flex items-center gap-2.5 flex-wrap">
              <span>Colección, Tienda y Mazo</span>
              <span className="text-xs font-semibold text-cyan-300">
                · {currentArena.name}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Administra tus {UNIT_LIST.length} cartas disponibles, compra héroes en la tienda y arma tu escuadra de 7 defensores.
            </p>
          </div>
        </div>

        {/* Resources Strip */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-semibold text-xs whitespace-nowrap">
            <Trophy className="w-3.5 h-3.5 text-purple-400" />
            <span>{currentArena.badge}</span>
          </div>

          <button
            onClick={() => setActiveSubTab('SHOP')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 font-bold font-mono tabular-nums text-xs cursor-pointer transition-colors whitespace-nowrap"
            title="Ir a la Tienda de Cartas"
          >
            <Wallet className="w-3.5 h-3.5 text-amber-400" />
            <span>{progression.savedCoins ?? 0} Monedas</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-bold font-mono tabular-nums text-xs whitespace-nowrap">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{progression.skillPoints} PH</span>
          </div>

          <button
            onClick={() => setActiveSubTab('PACKS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              progression.unopenedPacks > 0
                ? 'bg-purple-600/25 border-purple-500/60 text-purple-200 hover:bg-purple-600/35'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <PackageOpen className="w-3.5 h-3.5 text-purple-400" />
            <span className="tabular-nums">{progression.unopenedPacks} Sobres</span>
          </button>

          <button
            onClick={() => {
              const next = music.toggleMute();
              setIsMusicMuted(next);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              isMusicMuted
                ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                : 'bg-purple-950/60 border-purple-500/50 text-purple-200'
            }`}
            title={isMusicMuted ? 'Activar música generada por IA' : 'Silenciar música'}
          >
            <Music className="w-3.5 h-3.5" />
            <span>{isMusicMuted ? 'Música: OFF' : 'Música IA'}</span>
          </button>

          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-300 font-semibold text-xs cursor-pointer hover:bg-emerald-950/40 transition-colors whitespace-nowrap"
            title="Ver datos de progreso guardados en tu dispositivo"
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Guardado Local</span>
            <span className="sm:hidden">Guardado</span>
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
            {/* 7-CARD ACTIVE BATTLE DECK DOCK */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Swords className="w-4 h-4 text-cyan-400 shrink-0" />
                  <h3 className="text-sm font-black text-slate-100 tracking-tight">
                    Mazo de Batalla Activo
                  </h3>
                  <span className="text-xs font-mono tabular-nums text-cyan-300 font-bold">
                    {progression.activeDeckCardIds?.length || 0} / 7 ranuras
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Toca cualquier carta para inspeccionarla o usa el botón rápido para equipar o mejorar.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {(progression.activeDeckCardIds || []).map((deckCardId, slotIdx) => {
                  const deckUnit = UNITS[deckCardId];
                  if (!deckUnit) return null;
                  const lvl = progression.cardMasteryLevels[deckCardId] || 1;
                  const isSel = selectedCardId === deckCardId;
                  const rMeta = getRarityMeta(deckUnit.rarity);
                  const slotCost = LEVEL_UP_COSTS[lvl];
                  const canSlotUpgrade = lvl < 10 && slotCost !== undefined && progression.skillPoints >= slotCost;

                  return (
                    <div
                      key={`deck_slot_${deckCardId}`}
                      onClick={() => {
                        setSelectedCardId(deckCardId);
                        setInspectorTierPreview(0);
                      }}
                      className={`group relative rounded-xl border p-2 text-left cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                        isSel
                          ? `bg-slate-900 ${rMeta.cardSelected} ring-2 ring-cyan-400/70`
                          : `bg-slate-900/70 ${rMeta.cardBorder} hover:bg-slate-900`
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono tabular-nums">
                          <span className="text-slate-400 font-bold">#{slotIdx + 1} · Nv.{lvl}</span>
                          <span className="text-amber-300 font-bold">{deckUnit.cost}o</span>
                        </div>

                        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-1.5 bg-slate-950 border border-slate-800">
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
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                          <span className={`absolute bottom-1 left-1.5 text-[9px] font-black uppercase tracking-wide ${rMeta.textColor}`}>
                            {rMeta.badgeLabel}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-slate-100 truncate">
                          {deckUnit.name}
                        </div>
                      </div>

                      {lvl < 10 && slotCost !== undefined && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (canSlotUpgrade) {
                              onUpgradeCharacter(deckCardId);
                            } else {
                              setSelectedCardId(deckCardId);
                            }
                          }}
                          disabled={!canSlotUpgrade}
                          className={`mt-2 w-full py-1 px-1.5 rounded-lg text-[10px] font-bold font-mono tabular-nums flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                            canSlotUpgrade
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                              : 'bg-slate-950 text-slate-500 border border-slate-800'
                          }`}
                          title={
                            canSlotUpgrade
                              ? `Subir a Nv.${lvl + 1} (${slotCost} PH)`
                              : `Necesitas ${slotCost} PH`
                          }
                        >
                          <ArrowUp className="w-3 h-3 shrink-0" />
                          <span>Nv.{lvl + 1} · {slotCost}</span>
                        </button>
                      )}

                      {(progression.activeDeckCardIds || []).length > 1 && onToggleDeckCard && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleDeckCard(deckCardId);
                            sounds.playSell();
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 hover:bg-red-600 border border-slate-700 hover:border-red-400 text-slate-300 hover:text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
                          title="Quitar del mazo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* Empty Slots */}
                {Array.from({ length: Math.max(0, 7 - (progression.activeDeckCardIds?.length || 0)) }).map((_, idx) => (
                  <div
                    key={`hub_empty_${idx}`}
                    className="p-3 rounded-xl border border-dashed border-slate-800 bg-slate-900/30 flex flex-col items-center justify-center text-center text-slate-500 min-h-[124px]"
                  >
                    <Plus className="w-5 h-5 mb-1 text-slate-600" />
                    <span className="text-[11px] font-semibold text-slate-400">Ranura libre</span>
                    <span className="text-[10px] text-slate-500">Equipa abajo</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TWO COLUMNS: COLLECTION GRID + STICKY TACTICAL INSPECTOR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Filterable Collection */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
                {(() => {
                  const filteredDeckCards = UNIT_LIST.filter((u) => {
                    const isUnlocked = progression.unlockedCardIds.includes(u.id);
                    const isInDeck = (progression.activeDeckCardIds || []).includes(u.id);
                    const lvl = progression.cardMasteryLevels[u.id] || 1;
                    const upCost = LEVEL_UP_COSTS[lvl];
                    const canUpgrade = isUnlocked && lvl < 10 && upCost !== undefined && progression.skillPoints >= upCost;

                    if (deckOwnershipFilter === 'UNLOCKED' && !isUnlocked) return false;
                    if (deckOwnershipFilter === 'IN_DECK' && !isInDeck) return false;
                    if (deckOwnershipFilter === 'UPGRADEABLE' && !canUpgrade) return false;
                    if (deckOwnershipFilter === 'LOCKED' && isUnlocked) return false;

                    if (searchQuery.trim()) {
                      const q = searchQuery.toLowerCase().trim();
                      const matchName = u.name.toLowerCase().includes(q);
                      const matchTitle = u.title.toLowerCase().includes(q);
                      const matchDesc = u.description.toLowerCase().includes(q);
                      if (!matchName && !matchTitle && !matchDesc) return false;
                    }
                    if (selectedRoleFilter !== 'all' && u.role !== selectedRoleFilter) return false;
                    if (selectedRarityFilter === 'all') return true;
                    const normRarity = u.rarity === 'rara' ? 'especial' : u.rarity;
                    return normRarity === selectedRarityFilter;
                  }).sort((a, b) => {
                    const aUnl = progression.unlockedCardIds.includes(a.id) ? 0 : 1;
                    const bUnl = progression.unlockedCardIds.includes(b.id) ? 0 : 1;
                    if (deckOwnershipFilter === 'ALL' && aUnl !== bUnl) return aUnl - bUnl;
                    const diff = compareRarities(a.rarity, b.rarity);
                    return raritySortAsc ? diff : -diff;
                  });

                  const upgradeableCount = UNIT_LIST.filter((u) => {
                    if (!progression.unlockedCardIds.includes(u.id)) return false;
                    const lvl = progression.cardMasteryLevels[u.id] || 1;
                    const upCost = LEVEL_UP_COSTS[lvl];
                    return lvl < 10 && upCost !== undefined && progression.skillPoints >= upCost;
                  }).length;

                  return (
                    <>
                      {/* Filter Toolbar */}
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm font-black text-slate-100">
                              Catálogo de Cartas
                            </span>
                            <span className="font-mono tabular-nums text-xs text-cyan-300 font-bold">
                              {filteredDeckCards.length} mostradas · {progression.unlockedCardIds.length}/{UNIT_LIST.length} tuyas
                            </span>
                          </div>

                          <button
                            onClick={() => setRaritySortAsc(!raritySortAsc)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs font-bold text-slate-200 transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap"
                          >
                            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{raritySortAsc ? 'Común → Divinidad' : 'Divinidad → Común'}</span>
                          </button>
                        </div>

                        {/* Search + Ownership Segmented Filter */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="relative flex-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Buscar héroe, rol o habilidad..."
                              className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                            />
                            {searchQuery && (
                              <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
                            {[
                              { key: 'ALL', label: 'Todas' },
                              { key: 'UNLOCKED', label: 'Mías' },
                              { key: 'IN_DECK', label: 'En Mazo' },
                              { key: 'UPGRADEABLE', label: `Mejorables (${upgradeableCount})` },
                              { key: 'LOCKED', label: 'Bloqueadas' }
                            ].map((opt) => (
                              <button
                                key={opt.key}
                                onClick={() => setDeckOwnershipFilter(opt.key as typeof deckOwnershipFilter)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                                  deckOwnershipFilter === opt.key
                                    ? 'bg-cyan-500 text-slate-950'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Rarity + Role Filter Strips */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-slate-800/80">
                          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar flex-1">
                            {RARITY_LIST.map((r) => (
                              <button
                                key={r.key}
                                onClick={() => setSelectedRarityFilter(r.key)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                                  selectedRarityFilter === r.key
                                    ? 'bg-slate-100 text-slate-950'
                                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                                }`}
                              >
                                {r.label}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                            {[
                              { key: 'all', label: 'Todos Roles' },
                              { key: 'ataque', label: 'Ataque' },
                              { key: 'area', label: 'Área' },
                              { key: 'control', label: 'Control' },
                              { key: 'invocador', label: 'Invocador' },
                              { key: 'soporte', label: 'Soporte' },
                              { key: 'economia', label: 'Economía' }
                            ].map((roleItem) => (
                              <button
                                key={roleItem.key}
                                onClick={() => setSelectedRoleFilter(roleItem.key)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                                  selectedRoleFilter === roleItem.key
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                                }`}
                              >
                                {roleItem.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Cards Grid */}
                      {filteredDeckCards.length === 0 ? (
                        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                          <div className="text-sm font-bold text-slate-300">No hay cartas con estos filtros</div>
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedRarityFilter('all');
                              setSelectedRoleFilter('all');
                              setDeckOwnershipFilter('ALL');
                            }}
                            className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black cursor-pointer"
                          >
                            Restablecer filtros
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                          {filteredDeckCards.map((unit) => {
                            const isUnlocked = progression.unlockedCardIds.includes(unit.id);
                            const isInDeck = (progression.activeDeckCardIds || []).includes(unit.id);
                            const isSelected = selectedCardId === unit.id;
                            const level = progression.cardMasteryLevels[unit.id] || 1;
                            const isMaxLevel = level >= 10;
                            const cost = LEVEL_UP_COSTS[level] || null;
                            const canUpgrade = isUnlocked && cost !== null && progression.skillPoints >= cost;
                            const rMeta = getRarityMeta(unit.rarity);
                            const deckFull = (progression.activeDeckCardIds || []).length >= 7;

                            return (
                              <div
                                key={unit.id}
                                onClick={() => {
                                  setSelectedCardId(unit.id);
                                  setInspectorTierPreview(0);
                                }}
                                className={`group relative rounded-2xl border p-2.5 text-left transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                                  isSelected
                                    ? `bg-slate-900 ${rMeta.cardSelected} ring-2 ring-cyan-400`
                                    : isUnlocked
                                    ? `bg-slate-950/90 ${rMeta.cardBorder} hover:bg-slate-900`
                                    : 'bg-slate-950/40 border-slate-800/80 opacity-75 hover:opacity-100'
                                }`}
                              >
                                <div>
                                  {/* Portrait with bottom scrim */}
                                  <div className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-2 border ${rMeta.cardBorder} bg-slate-900`}>
                                    {unit.imageUrl && (
                                      <GameImage
                                        src={unit.imageUrl}
                                        alt={unit.name}
                                        loading="lazy"
                                        className={`w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 ${
                                          !isUnlocked ? 'grayscale opacity-45' : ''
                                        }`}
                                        fallback={
                                          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-xs font-bold">
                                            {unit.name.slice(0, 2).toUpperCase()}
                                          </div>
                                        }
                                      />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                                    <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1">
                                      <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-black ${rMeta.badgeClass}`}>
                                        {unit.rarity === 'divinidad' ? `Divinidad A${unit.arenaUnlockLevel || 1}` : rMeta.badgeLabel}
                                      </span>
                                      {isUnlocked ? (
                                        <span className="text-[10px] font-mono tabular-nums font-bold px-1.5 py-0.5 rounded bg-slate-950/85 text-cyan-300 border border-slate-700">
                                          Nv.{level}
                                        </span>
                                      ) : (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950/85 text-slate-300 border border-slate-700 flex items-center gap-0.5">
                                          <Lock className="w-2.5 h-2.5 text-amber-400" />
                                          {unit.arenaUnlockLevel ? `A${unit.arenaUnlockLevel}` : ''}
                                        </span>
                                      )}
                                    </div>

                                    {isInDeck && (
                                      <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-cyan-400 text-slate-950 text-[9px] font-black tracking-wide">
                                        EN MAZO
                                      </div>
                                    )}
                                  </div>

                                  {/* Unboxed Title & Metadata */}
                                  <div className={`text-xs font-extrabold truncate ${rMeta.textColor}`}>
                                    {unit.name}
                                  </div>
                                  <div className="text-[11px] text-slate-400 truncate mt-0.5 capitalize font-mono tabular-nums">
                                    {unit.role} · {unit.cost} oro · {Math.round(unit.baseDamage * getLevelStatMultiplier(level).damageMult)} daño
                                  </div>
                                </div>

                                {/* Direct Card Controls */}
                                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-col gap-1.5">
                                  {isUnlocked ? (
                                    <>
                                      {onToggleDeckCard && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (isInDeck) {
                                              if ((progression.activeDeckCardIds || []).length > 1) {
                                                onToggleDeckCard(unit.id);
                                                sounds.playSell();
                                              }
                                            } else if (!deckFull) {
                                              onToggleDeckCard(unit.id);
                                              sounds.playPlace();
                                            } else {
                                              setSelectedCardId(unit.id);
                                            }
                                          }}
                                          className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                                            isInDeck
                                              ? 'bg-cyan-950/80 hover:bg-red-950/80 text-cyan-300 hover:text-red-300 border border-cyan-500/40 hover:border-red-500/40'
                                              : deckFull
                                              ? 'bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40'
                                              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black'
                                          }`}
                                        >
                                          {isInDeck ? 'Quitar del Mazo' : deckFull ? 'Sustituir en Mazo' : 'Equipar al Mazo'}
                                        </button>
                                      )}

                                      {!isMaxLevel && cost !== null ? (
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
                                          className={`w-full py-1 px-2 rounded-lg text-[10px] font-bold font-mono tabular-nums flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                                            canUpgrade
                                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                                              : 'bg-slate-900 text-slate-500 border border-slate-800'
                                          }`}
                                        >
                                          <ArrowUp className="w-3 h-3 shrink-0" />
                                          <span>{canUpgrade ? `Subir Nv.${level + 1} (${cost} PH)` : `Nv.${level + 1} · ${cost} PH`}</span>
                                        </button>
                                      ) : (
                                        <div className="w-full py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[10px] font-bold text-center">
                                          Nivel 10 Máximo
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveSubTab('SHOP');
                                        setShopSearch(unit.name);
                                      }}
                                      className="w-full py-1.5 px-2 rounded-lg text-[11px] font-bold bg-slate-900 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-1"
                                    >
                                      <ShoppingBag className="w-3 h-3" />
                                      <span>Ver en Tienda</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Right Column: Sticky Selected Card Inspector */}
              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-0 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                {(() => {
                  const selRMeta = getRarityMeta(selectedUnit.rarity);
                  const activeTier = getInMatchUnitTier(selectedUnit, inspectorTierPreview + 1);
                  return (
                    <>
                      {/* Header with portrait */}
                      <div className="flex items-start gap-3.5 pb-4 border-b border-slate-800">
                        <div className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${selRMeta.cardBorder} bg-slate-900 shrink-0 relative`}>
                          {selectedUnit.imageUrl && (
                            <GameImage
                              src={selectedUnit.imageUrl}
                              alt={selectedUnit.name}
                              className={`w-full h-full object-cover ${!isSelectedUnlocked ? 'grayscale opacity-45' : ''}`}
                              fallback={
                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-sm font-bold">
                                  {selectedUnit.name.slice(0, 2).toUpperCase()}
                                </div>
                              }
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded ${selRMeta.badgeClass}`}>
                              {selRMeta.badgeLabel}
                            </span>
                            {isSelectedUnlocked && (
                              <span className="text-xs font-bold font-mono tabular-nums text-cyan-300">
                                Nivel {currentLevel}/10
                              </span>
                            )}
                          </div>
                          <h3 className={`font-black text-base mt-1 leading-tight ${selRMeta.textColor}`}>
                            {selectedUnit.name}
                          </h3>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {selectedUnit.title} · {selectedUnit.cost} oro arena
                          </div>
                        </div>
                      </div>

                      {/* Deck Equip / Swap Section */}
                      {isSelectedUnlocked && onToggleDeckCard && (
                        <div className="pb-3 border-b border-slate-800">
                          {isSelectedInDeck ? (
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs text-cyan-300 font-bold flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                                <span>Equipada en tu Mazo</span>
                              </span>
                              {(progression.activeDeckCardIds || []).length > 1 && (
                                <button
                                  onClick={() => {
                                    onToggleDeckCard(selectedUnit.id);
                                    sounds.playSell();
                                  }}
                                  className="px-3 py-1.5 text-xs font-bold text-red-300 bg-red-950/60 border border-red-800/60 hover:bg-red-900 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                                >
                                  Quitar
                                </button>
                              )}
                            </div>
                          ) : (progression.activeDeckCardIds || []).length < 7 ? (
                            <button
                              onClick={() => {
                                onToggleDeckCard(selectedUnit.id);
                                sounds.playPlace();
                              }}
                              className="w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Equipar al Mazo ({progression.activeDeckCardIds?.length || 0}/7)</span>
                            </button>
                          ) : (
                            <div className="space-y-2">
                              <div className="text-xs text-amber-300 font-bold">
                                Mazo completo (7/7). Elige a quién reemplazar:
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                {(progression.activeDeckCardIds || []).map((cardId) => {
                                  const u = UNITS[cardId];
                                  return (
                                    <button
                                      key={`swap_${cardId}`}
                                      onClick={() => {
                                        onToggleDeckCard(cardId);
                                        setTimeout(() => onToggleDeckCard(selectedUnit.id), 40);
                                        sounds.playPlace();
                                      }}
                                      className="p-2 rounded-lg bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-[11px] text-slate-200 truncate transition-colors cursor-pointer flex items-center gap-1.5 text-left"
                                      title={`Reemplazar a ${u?.name || cardId}`}
                                    >
                                      <span className="text-cyan-400 font-bold">↔</span>
                                      <span className="truncate">{u?.name || cardId}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedUnit.description}
                      </p>

                      {/* Current vs Next Level Stats */}
                      <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2 text-xs font-mono tabular-nums">
                        <div className="flex justify-between text-slate-300">
                          <span className="font-sans text-slate-400">Daño en Arena</span>
                          <span>
                            <strong className="text-amber-300">{Math.round(selectedUnit.baseDamage * currentStats.damageMult)}</strong>
                            {nextStats && (
                              <span className="text-emerald-400 ml-1.5">
                                → {Math.round(selectedUnit.baseDamage * nextStats.damageMult)}
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span className="font-sans text-slate-400">Cadencia</span>
                          <span>
                            <strong className="text-emerald-300">{(selectedUnit.baseAttackSpeed * currentStats.speedMult).toFixed(2)}/s</strong>
                            {nextStats && (
                              <span className="text-cyan-300 ml-1.5">
                                → {(selectedUnit.baseAttackSpeed * nextStats.speedMult).toFixed(2)}/s
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span className="font-sans text-slate-400">Alcance</span>
                          <span className="text-cyan-300">{selectedUnit.baseRange}px</span>
                        </div>
                      </div>

                      {/* In-Arena 6 Upgrade Tiers Preview */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Mejoras en Arena (Nv.1–{MAX_IN_MATCH_LEVEL})
                          </span>
                          <div className="flex items-center gap-0.5 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                            {[0, 1, 2, 3, 4, 5].map((tIdx) => (
                              <button
                                key={tIdx}
                                onClick={() => setInspectorTierPreview(tIdx)}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                  inspectorTierPreview === tIdx
                                    ? 'bg-cyan-500 text-slate-950'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                N{tIdx + 1}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] space-y-1">
                          <div className="flex items-center justify-between font-bold text-slate-200">
                            <span>{activeTier.name}</span>
                            <span className="font-mono tabular-nums text-amber-300">
                              {activeTier.cost > 0 ? `${activeTier.cost} oro` : 'Base'} · {activeTier.damage} dmg
                            </span>
                          </div>
                          <p className="text-slate-400 leading-snug">{activeTier.description}</p>
                        </div>
                      </div>

                      {/* Showdown Info */}
                      <div className="bg-slate-900/90 rounded-xl p-3 border border-purple-500/30 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-purple-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>{selectedUnit.showdownName}</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {currentStats.isShowdownUnlocked ? 'Activo desde inicio' : 'Carta Nv.3 o Arena Nv.3'} · {selectedUnit.showdownCooldown}s
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {selectedUnit.showdownDescription}
                        </p>
                      </div>

                      {/* Bottom Upgrade / Unlock Action */}
                      {isSelectedUnlocked ? (
                        <div className="pt-2 border-t border-slate-800 space-y-2">
                          {selectedUnit.rarity === 'divinidad' && (
                            <p className="text-[11px] text-amber-300 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/30">
                              <strong>Divinidad Arena {selectedUnit.arenaUnlockLevel}:</strong> Máximo 1 Divinidad desplegada a la vez en batalla.
                            </p>
                          )}
                          {currentLevel < 10 ? (
                            <button
                              onClick={() => onUpgradeCharacter(selectedUnit.id)}
                              disabled={!canAffordUpgrade}
                              className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                                canAffordUpgrade
                                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                                  : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                              }`}
                            >
                              <ArrowUp className="w-4 h-4" />
                              <span className="font-mono tabular-nums">
                                Subir a Nivel {currentLevel + 1} ({nextLevelCost} PH)
                              </span>
                            </button>
                          ) : (
                            <div className="w-full py-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 font-bold text-xs text-center">
                              Nivel 10 Máximo · Showdown Definitivo Activo
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-slate-800 space-y-2">
                          {isCardLockedByArena(selectedUnit, progression.highestArenaUnlocked || 1) ? (
                            <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 text-xs text-slate-300">
                              <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                                <Lock className="w-3.5 h-3.5" />
                                <span>Bloqueada hasta Arena {selectedUnit.arenaUnlockLevel}</span>
                              </div>
                              Llega a <strong>{getArenaByLevel(selectedUnit.arenaUnlockLevel || 1).name}</strong> para desbloquearla en Tienda y Sobres.
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveSubTab('SHOP');
                                setShopSearch(selectedUnit.name);
                              }}
                              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              <span>Comprar en Tienda ({getCardShopPrice(selectedUnit)} monedas)</span>
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: CARD SHOP (DIRECT PURCHASE WITH SAVED COINS) */}
        {activeSubTab === 'SHOP' && (
          <div className="space-y-6">
            {/* Vault Banner + Quick Bundles */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
              <div className="lg:col-span-5 bg-slate-950 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0">
                    <Wallet className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Bóveda del Comandante
                    </div>
                    <div className="text-2xl font-black font-mono tabular-nums text-amber-200">
                      {progression.savedCoins ?? 0} <span className="text-xs font-sans font-normal text-amber-300/80">monedas</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Arena {progression.highestArenaUnlocked || 1} · {progression.unlockedCardIds.length}/{UNIT_LIST.length} cartas · {progression.unopenedPacks} sobres pendientes
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 bg-slate-950 border border-purple-500/35 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                    <PackageOpen className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="truncate">Lote x3 Sobres Crono</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Ahorra 300 monedas</div>
                </div>
                <button
                  onClick={() => onBuyPackBundleWithCoins?.()}
                  disabled={(progression.savedCoins ?? 0) < SHOP_BUNDLE_3_PACKS_PRICE}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black font-mono tabular-nums whitespace-nowrap transition-colors cursor-pointer ${
                    (progression.savedCoins ?? 0) >= SHOP_BUNDLE_3_PACKS_PRICE
                      ? 'bg-purple-600 hover:bg-purple-500 text-white'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  {SHOP_BUNDLE_3_PACKS_PRICE} mon.
                </button>
              </div>

              <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">+{SHOP_SP_BUNDLE_AMOUNT} Puntos de Habilidad</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Mejora tus cartas hasta Nv.10</div>
                </div>
                <button
                  onClick={() => onBuySkillPointsWithCoins?.()}
                  disabled={(progression.savedCoins ?? 0) < SHOP_SP_COIN_PRICE}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black font-mono tabular-nums whitespace-nowrap transition-colors cursor-pointer ${
                    (progression.savedCoins ?? 0) >= SHOP_SP_COIN_PRICE
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  {SHOP_SP_COIN_PRICE} mon.
                </button>
              </div>
            </div>

            {/* Purchasable Booster Packs & Chests Shelf */}
            <div className="space-y-3 bg-slate-950/70 border border-purple-500/30 rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <PackageOpen className="w-4 h-4 text-purple-400 shrink-0" />
                  <h3 className="text-sm font-black text-slate-100">
                    Sobres y Cofres de Reclutamiento
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  Compra y abre sobres al instante con cartas nuevas garantizadas sin repetidos
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {SHOP_PACK_TIERS.map((tier) => {
                  const canAffordTier = (progression.savedCoins ?? 0) >= tier.priceCoins;
                  const tierAccent =
                    tier.id === 'cosmic'
                      ? 'border-cyan-400/60 bg-gradient-to-b from-cyan-950/35 to-slate-950'
                      : tier.id === 'royal'
                      ? 'border-amber-400/50 bg-gradient-to-b from-amber-950/30 to-slate-950'
                      : tier.id === 'elite'
                      ? 'border-purple-500/50 bg-gradient-to-b from-purple-950/30 to-slate-950'
                      : 'border-slate-700 bg-slate-950';
                  const tierTitleColor =
                    tier.id === 'cosmic'
                      ? 'text-cyan-300'
                      : tier.id === 'royal'
                      ? 'text-amber-300'
                      : tier.id === 'elite'
                      ? 'text-purple-300'
                      : 'text-slate-100';
                  const tierBtnClass =
                    tier.id === 'cosmic'
                      ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
                      : tier.id === 'royal'
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : tier.id === 'elite'
                      ? 'bg-purple-600 hover:bg-purple-500 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white';

                  return (
                    <div
                      key={tier.id}
                      className={`rounded-2xl border p-3.5 flex flex-col justify-between gap-3 ${tierAccent}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${tierTitleColor}`}>
                            {tier.badgeText}
                          </span>
                          <span className="text-[11px] font-mono tabular-nums text-amber-300 font-bold">
                            {tier.priceCoins.toLocaleString()} mon.
                          </span>
                        </div>

                        <div>
                          <div className={`text-sm font-black ${tierTitleColor}`}>{tier.name}</div>
                          <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{tier.subtitle}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] font-mono tabular-nums">
                          <div className="flex items-center justify-between text-slate-200">
                            <span className="font-sans text-slate-400">Contenido:</span>
                            <span className="font-bold">{tier.cardsSummary}</span>
                          </div>
                          <div className="flex items-center justify-between text-emerald-300">
                            <span className="font-sans text-slate-400">Puntos Hab.:</span>
                            <span className="font-bold">+{tier.spRangeLabel}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (!onBuyAndOpenPackTier) return;
                            const pulled = onBuyAndOpenPackTier(tier.id);
                            if (pulled.length > 0) {
                              setShopPackReveal({ tierName: tier.name, rewards: pulled });
                            }
                          }}
                          disabled={!canAffordTier}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-colors cursor-pointer whitespace-nowrap ${
                            canAffordTier
                              ? tierBtnClass
                              : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                          }`}
                        >
                          {canAffordTier ? `Comprar y Abrir` : `Faltan monedas`}
                        </button>

                        {tier.id === 'classic' && onBuyPackWithCoins && (
                          <button
                            onClick={() => onBuyPackWithCoins()}
                            disabled={!canAffordTier}
                            title="Comprar y guardar en Abrir Sobres"
                            className={`px-2.5 py-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                              canAffordTier
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                                : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                            }`}
                          >
                            +1 Inv.
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Purchase feedback banner */}
            {shopPurchaseToast && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-200 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>¡Has comprado a <strong>{shopPurchaseToast.name}</strong>!</span>
                </div>
                <div className="flex items-center gap-2">
                  {!(progression.activeDeckCardIds || []).includes(shopPurchaseToast.cardId) &&
                    (progression.activeDeckCardIds || []).length < 7 &&
                    onToggleDeckCard && (
                      <button
                        onClick={() => {
                          onToggleDeckCard(shopPurchaseToast.cardId);
                          sounds.playPlace();
                          setShopPurchaseToast(null);
                        }}
                        className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black cursor-pointer whitespace-nowrap"
                      >
                        Equipar ahora
                      </button>
                    )}
                  <button
                    onClick={() => setShopPurchaseToast(null)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Recommended Offers Spotlight */}
            {(() => {
              const unownedEligible = UNIT_LIST.filter(
                (u) => !progression.unlockedCardIds.includes(u.id) && canBuyCardInShop(u, progression).allowed
              );
              if (unownedEligible.length === 0 || shopSearch.trim() || shopRarity !== 'all') return null;

              const affordableTop = unownedEligible
                .filter((u) => (progression.savedCoins ?? 0) >= getCardShopPrice(u))
                .sort((a, b) => getCardShopPrice(b) - getCardShopPrice(a))[0];
              const nextGoal = unownedEligible
                .filter((u) => u.id !== affordableTop?.id)
                .sort((a, b) => getCardShopPrice(a) - getCardShopPrice(b))[0];
              const highRarityPick = unownedEligible
                .filter((u) => u.id !== affordableTop?.id && u.id !== nextGoal?.id)
                .sort((a, b) => compareRarities(b.rarity, a.rarity))[0];
              const featured = [affordableTop, nextGoal, highRarityPick].filter(Boolean);
              if (featured.length === 0) return null;

              return (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
                      Destacadas para tu Progreso
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Disponibles para compra inmediata en tu Arena actual
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {featured.map((unit) => {
                      const rMeta = getRarityMeta(unit.rarity);
                      const price = getCardShopPrice(unit);
                      const canAfford = (progression.savedCoins ?? 0) >= price;
                      return (
                        <div
                          key={`feat_${unit.id}`}
                          className={`p-3 rounded-2xl border ${rMeta.cardBorder} bg-slate-950 flex items-center gap-3`}
                        >
                          <div
                            onClick={() => setShopPreviewCardId(unit.id)}
                            className={`w-16 h-16 rounded-xl overflow-hidden border ${rMeta.cardBorder} bg-slate-900 shrink-0 cursor-pointer`}
                          >
                            {unit.imageUrl && (
                              <GameImage
                                src={unit.imageUrl}
                                alt={unit.name}
                                className="w-full h-full object-cover"
                                fallback={<div className="w-full h-full flex items-center justify-center bg-slate-800 text-xs">{unit.name.slice(0, 2)}</div>}
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className={`text-[10px] font-black uppercase ${rMeta.textColor}`}>
                              {rMeta.badgeLabel} · {unit.role}
                            </div>
                            <div className="text-sm font-black text-slate-100 truncate">{unit.name}</div>
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  onBuyCardWithCoins?.(unit.id);
                                  setShopPurchaseToast({ cardId: unit.id, name: unit.name });
                                }}
                                disabled={!canAfford}
                                className={`px-3 py-1 rounded-lg text-[11px] font-black font-mono tabular-nums cursor-pointer whitespace-nowrap ${
                                  canAfford
                                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                                    : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                                }`}
                              >
                                {canAfford ? `Comprar · ${price}` : `${price} mon.`}
                              </button>
                              <button
                                onClick={() => setShopPreviewCardId(unit.id)}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
                                title="Ver detalles"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Shop Search, Filters & Sort */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-3">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={shopSearch}
                    onChange={(e) => setShopSearch(e.target.value)}
                    placeholder="Buscar carta por nombre, rol o efecto..."
                    className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  {shopSearch && (
                    <button
                      onClick={() => setShopSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setShopShowMode('ALL')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        shopShowMode === 'ALL'
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Todas ({UNIT_LIST.length})
                    </button>
                    <button
                      onClick={() => setShopShowMode('UNOWNED')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        shopShowMode === 'UNOWNED'
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Faltantes ({UNIT_LIST.filter((u) => !progression.unlockedCardIds.includes(u.id)).length})
                    </button>
                    <button
                      onClick={() => setShopShowMode('AFFORDABLE')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        shopShowMode === 'AFFORDABLE'
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Comprables ({UNIT_LIST.filter((u) => !progression.unlockedCardIds.includes(u.id) && canBuyCardInShop(u, progression).allowed && (progression.savedCoins ?? 0) >= getCardShopPrice(u)).length})
                    </button>
                  </div>

                  <select
                    value={shopSort}
                    onChange={(e) => setShopSort(e.target.value as typeof shopSort)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="AVAILABLE">Disponibles primero</option>
                    <option value="PRICE_ASC">Precio: Menor a Mayor</option>
                    <option value="PRICE_DESC">Precio: Mayor a Menor</option>
                    <option value="RARITY">Rareza: Común → Divinidad</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-slate-800/80">
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar flex-1">
                  {RARITY_LIST.map((r) => (
                    <button
                      key={`shop_r_${r.key}`}
                      onClick={() => setShopRarity(r.key)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        shopRarity === r.key
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                  {[
                    { key: 'all', label: 'Todos Roles' },
                    { key: 'ataque', label: 'Ataque' },
                    { key: 'area', label: 'Área' },
                    { key: 'control', label: 'Control' },
                    { key: 'invocador', label: 'Invocador' },
                    { key: 'soporte', label: 'Soporte' },
                    { key: 'economia', label: 'Economía' }
                  ].map((roleItem) => (
                    <button
                      key={`shop_role_${roleItem.key}`}
                      onClick={() => setShopRole(roleItem.key)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        shopRole === roleItem.key
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {roleItem.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Card Purchase Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {UNIT_LIST
                .filter((u) => {
                  const owned = progression.unlockedCardIds.includes(u.id);
                  const eligible = canBuyCardInShop(u, progression).allowed;
                  const affordable = (progression.savedCoins ?? 0) >= getCardShopPrice(u);
                  if (shopShowMode === 'UNOWNED' && owned) return false;
                  if (shopShowMode === 'AFFORDABLE' && (owned || !eligible || !affordable)) return false;
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
                  if (shopSort === 'PRICE_ASC') return getCardShopPrice(a) - getCardShopPrice(b);
                  if (shopSort === 'PRICE_DESC') return getCardShopPrice(b) - getCardShopPrice(a);
                  if (shopSort === 'RARITY') return compareRarities(a.rarity, b.rarity);
                  const aOwned = progression.unlockedCardIds.includes(a.id) ? 1 : 0;
                  const bOwned = progression.unlockedCardIds.includes(b.id) ? 1 : 0;
                  if (aOwned !== bOwned) return aOwned - bOwned;
                  const aCan = canBuyCardInShop(a, progression).allowed ? 0 : 1;
                  const bCan = canBuyCardInShop(b, progression).allowed ? 0 : 1;
                  if (aCan !== bCan) return aCan - bCan;
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
                      className={`rounded-2xl border p-3 flex flex-col justify-between gap-3 transition-colors ${
                        isOwned
                          ? 'bg-slate-950/70 border-emerald-500/30'
                          : isDivinityLocked
                          ? 'bg-slate-950/80 border-slate-800'
                          : `bg-slate-950 ${rMeta.cardBorder}`
                      }`}
                    >
                      <div>
                        <div
                          onClick={() => setShopPreviewCardId(unit.id)}
                          className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden border ${rMeta.cardBorder} bg-slate-900 mb-2.5 cursor-pointer group`}
                        >
                          {unit.imageUrl && (
                            <GameImage
                              src={unit.imageUrl}
                              alt={unit.name}
                              loading="lazy"
                              className={`w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 ${
                                isDivinityLocked && !isOwned ? 'grayscale opacity-45' : ''
                              }`}
                              fallback={
                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-xs font-bold text-slate-300">
                                  {unit.name.slice(0, 2).toUpperCase()}
                                </div>
                              }
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                          <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1">
                            <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-black ${rMeta.badgeClass}`}>
                              {unit.rarity === 'divinidad' ? `Divinidad A${unit.arenaUnlockLevel || 1}` : rMeta.badgeLabel}
                            </span>
                            <span className="text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded bg-slate-950/85 text-amber-300 font-bold border border-slate-700">
                              {unit.cost}o arena
                            </span>
                          </div>

                          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between gap-2">
                            <div className="min-w-0">
                              <div className={`text-sm font-black truncate ${rMeta.textColor}`}>{unit.name}</div>
                              <div className="text-[11px] text-slate-300 truncate">{unit.title}</div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShopPreviewCardId(unit.id);
                              }}
                              className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-200 shrink-0 cursor-pointer"
                              title="Inspeccionar estadísticas"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {isDivinityLocked && !isOwned && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45 pointer-events-none">
                              <div className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5" />
                                <span>Arena {shopEligibility.requiredArena}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-[11px] text-cyan-300 font-mono tabular-nums capitalize">
                          {unit.role} · {unit.baseDamage} daño · {unit.baseRange}px
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mt-1">
                          {unit.description}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-slate-800/80 flex items-center gap-2">
                        {isOwned ? (
                          <>
                            <div className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>En Colección</span>
                            </div>
                            {!isInDeck && (progression.activeDeckCardIds?.length || 0) < 7 && onToggleDeckCard && (
                              <button
                                onClick={() => {
                                  onToggleDeckCard(unit.id);
                                  sounds.playPlace();
                                }}
                                className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black cursor-pointer transition-colors whitespace-nowrap"
                              >
                                Equipar
                              </button>
                            )}
                          </>
                        ) : isDivinityLocked ? (
                          <button
                            disabled
                            className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-slate-900 text-amber-300/80 border border-amber-500/30 cursor-not-allowed whitespace-nowrap"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate font-mono tabular-nums">
                              Arena {shopEligibility.requiredArena} · {coinPrice} mon.
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onBuyCardWithCoins?.(unit.id);
                              setShopPurchaseToast({ cardId: unit.id, name: unit.name });
                            }}
                            disabled={!canAfford}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                              canAfford
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
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

            {/* Drop Rates Info Box */}
            <div className="w-full bg-slate-950/80 border border-purple-500/30 rounded-2xl p-3 text-left space-y-1.5 shadow-md">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Probabilidades de Sobre Crono (Sin repetidos):</span>
                </div>
                <button
                  onClick={() => setActiveSubTab('SHOP')}
                  className="text-[11px] font-bold text-amber-300 hover:text-amber-200 cursor-pointer whitespace-nowrap"
                >
                  Comprar más en Tienda →
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-slate-300 pt-1">
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-600/70">
                  <div className="text-slate-300 font-bold">Comunes</div>
                  <div className="font-mono font-bold text-slate-200">48%</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-amber-500/70">
                  <div className="text-amber-300 font-bold">Especiales</div>
                  <div className="font-mono font-bold text-amber-300">32%</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-purple-500/70">
                  <div className="text-purple-300 font-bold">Épicas</div>
                  <div className="font-mono font-bold text-purple-300">13%</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-cyan-400">
                  <div className="text-cyan-300 font-bold">Legendarias</div>
                  <div className="font-mono font-bold text-yellow-300">5%</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-rose-400/70">
                  <div className="text-rose-300 font-bold">Divinidades</div>
                  <div className="font-mono font-bold text-rose-200">2%</div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                30% de probabilidad por sobre estándar de contener un héroe nuevo. ¿Buscas carta garantizada? Compra Sobres Élite, Cofres Reales o Megacajas en la Tienda.
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

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <div className="text-xs text-slate-400">
                    Sobres Disponibles:{' '}
                    <span className="font-bold font-mono tabular-nums text-amber-300 text-sm">
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

                  {progression.unopenedPacks <= 0 && (
                    <button
                      onClick={() => setActiveSubTab('SHOP')}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Comprar Sobres en Tienda
                    </button>
                  )}
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
        {activeSubTab === 'MISSIONS' && (() => {
          const totalMissions = missions.length;
          const completedCount = missions.filter((m) => m.completed).length;
          const claimedTotal = missions.filter((m) => m.claimed).length;

          const difficultyLabel: Record<MissionDifficulty, string> = {
            facil: 'Fácil',
            media: 'Media',
            dificil: 'Difícil',
            extrema: 'Extrema',
            legendaria: 'Legendaria'
          };
          const difficultyStyle: Record<MissionDifficulty, string> = {
            facil: 'text-emerald-300',
            media: 'text-cyan-300',
            dificil: 'text-amber-300',
            extrema: 'text-orange-300',
            legendaria: 'text-rose-300'
          };
          const categoryLabel: Record<MissionCategory, string> = {
            combat: 'Combate',
            story: 'Oleadas',
            arena: 'Arenas',
            economy: 'Economía',
            collection: 'Colección'
          };

          const filteredMissions = missions
            .filter((m) => {
              if (missionCategoryFilter !== 'all' && m.category !== missionCategoryFilter) return false;
              if (missionStatusFilter === 'claimable') return m.completed && !m.claimed;
              if (missionStatusFilter === 'active') return !m.completed;
              if (missionStatusFilter === 'hard') {
                return m.difficulty === 'dificil' || m.difficulty === 'extrema' || m.difficulty === 'legendaria';
              }
              if (missionStatusFilter === 'claimed') return m.claimed;
              return true;
            })
            .sort((a, b) => {
              // Claimable first, then uncompleted, then claimed
              const rankA = a.completed && !a.claimed ? 0 : !a.completed ? 1 : 2;
              const rankB = b.completed && !b.claimed ? 0 : !b.completed ? 1 : 2;
              if (rankA !== rankB) return rankA - rankB;
              if (rankA === 1) {
                const ratioA = a.currentCount / a.targetCount;
                const ratioB = b.currentCount / b.targetCount;
                return ratioB - ratioA;
              }
              return 0;
            });

          return (
            <div className="space-y-4 max-w-5xl mx-auto">
              {/* Summary Header */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-100">
                    Misiones de Campaña y Desafíos ({totalMissions})
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono tabular-nums">
                    {completedCount}/{totalMissions} completadas · {claimedTotal} reclamadas · {claimableCount} listas para reclamar
                  </div>
                </div>

                {claimableCount > 0 && onClaimAllMissions && (
                  <button
                    onClick={onClaimAllMissions}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Reclamar Todas ({claimableCount})
                  </button>
                )}
              </div>

              {/* Filters Toolbar */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2.5">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    { key: 'all', label: `Todas (${totalMissions})` },
                    { key: 'combat', label: 'Combate' },
                    { key: 'story', label: 'Oleadas' },
                    { key: 'arena', label: 'Arenas' },
                    { key: 'economy', label: 'Economía' },
                    { key: 'collection', label: 'Colección' }
                  ].map((cat) => (
                    <button
                      key={`mcat_${cat.key}`}
                      onClick={() => setMissionCategoryFilter(cat.key as typeof missionCategoryFilter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        missionCategoryFilter === cat.key
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-800/80">
                  {[
                    { key: 'all', label: 'Todos los estados' },
                    { key: 'claimable', label: `Listas (${claimableCount})` },
                    { key: 'active', label: 'En progreso' },
                    { key: 'hard', label: 'Alta dificultad' },
                    { key: 'claimed', label: `Reclamadas (${claimedTotal})` }
                  ].map((st) => (
                    <button
                      key={`mst_${st.key}`}
                      onClick={() => setMissionStatusFilter(st.key as typeof missionStatusFilter)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        missionStatusFilter === st.key
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Missions Grid */}
              {filteredMissions.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                  <div className="text-sm font-bold text-slate-300">No hay misiones en este filtro</div>
                  <button
                    onClick={() => {
                      setMissionCategoryFilter('all');
                      setMissionStatusFilter('all');
                    }}
                    className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black cursor-pointer"
                  >
                    Ver todas las misiones
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredMissions.map((mission) => {
                    const progressRatio = Math.min(1, mission.currentCount / mission.targetCount);
                    const diffKey: MissionDifficulty = mission.difficulty || 'media';

                    return (
                      <div
                        key={mission.id}
                        className={`p-4 rounded-2xl border transition-colors flex flex-col justify-between gap-3 ${
                          mission.claimed
                            ? 'bg-slate-950/40 border-slate-800/70 opacity-60'
                            : mission.completed
                            ? 'bg-slate-900 border-amber-400/70'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 text-[11px] font-mono mb-1">
                            <span className="text-slate-400">
                              {categoryLabel[mission.category]} ·{' '}
                              <span className={`font-bold ${difficultyStyle[diffKey]}`}>
                                {difficultyLabel[diffKey]}
                              </span>
                            </span>
                            <span className="tabular-nums text-slate-300 font-bold">
                              {Math.min(mission.currentCount, mission.targetCount).toLocaleString()} /{' '}
                              {mission.targetCount.toLocaleString()}
                            </span>
                          </div>

                          <h4 className="font-black text-sm text-slate-100">{mission.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed mt-1 mb-2.5">
                            {mission.description}
                          </p>

                          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className={`h-full transition-all duration-300 ${
                                mission.completed ? 'bg-emerald-500' : 'bg-amber-400'
                              }`}
                              style={{ width: `${progressRatio * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <div className="text-xs font-mono tabular-nums flex items-center gap-2 flex-wrap">
                            <span className="text-purple-300 font-bold">
                              +{mission.rewardPacks} {mission.rewardPacks === 1 ? 'Sobre' : 'Sobres'}
                            </span>
                            {mission.rewardCoins ? (
                              <span className="text-amber-300 font-bold">· +{mission.rewardCoins} mon.</span>
                            ) : null}
                            {mission.rewardSkillPoints ? (
                              <span className="text-emerald-300 font-bold">· +{mission.rewardSkillPoints} PH</span>
                            ) : null}
                          </div>

                          {mission.claimed ? (
                            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 whitespace-nowrap">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Reclamado
                            </span>
                          ) : mission.completed ? (
                            <button
                              onClick={() => onClaimMission(mission.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer whitespace-nowrap"
                            >
                              Reclamar
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-semibold whitespace-nowrap">
                              {Math.round(progressRatio * 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

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
                <span>Guardar Ahora</span>
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

      {/* Shop Card Preview Modal */}
      {shopPreviewCardId && UNITS[shopPreviewCardId] && (() => {
        const previewUnit = UNITS[shopPreviewCardId];
        const pMeta = getRarityMeta(previewUnit.rarity);
        const isOwned = progression.unlockedCardIds.includes(previewUnit.id);
        const coinPrice = getCardShopPrice(previewUnit);
        const canAfford = (progression.savedCoins ?? 0) >= coinPrice;
        const shopElig = canBuyCardInShop(previewUnit, progression);

        return (
          <div
            onClick={() => setShopPreviewCardId(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90dvh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-14 h-14 rounded-xl overflow-hidden border-2 ${pMeta.cardBorder} bg-slate-950 shrink-0`}>
                    {previewUnit.imageUrl && (
                      <GameImage
                        src={previewUnit.imageUrl}
                        alt={previewUnit.name}
                        className="w-full h-full object-cover"
                        fallback={<div className="w-full h-full flex items-center justify-center bg-slate-800 text-xs">{previewUnit.name.slice(0, 2)}</div>}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-[10px] font-black uppercase ${pMeta.textColor}`}>
                      {pMeta.badgeLabel} · {previewUnit.role}
                    </div>
                    <h3 className="text-base font-black text-slate-100 truncate">{previewUnit.name}</h3>
                    <div className="text-xs text-slate-400 truncate">{previewUnit.title}</div>
                  </div>
                </div>
                <button
                  onClick={() => setShopPreviewCardId(null)}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
                <p className="text-slate-300 leading-relaxed">{previewUnit.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono tabular-nums">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-sans text-slate-400">Coste Arena</div>
                    <div className="text-sm font-bold text-amber-300">{previewUnit.cost} oro</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-sans text-slate-400">Daño Base</div>
                    <div className="text-sm font-bold text-amber-200">{previewUnit.baseDamage}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-sans text-slate-400">Cadencia</div>
                    <div className="text-sm font-bold text-emerald-300">{previewUnit.baseAttackSpeed}/s</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-sans text-slate-400">Alcance</div>
                    <div className="text-sm font-bold text-cyan-300">{previewUnit.baseRange}px</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Niveles en Batalla
                  </div>
                  {previewUnit.tiers.map((t, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-200">{t.name}</div>
                        <div className="text-[11px] text-slate-400">{t.description}</div>
                      </div>
                      <span className="font-mono tabular-nums text-[11px] text-amber-300 shrink-0">
                        {t.cost > 0 ? `${t.cost}o` : 'Base'} · {t.damage} dmg
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 space-y-1">
                  <div className="font-bold text-purple-300 flex items-center justify-between">
                    <span>Showdown: {previewUnit.showdownName}</span>
                    <span className="font-mono text-[10px] text-slate-400">{previewUnit.showdownCooldown}s CD</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{previewUnit.showdownDescription}</p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3">
                <button
                  onClick={() => setShopPreviewCardId(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                >
                  Cerrar
                </button>
                {isOwned ? (
                  <div className="px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    Ya en tu colección
                  </div>
                ) : !shopElig.allowed ? (
                  <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-bold">
                    Requiere completar Arena {shopElig.requiredArena}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onBuyCardWithCoins?.(previewUnit.id);
                      setShopPurchaseToast({ cardId: previewUnit.id, name: previewUnit.name });
                      setShopPreviewCardId(null);
                    }}
                    disabled={!canAfford}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black font-mono tabular-nums cursor-pointer ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? `Comprar · ${coinPrice} monedas` : `Faltan monedas (${coinPrice})`}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Shop Pack Immediate Opening Reveal Modal */}
      {shopPackReveal && (
        <div
          onClick={() => setShopPackReveal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90dvh] flex flex-col bg-slate-900 border border-purple-500/40 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <PackageOpen className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                    Recompensas Obtenidas
                  </div>
                  <h3 className="text-base font-black text-slate-100">{shopPackReveal.tierName}</h3>
                </div>
              </div>
              <button
                onClick={() => setShopPackReveal(null)}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shopPackReveal.rewards.map((reward, idx) => {
                const unit = reward.cardId ? UNITS[reward.cardId] : null;
                const rMeta = getRarityMeta(reward.rarity || unit?.rarity);
                const isInDeck = reward.cardId ? (progression.activeDeckCardIds || []).includes(reward.cardId) : false;
                const deckHasRoom = (progression.activeDeckCardIds || []).length < 7;

                return (
                  <div
                    key={`shop_pull_${idx}`}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                      reward.type === 'card'
                        ? `${rMeta.cardBg} ${rMeta.cardBorder}`
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    {reward.type === 'card' && unit ? (
                      <>
                        <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${rMeta.cardBorder} bg-slate-900 shrink-0`}>
                          {unit.imageUrl && (
                            <GameImage
                              src={unit.imageUrl}
                              alt={unit.name}
                              className="w-full h-full object-cover"
                              fallback={<div className="w-full h-full flex items-center justify-center bg-slate-800 text-xs">{unit.name.slice(0, 2)}</div>}
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-[10px] font-black uppercase ${rMeta.textColor}`}>
                            {rMeta.badgeLabel} · ¡Nueva Carta!
                          </div>
                          <div className={`text-sm font-black truncate ${rMeta.textColor}`}>{unit.name}</div>
                          <div className="text-[11px] text-slate-300 truncate">{unit.title}</div>
                          {!isInDeck && deckHasRoom && onToggleDeckCard && (
                            <button
                              onClick={() => {
                                onToggleDeckCard(unit.id);
                                sounds.playPlace();
                              }}
                              className="mt-1.5 px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-black cursor-pointer"
                            >
                              Equipar al Mazo
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-amber-950/70 border border-amber-500/40 flex items-center justify-center shrink-0">
                          <Zap className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase text-slate-400">Puntos de Habilidad</div>
                          <div className="text-lg font-black font-mono tabular-nums text-amber-300">
                            +{reward.skillPoints} PH
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setShopPackReveal(null);
                  setActiveSubTab('DECK');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
              >
                Ir a Mi Mazo
              </button>
              <button
                onClick={() => setShopPackReveal(null)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black cursor-pointer"
              >
                Continuar en Tienda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
