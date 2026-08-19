import React, { useState, useRef } from 'react';
import { Beat } from '../types';

interface CustomPlayerProps {
  beat: Beat & { 
    genre?: string; 
    scale?: string; 
    customPrice: number; 
    onCheckout: (beat: Beat) => void 
  };
}

export default function CustomPlayer({ beat }: CustomPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Toggle Play / Pause with high fidelity stream handling
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((current / (duration || 1)) * 100);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-4 shadow-2xl relative overflow-hidden group hover:border-red-600 transition-all duration-300">
      
      {/* Background Glow Effect */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-600/10 rounded-full blur-2xl group-hover:bg-red-600/20 transition-all"></div>

      {/* Top Row: Info & Multi-Tags */}
      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="text-white font-bold text-lg tracking-wide">{beat.title}</h3>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-800">{beat.genre || 'Trap'}</span>
            <span className="text-xs bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-800">{beat.bpm} BPM</span>
            <span className="text-xs bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-800">{beat.key || 'N/A'}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-red-500 font-extrabold text-xl">${beat.customPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Center: Lowrider Bouncing Waveform Visualizer */}
      <div className="flex items-center gap-1 h-10 px-2 bg-zinc-900/60 rounded-lg border border-zinc-800/80 z-10 overflow-hidden relative">
        {/* Simulated animated bouncing bars when playing */}
        {[...Array(32)].map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 bg-gradient-to-t from-red-600 to-amber-500 rounded-full transition-all duration-150 ${
              isPlaying ? 'animate-pulse' : 'opacity-40'
            }`}
            style={{ 
              height: isPlaying ? `${Math.max(15, Math.sin(i + progress) * 100)}%` : '20%',
              animationDelay: `${i * 0.05}s` 
            }}
          ></div>
        ))}
      </div>

      {/* Bottom Row: Controls & Direct Custom Checkout */}
      <div className="flex items-center justify-between z-10">
        <button 
          onClick={togglePlay}
          className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg font-bold text-sm tracking-wider shadow-lg shadow-red-900/40 transition-transform active:scale-95 flex items-center gap-2"
        >
          {isPlaying ? '⏸ PAUSE' : '▶ PLAY BEAT'}
        </button>

        <button 
          onClick={() => beat.onCheckout(beat)}
          className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          Instant Crypto Buy
        </button>
      </div>

      {/* Hidden high-definition audio element (.m4a stream) */}
      <audio 
        ref={audioRef} 
        src={beat.audioUrl} 
        preload="auto"
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
