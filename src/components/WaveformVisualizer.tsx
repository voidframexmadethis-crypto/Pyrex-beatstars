import React from 'react';

interface WaveformProps {
  isPlaying: boolean;
  progress?: number; // 0 to 100 percentage
  onSeek?: (percentage: number) => void;
}

export function WaveformVisualizer({ isPlaying, progress = 35, onSeek }: WaveformProps) {
  // Generate 85 bars to fill the full container width like BeatStars
  const bars = Array.from({ length: 85 }, (_, i) => {
    // Create a natural waveform contour using sine math combined with variation
    const baseHeight = Math.max(12, Math.abs(Math.sin(i * 0.15) * 48) + (i % 3 === 0 ? 15 : 5));
    return { id: i, height: baseHeight };
  });

  return (
    <div className="w-full bg-[#111111] border border-neutral-800/80 rounded-md p-3 flex flex-col justify-center relative group cursor-pointer">
      {/* Waveform Bars Container */}
      <div 
        className="h-16 w-full flex items-center justify-between gap-[2px] overflow-hidden relative"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const percentage = (clickX / rect.width) * 100;
          if (onSeek) onSeek(percentage);
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
                animationDuration: isPlaying ? `${0.4 + (i % 5) * 0.15}s` : 'none'
              }}
            />
          );
        })}
      </div>

      {/* Progress Playhead Line */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none transition-all"
        style={{ left: `${progress}%` }}
      />
    </div>
  );
}
