import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { PublicVideoFeed } from '../components/PublicVideoFeed';
import { AdminVideoManager } from '../components/admin/AdminVideoManager';
import { ShoppingCart, Download, ThumbsUp, Share2, Music, ChevronLeft, ChevronRight, Disc, Sparkles, Play, Pause, Edit, Filter, SlidersHorizontal, ShieldCheck, Trash2, Activity, Scale } from 'lucide-react';
import { Beat } from '../types';
import { trackBeatPlay, trackBeatDownload, trackPurchase } from '../utils/gtag';
import CheckoutModal from '../components/CheckoutModal';
import CheckoutErrorBoundary from '../components/CheckoutErrorBoundary';
import SubscribeDownloadModal from '../components/SubscribeDownloadModal';
import { SocialUnlockModal } from '../components/SocialUnlockModal';
import BeatEditModal from '../components/BeatEditModal';
import PermanentPlayerCard from '../components/PermanentPlayerCard';
import HeaderBanner from '../components/HeaderBanner';
import BeatPackPreview from '../components/BeatPackPreview';
import AdvancedFeaturesSection from '../components/AdvancedFeaturesSection';
import { LicenseCalculator } from '../components/LicenseCalculator';
import { filterHumanBeats, isAIPlaceholderBeat, downloadAudioFile, getUniqueBeats } from '../lib/beatUtils';
import { getSafeKey } from '../lib/utils';
import { sanitizeTitle } from '../utils/sanitizeTitle';
import { generateAndDownloadLicense } from '../utils/contractGenerator';

