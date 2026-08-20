import React, { useEffect, useRef, useState } from 'react';
import { Beat } from '../types';
import { useStore } from '../context/StoreContext';
import { useBeatManager } from '../hooks/useBeatManager';
import { Trash2, ShieldCheck, Play, Pause, Activity, Music } from 'lucide-react';
import CanvasWaveform from './CanvasWaveform';
import { sanitizeTitle } from '../utils/sanitizeTitle';

interface PermanentPlayerCardProps {
  beat: Beat;
}

export default function PermanentPlayerCard({ beat }: PermanentPlayerCardProps) {
  const { handleDeleteBeat } = useBeatManager();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isAdmin = localStorage.getItem('pyrex_admin_session') === 'true';
  
  // Persistence Key matching requested logic
  const storageKey = `pyrex_deleted_beat-${beat.id}`;
  
  // State for local hide and animation
  const [isDeleted, setIsDeleted] = useState(() => localStorage.getItem(storageKey) === 'true');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioSourceUrl = beat.audioUrl || beat.backupAudioUrl || beat.r2AudioUrl || '';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      // 1. Explicitly check and resume the browser's AudioContext state
      if (typeof window !== 'undefined') {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          if (!(window as any).globalAudioCtx) {
            (window as any).globalAudioCtx = new AudioCtxClass();
          }
          const audioCtx = (window as any).globalAudioCtx;
          if (audioCtx && audioCtx.state === 'suspended') {
            await audioCtx.resume().catch((err: any) => console.warn("AudioContext resume warning:", err));
          }
        }
      }

      if (audio.paused) {
        if ((window as any).activeAudio && (window as any).activeAudio !== audio) {
          (window as any).activeAudio.pause();
        }
        if (!audio.src || audio.src === '' || audio.src.endsWith('/null') || audio.src.endsWith('/undefined')) {
          audio.src = audioSourceUrl;
          audio.load();
        }
        // 2. Wrap audioElement.play() execution in Promise catch block
        await audio.play();
        (window as any).activeAudio = audio;
      } else {
        audio.pause();
      }
    } catch (e) {
      console.warn("PermanentPlayerCard playback error, re-initializing source URL:", e);
      try {
        audio.src = audioSourceUrl;
        audio.load();
        await audio.play();
        (window as any).activeAudio = audio;
      } catch (retryErr) {
        console.warn("PermanentPlayerCard retry playback failed:", retryErr);
      }
    }
  };

  const handleSeek = (newTime: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="%2364748b" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this permanent track?')) {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      setIsFadingOut(true);
      localStorage.setItem(storageKey, 'true');

      setTimeout(async () => {
        setIsDeleted(true);
        await handleDeleteBeat(beat.id);
      }, 300);
    }
  };

  if (isDeleted) return null;

  return (
    <div 
      id={`beat-${beat.id}`}
      className={`pyrex-beat-card bg-[#090d16] border border-[#1e293b] rounded-2xl p-4 w-full max-w-xl flex flex-col gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.6)] mx-auto relative group transition-all duration-300 ${isFadingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
    >
      <div className="flex items-center gap-4">
        {/* Artwork Container with Discount Badge */}
        <div className="art-container relative w-[70px] h-[70px] flex-shrink-0">
          <img 
            src={(beat as any).artwork || (beat as any).coverUrl || (beat as any).imageUrl || beat.coverArtUrl || beat.backupArtworkUrl || beat.r2ArtworkUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60'} 
            alt={beat.title || "Custom Beat Artwork"} 
            className="player-art w-full h-full object-cover rounded-xl border border-white/8"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={handleImageError}
          />
          {(beat.originalPrice && beat.originalPrice > beat.price) && (
            <span className="discount-badge absolute top-[-6px] left-[-6px] bg-[#38bdf8] text-[#090d16] text-[0.65rem] font-[800] px-[6px] py-[3px] rounded-[4px] uppercase tracking-[0.05em] shadow-[0_4px_12px_rgba(56,189,248,0.4)]">
              {Math.round(((beat.originalPrice - beat.price) / beat.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>
        
        <div className="player-content flex flex-col gap-1 w-full min-w-0">
          <div className="player-header flex items-start justify-between gap-2 w-full">
            <div className="track-meta flex flex-col gap-0.5 min-w-0">
              <span className="artist-tag text-[0.75rem] text-[#38bdf8] font-semibold uppercase tracking-[0.05em] truncate">
                {beat.producer || 'Pyrex Spinna'}
              </span>
              <h4 className="font-semibold text-white">
                {beat.title || "Untitled Track"}
                {beat.isAIFree && (
                  <div className="flex items-center gap-1 text-[8px] text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 px-1.5 py-0.5 rounded uppercase font-black tracking-tighter ml-2 inline-flex">
                    <ShieldCheck size={8} /> AI-FREE
                  </div>
                )}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-[9px] font-black text-neutral-400 uppercase tracking-wider">
                  <Activity size={10} className="text-purple-500" />
                  {beat.bpm} BPM
                </div>
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-[9px] font-black text-neutral-400 uppercase tracking-wider">
                  <Music size={10} className="text-blue-500" />
                  {beat.key}
                </div>
                {beat.camelotCode && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-[9px] font-black text-indigo-400 uppercase tracking-wider">
                    {beat.camelotCode}
                  </div>
                )}
              </div>
              <div className="price-container flex items-center gap-2 mt-1.5">
                {beat.originalPrice && beat.originalPrice > beat.price && (
                  <span className="old-price text-[#64748b] line-through text-[0.8rem]">
                    ${beat.originalPrice.toFixed(2)}
                  </span>
                )}
                <div className="beat-price-tag !bg-emerald-500/10 !border-emerald-500/20 !text-emerald-400">
                  <span>${beat.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-all shadow-md shadow-purple-600/30 cursor-pointer shrink-0"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              </button>

              {isAdmin && (
                <button 
                  onClick={handleDelete}
                  className="delete-beat-btn p-1.5 flex items-center justify-center text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-all cursor-pointer"
                  title="Delete this beat"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={audioSourceUrl} preload="metadata" crossOrigin="anonymous" />

      {/* Full-width Canvas Waveform Visualizer */}
      <div className="w-full bg-neutral-900/60 rounded-xl border border-neutral-800/80 overflow-hidden">
        <CanvasWaveform 
          audioRef={audioRef}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          height={90}
          audioUrl={audioSourceUrl}
        />
        <div className="flex items-center justify-between mt-1 px-3 pb-2 text-[11px] font-mono text-neutral-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

