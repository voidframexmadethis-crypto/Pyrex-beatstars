import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface WaveformPlayerProps {
  audioUrl: string;
  title?: string;
  producer?: string;
  height?: number;
  className?: string;
}

export default function WaveformPlayer({
  audioUrl,
  title = 'Untitled Beat',
  producer = 'Krypside',
  height = 90,
  className = ''
}: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      fillParent: true,
      height: 90,
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      waveColor: 'rgba(255, 255, 255, 0.35)',
      progressColor: '#FFFFFF',
      cursorColor: 'transparent',
      normalize: true,
      url: audioUrl || undefined
    });

    wavesurferRef.current = ws;

    ws.on('ready', () => {
      setIsReady(true);
      setDuration(ws.getDuration());
    });

    ws.on('audioprocess', () => {
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on('timeupdate', (currentTime) => {
      setCurrentTime(currentTime);
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('finish', () => setIsPlaying(false));

    return () => {
      ws.destroy();
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(isMuted ? 0 : newVol);
    }
  };

  const toggleMute = () => {
    if (wavesurferRef.current) {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      wavesurferRef.current.setVolume(nextMuted ? 0 : volume);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`bg-neutral-950 border border-neutral-800 rounded-2xl p-4 shadow-xl ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-white">{title}</h4>
          <span className="text-xs text-neutral-400">{producer}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            disabled={!isReady}
            className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-neutral-800 text-white flex items-center justify-center transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Waveform Container matching user spec */}
      <div id="waveform" ref={containerRef} style={{ width: '100%', height: '90px' }} className="waveform-wrapper w-full rounded-xl overflow-hidden bg-neutral-900/60" />

      <div className="flex items-center justify-between mt-3 text-xs text-neutral-400 font-mono">
        <span>{formatTime(currentTime)}</span>
        <span>{!isReady ? 'Loading waveform...' : formatTime(duration)}</span>
      </div>
    </div>
  );
}