export default function Storefront() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { beatId: pathBeatId } = useParams<{ beatId?: string }>();
  const { state, updateBeat, removeBeat, incrementAnalytics } = useStore();
  const { currentTrack, isPlaying: isGlobalPlaying, playTrack, togglePlay: toggleGlobalPlay } = useAudioPlayer();
  const [checkoutBeat, setCheckoutBeat] = useState<Beat | null>(null);
  const [downloadUnlockBeat, setDownloadUnlockBeat] = useState<Beat | null>(null);
  const [trackToEdit, setTrackToEdit] = useState<Beat | null>(null);

  const [bpmFilter, setBpmFilter] = useState<string>('All');
  const [keyFilter, setKeyFilter] = useState<string>('All');
  const [energyFilter, setEnergyFilter] = useState<string>('All');

  const isAdmin = localStorage.getItem('pyrex_admin_session') === 'true';

  // ABSOLUTE RENDER DEDUPLICATION
  const safeBeats = filterHumanBeats([...state.beats]);
  const deduplicatedBeats = Array.from(new Map(safeBeats.map(b => [(b.id || b.title).toString().toLowerCase().trim(), b])).values()) as Beat[];
  
  const allBeats = deduplicatedBeats.sort((a, b) => {
    const scoreA = (a.likes || 0) + (a.plays || 0);
    const scoreB = (b.likes || 0) + (b.plays || 0);
    return scoreB - scoreA;
  });

  const filteredBeatsList = allBeats.filter(beat => {
    if (bpmFilter !== 'All') {
      const [min, max] = bpmFilter.split('-').map(Number);
      if (max) {
        if (beat.bpm < min || beat.bpm > max) return false;
      } else {
        if (beat.bpm < min) return false;
      }
    }
    if (keyFilter !== 'All' && beat.key !== keyFilter) return false;
    if (energyFilter !== 'All' && beat.energyLevel !== energyFilter) return false;
    return true;
  });

  const permanentBeats = filteredBeatsList.filter(b => b.isPermanent);
  const regularBeats = filteredBeatsList.filter(b => !b.isPermanent);

  // 🔗 DEEP LINKING & PLAYER SYNC HANDLER
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryBeatId = params.get('beat');
    const queryTrackId = params.get('track');
    
    // Determine the target beat ID from query params or path params
    const targetBeatId = queryTrackId || queryBeatId || pathBeatId;
    
    if (targetBeatId && state.beats.length > 0) {
      const beat = state.beats.find(b => 
        b.id === targetBeatId || 
        b.title.toLowerCase().replace(/\s+/g, '-') === targetBeatId.toLowerCase()
      );

      if (beat) {
        // Handle checkout deep link if it was a 'beat' param
        if (queryBeatId && checkoutBeat?.id !== beat.id) {
          setCheckoutBeat(beat);
        }

        // Handle player sync (auto-play)
        if (currentTrack?.id !== beat.id) {
          playTrack(beat);
        }
      }
    }
  }, [location.search, pathBeatId, state.beats, checkoutBeat, currentTrack, playTrack]);

  const collectionScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollCollection = (direction: 'left' | 'right') => {
    if (collectionScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      collectionScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleTogglePlay = (beat: Beat) => {
    const isCurrentTrack = currentTrack?.id === beat.id;
    
    if (isCurrentTrack) {
      toggleGlobalPlay();
    } else {
      playTrack(beat);
      const isAdmin = localStorage.getItem('pyrex_admin_session') === 'true';
      const isProducerOwner = user?.email === 'pyrex@gmail.com' || isAdmin;
      if (!isProducerOwner) {
        updateBeat(beat.id, { plays: (beat.plays || 0) + 1 });
        trackBeatPlay(beat.title, beat.bpm || 128);
      }
      incrementAnalytics('totalPlays');

      // 🔗 URL SYNC: Update the browser address bar for deep sharing
      const newUrl = `${window.location.origin}${window.location.pathname}?track=${beat.id}`;
      window.history.pushState({ trackId: beat.id, title: beat.title }, '', newUrl);
    }
  };

  const handlePurchase = (beat: Beat) => {
    setCheckoutBeat(beat);
  };

  const handlePurchaseSuccess = (beat: Beat) => {
    updateBeat(beat.id, { purchases: (beat.purchases || 0) + 1, earnings: (beat.earnings || 0) + beat.price });
    
    // 📊 GLOBAL ANALYTICS UPDATE (Real-time distribution)
    incrementAnalytics('totalEarnings', beat.price);
    incrementAnalytics('platformFees', beat.price * 0.25); // 25% Platform fee
    
    trackPurchase(beat.price, 'Exclusive');

    if (beat.audioUrl) {
      downloadAudioFile(beat.audioUrl, beat.title);
    }
  };

  const handleFreeDownload = (beat: Beat) => {
    handleTogglePlay(beat);
    setDownloadUnlockBeat(beat);
  };

  const triggerDownload = (beat: Beat) => {
    if (isAIPlaceholderBeat(beat)) return;
    updateBeat(beat.id, { downloads: (beat.downloads || 0) + 1 });
    incrementAnalytics('downloads');
    trackBeatDownload(beat.title, 'wav');
    
    if (beat.audioUrl) {
      downloadAudioFile(beat.audioUrl, beat.title);
    }

    // Generate and download license
    const userEmail = localStorage.getItem('PYREX_USER_EMAIL') || 'Valued Fan';
    generateAndDownloadLicense(beat.title, userEmail);
  };

  const handleLike = (beat: Beat) => {
    updateBeat(beat.id, { likes: (beat.likes || 0) + 1 });
  };

  const handleShareBeat = (beat: Beat) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?beat=${beat.id}`;
    
    // Update URL without full navigation
    window.history.pushState({ beatId: beat.id }, '', shareUrl);
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert(`🔗 Share Link Copied: ${beat.title}`);
    }).catch(err => {
      console.error('Failed to copy share link:', err);
    });
  };

  const isPlaying = (beatId: string) => isGlobalPlaying && currentTrack?.id === beatId;

  // 🏆 MILESTONES CELEBRATION LOGIC
  const totalPlays = state.analytics.totalPlays || 0;
  const isCelebrationMode = totalPlays >= 100; // Trigger celebration at 100 plays (Bronze)
  
  const getMilestoneInfo = () => {
    if (totalPlays >= 10000) return { name: 'Diamond', color: '#b9f2ff', icon: '💎' };
    if (totalPlays >= 5000) return { name: 'Platinum', color: '#e5e4e2', icon: '💿' };
    if (totalPlays >= 1000) return { name: 'Gold', color: '#FFD700', icon: '🥇' };
    if (totalPlays >= 500) return { name: 'Silver', color: '#c0c0c0', icon: '🥈' };
    if (totalPlays >= 100) return { name: 'Bronze', color: '#cd7f32', icon: '🥉' };
    return null;
  };

  const milestone = getMilestoneInfo();

  return (
    <div className="space-y-12">
      <HeaderBanner />
      <div className="p-4 sm:p-8 space-y-12">
        {/* ⚡ FEATURED BEAT PACK PREVIEW (Continuous 30s Snippet Player) */}
        <BeatPackPreview 
          packTitle="PYREX GRAIL VAULT • VOL. 1"
          subtitle="Official 6-Track Producer Sound Pack"
          price={state.profile.marketingConfig?.defaultUnlimitedPrice || 79.99}
          originalValue={(state.profile.marketingConfig?.defaultUnlimitedPrice || 79.99) * 2.5}
        />

        {/* 🔍 ADVANCED FILTER BAR */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-neutral-900/50 backdrop-blur-xl border border-white/5 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 px-4 py-2 bg-neutral-950/40 rounded-xl border border-neutral-800 text-neutral-400">
          <SlidersHorizontal size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">Filters</span>
        </div>
        
        <div className="flex-1 flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
            <label className="text-[10px] font-bold text-neutral-500 uppercase px-1">BPM Range</label>
            <select 
              value={bpmFilter}
              onChange={(e) => setBpmFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm rounded-xl px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="All">All Tempos</option>
              <option value="0-80">Slow (0-80)</option>
              <option value="81-120">Mid (81-120)</option>
              <option value="121-160">Fast (121-160)</option>
              <option value="161">Hyper (161+)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
            <label className="text-[10px] font-bold text-neutral-500 uppercase px-1">Key</label>
            <select 
              value={keyFilter}
              onChange={(e) => setKeyFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm rounded-xl px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="All">All Keys</option>
              {Array.from(new Set(allBeats.map(b => b.key).filter(Boolean))).sort().map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
            <label className="text-[10px] font-bold text-neutral-500 uppercase px-1">Energy</label>
            <select 
              value={energyFilter}
              onChange={(e) => setEnergyFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm rounded-xl px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="All">All Energy</option>
              <option value="Low">Low (Chill)</option>
              <option value="Medium">Medium (Steady)</option>
              <option value="High">High (Hype)</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => {
            setBpmFilter('All');
            setKeyFilter('All');
            setEnergyFilter('All');
          }}
          className="px-4 py-2 text-xs font-bold text-neutral-500 hover:text-indigo-400 transition-colors uppercase tracking-widest"
        >
          Reset
        </button>
      </div>

      {/* 🏆 MILESTONE CELEBRATION BANNER */}
      {isCelebrationMode && milestone && (
        <div className="bg-gradient-to-r from-indigo-900 via-neutral-900 to-indigo-900 border-2 border-indigo-500/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(79,70,229,0.3)] animate-in slide-in-from-top duration-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-neutral-950 rounded-full border-4 border-indigo-500 flex items-center justify-center text-4xl shadow-lg transform hover:scale-110 transition-transform cursor-pointer">
                {milestone.icon}
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
                  {milestone.name} Milestone Unlocked!
                </h2>
                <p className="text-indigo-300 font-bold flex items-center gap-2 justify-center md:justify-start">
                  <Sparkles size={16} /> ALL BEATS ARE COMPLETELY FREE TO CELEBRATE <Sparkles size={16} />
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <div className="text-[10px] uppercase font-black tracking-[0.2em] text-neutral-400 mb-1">Total Lifetime Streams</div>
              <div className="text-4xl font-mono font-black text-white">{totalPlays.toLocaleString()}</div>
              <div className="mt-2 text-[11px] font-bold bg-indigo-500 text-white px-3 py-1 rounded-full animate-bounce shadow-lg">
                MUSIC AWARDS GROUP FULFILLMENT ACTIVE
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8 p-6 text-white bg-transparent min-h-screen">
        <div className="border border-blue-900/40 rounded-2xl p-6 bg-gray-950/40 backdrop-blur-md shadow-2xl">
          <h3 className="text-xl font-black mb-4 tracking-wide text-blue-400">FEATURED BROADCASTS</h3>
          <PublicVideoFeed />
        </div>
      </div>

      {/* 🛡️ PERMANENT VAULT: FEATURED SECTION */}
      {permanentBeats.length > 0 && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center gap-3 mb-8 border-b border-neutral-800 pb-4">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
               <Sparkles size={20} />
             </div>
             <div>
               <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Permanent Vault</h2>
               <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-1">Locked Assets • Guaranteed Persistence</p>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {permanentBeats.map((track, index) => (
              <PermanentPlayerCard 
                key={getSafeKey(track, index, 'permanent-beat')} 
                beat={track} 
              />
            ))}
          </div>
        </section>
      )}

      {/* 🟢 CIRCULAR COLLECTION SHOWCASE SECTION */}
      {regularBeats.length > 0 && (
        <section className="bg-neutral-950/80 rounded-2xl p-6 border border-neutral-800/80 shadow-2xl relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-indigo-400" />
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Featured Beat Collections</h2>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Circular beat showcase — click the centered play controls to listen
              </p>
            </div>

            {/* Scroll Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => scrollCollection('left')}
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition-all active:scale-95"
                title="Scroll Left"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scrollCollection('right')}
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition-all active:scale-95"
                title="Scroll Right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Horizontal Scrolling Circular Cards */}
          <div 
            ref={collectionScrollRef}
            className="flex overflow-x-auto gap-6 pb-4 pt-2 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent scroll-smooth snap-x"
          >
            {regularBeats.map((track, index) => (
              <div 
                key={getSafeKey(track, index, 'circular-beat')}
                className="flex-shrink-0 snap-start flex flex-col items-center group relative"
              >
                  {/* CIRCULAR ARTWORK CONTAINER */}
                  <div className="relative w-52 h-52 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-2xl border-2 border-neutral-800 group-hover:border-indigo-500 transition-all duration-300 transform group-hover:scale-105">
                    { (track.coverArtUrl || track.artwork || track.coverUrl || track.imageUrl) ? (
                      <img 
                        src={track.artwork || track.coverUrl || track.imageUrl || track.coverArtUrl} 
                        alt={track.title || "Custom Beat Artwork"} 
                        className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-neutral-900 to-black flex items-center justify-center text-neutral-600 rounded-full">
                        <Music size={44} />
                      </div>
                    )}

                    {/* CENTER OVERLAY: PLAY BUTTON + BEAT TITLE + BPM */}
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/75 transition-colors duration-300 rounded-full flex flex-col items-center justify-center p-4 text-center select-none backdrop-blur-[2px]">
                      {/* Play Button in the middle */}
                      <button
                        onClick={() => handleTogglePlay(track)}
                        className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 mb-2 group-hover:scale-110"
                        title={isPlaying(track.id) ? "Pause" : "Play"}
                      >
                        {isPlaying(track.id) ? (
                          <Pause size={22} className="fill-current text-white" />
                        ) : (
                          <Play size={22} className="fill-current text-white ml-0.5" />
                        )}
                      </button>

                      {/* Name of the beat in the middle */}
                      <h4 className="font-semibold text-white">
                        {track.title || "Untitled Track"}
                      </h4>

                      {/* BPM in the middle */}
                      <span className="text-[11px] font-bold text-indigo-300 mt-1 bg-black/80 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                        {track.bpm || 120} BPM
                      </span>
                    </div>
                  </div>

                  {/* Producer & Purchase Actions underneath the circle */}
                  <div className="mt-3 text-center flex flex-col items-center">
                    <p className="text-xs text-neutral-400 font-medium truncate max-w-[180px]">{track.producer}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => (isCelebrationMode || track.freeDownload?.enabled) ? handleFreeDownload(track) : handlePurchase(track)} 
                        className="transition-all active:scale-95"
                      >
                        <div className={`${(isCelebrationMode || track.freeDownload?.enabled) ? '!bg-emerald-600/20 !border-emerald-500/30 !text-emerald-400' : ''} beat-price-tag gap-1.5`}>
                          {(isCelebrationMode || track.freeDownload?.enabled) ? <Download size={12} /> : <ShoppingCart size={12} />}
                          <span>{(isCelebrationMode || track.freeDownload?.enabled) ? 'FREE DOWNLOAD (.M4A)' : `$${track.price ? Number(track.price).toFixed(2) : '49.99'}`}</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => handleShareBeat(track)}
                        className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-indigo-500 flex items-center justify-center transition-all active:scale-90"
                        title="Share Beat"
                      >
                        <Share2 size={12} />
                      </button>
                      {isAdmin && (
                        <>
                          <button 
                            onClick={() => setTrackToEdit(track)}
                            className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-indigo-400 hover:border-indigo-500 flex items-center justify-center transition-all active:scale-90"
                            title="Edit Beat"
                          >
                            <Edit size={12} />
                          </button>
                          <button 
                            onClick={async () => {
                              if (window.confirm(`Are you sure you want to permanently delete "${track.title}"?`)) {
                                await removeBeat(track.id);
                              }
                            }}
                            className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-rose-500 hover:border-rose-500 flex items-center justify-center transition-all active:scale-90"
                            title="Delete Beat"
                            id={`storefront-circular-delete-${track.id}`}
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </section>
      )}

      {/* 🔴 ADVANCED FEATURES HUB (AI, SUBS, MERCH, TOUR) */}
      <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
        <AdvancedFeaturesSection />
      </section>

      {/* TRENDING TRACKS GRID SECTION */}
      <div>
        <h1 className="text-3xl font-bold mb-8">Trending tracks</h1>
        {regularBeats.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl bg-gray-950/50 my-6">
            <p className="text-sm font-mono text-gray-400 uppercase tracking-widest">No beats available yet.</p>
            <p className="text-xs text-gray-600 mt-2">Upload your first .m4a track in the uploader!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {regularBeats.map((track, index) => (
              <div 
                key={getSafeKey(track, index, 'trending-beat')} 
                className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 group"
              >
                  <div className="relative aspect-square">
                    { (track.artwork || track.coverUrl || track.imageUrl || track.coverArtUrl) ? (
                      <img 
                        src={track.artwork || track.coverUrl || track.imageUrl || track.coverArtUrl} 
                        alt={track.title || "Custom Beat Artwork"} 
                        className="w-full h-full object-cover rounded-md" 
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500"><Music size={32} /></div>
                    )}
                    <button 
                      onClick={() => handleTogglePlay(track)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {isPlaying(track.id) ? <Pause size={48} className="text-white" /> : <Play size={48} className="text-white" />}
                    </button>
                  
                  {/* Overlay stats */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/80">
                      <span className="flex items-center gap-1"><Play size={10} /> {track.plays || 0}</span>
                      <span className="flex items-center gap-1"><ThumbsUp size={10} /> {track.likes || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex flex-col flex-1 min-w-0">
                      <h4 className="font-semibold text-white">
                        {track.title || "Untitled Track"}
                        {track.isPermanent && (
                          <span className="bg-indigo-500/20 text-indigo-400 text-[9px] px-1.5 py-0.5 rounded border border-indigo-500/30 font-bold tracking-tighter ml-2">PERMANENT</span>
                        )}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-[9px] font-bold text-neutral-500 uppercase tracking-tighter">
                          <Activity size={10} className="text-purple-500" />
                          {track.bpm} BPM
                        </div>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-neutral-500 uppercase tracking-tighter">
                          <Music size={10} className="text-blue-500" />
                          {track.key}
                        </div>
                        {track.camelotCode && (
                          <div className="flex items-center gap-1 text-[9px] font-black text-indigo-400 uppercase tracking-tighter bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
                            {track.camelotCode}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {track.isAIFree && (
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[8px] font-black uppercase tracking-tighter">
                            <ShieldCheck size={8} /> AI-FREE VERIFIED
                          </div>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleLike(track)}
                      className="text-neutral-500 hover:text-indigo-400 transition-colors ml-2"
                    >
                      <ThumbsUp size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-neutral-400 mb-4 truncate">{track.producer}</p>
                  
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => (isCelebrationMode || track.freeDownload?.enabled) ? handleFreeDownload(track) : handlePurchase(track)} 
                      className="transition-all active:scale-95"
                    >
                      <div className={`${(isCelebrationMode || track.freeDownload?.enabled) ? '!bg-emerald-600/20 !border-emerald-500/30 !text-emerald-400' : ''} beat-price-tag gap-1`}>
                        {(isCelebrationMode || track.freeDownload?.enabled) ? <Download size={14} /> : <ShoppingCart size={14} />}
                        <span>{(isCelebrationMode || track.freeDownload?.enabled) ? 'FREE DOWNLOAD (TAGGED .M4A)' : `$${track.price ? Number(track.price).toFixed(2) : '49.99'}`}</span>
                      </div>
                    </button>
                    <div className="flex items-center gap-3">
                      {(track.freeDownload?.enabled || isCelebrationMode) && (
                        <button 
                          onClick={() => handleFreeDownload(track)} 
                          className="text-neutral-400 hover:text-white transition-colors"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleShareBeat(track)}
                        className="text-neutral-400 hover:text-white transition-colors"
                        title="Share Beat"
                      >
                        <Share2 size={16} />
                      </button>
                      {isAdmin && (
                        <>
                          <button 
                            onClick={() => setTrackToEdit(track)}
                            className="text-neutral-400 hover:text-indigo-400 transition-colors"
                            title="Edit Beat"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={async () => {
                              if (window.confirm(`Are you sure you want to permanently delete "${track.title}"?`)) {
                                await removeBeat(track.id);
                              }
                            }}
                            className="text-neutral-400 hover:text-rose-500 transition-colors"
                            title="Delete Beat"
                            id={`storefront-trending-delete-${track.id}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* License Matching Tool */}
      <section className="py-20 border-t border-white/5">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-widest">
              <Scale size={12} /> Legal Optimizer
            </div>
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Which license <br /> <span className="text-purple-500">do you need?</span></h2>
            <p className="text-neutral-400 text-lg leading-relaxed max-w-xl">
              Don't overpay for rights you don't need, and don't risk your career with insufficient coverage. Use our interactive calculator to find your perfect match.
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <LicenseCalculator />
          </div>
        </div>
      </section>

      <AnimatePresence>
        {checkoutBeat && (
          <CheckoutErrorBoundary>
            <CheckoutModal 
              onClose={() => {
                setCheckoutBeat(null);
                // Revert URL when closing
                if (new URLSearchParams(window.location.search).has('beat')) {
                  window.history.pushState({}, '', window.location.pathname);
                }
              }} 
              beat={checkoutBeat} 
              onSuccess={handlePurchaseSuccess} 
            />
          </CheckoutErrorBoundary>
        )}
      </AnimatePresence>

      <SocialUnlockModal 
        isOpen={!!downloadUnlockBeat}
        onClose={() => setDownloadUnlockBeat(null)}
        beat={downloadUnlockBeat}
      />

      {trackToEdit && (
        <BeatEditModal 
          beat={trackToEdit}
          onClose={() => setTrackToEdit(null)}
          onSave={async (id, updates) => {
            await updateBeat(id, updates);
          }}
        />
      )}
      </div>
    </div>
  );
}

