import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Layers, 
  ShoppingCart, 
  Radio, 
  Infinity, 
  Plus,
  Trash2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Share2,
  Copy,
  X,
  Archive,
  Download
} from 'lucide-react';
import { Beat, BeatPackData } from '../types';
import { useStore } from '../context/StoreContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import CheckoutModal from '../components/CheckoutModal';
import BeatPackFreeDownloadModal from '../components/BeatPackFreeDownloadModal';
import { sanitizeTitle } from '../utils/sanitizeTitle';

// Generated authentic cover arts matching reference design
import trapVol1Art from '../assets/images/trap_vol1_art_1787016520272.jpg';
import trapVol2Art from '../assets/images/trap_vol2_art_1787016554260.jpg';
import trapVol3Art from '../assets/images/trap_vol3_art_1787016564316.jpg';
import trapVol4Art from '../assets/images/trap_vol4_art_1787016573765.jpg';

export type { BeatPackData };

const SNIPPET_DURATION = 30; // 30 seconds per beat in preview mode
const STORAGE_KEY = 'pyrex_spinna_beat_packs_data_v1';

// Helper to generate full Beat objects
const makeBeat = (
  id: string,
  title: string,
  bpm: number,
  key: string,
  camelot: string,
  price: number,
  audioUrl: string,
  coverArtUrl: string,
  config?: any
): Beat => ({
  id,
  title,
  producer: 'PyrexSpinna',
  bpm,
  key,
  camelotCode: camelot,
  price,
  audioUrl,
  directAudioUrl: audioUrl,
  coverArtUrl,
  visibility: 'Public',
  trackType: 'Beat',
  isPackTrack: true,
  licenses: {
    mp3Lease: { enabled: true, price: price ?? config?.defaultMp3Price ?? 0 },
    wavLease: { enabled: true, price: (price ?? config?.defaultMp3Price ?? 0) + 20 },
    premiumLease: { enabled: true, price: (price ?? config?.defaultMp3Price ?? 0) + 50 },
    unlimitedLease: { enabled: true, price: (price ?? config?.defaultMp3Price ?? 0) + 150 },
    exclusive: { enabled: true, price: config?.defaultExclusivePrice ?? 0 }
  }
});

const DEFAULT_BEAT_PACKS: BeatPackData[] = [
  { 
    id: 'pack1', 
    title: 'Trap Genesis Vol. 1', 
    subtitle: 'Classic hard-hitting trap beats',
    beatCount: 6,
    producer: 'PyrexSpinna',
    bpmKey: '140 BPM / C Minor',
    price: 29.99,
    coverArt: trapVol1Art,
    beats: []
  },
  { 
    id: 'pack2', 
    title: 'Dark Melodies Vol. 2', 
    subtitle: 'Dark and atmospheric soundscapes',
    beatCount: 6,
    producer: 'PyrexSpinna',
    bpmKey: '130 BPM / F Minor',
    price: 29.99,
    coverArt: trapVol2Art,
    beats: []
  },
  { 
    id: 'pack3', 
    title: '808 Heavyweights', 
    subtitle: 'Massive 808s and punchy drums',
    beatCount: 6,
    producer: 'PyrexSpinna',
    bpmKey: '145 BPM / D# Minor',
    price: 24.99,
    coverArt: trapVol3Art,
    beats: []
  },
  { 
    id: 'pack4', 
    title: 'Midnight Atmosphere', 
    subtitle: 'Late night vibes for smooth production',
    beatCount: 6,
    producer: 'PyrexSpinna',
    bpmKey: '120 BPM / G# Minor',
    price: 29.99,
    coverArt: trapVol4Art,
    beats: []
  },
  { 
    id: 'pack5', 
    title: 'Sub-Zero Soundkit', 
    subtitle: 'Cold and crisp sound design',
    beatCount: 6,
    producer: 'PyrexSpinna',
    bpmKey: '135 BPM / A Minor',
    price: 19.99,
    coverArt: trapVol1Art, // Reusing art for now
    beats: []
  },
  { 
    id: 'pack6', 
    title: 'Stadium Anthems', 
    subtitle: 'Epic sounds for the big stage',
    beatCount: 6,
    producer: 'PyrexSpinna',
    bpmKey: '150 BPM / B Minor',
    price: 34.99,
    coverArt: trapVol2Art, // Reusing art for now
    beats: []
  }
];

