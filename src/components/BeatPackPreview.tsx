import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  FastForward, 
  Rewind, 
  Disc, 
  Flame, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  ShoppingCart, 
  ArrowRight, 
  RefreshCw, 
  Layers, 
  ShieldCheck,
  Music,
  Zap,
  Clock,
  Radio,
  Share2,
  Trash2,
  Download
} from 'lucide-react';
import { Beat } from '../types';
import { useStore } from '../context/StoreContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { filterHumanBeats } from '../lib/beatUtils';
import { sanitizeTitle } from '../utils/sanitizeTitle';
import CheckoutModal from './CheckoutModal';
import BeatPackFreeDownloadModal from './BeatPackFreeDownloadModal';

export interface BeatPackPreviewProps {
  packTitle?: string;
  subtitle?: string;
  description?: string;
  price?: number;
  originalValue?: number;
  coverArtUrl?: string;
  beats?: Beat[];
  isFreeDownload?: boolean;
  onPurchasePack?: (packBeats: Beat[]) => void;
  className?: string;
}

// Fallback curated beats array (strictly user uploaded beats only)
const DEFAULT_PACK_TRACKS: Beat[] = [];

const SNIPPET_DURATION = 30; // 30 seconds per beat demo

export default function BeatPackPreview({
  packTitle = "THE GRAIL VAULT • VOL. 1",
  subtitle = "Curated 6-Beat Producer Bundle",
  description = "Get instant access to 6 industry-grade trap & hip-hop instrumentals produced by Pyrex Spinna. Includes untagged WAVs, stems, and commercial licensing rights at over 65% off individual lease prices.",
  price = 79.99,
  originalValue = 189.99,
  coverArtUrl = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=85",
  beats: propBeats,
  isFreeDownload: propIsFreeDownload = false,
  onPurchasePack,
  className = ""
}: BeatPackPreviewProps) {
  const { state, removeBeat } = useStore();
  const { 
    currentTrack, 
    isPlaying: isGlobalPlaying, 
    playTrack, 
    togglePlay, 
    pauseTrack, 
    currentTime, 
    seek 
  } = useAudioPlayer();

  const handleDeleteBeat = async (beat: Beat, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${beat.title}" from your catalog?`)) {
      await removeBeat(beat.id);
    }
  };

  // Selected pack tracks (user beats only)
  const packTracks = useMemo(() => {
    if (propBeats && propBeats.length > 0) {
      return propBeats.slice(0, 6);
    }
    const storeBeats = filterHumanBeats(state.beats);
    return storeBeats.slice(0, 6);
  }, [propBeats, state.beats]);

  // Pack preview engine state
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(SNIPPET_DURATION);
  const [isLooping, setIsLooping] = useState(true);
  const [checkoutSingleBeat, setCheckoutSingleBeat] = useState<Beat | null>(null);
  const [isPackCheckoutOpen, setIsPackCheckoutOpen] = useState(false);
  const [isFreeDownloadOpen, setIsFreeDownloadOpen] = useState(false);
  const [transitionNotification, setTransitionNotification] = useState<string | null>(null);
  const [shareToastMessage, setShareToastMessage] = useState<string | null>(null);

  // Share handler
  const handleSharePack = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = window.location.href;
    const shareData = {
      title: `${packTitle} - Beat Pack Bundle`,
      text: `Listen to the 30-second preview of ${packTitle} produced by PyrexSpinna!`,
      url: shareUrl
    };

    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setShareToastMessage(`Shared "${packTitle}"!`);
        setTimeout(() => setShareToastMessage(null), 4000);
        return;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.log('Share fallback to clipboard');
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareToastMessage(`Beat Pack link copied to clipboard!`);
      setTimeout(() => setShareToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      setShareToastMessage(`Link: ${shareUrl}`);
      setTimeout(() => setShareToastMessage(null), 5000);
    }
  };

  const activeBeatInPack = packTracks[currentSnippetIndex] || packTracks[0];
  const isThisBeatActiveInGlobal = currentTrack?.id === activeBeatInPack?.id;
  const isActuallyPlaying = isPreviewActive && isThisBeatActiveInGlobal && isGlobalPlaying;

  // Interval timer for 30-second snippet progression
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isPreviewActive && isActuallyPlaying) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            // Snippet finished! Auto-advance to next beat
            advanceToNextSnippet();
            return SNIPPET_DURATION;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPreviewActive, isActuallyPlaying, currentSnippetIndex, packTracks.length, isLooping]);

  // If user changes global track outside the pack preview, pause preview mode
  useEffect(() => {
    if (isPreviewActive && currentTrack) {
      const isTrackInPack = packTracks.some(b => b.id === currentTrack.id);
      if (!isTrackInPack) {
        setIsPreviewActive(false);
      } else {
        const foundIndex = packTracks.findIndex(b => b.id === currentTrack.id);
        if (foundIndex !== -1 && foundIndex !== currentSnippetIndex) {
          setCurrentSnippetIndex(foundIndex);
          setSecondsRemaining(SNIPPET_DURATION);
        }
      }
    }
  }, [currentTrack?.id, isPreviewActive, packTracks]);

  // Advance to next snippet
  const advanceToNextSnippet = (forcedIndex?: number) => {
    let nextIndex = forcedIndex !== undefined ? forcedIndex : currentSnippetIndex + 1;

    if (nextIndex >= packTracks.length) {
      if (isLooping) {
        nextIndex = 0;
      } else {
        setIsPreviewActive(false);
        setSecondsRemaining(SNIPPET_DURATION);
        return;
      }
    }

    const nextTrack = packTracks[nextIndex];
    if (nextTrack) {
      setCurrentSnippetIndex(nextIndex);
      setSecondsRemaining(SNIPPET_DURATION);
      playTrack(nextTrack);

      // Flash notification
      setTransitionNotification(`Playing Snippet ${nextIndex + 1}/${packTracks.length}: ${nextTrack.title}`);
      setTimeout(() => setTransitionNotification(null), 3500);
    }
  };

  // Jump to previous snippet
  const rewindToPreviousSnippet = () => {
    let prevIndex = currentSnippetIndex - 1;
    if (prevIndex < 0) {
      prevIndex = packTracks.length - 1;
    }
    advanceToNextSnippet(prevIndex);
  };

  // Master Trigger: "Preview Pack" button handler
  const handleTogglePackPreview = () => {
    if (isPreviewActive) {
      if (isGlobalPlaying) {
        togglePlay();
      } else {
        togglePlay();
      }
    } else {
      // Start fresh pack preview from current or first track
      setIsPreviewActive(true);
      setSecondsRemaining(SNIPPET_DURATION);
      const targetTrack = packTracks[currentSnippetIndex] || packTracks[0];
      playTrack(targetTrack);
      setTransitionNotification(`Started 30s Snippet Loop • Track 1 of ${packTracks.length}`);
      setTimeout(() => setTransitionNotification(null), 3500);
    }
  };

  // Click on an individual beat row in the pack
  const handleSelectTrackSnippet = (index: number) => {
    setIsPreviewActive(true);
    advanceToNextSnippet(index);
  };

  // Stop preview
  const handleStopPreview = () => {
    setIsPreviewActive(false);
    pauseTrack();
    setSecondsRemaining(SNIPPET_DURATION);
  };

  const progressPercent = Math.min(100, Math.max(0, ((SNIPPET_DURATION - secondsRemaining) / SNIPPET_DURATION) * 100));

  if (packTracks.length === 0) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900/90 via-neutral-950 to-neutral-950 border border-purple-500/20 shadow-2xl p-6 sm:p-8 backdrop-blur-2xl ${className}`}>
      {/* Background Neon Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Transition Alert */}
      {transitionNotification && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-purple-600/90 border border-purple-400/50 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 animate-bounce">
          <Zap size={14} className="text-yellow-300 fill-yellow-300" />
          <span>{transitionNotification}</span>
        </div>
      )}

      {/* Main Pack Header / Hero Banner */}
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-between mb-8 pb-8 border-b border-neutral-800/80">
        {/* Left: Pack Artwork Stack */}
        <div className="relative group flex-shrink-0">
          {/* Layered Vinyl / Disc stack illusion */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-amber-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
          
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border border-neutral-700 bg-neutral-900">
            <img 
              src={coverArtUrl} 
              alt={packTitle}
              className={`w-full h-full object-cover transition-transform duration-700 ${isActuallyPlaying ? 'scale-105 rotate-1' : 'group-hover:scale-105'}`}
            />
            {/* Overlay Disc Tag */}
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
              <Disc className={`w-4 h-4 text-purple-400 ${isActuallyPlaying ? 'animate-spin' : ''}`} />
              <span className="text-[11px] font-black uppercase tracking-wider text-white">
                {packTracks.length} BEATS INCLUDED
              </span>
            </div>

            {/* Live Visualizer Overlay when playing */}
            {isActuallyPlaying && (
              <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-[2px] flex items-center justify-center">
                <div className="flex items-end gap-1.5 h-12">
                  <div className="w-1.5 bg-purple-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-8" />
                  <div className="w-1.5 bg-amber-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-12" />
                  <div className="w-1.5 bg-purple-300 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-10" />
                  <div className="w-1.5 bg-pink-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-6" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle: Pack Details & Badges */}
        <div className="flex-1 text-center lg:text-left space-y-3 min-w-0">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1.5 shadow-sm">
              <Flame size={12} className="text-amber-400 fill-amber-400" />
              EXCLUSIVE BEAT PACK
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck size={12} />
              100% ROYALTY-FREE STEMS
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20">
              SAVE ${(originalValue - price).toFixed(0)}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            {packTitle}
          </h2>
          <p className="text-sm font-semibold text-purple-300/80">
            {subtitle}
          </p>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Quick Pack Specs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-neutral-300 font-mono">
            <div className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
              <Layers size={13} className="text-purple-400" />
              <span>{packTracks.length} Uncompressed WAVs + Stems</span>
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
              <Clock size={13} className="text-amber-400" />
              <span>30-Second High-Energy Demos</span>
            </div>
          </div>
        </div>

        {/* Right: Master Pricing & Actions */}
        <div className="flex flex-col items-center lg:items-end justify-center gap-3 w-full lg:w-auto">
          <div className="text-center lg:text-right">
            <div className="flex items-baseline justify-center lg:justify-end gap-2">
              <div className="beat-price-tag !text-2xl sm:!text-3xl !px-4 !py-2">
                <span>${price.toFixed(2)}</span>
              </div>
              <span className="text-sm font-bold text-neutral-500 line-through">${originalValue.toFixed(2)}</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mt-1">
              Instant Digital Download & Rights
            </span>
          </div>

          {/* Primary Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* MASTER TRIGGER: PREVIEW PACK (Continuous 30s playback loop) */}
            <button
              onClick={handleTogglePackPreview}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2.5 shadow-xl hover:scale-105 active:scale-95 ${
                isPreviewActive && isActuallyPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                  : isPreviewActive
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
              }`}
            >
              {isPreviewActive && isActuallyPlaying ? (
                <>
                  <Pause size={18} fill="currentColor" />
                  <span>Pause Pack Preview</span>
                </>
              ) : isPreviewActive ? (
                <>
                  <Play size={18} fill="currentColor" className="ml-0.5" />
                  <span>Resume Pack Preview</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} className="text-yellow-300" />
                  <span>Preview Pack (30s Demos)</span>
                </>
              )}
            </button>

            {/* UNLOCK / BUY PACK BUTTON (Only if not free) */}
            {!propIsFreeDownload && (
              <button
                onClick={() => {
                  if (onPurchasePack) {
                    onPurchasePack(packTracks);
                  } else {
                    setIsPackCheckoutOpen(true);
                  }
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm rounded-2xl transition-all border border-neutral-700 hover:border-neutral-600 flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer"
              >
                <ShoppingCart size={17} className="text-purple-400" />
                <span>Unlock Full Pack</span>
              </button>
            )}

            {/* FREE DOWNLOAD & CONTRACT BUTTON (Only if free or explicitly enabled) */}
            {(propIsFreeDownload || price === 0) && (
              <button
                onClick={() => setIsFreeDownloadOpen(true)}
                title="Sign agreement & download free beat pack"
                className="w-full sm:w-auto px-6 py-3.5 bg-purple-900/60 hover:bg-purple-800 text-white font-bold text-sm rounded-2xl transition-all border border-purple-500/60 hover:border-purple-400 flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer"
              >
                <Download size={17} className="text-purple-300" />
                <span>Free Download</span>
              </button>
            )}

            {/* SHARE PACK BUTTON */}
            <button
              onClick={handleSharePack}
              title="Share this beat pack"
              className="w-full sm:w-auto px-4 py-3.5 bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 hover:text-white font-bold text-sm rounded-2xl transition-all border border-purple-800/60 hover:border-purple-500 flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              <Share2 size={16} />
              <span>Share Pack</span>
            </button>
          </div>
        </div>
      </div>

      {/* CONTINUOUS 30-SECOND PREVIEW HUD (When Active) */}
      {isPreviewActive && (
        <div className="mb-6 bg-gradient-to-r from-purple-950/80 via-neutral-900/90 to-indigo-950/80 border border-purple-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Active Snippet Indicator */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-md flex-shrink-0 animate-pulse">
                {currentSnippetIndex + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
                    <Radio size={12} className="animate-pulse" />
                    PREVIEWING SNIPPET {currentSnippetIndex + 1} OF {packTracks.length}
                  </span>
                </div>
                <h4 className="text-base font-black text-white truncate">
                  {sanitizeTitle(activeBeatInPack.title)}
                </h4>
                <p className="text-xs text-neutral-400 font-mono">
                  {activeBeatInPack.bpm} BPM • {activeBeatInPack.key || 'Cm'}
                </p>
              </div>
            </div>

            {/* Middle: 30-Second Countdown & Progress Bar */}
            <div className="w-full md:max-w-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-purple-300 font-bold flex items-center gap-1">
                  <Clock size={12} />
                  0:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining} remaining
                </span>
                <span className="text-neutral-400 text-[11px]">
                  Next in {secondsRemaining}s
                </span>
              </div>
              
              {/* Animated Snippet Progress Line */}
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-amber-400 to-pink-500 transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Right: Snippet Skip Controls */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={rewindToPreviousSnippet}
                title="Previous Snippet"
                className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-xl transition-all border border-neutral-700"
              >
                <Rewind size={16} />
              </button>

              <button
                onClick={handleTogglePackPreview}
                title={isActuallyPlaying ? "Pause Preview" : "Play Preview"}
                className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all shadow-md"
              >
                {isActuallyPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>

              <button
                onClick={() => advanceToNextSnippet()}
                title="Skip to Next 30s Snippet"
                className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-xl transition-all border border-neutral-700 flex items-center gap-1.5 text-xs font-bold"
              >
                <span>Next 30s</span>
                <FastForward size={14} />
              </button>

              <button
                onClick={() => setIsLooping(prev => !prev)}
                title={isLooping ? "Continuous Loop: ON" : "Continuous Loop: OFF"}
                className={`p-2.5 rounded-xl transition-all border ${
                  isLooping 
                    ? 'bg-purple-950/60 border-purple-500/40 text-purple-300' 
                    : 'bg-neutral-800 border-neutral-700 text-neutral-500'
                }`}
              >
                <RefreshCw size={16} className={isLooping ? 'animate-spin-slow' : ''} />
              </button>

              <button
                onClick={handleStopPreview}
                className="px-3 py-2 text-xs font-bold text-neutral-400 hover:text-red-400 transition-colors"
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRACKLIST GRID (5-6 BEATS IN THE PACK) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2 text-xs font-black uppercase tracking-wider text-neutral-400">
          <span>Pack Tracklist ({packTracks.length} Selected Beats)</span>
          <span>Snippet Duration: 30s Each</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {packTracks.map((beat, index) => {
            const isThisCurrentSnippet = isPreviewActive && currentSnippetIndex === index;
            const isPlayingThis = isThisCurrentSnippet && isActuallyPlaying;

            return (
              <div 
                key={beat.id || index}
                onClick={() => handleSelectTrackSnippet(index)}
                className={`group cursor-pointer rounded-2xl p-3.5 transition-all flex items-center justify-between gap-3 border ${
                  isThisCurrentSnippet
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/30'
                    : 'bg-neutral-900/60 border-neutral-800/80 hover:bg-neutral-900 hover:border-neutral-700'
                }`}
              >
                {/* Track Thumbnail & Play Button */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-800 border border-neutral-700/60">
                    <img 
                      src={beat.coverArtUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120'} 
                      alt={beat.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                      isPlayingThis ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      {isPlayingThis ? (
                        <Pause size={18} className="text-white" />
                      ) : (
                        <Play size={18} className="text-white ml-0.5" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono text-purple-400 font-bold">#{index + 1}</span>
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                        {sanitizeTitle(beat.title)}
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
                      <span>{beat.bpm || 128} BPM</span>
                      <span className="text-neutral-600">•</span>
                      <span className="text-purple-300/80">{beat.key || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Snippet Badge / Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isThisCurrentSnippet ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Zap size={10} className="fill-amber-300" />
                      0:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-neutral-500 group-hover:text-neutral-300">
                      30s demo
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCheckoutSingleBeat(beat);
                    }}
                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all"
                    title="License Single Beat"
                  >
                    <ShoppingCart size={15} />
                  </button>

                  <button
                    onClick={(e) => handleDeleteBeat(beat, e)}
                    className="p-1.5 text-red-400/80 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 rounded-lg transition-all"
                    title={`Delete "${beat.title}"`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Pack Guarantee & Instant Download note */}
      <div className="mt-6 pt-5 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
        <div className="flex items-center gap-2 text-neutral-300">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Includes Full Commercial License, Untagged Master WAVs, and Trackout Stems for all {packTracks.length} beats.</span>
        </div>

        <button 
          onClick={() => setIsPackCheckoutOpen(true)}
          className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 group/link"
        >
          <span>Get Pack for ${price.toFixed(2)}</span>
          <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-0.5" />
        </button>
      </div>

      {/* Single Beat Checkout Modal */}
      {checkoutSingleBeat && (
        <CheckoutModal 
          beat={checkoutSingleBeat} 
          onClose={() => setCheckoutSingleBeat(null)}
          onSuccess={() => setCheckoutSingleBeat(null)}
        />
      )}

      {/* Pack Checkout Modal (Treating first track as pack proxy with bundle price) */}
      {isPackCheckoutOpen && (
        <CheckoutModal 
          beat={{
            ...packTracks[0],
            id: `pack-${Date.now()}`,
            title: `${packTitle} (${packTracks.length}-Beat Bundle)`,
            price: price,
            coverArtUrl: coverArtUrl
          }} 
          onClose={() => setIsPackCheckoutOpen(false)}
          onSuccess={() => setIsPackCheckoutOpen(false)}
        />
      )}

      {/* Free Beat Pack Download & Legal Agreement Modal */}
      <BeatPackFreeDownloadModal
        isOpen={isFreeDownloadOpen}
        pack={{
          id: `preview-pack-${Date.now()}`,
          title: packTitle,
          subtitle: subtitle,
          description: description,
          beatCount: packTracks.length,
          producer: 'PyrexSpinna',
          bpmKey: 'Multi BPM/Key',
          price: price,
          coverArt: coverArtUrl || '',
          beats: packTracks
        }}
        onClose={() => setIsFreeDownloadOpen(false)}
      />

      {/* Share Notification Toast */}
      {shareToastMessage && (
        <div className="fixed bottom-24 right-6 z-50 bg-[#12121c] border border-purple-500/50 rounded-2xl p-4 shadow-2xl shadow-purple-950/50 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 flex-shrink-0">
            <Share2 size={16} />
          </div>
          <div className="text-sm">
            <span className="font-bold text-white block">{shareToastMessage}</span>
            <span className="text-[11px] text-neutral-400">Share link copied for social media</span>
          </div>
        </div>
      )}
    </div>
  );
}
