import React, { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import CanvasWaveform from "./CanvasWaveform";

type Props = {
  src: string;
  title?: string;
  className?: string;
};

export default function TrackPlayer({ src, title, className }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const canPlay = useMemo(() => typeof src === "string" && src.length > 0, [src]);

  useEffect(() => {
    setError(null);
    setIsBuffering(false);
    setCurrentTime(0);
    setDuration(0);

    const audio = audioRef.current;
    if (!audio || !canPlay) return;

    audio.src = src;
    audio.load();
  }, [src, canPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const onError = () => setError(`Playback error (code: ${audio.error?.code ?? "unknown"})`);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("error", onError);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      setError(null);

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
          audio.src = src;
          audio.load();
        }
        // 2. Wrap audioElement.play() execution in a proper Promise catch block
        await audio.play();
        (window as any).activeAudio = audio;
      } else {
        audio.pause();
      }
    } catch (e: any) {
      console.warn("TrackPlayer playback interrupted or blocked, re-initializing source:", e);
      try {
        audio.src = src;
        audio.load();
        await audio.play();
        (window as any).activeAudio = audio;
      } catch (retryErr: any) {
        setError(retryErr?.message ?? "Autoplay/play failed");
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

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggle} 
            disabled={!canPlay}
            className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white flex items-center justify-center transition-all shadow-md shadow-purple-600/30 cursor-pointer"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>
          <div>
            {title ? <div className="text-sm font-bold text-white">{title}</div> : null}
            <div className="text-xs text-neutral-400 font-mono">
              {isBuffering ? "Loading audio..." : `${formatTime(currentTime)} / ${formatTime(duration)}`}
            </div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

      {/* Canvas Waveform Visualizer */}
      <div className="waveform-wrapper w-full rounded-xl overflow-hidden bg-neutral-900/80 border border-neutral-800">
        <CanvasWaveform 
          audioRef={audioRef}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          height={90}
          audioUrl={src}
        />
      </div>

      {error ? <div className="mt-2 text-xs text-red-400 font-medium">{error}</div> : null}
    </div>
  );
}