export default function BeatPacks() {
  const { state, removeBeatPack } = useStore();
  const { 
    currentTrack, 
    isPlaying: isGlobalPlaying, 
    playTrack, 
    togglePlay, 
    pauseTrack, 
    currentTime 
  } = useAudioPlayer();

  // Persistent beat packs list with localStorage support
  const [beatPacks, setBeatPacks] = useState<BeatPackData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load beat packs from storage:', err);
    }
    return [];
  });

  // Sync with global store packs whenever state.beatPacks is updated
  useEffect(() => {
    if (state.beatPacks && Array.isArray(state.beatPacks) && state.beatPacks.length > 0) {
      setBeatPacks(state.beatPacks);
    }
  }, [state.beatPacks]);

  // URL Search param for direct deep linking
  const [searchParams] = useSearchParams();

  // Selected pack in focus
  const [selectedPackId, setSelectedPackId] = useState<string>(() => {
    return searchParams.get('pack') || beatPacks[0]?.id || '';
  });

  // Sync selectedPackId if search param changes
  useEffect(() => {
    const packParam = searchParams.get('pack');
    if (packParam && beatPacks.some(p => p.id === packParam)) {
      setSelectedPackId(packParam);
    }
  }, [searchParams, beatPacks]);

  // Keep selectedPackId in sync if the current pack was deleted
  const activePack = useMemo(() => {
    return beatPacks.find(p => p.id === selectedPackId) || beatPacks[0] || null;
  }, [beatPacks, selectedPackId]);

  // Preview Mode State
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState<number>(0);
  const [snippetSecondsElapsed, setSnippetSecondsElapsed] = useState<number>(0);
  const [isPackCheckoutOpen, setIsPackCheckoutOpen] = useState<boolean>(false);
  const [freeDownloadPack, setFreeDownloadPack] = useState<BeatPackData | null>(null);

  // Deletion state & modal
  const [packToDelete, setPackToDelete] = useState<BeatPackData | null>(null);
  const [recentlyDeletedToast, setRecentlyDeletedToast] = useState<{ pack: BeatPackData; index: number } | null>(null);
  const [shareToastMessage, setShareToastMessage] = useState<string | null>(null);

  // Share Pack handler (Web Share API with Clipboard Fallback)
  const handleSharePack = useCallback(async (pack: BeatPackData, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/beat-packs?pack=${encodeURIComponent(pack.id)}`;
    const shareData = {
      title: `${pack.title} - Beat Pack`,
      text: `Listen to ${pack.title} (${pack.beatCount} beats) produced by PyrexSpinna!`,
      url: shareUrl
    };

    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setShareToastMessage(`Shared "${pack.title}" successfully!`);
        setTimeout(() => setShareToastMessage(null), 4000);
        return;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.log('Share canceled or fallback needed');
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareToastMessage(`Beat Pack link copied to clipboard!`);
      setTimeout(() => setShareToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to copy share link:', err);
      setShareToastMessage(`Link: ${shareUrl}`);
      setTimeout(() => setShareToastMessage(null), 5000);
    }
  }, []);

  // Sync to localStorage on update
  const savePacks = useCallback((updatedPacks: BeatPackData[]) => {
    setBeatPacks(updatedPacks);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPacks));
    } catch (e) {
      console.warn('Failed to save beat packs:', e);
    }
  }, []);

  // 30-second snippet loop ticker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPreviewMode && isGlobalPlaying && activePack && activePack.beats.length > 0) {
      interval = setInterval(() => {
        setSnippetSecondsElapsed(prev => {
          if (prev >= SNIPPET_DURATION - 1) {
            // Move to next snippet in the active pack
            const total = activePack.beats.length;
            const nextIdx = (currentSnippetIndex + 1) % total;
            setCurrentSnippetIndex(nextIdx);
            const nextTrack = activePack.beats[nextIdx];
            if (nextTrack) {
              playTrack(nextTrack);
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPreviewMode, isGlobalPlaying, currentSnippetIndex, activePack, playTrack]);

  // Handle master "PREVIEW PACK" button
  const handleTogglePreviewMode = () => {
    if (!activePack || activePack.beats.length === 0) return;

    if (isPreviewMode) {
      togglePlay();
    } else {
      // Start preview loop
      setIsPreviewMode(true);
      setCurrentSnippetIndex(0);
      setSnippetSecondsElapsed(0);
      playTrack(activePack.beats[0]);
    }
  };

  // Select another pack from the bottom grid
  const handleSelectPack = (packId: string) => {
    setSelectedPackId(packId);
    if (isPreviewMode) {
      const targetPack = beatPacks.find(p => p.id === packId);
      if (targetPack && targetPack.beats.length > 0) {
        setCurrentSnippetIndex(0);
        setSnippetSecondsElapsed(0);
        playTrack(targetPack.beats[0]);
      }
    }
  };

  // Execute deletion of a beat pack
  const confirmDeletePack = () => {
    if (!packToDelete) return;

    const packIdToDelete = packToDelete.id;
    const packIndex = beatPacks.findIndex(p => p.id === packIdToDelete);
    const updated = beatPacks.filter(p => p.id !== packIdToDelete);

    // Stop audio if the deleted pack was currently playing
    if (activePack?.id === packIdToDelete && isGlobalPlaying) {
      pauseTrack();
      setIsPreviewMode(false);
    }

    // Update active selection to remaining pack
    if (selectedPackId === packIdToDelete) {
      const remainingPack = updated[packIndex] || updated[packIndex - 1] || updated[0];
      setSelectedPackId(remainingPack ? remainingPack.id : '');
    }

    // Remove from store context
    try {
      removeBeatPack(packIdToDelete);
    } catch (e) {
      console.warn('Error calling removeBeatPack:', e);
    }

    // Save and show toast with undo
    savePacks(updated);
    setRecentlyDeletedToast({ pack: packToDelete, index: packIndex });
    setPackToDelete(null);

    // Auto-dismiss undo toast after 6 seconds
    setTimeout(() => {
      setRecentlyDeletedToast(prev => (prev?.pack.id === packIdToDelete ? null : prev));
    }, 6000);
  };

  // Undo delete
  const handleUndoDelete = () => {
    if (!recentlyDeletedToast) return;
    const { pack, index } = recentlyDeletedToast;
    const restored = [...beatPacks];
    restored.splice(index, 0, pack);
    savePacks(restored);
    setSelectedPackId(pack.id);
    setRecentlyDeletedToast(null);
  };

  // Restore all defaults
  const handleRestoreDefaults = () => {
    savePacks(DEFAULT_BEAT_PACKS);
    setSelectedPackId(DEFAULT_BEAT_PACKS[0].id);
    setRecentlyDeletedToast(null);
  };

  // Format dynamic total pack preview elapsed time & max duration for any number of tracks
  const totalPackBeats = activePack?.beats?.length || activePack?.beatCount || 1;
  const totalPackPreviewDuration = totalPackBeats * SNIPPET_DURATION;

  const totalElapsedSeconds = Math.min(
    totalPackPreviewDuration, 
    currentSnippetIndex * SNIPPET_DURATION + snippetSecondsElapsed
  );
  const totalMinutes = Math.floor(totalElapsedSeconds / 60);
  const totalSeconds = Math.floor(totalElapsedSeconds % 60);
  const formattedProgressTime = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;

  const maxTotalMinutes = Math.floor(totalPackPreviewDuration / 60);
  const maxTotalSeconds = Math.floor(totalPackPreviewDuration % 60);
  const formattedTotalTime = `${maxTotalMinutes}:${maxTotalSeconds < 10 ? '0' : ''}${maxTotalSeconds}`;

  return (
    <div className="w-full min-h-[85vh] text-white flex flex-col justify-between max-w-6xl mx-auto px-4 py-4 md:py-8 space-y-10 relative">
      
      {/* 1. TOP HEADER & TITLE */}
      <div className="text-center space-y-2 pt-2 relative">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white drop-shadow-md">
            PYREXSPINNA BEAT PACKS - PREVIEW MODE ENABLED
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 font-medium">
          Click 'Preview Pack' to hear 30s snippets of all beats in this pack.
        </p>

        {/* Restore Defaults Button (if some packs were deleted) */}
        {beatPacks.length < DEFAULT_BEAT_PACKS.length && (
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleRestoreDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white transition-all shadow-sm active:scale-95"
            >
              <RotateCcw size={13} className="text-purple-400" />
              <span>Restore All Default Packs ({DEFAULT_BEAT_PACKS.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* If all packs were deleted, show Empty State */}
      {!activePack ? (
        <div className="max-w-xl mx-auto text-center py-16 px-6 bg-neutral-950/80 border border-neutral-800 rounded-3xl space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
            <Layers size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">No Beat Packs Available</h2>
            <p className="text-sm text-neutral-400">
              All beat packs have been deleted from your store.
            </p>
          </div>
          <button
            onClick={handleRestoreDefaults}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-lg active:scale-95"
          >
            <RotateCcw size={16} />
            <span>Restore Default Beat Packs</span>
          </button>
        </div>
      ) : (
        <>
          {/* 2. TOP HERO ROW (3-COLUMN SECTION MATCHING REFERENCE IMAGE) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch max-w-5xl mx-auto w-full">
            
            {/* LEFT COLUMN: PREVIEW PACK BUTTON CARD */}
            <div className="flex flex-col items-center">
              <div
                onClick={handleTogglePreviewMode}
                className={`w-full aspect-square rounded-2xl md:rounded-3xl border-2 transition-all flex flex-col items-center justify-center p-6 cursor-pointer group shadow-2xl relative overflow-hidden select-none ${
                  isPreviewMode && isGlobalPlaying
                    ? 'border-purple-400 bg-gradient-to-b from-purple-900/60 via-neutral-950 to-purple-950/70 shadow-[0_0_35px_rgba(168,85,247,0.5)] scale-[1.02]'
                    : 'border-purple-500/70 hover:border-purple-400 bg-gradient-to-b from-[#160d26] via-[#0d0718] to-[#080410] hover:shadow-[0_0_30px_rgba(168,85,247,0.35)] active:scale-95'
                }`}
              >
                {/* Background subtle neon glow */}
                <div className="absolute inset-0 bg-radial-gradient from-purple-600/20 to-transparent pointer-events-none" />

                {/* Glowing Icon Group (+ ▶ ∞) */}
                <div className="relative flex items-center justify-center gap-2 mb-4 text-white">
                  <Plus size={24} className="text-purple-300 font-bold" />
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                    {isPreviewMode && isGlobalPlaying ? (
                      <Pause size={28} fill="white" className="text-white" />
                    ) : (
                      <Play size={28} fill="white" className="text-white ml-1" />
                    )}
                  </div>
                  <Infinity size={24} className="text-purple-300" />
                </div>

                {/* Main Label */}
                <span className="text-lg sm:text-xl font-black uppercase tracking-wider text-white text-center drop-shadow">
                  {isPreviewMode && isGlobalPlaying ? 'PAUSE PREVIEW' : 'PREVIEW PACK'}
                </span>

                {/* Live pulsating equalizer effect when active */}
                {isPreviewMode && isGlobalPlaying && (
                  <div className="flex items-end gap-1 h-4 mt-3">
                    <div className="w-1 bg-purple-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-4" />
                    <div className="w-1 bg-purple-300 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
                    <div className="w-1 bg-purple-200 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-4" />
                    <div className="w-1 bg-purple-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-2" />
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-neutral-300 mt-3 text-center">
                {activePack.title}
              </span>
            </div>

            {/* MIDDLE COLUMN: PACK INFO, BUY LICENSE & ACTIVE PACK DELETE BUTTON */}
            <div className="flex flex-col items-center">
              <div className="w-full aspect-square rounded-2xl md:rounded-3xl border border-neutral-800 bg-[#0e0e12] p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative">
                
                {/* Header with Title, Share, and Delete Button for the active pack */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {activePack.title}
                      </h2>
                      {activePack.isMiniPack && (
                        <div className="exclusive-badge !static !p-1">
                          <span role="img" aria-label="exclusive" className="crown-icon">👑</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Share Active Pack Button */}
                      <button
                        onClick={(e) => handleSharePack(activePack, e)}
                        title="Share this beat pack"
                        className="p-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/80 border border-purple-700/60 hover:border-purple-400 text-purple-300 hover:text-white transition-all shadow-sm flex items-center justify-center active:scale-95 group"
                      >
                        <Share2 size={16} className="group-hover:scale-110 transition-transform" />
                      </button>

                      {/* Delete Active Pack Button */}
                      <button
                        onClick={() => setPackToDelete(activePack)}
                        title="Delete this beat pack"
                        className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/80 border border-red-800/60 hover:border-red-500 text-red-400 hover:text-white transition-all shadow-sm flex items-center justify-center active:scale-95 group"
                      >
                        <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-300 font-semibold">
                    {activePack.beatCount} Exclusive Beats
                  </p>
                  <p className="text-sm text-neutral-400">
                    Produced by {activePack.producer}
                  </p>
                  <p className="text-sm text-neutral-400 font-mono pt-1">
                    {activePack.bpmKey}
                  </p>
                </div>

                {/* Buy License & Free Download Pill Buttons */}
                <div className="pt-4 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {!activePack.isFreeDownload && (
                      <button
                        onClick={() => setIsPackCheckoutOpen(true)}
                        className={`w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${activePack.isFreeDownload ? 'hidden' : ''}`}
                      >
                        <ShoppingCart size={15} />
                        <span>${activePack.price.toFixed(2)} - Buy License</span>
                      </button>
                    )}
                    
                    {(activePack.isFreeDownload || activePack.price === 0) && (
                      <button
                        onClick={() => setFreeDownloadPack(activePack)}
                        className={`w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-purple-300 hover:text-white border border-purple-500/50 hover:border-purple-400 rounded-full font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${!activePack.isFreeDownload && activePack.price > 0 ? 'sm:col-span-1' : 'sm:col-span-2'}`}
                      >
                        <Download size={15} />
                        <span>Free Download</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-4 pt-1">
                    <button
                      onClick={(e) => handleSharePack(activePack, e)}
                      className="text-xs text-purple-400/90 hover:text-purple-300 font-semibold hover:underline flex items-center gap-1.5 transition-colors"
                    >
                      <Share2 size={12} />
                      <span>Share Pack</span>
                    </button>
                    <span className="text-neutral-700">•</span>
                    <button
                      onClick={() => setPackToDelete(activePack)}
                      className="text-xs text-red-400/80 hover:text-red-300 font-medium hover:underline flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ACTIVE PACK COVER ART */}
            <div className="flex flex-col items-center">
              <div className="w-full aspect-square rounded-2xl md:rounded-3xl overflow-hidden border border-neutral-800 bg-[#0e0e12] shadow-2xl relative group">
                <img 
                  src={activePack.coverArt} 
                  alt={activePack.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Top-Right Badges: Price (Clickable Checkout) + Share + Delete + Track Count */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPackCheckoutOpen(true);
                    }}
                    title={`Buy ${activePack.title} for $${activePack.price.toFixed(2)}`}
                    className="bg-purple-950/90 hover:bg-purple-600 backdrop-blur-md px-2.5 py-1 rounded-lg border border-purple-500/60 hover:border-purple-300 text-[11px] font-mono font-black text-white hover:text-white shadow-md active:scale-95 transition-all flex items-center gap-1 cursor-pointer group/price"
                  >
                    <ShoppingCart size={11} className="text-purple-300 group-hover/price:scale-110 transition-transform" />
                    <span>${activePack.price.toFixed(2)}</span>
                  </button>
                  <button
                    onClick={(e) => handleSharePack(activePack, e)}
                    title="Share this beat pack"
                    className="bg-black/75 hover:bg-purple-600/90 backdrop-blur-md p-1.5 rounded-lg border border-purple-500/30 text-purple-300 hover:text-white transition-all shadow-md active:scale-95"
                  >
                    <Share2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPackToDelete(activePack);
                    }}
                    title="Delete this beat pack"
                    className="bg-black/75 hover:bg-red-600/90 backdrop-blur-md p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:text-white transition-all shadow-md active:scale-95"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono uppercase font-bold text-purple-300">
                    {activePack.beats.length || activePack.beatCount} TRACKS
                  </div>
                </div>
              </div>
              <span className="text-sm font-semibold text-neutral-300 mt-3 text-center">
                {activePack.title}
              </span>
            </div>

          </div>

          {/* 3. PACK CATALOG GRID (EVERY PACK HAS DIRECT SHARE, REACTIVE PRICE & DELETE BUTTONS) */}
          <div className="max-w-5xl mx-auto w-full space-y-3">
            <div className={`grid gap-4 sm:gap-6 ${
              beatPacks.length === 1 
                ? 'grid-cols-1 max-w-xs mx-auto' 
                : beatPacks.length === 2 
                  ? 'grid-cols-2 max-w-lg mx-auto' 
                  : beatPacks.length === 3 
                    ? 'grid-cols-3' 
                    : 'grid-cols-2 sm:grid-cols-4'
            }`}>
              {beatPacks.map((pack) => {
                const isSelected = pack.id === selectedPackId;
                return (
                  <div 
                    key={pack.id}
                    onClick={() => handleSelectPack(pack.id)}
                    className="flex flex-col items-center cursor-pointer group relative"
                  >
                    <div 
                      className={`w-full aspect-square rounded-2xl overflow-hidden border transition-all duration-300 shadow-xl bg-neutral-900 relative ${
                        isSelected 
                          ? 'border-purple-500 ring-2 ring-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-[1.03]' 
                          : 'border-neutral-800/80 group-hover:border-neutral-600 group-hover:scale-105'
                      }`}
                    >
                      <img 
                        src={pack.coverArt} 
                        alt={pack.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />

                      {pack.isMiniPack && (
                        <div className="exclusive-badge">
                          <span role="img" aria-label="exclusive" className="crown-icon">👑</span>
                        </div>
                      )}

                      {/* DIRECT SHARE, REACTIVE PRICE BADGE & DELETE BUTTONS ON EVERY BEAT PACK CARD */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPackId(pack.id);
                            setIsPackCheckoutOpen(true);
                          }}
                          title={`Buy ${pack.title} for $${pack.price.toFixed(2)}`}
                          className="bg-purple-950/90 hover:bg-purple-600 backdrop-blur-md px-2 py-1 rounded-xl border border-purple-500/60 hover:border-purple-300 text-[10px] font-mono font-bold text-white transition-all shadow-lg active:scale-95 flex items-center gap-1 cursor-pointer group/cardprice"
                        >
                          <ShoppingCart size={10} className="text-purple-300 group-hover/cardprice:scale-110 transition-transform" />
                          <span>${pack.price.toFixed(2)}</span>
                        </button>
                        <button
                          onClick={(e) => handleSharePack(pack, e)}
                          title={`Share ${pack.title}`}
                          className="p-1.5 sm:p-2 rounded-xl bg-black/80 hover:bg-purple-600 text-neutral-300 hover:text-white border border-white/20 hover:border-purple-400 transition-all shadow-lg active:scale-95 group/share"
                        >
                          <Share2 size={14} className="group-hover/share:scale-110 transition-transform text-purple-300 hover:text-white" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPackToDelete(pack);
                          }}
                          title={`Delete ${pack.title}`}
                          className="p-1.5 sm:p-2 rounded-xl bg-black/80 hover:bg-red-600 text-neutral-300 hover:text-white border border-white/20 hover:border-red-500 transition-all shadow-lg active:scale-95 group/del"
                        >
                          <Trash2 size={14} className="group-hover/del:scale-110 transition-transform text-red-400 hover:text-white" />
                        </button>
                      </div>

                      {isSelected && (
                        <div className="absolute bottom-2 left-2 right-2 bg-purple-950/80 backdrop-blur-md border border-purple-500/40 rounded-lg py-1 px-2 text-center text-[10px] font-black uppercase tracking-wider text-purple-200">
                          SELECTED
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between w-full px-1 mt-2.5">
                      <span className={`text-xs sm:text-sm font-semibold truncate transition-colors ${
                        isSelected ? 'text-white font-bold' : 'text-neutral-400 group-hover:text-neutral-200'
                      }`}>
                        {pack.title}
                      </span>
                      
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {(pack.isFreeDownload || pack.price === 0) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFreeDownloadPack(pack);
                            }}
                            title={`Free Download & Contract for ${pack.title}`}
                            className="text-xs font-mono font-bold text-purple-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-purple-500/50 hover:border-purple-400 px-2 py-0.5 rounded-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer shadow-sm"
                          >
                            <Download size={11} />
                            <span>Free</span>
                          </button>
                        )}
                        {!pack.isFreeDownload && pack.price > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPackId(pack.id);
                              setIsPackCheckoutOpen(true);
                            }}
                            title={`Checkout ${pack.title} ($${pack.price.toFixed(2)})`}
                            className="text-xs font-mono font-bold text-purple-200 hover:text-white bg-purple-950/80 hover:bg-purple-600 border border-purple-700/60 hover:border-purple-400 px-2 py-0.5 rounded-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer shadow-sm"
                          >
                            <ShoppingCart size={11} />
                            <span>${pack.price.toFixed(2)}</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => handleSharePack(pack, e)}
                          title={`Share ${pack.title}`}
                          className="text-neutral-500 hover:text-purple-400 p-1 transition-colors"
                        >
                          <Share2 size={13} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPackToDelete(pack);
                          }}
                          title={`Delete ${pack.title}`}
                          className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. PREVIEW HUD BAR (DYNAMIC SEGMENTS & DURATION FOR UNLIMITED TRACKS) */}
          <div className="max-w-5xl mx-auto w-full bg-[#0a0a0e]/90 border border-neutral-800/90 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Left Title & Share */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Radio size={16} className={`text-purple-400 ${isPreviewMode && isGlobalPlaying ? 'animate-pulse' : ''}`} />
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-200">
                    PREVIEW: {activePack.title} ({currentSnippetIndex + 1} of {activePack.beats.length || activePack.beatCount})
                  </span>
                </div>
                <button
                  onClick={(e) => handleSharePack(activePack, e)}
                  title="Share this beat pack"
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-purple-600/90 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Share2 size={12} />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              {/* Middle: Horizontal Segment Pills for Unlimited Tracks */}
              <div className="flex items-center gap-1.5 w-full max-w-lg flex-1 overflow-x-auto py-1 scrollbar-none">
                {Array.from({ length: activePack.beats.length || activePack.beatCount || 1 }).map((_, index) => {
                  const isPast = index < currentSnippetIndex;
                  const isCurrent = index === currentSnippetIndex;
                  const currentFillPercent = isCurrent 
                    ? Math.min(100, Math.max(0, (snippetSecondsElapsed / SNIPPET_DURATION) * 100))
                    : isPast ? 100 : 0;

                  return (
                    <div 
                      key={index}
                      onClick={() => {
                        if (isPreviewMode && activePack.beats[index]) {
                          setCurrentSnippetIndex(index);
                          setSnippetSecondsElapsed(0);
                          playTrack(activePack.beats[index]);
                        }
                      }}
                      className={`h-3 min-w-[12px] flex-1 rounded-full bg-neutral-800/90 overflow-hidden relative cursor-pointer border border-neutral-700/50 hover:border-purple-500/50 transition-all ${
                        isCurrent ? 'ring-1 ring-purple-400/50' : ''
                      }`}
                      title={`Snippet ${index + 1}: ${sanitizeTitle(activePack.beats[index]?.title || 'Beat')}`}
                    >
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCurrent 
                            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-400 shadow-[0_0_10px_rgba(168,85,247,0.7)]' 
                            : isPast 
                              ? 'bg-purple-600/80' 
                              : 'bg-transparent'
                        }`}
                        style={{ width: `${currentFillPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Right Timestamp: Elapsed / Total Duration */}
              <div className="flex items-center gap-3 text-xs sm:text-sm font-mono text-neutral-300 flex-shrink-0">
                <span className="font-bold text-white">{formattedProgressTime}</span>
                <span className="text-neutral-500">/</span>
                <span className="text-neutral-400 font-bold">{formattedTotalTime}</span>
              </div>

            </div>
          </div>
        </>
      )}

      {/* 5. CONFIRMATION MODAL FOR DELETING A BEAT PACK */}
      {packToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-[#121218] border border-red-900/50 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top red glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-pink-600 to-red-600" />
            
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/80 flex items-center justify-center text-red-400">
                <AlertTriangle size={24} />
              </div>
              <button
                onClick={() => setPackToDelete(null)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">
                Delete Beat Pack?
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Are you sure you want to delete <span className="text-white font-bold underline decoration-red-500/60">{packToDelete.title}</span>? 
                This will remove the bundle and its {packToDelete.beatCount} exclusive instrumentals from your store.
              </p>
            </div>

            {/* Pack Preview Card in Modal */}
            <div className="flex items-center gap-4 p-3 bg-neutral-900/90 rounded-2xl border border-neutral-800">
              <img 
                src={packToDelete.coverArt} 
                alt={packToDelete.title} 
                className="w-14 h-14 rounded-xl object-cover border border-neutral-700 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">{packToDelete.title}</h4>
                <p className="text-xs text-neutral-400 font-mono">{packToDelete.bpmKey} • ${packToDelete.price.toFixed(2)}</p>
                <p className="text-[11px] text-purple-400">{packToDelete.beatCount} tracks included</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setPackToDelete(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePack}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95"
              >
                <Trash2 size={16} />
                <span>Delete Pack</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. UNDO DELETE TOAST */}
      {recentlyDeletedToast && (
        <div className="fixed bottom-24 right-6 z-50 bg-[#16161f] border border-neutral-700/80 rounded-2xl p-4 shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-semibold text-white">Deleted "{recentlyDeletedToast.pack.title}"</span>
          </div>
          <button
            onClick={handleUndoDelete}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow active:scale-95"
          >
            Undo
          </button>
          <button
            onClick={() => setRecentlyDeletedToast(null)}
            className="text-neutral-400 hover:text-white p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 7. SHARE NOTIFICATION TOAST */}
      {shareToastMessage && (
        <div className="fixed bottom-24 right-6 z-50 bg-[#12121c] border border-purple-500/50 rounded-2xl p-4 shadow-2xl shadow-purple-950/50 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 flex-shrink-0">
            <Share2 size={16} />
          </div>
          <div className="text-sm">
            <span className="font-bold text-white block">{shareToastMessage}</span>
            <span className="text-[11px] text-neutral-400">Share link is ready for social media</span>
          </div>
          <button
            onClick={() => setShareToastMessage(null)}
            className="text-neutral-400 hover:text-white p-1 ml-2"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Full Pack Checkout Modal */}
      {isPackCheckoutOpen && activePack && (
        <CheckoutModal 
          beat={{
            ...activePack.beats[0],
            id: `pack-${activePack.id}`,
            title: `${activePack.title} (6-Beat Pack Bundle)`,
            price: activePack.price,
            coverArtUrl: activePack.coverArt
          }}
          onClose={() => setIsPackCheckoutOpen(false)}
          onSuccess={() => setIsPackCheckoutOpen(false)}
        />
      )}

      {/* Free Beat Pack Download & Legal Agreement Modal */}
      <BeatPackFreeDownloadModal
        isOpen={!!freeDownloadPack}
        pack={freeDownloadPack}
        onClose={() => setFreeDownloadPack(null)}
      />

    </div>
  );
}
