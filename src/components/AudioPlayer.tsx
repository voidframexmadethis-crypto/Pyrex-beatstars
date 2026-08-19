import React from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, ShieldCheck } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { AudioTagToggle } from './AudioTagToggle';
import { sanitizeTitle } from '../utils/sanitizeTitle';

export default function AudioPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    currentTime, 
    duration, 
    volume, 
    isMuted, 
    playNext, 
    playPrevious, 
    togglePlay, 
    seek, 
    setVolume, 
    toggleMute, 
    isTaggedMode,
    setIsTaggedMode,
    error,
    offlineReadyTracks 
  } = useAudioPlayer();

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isMuted && val > 0) toggleMute();
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentTrack) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 w-full bg-[#0a0a0c]/95 border-t border-neutral-800/80 px-3 sm:px-6 py-2.5 sm:py-3 z-[999] shadow-2xl backdrop-blur-xl transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        {/* Error Notification */}
        {error && (
          <div className="w-full text-center text-red-400 text-[10px] font-bold p-1 bg-red-950/40 border border-red-800/60 rounded mb-0.5">
            {error}
          </div>
        )}

        {/* Progress Slider */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full group">
          <span className="text-[10px] sm:text-xs font-mono text-neutral-400 w-8 sm:w-10 text-right select-none shrink-0">{formatTime(currentTime)}</span>
          <div className="relative flex-1 flex items-center h-4">
            <input 
              type="range"
              min="0"
              max={duration > 0 ? duration : 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:h-2 transition-all"
            />
          </div>
          <span className="text-[10px] sm:text-xs font-mono text-neutral-400 w-8 sm:w-10 select-none shrink-0">{formatTime(duration)}</span>
        </div>

        <div className="grid grid-cols-12 items-center gap-2 sm:gap-4">
          {/* Track Info (Left - 5 cols on mobile/iPad, 4 on desktop) */}
          <div className="col-span-7 md:col-span-4 flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 shadow-lg">
              <img 
                src={currentTrack.coverArtUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'} 
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate leading-tight">{sanitizeTitle(currentTrack.title)}</h4>
                {offlineReadyTracks.has(currentTrack.id) && (
                  <div className="hidden lg:flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold text-emerald-500 uppercase tracking-wider shrink-0">
                    <ShieldCheck size={10} />
                    <span>Offline</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-400 truncate flex items-center gap-1.5 mt-0.5 leading-tight">
                <span className="text-purple-400 font-semibold truncate">{currentTrack.producer || 'Pyrex Spinna'}</span>
                <span className="text-neutral-700 shrink-0">•</span>
                <span className="font-mono shrink-0">{currentTrack.bpm || 120} BPM</span>
                {currentTrack.key && (
                  <>
                    <span className="text-neutral-700 shrink-0">|</span>
                    <span className="font-mono uppercase text-purple-300/70 shrink-0">{currentTrack.key}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Controls (Center - 5 cols on mobile/iPad, 4 on desktop) */}
          <div className="col-span-5 md:col-span-4 flex items-center justify-end md:justify-center gap-2.5 sm:gap-5 shrink-0">
            <button 
              onClick={playPrevious}
              aria-label="Previous Track"
              className="text-neutral-400 hover:text-white transition-colors p-1 hover:scale-110 active:scale-95"
            >
              <SkipBack size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button 
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-purple-500/20 shrink-0"
            >
              {isPlaying ? <Pause size={18} className="sm:w-5 sm:h-5 fill-current" /> : <Play size={18} className="sm:w-5 sm:h-5 fill-current ml-0.5" />}
            </button>
            <button 
              onClick={playNext}
              aria-label="Next Track"
              className="text-neutral-400 hover:text-white transition-colors p-1 hover:scale-110 active:scale-95"
            >
              <SkipForward size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Audio Tag Toggle (Desktop Only) */}
          <div className="hidden lg:flex col-span-2 items-center justify-center">
             <AudioTagToggle 
               initialMode={isTaggedMode}
               onToggleTag={(isTagged) => setIsTaggedMode(isTagged)}
             />
          </div>

          {/* Volume Slider (Right - Hidden on mobile, visible on iPad/Desktop) */}
          <div className="hidden md:flex col-span-3 lg:col-span-2 items-center justify-end gap-2.5 min-w-0">
            <button 
              onClick={toggleMute} 
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="text-neutral-400 hover:text-white transition-colors shrink-0 p-1"
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 lg:w-24 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neutral-300 hover:accent-purple-400 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
