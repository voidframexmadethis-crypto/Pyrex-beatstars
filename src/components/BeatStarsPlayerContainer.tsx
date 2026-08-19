import React from 'react';

interface BeatStarsPlayerContainerProps {
  isPlaying: boolean;
  progress: number;
  onSeek: (percentage: number) => void;
  trackTitle: string;
  artistName: string;
  artworkUrl: string;
  bpm: number;
  key: string;
  price: string;
  onPlayToggle: () => void;
}

export function BeatStarsPlayerContainer({
  isPlaying,
  progress,
  onSeek,
  trackTitle,
  artistName,
  artworkUrl,
  bpm,
  key,
  price,
  onPlayToggle,
}: BeatStarsPlayerContainerProps) {
  // Generate 95 bars for an edge-to-edge widescreen layout
  const bars = Array.from({ length: 95 }, (_, i) => ({
    id: i,
    height: Math.max(10, Math.abs(Math.sin(i * 0.12) * 50) + (i % 4 === 0 ? 18 : 6)),
  }));

  return (
    <div className="w-full bg-[#121212] text-white font-sans">
      {/* Main Hero Container - Full Width Expansion */}
      <div className="w-full bg-[#161616] border border-neutral-800 rounded-lg p-5 md:p-6 space-y-5">
        
        {/* Top Header: Artwork & Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <img 
            src={artworkUrl} 
            alt={trackTitle} 
            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded shadow-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center space-x-2 text-purple-500 text-sm font-semibold">
              <button 
                onClick={onPlayToggle}
                className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-500 transition"
              >
                {isPlaying ? '❚❚' : '▶'}
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-white truncate tracking-tight">
                {trackTitle}
              </h1>
            </div>
            
            <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">{artistName}</p>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-300">
              <span className="bg-[#222222] px-2.5 py-1 rounded">🎹 {bpm} BPM</span>
              <span className="bg-[#222222] px-2.5 py-1 rounded">🎵 {key}</span>
              <span className="bg-[#222222] px-2.5 py-1 rounded">📅 September 25, 2025</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2 rounded text-xs transition flex items-center space-x-1.5 shadow">
                <span>🛒</span>
                <span>{price}</span>
              </button>
              <button className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold px-4 py-2 rounded text-xs transition">
                DOWNLOAD
              </button>
              <button className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold px-4 py-2 rounded text-xs transition">
                SHARE
              </button>
            </div>
          </div>
        </div>

        {/* 100% Width Full-Span Waveform Section */}
        <div className="w-full bg-[#101010] border border-neutral-800 rounded-md p-3 relative group">
          <div 
            className="h-20 w-full flex items-center justify-between gap-[2px] cursor-pointer overflow-hidden relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
              onSeek(percentage);
            }}
          >
            {bars.map((bar, i) => {
              const barPercentage = (i / bars.length) * 100;
              const isPassed = barPercentage <= progress;

              return (
                <div 
                  key={bar.id}
                  className={`w-[3px] rounded-full transition-all duration-150 ${
                    isPassed ? 'bg-purple-500' : 'bg-neutral-700'
                  } ${isPlaying ? 'animate-pulse' : ''}`}
                  style={{ 
                    height: `${bar.height}px`,
                    animationDuration: isPlaying ? `${0.35 + (i % 4) * 0.1}s` : 'none'
                  }}
                />
              );
            })}
          </div>

          {/* Active Playhead Indicator Line */}
          <div 
            className="absolute top-2 bottom-2 w-[2px] bg-white pointer-events-none transition-all shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ left: `${progress}%` }}
          />
        </div>

      </div>
    </div>
  );
}
