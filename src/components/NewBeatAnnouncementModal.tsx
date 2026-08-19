import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, X, Music, Disc } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { Beat } from '../types';

export default function NewBeatAnnouncementModal() {
  const { state } = useStore();
  const { playTrack } = useAudioPlayer();
  const [isOpen, setIsOpen] = useState(false);
  const [latestBeat, setLatestBeat] = useState<Beat | null>(null);

  useEffect(() => {
    const dismissedKey = 'krypside_announcement_dismissed_v1';
    const isDismissed = localStorage.getItem(dismissedKey);
    
    // Suppress popups during upload phase or on uploader pages
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('upload') || path.includes('uploader') || path.includes('admin')) {
        return;
      }
    }

    if (!isDismissed && state.beats && state.beats.length > 0) {
      // Pick the first beat or newest beat
      setLatestBeat(state.beats[0]);
      // Small delay for smooth entry on load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [state.beats]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('krypside_announcement_dismissed_v1', 'true');
  };

  const handleListenNow = () => {
    if (!latestBeat) return;
    
    // Use the central playTrack mechanism to ensure SINGLE AUDIO ENGINE INSTANCE
    playTrack(latestBeat);

    handleClose();
  };

  if (!isOpen || !latestBeat) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-neutral-900 border border-purple-500/30 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden text-white"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-10 border border-neutral-700"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              NEW DROP ALERT
            </span>
            <span className="text-xs font-mono text-neutral-400">Official Release</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 items-center mb-6">
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-xl border border-neutral-800 shrink-0 group">
              <img
                src={latestBeat.coverArtUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400'}
                alt={latestBeat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[10px] font-mono text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                  {latestBeat.trackType || 'Instrumental'}
                </span>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1 truncate">
                {latestBeat.title}
              </h2>
              <p className="text-xs text-neutral-400 mb-3 font-medium">
                Prod. by <span className="text-purple-400 font-semibold">{latestBeat.producer || 'Pyrex Spinna'}</span>
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-2">
                {latestBeat.bpm && (
                  <span className="px-2.5 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/60 text-[11px] font-mono text-neutral-300">
                    🎵 {latestBeat.bpm} BPM
                  </span>
                )}
                {latestBeat.key && (
                  <span className="px-2.5 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/60 text-[11px] font-mono text-neutral-300">
                    🎹 {latestBeat.key}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 font-bold">
                  ${latestBeat.price || 29.99}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleListenNow}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/30 cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Listen Now & Play Track</span>
            </button>
            <button
              onClick={handleClose}
              className="px-5 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-semibold text-sm rounded-2xl transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
