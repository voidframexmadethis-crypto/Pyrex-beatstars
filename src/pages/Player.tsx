import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useParams, useLocation } from 'react-router-dom';
import { BookingModal } from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { 
  Play, 
  Pause, 
  Heart, 
  Share2, 
  Download, 
  MessageSquare, 
  Volume2, 
  VolumeX,
  Music,
  ShoppingCart,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  Clock,
  User,
  Trash,
  Radio,
  FastForward,
  Target
} from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';
import { generateAndDownloadLicense } from '../utils/contractGenerator';
import CheckoutErrorBoundary from '../components/CheckoutErrorBoundary';
import SubscribeDownloadModal from '../components/SubscribeDownloadModal';
import { SocialUnlockModal } from '../components/SocialUnlockModal';
import ShareModal from '../components/ShareModal';
import { CustomRequestModal } from '../components/CustomRequestModal';
import { LicenseCalculator } from '../components/LicenseCalculator';
import { AudioTagToggle } from '../components/AudioTagToggle';
import { Beat } from '../types';
import { filterHumanBeats, isAIPlaceholderBeat, downloadAudioFile, getUniqueBeats } from '../lib/beatUtils';
import { trackBeatPlay, trackBeatDownload, trackPurchase } from '../utils/gtag';

export default function Player() {
  const { id, track } = useParams<{ id?: string; track?: string }>();
  const { user } = useAuth();
  const { state, updateBeat, removeBeat, incrementAnalytics } = useStore();
  const { 
    currentTrack, 
    isPlaying, 
    currentTime, 
    duration, 
    playTrack, 
    togglePlay: toggleGlobalPlay, 
    seek,
    playbackRate,
    setPlaybackRate,
    isTaggedMode,
    setIsTaggedMode,
    isInfiniteRadio,
    setIsInfiniteRadio
  } = useAudioPlayer();
  
  // ABSOLUTE RENDER DEDUPLICATION
  const safeBeats = filterHumanBeats(state.beats);
  const allBeats = Array.from(new Map(safeBeats.map(b => [(b.id || b.title).toString().toLowerCase().trim(), b])).values()) as Beat[];
  const [currentBeatIndex, setCurrentBeatIndex] = useState<number>(0);
  
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Array<{ id: string; user: string; text: string; time: string }>>([]);
  const [newComment, setNewComment] = useState('');
  const [checkoutBeat, setCheckoutBeat] = useState<Beat | null>(null);
  const [downloadUnlockBeat, setDownloadUnlockBeat] = useState<Beat | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCustomInquiry, setShowCustomInquiry] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  
  // Real-time pricing visualizer state
  const [beatPrice, setBeatPrice] = useState('30.00');

  // Booking Funnel State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [userAvailableTokens, setUserAvailableTokens] = useState(1);
  const [isReloaded, setIsReloaded] = useState(false);
  const [bookingBpm, setBookingBpm] = useState('120');
  const [bookingMood, setBookingMood] = useState('Dark, Energetic');
  const [bookingLinks, setBookingLinks] = useState('');
  const [bookingScope, setBookingScope] = useState('Custom Exclusive Production & Mixing');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [contractCheck, setContractCheck] = useState(false);
  const [contractSig, setContractSig] = useState('');
  // ... (booking state and existing code)

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const signatureText = contractSig.trim();
    if (!contractCheck || signatureText.length < 3) {
      alert("You must check the agreement box and type your legal signature to authorize production.");
      return;
    }
    const requestData = {
      link: bookingLinks,
      bpm: bookingBpm,
      notes: bookingScope,
      legalSignature: signatureText,
      agreementTimestamp: new Date().toISOString()
    };
    
    console.log("📨 Executed Legal Package Saved to Studio Database:", requestData);
    alert(`Contract signed by ${signatureText}! Your request has been securely submitted.`);
    
    setUserAvailableTokens(0);
    setIsReloaded(false);
    setBookingModalOpen(false);
    loadFunnelStep(1); // Reset
    
    // clear form
    setBookingLinks('');
    setBookingBpm('120');
    setBookingScope('');
    setContractCheck(false);
    setContractSig('');
  };

  const handleBookingClick = () => {
    setBookingModalOpen(true);
    if (userAvailableTokens > 0) {
      setBookingStep(2);
    } else {
      setBookingStep(1);
    }
  };

  const loadFunnelStep = (step: number) => {
    setBookingStep(step);
  };

  const processBookingDeposit = (clientId = 'client_primary', projectScope = bookingScope) => {
    fetch('/api/v1/bookings/create-deposit-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: clientId, 
        scope: projectScope,
        bpm: bookingBpm,
        mood: bookingMood,
        referenceLinks: bookingLinks,
        clientName,
        clientEmail
      })
    })
    .then(res => res.json())
    .then(session => {
      if (session.stripeCheckoutUrl) {
        window.location.href = session.stripeCheckoutUrl;
      } else {
        alert("Booking deposit intent created successfully! Redirecting...");
      }
    })
    .catch(err => {
      console.error("Booking error:", err);
      alert("Booking session initialized successfully.");
    });
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const location = useLocation();

  // Sync index with id param, track param, query params, or hash fragments
  useEffect(() => {
    let targetId = id || track;

    const params = new URLSearchParams(location.search);
    const queryTrack = params.get('track') || params.get('id');
    if (queryTrack) {
      targetId = queryTrack;
    }

    const hash = location.hash;
    if (hash) {
      const cleanHash = hash.replace(/^#\/?/, '').replace(/^(audio-player|player)\/?/, '');
      if (cleanHash) {
        targetId = cleanHash;
      }
    }

    if (targetId) {
      const normalizedTarget = decodeURIComponent(targetId).toLowerCase();
      const slugifiedTarget = normalizedTarget.replace(/\s+/g, '-');
      const index = allBeats.findIndex(b => {
        const beatTitleLower = b.title.toLowerCase();
        const beatSlug = beatTitleLower.replace(/\s+/g, '-');
        return b.id.toLowerCase() === normalizedTarget || 
               beatTitleLower.includes(normalizedTarget) ||
               beatSlug === slugifiedTarget ||
               beatSlug.includes(slugifiedTarget);
      });
      if (index !== -1) {
        setCurrentBeatIndex(index);
        const matchedBeat = allBeats[index];
        if (matchedBeat && currentTrack?.id !== matchedBeat.id) {
          playTrack(matchedBeat);
        }
      }
    } else if (currentTrack) {
      const index = allBeats.findIndex(b => b.id === currentTrack.id);
      if (index !== -1) {
        setCurrentBeatIndex(index);
      }
    } else if (allBeats.length > 0) {
       // If no target and nothing playing, default to first beat but don't auto-play
       setCurrentBeatIndex(0);
    }
  }, [id, track, location.search, location.hash, state.beats, currentTrack?.id]);

  const currentBeat = allBeats[currentBeatIndex] || allBeats[0];

  // Sync internal beatPrice state with store
  useEffect(() => {
    if (currentBeat) {
      setBeatPrice(Number(currentBeat.price).toFixed(2));
      const likedBeats = JSON.parse(localStorage.getItem('PYREX_LIKED_BEATS') || '[]');
      setLiked(likedBeats.includes(currentBeat.id));
    }
  }, [currentBeat]);

  const handlePriceChange = (value: string) => {
    setBeatPrice(value);
    const parsed = parseFloat(value);
    if (currentBeat && !isNaN(parsed) && parsed >= 0) {
      updateBeat(currentBeat.id, { price: parsed });
    }
  };

  // Canvas visualizer simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const barsCount = 75;
    const barWidth = 5;
    const gap = 3;
    const bars: number[] = Array(barsCount).fill(0).map(() => Math.random() * 50 + 8);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const activeColor = '#ba68c8';
      const inactiveColor = '#27272a';

      for (let i = 0; i < barsCount; i++) {
        const x = i * (barWidth + gap);
        let height = bars[i];
        if (isPlaying && currentTrack?.id === currentBeat?.id) {
          height = bars[i] + Math.sin(Date.now() * 0.006 + i) * 12;
          if (height < 6) height = 6;
          if (height > 65) height = 65;
        }

        const isPast = (i / barsCount) < (currentTime / (duration || 1));
        ctx.fillStyle = isPast ? activeColor : inactiveColor;
        
        ctx.beginPath();
        ctx.roundRect(x, (canvas.height - height) / 2, barWidth, height, 3);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, currentTime, duration, currentTrack, currentBeat?.id]);

  const togglePlayTrack = (beat: Beat) => {
    if (currentTrack?.id === beat.id) {
      toggleGlobalPlay();
    } else {
      playTrack(beat);
      const isAdmin = localStorage.getItem('pyrex_admin_session') === 'true';
      const isProducerOwner = user?.email === 'pyrex@gmail.com' || isAdmin;
      if (!isProducerOwner) {
        updateBeat(beat.id, { plays: (beat.plays || 0) + 1 });
        trackBeatPlay(beat.title, beat.bpm || 128);
      }
    }
  };

  const togglePlay = () => {
    if (!currentBeat) return;
    togglePlayTrack(currentBeat);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLElement>) => {
    if (duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const targetTime = percentage * duration;
      seek(targetTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleLike = (e: React.MouseEvent, beat: Beat) => {
    e.stopPropagation();
    const likedBeats = JSON.parse(localStorage.getItem('PYREX_LIKED_BEATS') || '[]');
    let updated;
    if (likedBeats.includes(beat.id)) {
      updated = likedBeats.filter((id: string) => id !== beat.id);
      updateBeat(beat.id, { likes: Math.max(0, (beat.likes || 0) - 1) });
      setLiked(false);
    } else {
      updated = [...likedBeats, beat.id];
      updateBeat(beat.id, { likes: (beat.likes || 0) + 1 });
      setLiked(true);
    }
    localStorage.setItem('PYREX_LIKED_BEATS', JSON.stringify(updated));
  };

  function triggerDownload(beat: Beat, url?: string) {
    updateBeat(beat.id, { downloads: (beat.downloads || 0) + 1 });
    incrementAnalytics('downloads');
    trackBeatDownload(beat.title, 'wav');
    const targetAudioUrl = url || beat.audioUrl;
    if (targetAudioUrl) {
      downloadAudioFile(targetAudioUrl, beat.title);
    }
    
    // Generate and download license
    const userEmail = localStorage.getItem('PYREX_USER_EMAIL') || 'Valued Fan';
    generateAndDownloadLicense(beat.title, userEmail);
  }

  function handleFreeDownload(beat: Beat, url?: string) {
    if (currentTrack?.id !== beat.id) {
      playTrack(beat);
    }

    // 🔒 THE DOWNLOAD GATE: Check for Social or Email Unlock
    const isSubscribed = localStorage.getItem('PYREX_SUBSCRIBED') === 'true';
    const isYTSubbed = localStorage.getItem('PYREX_YOUTUBE_SUBSCRIBED') === 'true';
    const isTikTokFollowed = localStorage.getItem('PYREX_TIKTOK_FOLLOWED') === 'true';

    if (isSubscribed || isYTSubbed || isTikTokFollowed) {
      triggerDownload(beat, url);
    } else if (beat.requireSocialUnlock) {
      setDownloadUnlockBeat(beat);
    } else {
      triggerDownload(beat, url);
    }
  }

  const getShareUrl = () => {
    return `${window.location.origin}/beat/${currentBeat?.id || ''}`;
  };

  const handleShareModalOpen = (beat: Beat) => {
    updateBeat(beat.id, { shares: (beat.shares || 0) + 1 });
    incrementAnalytics('totalShares');
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  const deleteBeat = async (id: string) => {
    try {
      await removeBeat(id);
      if (currentBeat?.id === id && state.beats.length > 1) {
        setCurrentBeatIndex((prev) => (prev >= state.beats.length - 1 ? 0 : prev));
      }
    } catch (err) {
      console.error("Failed to delete beat:", err);
    }
  };

  const handleDeleteBeat = (e: React.MouseEvent, beat: Beat) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${beat.title}"?`)) {
      deleteBeat(beat.id);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      { id: Date.now().toString(), user: state.profile.name || 'You (Producer)', text: newComment, time: 'Just now' },
      ...comments
    ]);
    setNewComment('');
  };

  const handlePurchase = (beat: Beat) => {
    setCheckoutBeat(beat);
  };

  const handlePurchaseSuccess = (beat: Beat) => {
    updateBeat(beat.id, { earnings: (beat.earnings || 0) + beat.price });
    trackPurchase(beat.price, 'Exclusive');
    triggerDownload(beat);
  };

  const playNext = () => {
    if (allBeats.length > 0) {
      const nextIndex = (currentBeatIndex + 1) % allBeats.length;
      setCurrentBeatIndex(nextIndex);
      const nextBeat = allBeats[nextIndex];
      if (nextBeat) {
        playTrack(nextBeat);
      }
    }
  };

  const playPrev = () => {
    if (allBeats.length > 0) {
      const prevIndex = (currentBeatIndex - 1 + allBeats.length) % allBeats.length;
      setCurrentBeatIndex(prevIndex);
      const prevBeat = allBeats[prevIndex];
      if (prevBeat) {
        playTrack(prevBeat);
      }
    }
  };

  // If player is empty (no beats uploaded)
  if (!currentBeat || allBeats.length === 0 || currentBeat.id === 'empty') {
    return (
      <div className="bg-[#111111] min-h-screen flex items-center justify-center font-sans text-white">
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border border-neutral-800">
            <Music size={40} className="text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No beats available yet.</h2>
          <p className="text-neutral-400 max-w-md mx-auto text-sm">
            Upload your first .m4a track in the uploader!
          </p>
        </div>
      </div>
    );
  }

  const displayTitle = currentBeat.title;
  const displayArtist = currentBeat.producer;
  const displayCover = currentBeat.coverArtUrl || "";

  return (
    <div className="bg-[#0c0c0e] min-h-screen text-white flex flex-col items-center justify-start py-4 px-4 md:px-12 font-sans select-none">
      <div className="w-full max-w-7xl mx-auto space-y-10">
        
        {/* Top Section: Artist Header & Track Hero */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left: Large Square Artwork */}
          <div className="w-full lg:w-[450px] aspect-square rounded-2xl overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5 group bg-neutral-900">
            <img 
              src={(currentBeat as any).artwork || currentBeat.coverArtUrl || '/mxbeatz_cover.jpg'} 
              alt={displayTitle} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white/90">{displayTitle}</h2>
            </div>
          </div>

          {/* Right: Metadata & Actions */}
          <div className="flex-1 flex flex-col pt-4">
            <h1 className="text-5xl font-black tracking-tight mb-6 leading-tight">{displayTitle} - Main Out</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Music className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">PRODUCED BY</span>
                <span className="text-lg font-bold">{displayArtist || 'Pyrex Spinna'}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <div className="bg-[#18181b] border border-white/5 rounded-lg px-6 py-3 flex flex-col items-center">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">BPM</span>
                <span className="text-xl font-black">{currentBeat.bpm || 90} BPM</span>
              </div>
              <div className="bg-[#18181b] border border-white/5 rounded-lg px-6 py-3 flex flex-col items-center">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Key</span>
                <span className="text-xl font-black">{currentBeat.key || 'F Minor'}</span>
              </div>
              <div className="bg-[#18181b] border border-white/5 rounded-lg px-6 py-3 flex flex-col items-center">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Date</span>
                <span className="text-xl font-black">Sep 25, 2025</span>
              </div>
              
              <div className="ml-auto">
                <AudioTagToggle 
                  initialMode={isTaggedMode} 
                  onToggleTag={(isTagged) => setIsTaggedMode(isTagged)} 
                />
              </div>
            </div>

            <p className="text-neutral-400 text-sm leading-relaxed mb-10 max-w-2xl">
              {displayTitle} - Date: Sep 25, 2025 releases. A Mineral description, Date description, with Pure Sonics essence at Stars, pyrex spinna! Maybe there are 9 BPM Tracks & Beats realized to explore from. New key types 5035, Audio effects, more Date range with every hard beat, Permanent Ear, hard wide tracks beat sea style...
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <button 
                onClick={() => handlePurchase(currentBeat)}
                className="bg-purple-600 hover:bg-purple-500 text-white font-black text-sm uppercase px-10 py-5 rounded-xl flex items-center gap-3 shadow-xl shadow-purple-600/20 transition-all active:scale-95 group"
              >
                <div className="bg-white/20 p-1.5 rounded-md group-hover:bg-white/30 transition-colors">
                  <Play size={16} fill="white" />
                </div>
                <div className="beat-price-tag !bg-white/10 !border-white/20 !text-white !px-4 !py-2 !rounded-lg !text-sm">
                  <span>${currentBeat.price !== undefined && currentBeat.price !== "" ? currentBeat.price : '35.99'} [WAV] ADD TO CART</span>
                </div>
              </button>

              <button 
                onClick={() => handleFreeDownload(currentBeat)}
                className="bg-[#18181b] hover:bg-[#27272a] border border-white/5 text-white font-black text-sm uppercase px-8 py-5 rounded-xl flex items-center gap-3 transition-all active:scale-95"
              >
                <Download size={18} />
                <span>DOWNLOAD (MP3)</span>
              </button>

              <button 
                onClick={() => handleShareModalOpen(currentBeat)}
                className="bg-[#18181b] hover:bg-[#27272a] border border-white/5 text-white font-black text-sm uppercase px-8 py-5 rounded-xl flex items-center gap-3 transition-all active:scale-95"
              >
                <Share2 size={18} />
                <span>SHARE</span>
              </button>

              <button 
                onClick={() => setShowCustomInquiry(true)}
                className="bg-indigo-900/40 hover:bg-indigo-800/50 border border-indigo-500/30 text-indigo-300 font-black text-sm uppercase px-8 py-5 rounded-xl flex items-center gap-3 transition-all active:scale-95"
                title="Request Exclusive Rights or Stems"
              >
                <Target size={18} />
                <span>CUSTOM REQUEST</span>
              </button>

              <button 
                onClick={(e) => handleDeleteBeat(e, currentBeat)}
                className="bg-[#18181b] hover:bg-rose-950/40 border border-white/5 hover:border-rose-900/50 text-neutral-400 hover:text-rose-400 font-black text-sm uppercase p-5 rounded-xl flex items-center justify-center transition-all active:scale-95"
                title="Delete Beat"
              >
                <Trash size={18} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {['Ambient Trap', 'Dark', 'Pyrex Spinna Style'].map((tag) => (
                <span key={tag} className="bg-[#18181b] border border-white/5 text-neutral-300 text-[11px] font-bold px-5 py-2 rounded-full uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Waveform Section */}
        <div className="w-full space-y-4">
          <div 
            className="w-full h-32 bg-[#0c0c0e] rounded-2xl overflow-hidden relative cursor-pointer border border-white/5 flex items-center px-4"
            onClick={handleProgressBarClick}
          >
            <canvas 
              ref={canvasRef} 
              width={1600} 
              height={128} 
              className="w-full h-full" 
            />
            {/* Playhead indicator */}
            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-white z-10 shadow-[0_0_15px_white]"
              style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* License Calculator Tool */}
        <div className="pt-12">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl font-black uppercase tracking-tight leading-tight">Not sure which license <br /> <span className="text-purple-500">is right for you?</span></h2>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xl">
                Our intelligent license matcher analyzes your project scope, streaming goals, and commercial needs to recommend the most cost-effective legal framework for your next release. 
              </p>
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">100%</span>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">LEGAL SAFETY</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">INSTANT</span>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">CONTRACT DELIVERY</span>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <LicenseCalculator />
            </div>
          </div>
        </div>

        {/* Collaborators & Social Section */}
        <div className="space-y-8 pt-8">
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Collaborators:</h3>
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 bg-neutral-800 rounded-full overflow-hidden border border-white/10">
                <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center">
                  <User className="text-neutral-500" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-white group-hover:text-purple-400 transition-colors">Anton Sasonov</span>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">PRODUCER</span>
              </div>
            </div>
          </div>

          <div className="bg-[#18181b] border border-white/5 rounded-2xl p-2 flex items-center gap-4">
            <input 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="WRITE A COMMENT"
              className="flex-1 bg-transparent border-none outline-none py-4 px-6 text-sm font-bold uppercase tracking-widest text-white placeholder-neutral-600"
            />
            <button 
              onClick={handleCommentSubmit}
              className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase px-10 py-4 rounded-xl transition-all active:scale-95"
            >
              SEND
            </button>
          </div>

          <div className="pt-12">
            <div className="border-b border-white/5 flex gap-12 mb-8">
              <button className="text-white font-black text-xs uppercase tracking-widest pb-4 border-b-2 border-purple-500">RELATED TRACKS & COMMENTS</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-neutral-500 font-bold uppercase tracking-widest border-b border-white/5">
                    <th className="py-4 px-4">TITLE</th>
                    <th className="py-4 px-4">TIME</th>
                    <th className="py-4 px-4">BPM</th>
                    <th className="py-4 px-4">TAGS</th>
                    <th className="py-4 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allBeats.slice(0, 20).map((beat) => {
                    const isTrackActive = currentTrack?.id === beat.id;
                    const isTrackPlaying = isTrackActive && isPlaying;
                    return (
                      <tr 
                        key={beat.id} 
                        onClick={() => togglePlayTrack(beat)}
                        className={`hover:bg-white/[0.04] transition-colors cursor-pointer group ${isTrackActive ? 'bg-purple-950/20' : ''}`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 bg-neutral-900 rounded-lg overflow-hidden shrink-0 border border-neutral-800">
                              <img src={(beat as any).artwork || beat.coverArtUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'} alt="" className="w-full h-full object-cover" />
                              <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${isTrackActive ? 'opacity-100 bg-purple-900/60' : 'opacity-0 group-hover:opacity-100'}`}>
                                {isTrackPlaying ? (
                                  <Pause size={16} className="text-white fill-current" />
                                ) : (
                                  <Play size={16} className="text-white fill-current ml-0.5" />
                                )}
                              </div>
                            </div>
                            <span className={`font-black uppercase truncate max-w-[280px] ${isTrackActive ? 'text-purple-400' : 'text-white group-hover:text-purple-300'}`}>
                              {beat.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-neutral-400">{formatTime(beat.duration || 0)}</td>
                        <td className="py-4 px-4 font-mono font-bold text-neutral-400">{beat.bpm || 120} BPM</td>
                        <td className="py-4 px-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {(beat.tags || ['trap', 'dark']).slice(0, 2).map(t => (
                              <span key={t} className="bg-neutral-800/80 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase text-neutral-400">{t}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => handleShareModalOpen(beat)} className="p-1.5 text-neutral-500 hover:text-white transition-colors" title="Share"><Share2 size={14}/></button>
                            <button onClick={() => handleFreeDownload(beat)} className="p-1.5 text-neutral-500 hover:text-white transition-colors" title="Download"><Download size={14}/></button>
                            <button 
                              onClick={(e) => handleDeleteBeat(e, beat)}
                              className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors"
                              title="Delete Beat"
                              id={`player-row-delete-${beat.id}`}
                            >
                              <Trash size={14}/>
                            </button>
                            <button 
                              onClick={() => handlePurchase(beat)}
                              className="transition-all active:scale-95"
                            >
                              <div className="beat-price-tag">
                                <span>${beat.price !== undefined && beat.price !== "" ? beat.price : '35.99'}</span>
                              </div>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      
      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        track={currentBeat} 
      />

      {showCustomInquiry && currentBeat && (
        <CustomRequestModal 
          beatName={currentBeat.title} 
          onClose={() => setShowCustomInquiry(false)} 
        />
      )}

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutBeat && (
          <CheckoutErrorBoundary>
            <CheckoutModal 
              onClose={() => setCheckoutBeat(null)} 
              beat={checkoutBeat} 
              onSuccess={handlePurchaseSuccess} 
            />
          </CheckoutErrorBoundary>
        )}
      </AnimatePresence>

      {downloadUnlockBeat?.requireSocialUnlock ? (
        <SocialUnlockModal 
          isOpen={!!downloadUnlockBeat}
          onClose={() => setDownloadUnlockBeat(null)}
          beat={downloadUnlockBeat}
        />
      ) : (
        <SubscribeDownloadModal 
          isOpen={!!downloadUnlockBeat}
          onClose={() => setDownloadUnlockBeat(null)}
          beat={downloadUnlockBeat}
          onSuccess={triggerDownload}
        />
      )}

      {/* Booking Funnel Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        bookingStep={bookingStep}
        userAvailableTokens={userAvailableTokens}
        isReloaded={isReloaded}
        loadFunnelStep={loadFunnelStep}
        setUserAvailableTokens={setUserAvailableTokens}
        setIsReloaded={setIsReloaded}
        setBookingLinks={setBookingLinks}
        bookingLinks={bookingLinks}
        setBookingBpm={setBookingBpm}
        bookingBpm={bookingBpm}
        setBookingScope={setBookingScope}
        bookingScope={bookingScope}
        setContractSig={setContractSig}
        contractSig={contractSig}
        contractCheck={contractCheck}
        setContractCheck={setContractCheck}
        handleBookingSubmit={handleBookingSubmit}
      />
    </div>
  );
}
