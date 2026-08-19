import React, { useEffect, useRef, useState, useCallback } from 'react';

interface CanvasWaveformProps {
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  height?: number;
  className?: string;
  audioUrl?: string;
}

export default function CanvasWaveform({
  audioRef,
  currentTime = 0,
  duration = 0,
  onSeek,
  height = 90,
  className = '',
  audioUrl
}: CanvasWaveformProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(600);
  const [waveformPeaks, setWaveformPeaks] = useState<number[]>([]);

  // Generate pseudorandom stable peaks for the audio URL or default
  useEffect(() => {
    // Generate ~100 normalized peaks between 0.15 and 0.95
    const numBars = 120;
    const peaks: number[] = [];
    let seed = 42;
    if (audioUrl) {
      for (let i = 0; i < audioUrl.length; i++) {
        seed = (seed * 31 + audioUrl.charCodeAt(i)) % 1000000;
      }
    }
    for (let i = 0; i < numBars; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      // Shape peaks to look natural (peaks and valleys)
      const val = 0.2 + Math.abs(Math.sin(i * 0.15) * 0.5) + rnd * 0.3;
      peaks.push(Math.min(0.98, Math.max(0.15, val)));
    }
    setWaveformPeaks(peaks);
  }, [audioUrl]);

  // ResizeObserver to handle full 100% width dynamically without pixel distortion
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          setCanvasWidth(width);
        }
      }
    });

    observer.observe(containerRef.current);
    setCanvasWidth(containerRef.current.clientWidth || 600);

    return () => observer.disconnect();
  }, []);

  // Draw canvas bars
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvasWidth, height);

    const barWidth = 3;
    const barGap = 2;
    const barRadius = 3;
    const totalBarSlot = barWidth + barGap;
    const numBars = Math.floor(canvasWidth / totalBarSlot);

    const progressRatio = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
    const playedBarsCount = Math.floor(numBars * progressRatio);

    for (let i = 0; i < numBars; i++) {
      const x = i * totalBarSlot;
      // Map i to waveformPeaks index
      const peakIndex = Math.floor((i / numBars) * waveformPeaks.length);
      const normalizedPeak = waveformPeaks[peakIndex] || 0.5;
      const barHeight = Math.max(6, normalizedPeak * (height - 12));
      const y = (height - barHeight) / 2;

      const isPlayed = i <= playedBarsCount;
      ctx.fillStyle = isPlayed ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)';

      // Draw rounded rectangle for bar
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barWidth, barHeight, barRadius);
      } else {
        ctx.rect(x, y, barWidth, barHeight);
      }
      ctx.fill();
    }
  }, [canvasWidth, height, currentTime, duration, waveformPeaks]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  // Handle click-to-seek
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || duration <= 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;

    if (onSeek) {
      onSeek(newTime);
    } else if (audioRef?.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`waveform-wrapper w-full cursor-pointer relative select-none ${className}`}
      style={{ width: '100%', height: `${height}px` }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${height}px`, display: 'block' }}
      />
    </div>
  );
}
