import React, { useMemo, useState } from 'react';
import { Play, Pause, Trash2, SkipBack, SkipForward, Volume2, Share2, Download, ShoppingCart, Music, Activity, Calendar } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { motion, AnimatePresence } from 'motion/react';
import { Beat } from '../types';
import { getSafeKey } from '../lib/utils';

export default function BeatStarsPlayerView() {
  const { 
    currentTrack, 
    isPlaying, 
    setIsPlaying, 
    togglePlay, 
    playTrack, 
    playlist, 
    currentTime, 
    duration, 
    seek, 
    clearTrack 
  } = useAudioPlayer();

  const [activeTab, setActiveTab] = useState<'tracks' | 'comments'>('tracks');
  const [commentText, setCommentText] = useState('');

  // Fallback tracks if playlist is empty
  const displayTracks = useMemo(() => {
    if (playlist && playlist.length > 0) return playlist;
    return [];
  }, [playlist]);

  // Generate edge-to-edge bars for the waveform
  const barsCount = 180;
  const bars = useMemo(() => {
    return Array.from({ length: barsCount }, (_, i) => ({
      id: i,
      height: Math.max(10, Math.abs(Math.sin(i * 0.15) * 85) + (i % 5 === 0 ? 15 : 5) + Math.random() * 5),
    }));
  }, [barsCount]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleWaveformSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seek(ratio * duration);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentTrack) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Music size={64} className="mx-auto text-neutral-800" />
          <h2 className="text-2xl font-bold text-neutral-500 uppercase tracking-widest">No Active Session</h2>
          <p className="text-neutral-700">Select a beat from the catalog to initialize the player</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-indigo-500 selection:text-white w-full pb-20">
      <style>{`
        @keyframes eq-bounce {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.4); }
        }
        .animate-eq-bounce {
          animation: eq-bounce infinite ease-in-out;
        }
      `}</style>

      {/* TOP HEADER NAVIGATION / STRIP */}
      <div className="w-full flex items-center justify-between px-8 py-4 bg-neutral-900/20 border-b border-neutral-800/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
          <span className="text-[10px] font-black tracking-[0.3em] text-neutral-500 uppercase">Pyrex Live Audio Engine v4.0</span>
        </div>
        <button 
          onClick={() => clearTrack()}
          className="flex items-center gap-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-full transition-all text-[11px] font-black uppercase tracking-widest border border-transparent hover:border-red-500/20"
        >
          <Trash2 size={14} />
          <span>Terminate Session</span>
        </button>
      </div>

      {/* MASSIVE WIDESCREEN HERO SECTION */}
      <section className="relative w-full overflow-hidden border-b border-neutral-800/60 bg-gradient-to-b from-neutral-900/10 to-[#030303]">
        {/* Blurred Background Artwork */}
        <div className="absolute inset-0 z-0 opacity-20 blur-[100px] pointer-events-none">
          <img 
            src={currentTrack.coverArtUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'} 
            className="w-full h-full object-cover scale-150"
            alt=""
          />
        </div>

        <div className="relative z-10 w-full px-8 lg:px-16 py-12 lg:py-24 flex flex-col xl:flex-row items-center gap-12 lg:gap-20">
          {/* Huge Artwork */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-64 h-64 sm:w-96 sm:h-96 xl:w-[500px] xl:h-[500px] shrink-0 rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-2 border-white/5 relative group"
          >
            <img 
              src={currentTrack.coverArtUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
              alt={currentTrack.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>

          {/* Massive Metadata Content */}
          <div className="flex-1 min-w-0 space-y-10 w-full">
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-indigo-400 font-black tracking-[0.2em] uppercase text-sm"
              >
                <Activity size={18} />
                <span>Now Streaming</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white drop-shadow-2xl"
              >
                {currentTrack.title}
              </motion.h1>
              <p className="text-xl sm:text-2xl text-neutral-500 font-medium tracking-tight">
                Produced by <span className="text-white">{currentTrack.producer || 'Pyrex Spinna'}</span>
              </p>
            </div>

            {/* Metadata Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center gap-4"
            >
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/80 px-6 py-4 rounded-2xl flex flex-col gap-1 shadow-inner group hover:border-indigo-500/30 transition-colors">
                <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Tempo</span>
                <span className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">{currentTrack.bpm} <span className="text-sm font-bold text-neutral-700">BPM</span></span>
              </div>
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/80 px-6 py-4 rounded-2xl flex flex-col gap-1 shadow-inner group hover:border-indigo-500/30 transition-colors">
                <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Key / Scale</span>
                <span className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">{currentTrack.key || 'N/A'}</span>
              </div>
              {currentTrack.camelotCode && (
                <div className="bg-indigo-900/20 backdrop-blur-xl border border-indigo-500/20 px-6 py-4 rounded-2xl flex flex-col gap-1 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]">
                  <span className="text-[10px] font-black text-indigo-400/60 uppercase tracking-widest">Camelot</span>
                  <span className="text-2xl font-black text-indigo-400">{currentTrack.camelotCode}</span>
                </div>
              )}
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/80 px-6 py-4 rounded-2xl flex flex-col gap-1 shadow-inner">
                <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Released</span>
                <span className="text-xl font-bold text-neutral-300">Aug 17, 2026</span>
              </div>
            </motion.div>

            {/* Main Action Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-6 pt-4"
            >
              <button className="h-16 lg:h-20 bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 rounded-2xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(79,70,229,0.3)] group">
                <ShoppingCart size={24} className="group-hover:rotate-12 transition-transform" />
                <span className="text-xl tracking-tight">Purchase License</span>
              </button>
              <button className="h-16 lg:h-20 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 font-bold px-10 rounded-2xl border border-neutral-800 flex items-center gap-4 transition-all hover:border-neutral-700">
                <Download size={20} />
                <span>Free Download</span>
              </button>
              <button className="h-16 lg:h-20 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 font-bold w-16 lg:w-20 rounded-2xl border border-neutral-800 flex items-center justify-center transition-all">
                <Share2 size={20} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EDGE-TO-EDGE BOUNCING WAVEFORM SECTION */}
      <div className="w-full relative bg-[#030303]">
        {/* Waveform Visualization Stage */}
        <div 
          className="w-full h-48 sm:h-64 flex flex-col justify-end relative cursor-pointer group bg-black/60 border-y border-neutral-900/50"
          onClick={handleWaveformSeek}
        >
          <div className="absolute inset-0 flex items-end justify-between gap-[2px] px-1 overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity">
            {bars.map((bar, i) => {
              const barPercentage = (i / barsCount) * 100;
              const isPassed = barPercentage <= progressPercent;
              
              return (
                <div 
                  key={bar.id}
                  className={`w-full rounded-t-lg transition-all duration-300 origin-bottom ${
                    isPassed 
                      ? 'bg-gradient-to-t from-indigo-800 via-indigo-500 to-indigo-300 shadow-[0_0_30px_rgba(99,102,241,0.4)]' 
                      : 'bg-neutral-900 group-hover:bg-neutral-800'
                  } ${isPlaying ? 'animate-eq-bounce' : ''}`}
                  style={{ 
                    height: `${bar.height}%`,
                    animationDuration: isPlaying ? `${0.4 + (i % 8) * 0.1}s` : 'none',
                    animationDelay: isPlaying ? `${(i % 12) * 0.05}s` : 'none'
                  }}
                />
              )
            })}
          </div>

          {/* Massive Playhead Line */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_40px_white] pointer-events-none transition-all duration-75 z-20"
            style={{ left: `${progressPercent}%` }}
          />
          
          {/* Hover Preview Head */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <div className="bg-indigo-600/10 backdrop-blur-sm px-6 py-3 rounded-full border border-indigo-500/20 text-indigo-400 font-black text-xs uppercase tracking-[0.3em]">
               Seek Position
             </div>
          </div>
        </div>

        {/* Global Controls Overlaying Waveform */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8 lg:gap-16 z-30 pointer-events-none">
          <button 
            className="pointer-events-auto p-4 text-neutral-500 hover:text-white hover:scale-125 active:scale-95 transition-all"
            title="Previous Track"
          >
            <SkipBack size={48} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="pointer-events-auto w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_20px_80px_rgba(255,255,255,0.4)] relative group"
          >
            {isPlaying ? (
              <Pause size={64} fill="currentColor" />
            ) : (
              <Play size={64} fill="currentColor" className="ml-4" />
            )}
            <div className="absolute inset-0 rounded-full border-8 border-indigo-500/20 scale-110 opacity-0 group-hover:opacity-100 transition-all animate-pulse" />
          </button>

          <button 
            className="pointer-events-auto p-4 text-neutral-500 hover:text-white hover:scale-125 active:scale-95 transition-all"
            title="Next Track"
          >
            <SkipForward size={48} />
          </button>
        </div>

        {/* Time Indicators */}
        <div className="absolute bottom-6 left-8 right-8 flex justify-between pointer-events-none mix-blend-difference">
          <span className="text-2xl font-black tracking-tighter text-white opacity-80">{formatTime(currentTime)}</span>
          <span className="text-2xl font-black tracking-tighter text-white opacity-40">{formatTime(duration)}</span>
        </div>
      </div>

      {/* CONTENT AREA: TABS & TABLES */}
      <main className="w-full px-8 lg:px-16 py-20">
        <div className="max-w-8xl mx-auto space-y-16">
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-12 border-b border-neutral-900 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveTab('tracks')}
              className={`pb-8 text-lg font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'tracks' ? 'text-white' : 'text-neutral-700 hover:text-neutral-500'}`}
            >
              Related Catalog
              {activeTab === 'tracks' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
            </button>
            <button 
              onClick={() => setActiveTab('comments')}
              className={`pb-8 text-lg font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'comments' ? 'text-white' : 'text-neutral-700 hover:text-neutral-500'}`}
            >
              Session Logs
              {activeTab === 'comments' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'tracks' ? (
              <motion.div 
                key="tab-tracks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Related Tracks Table */}
                <div className="bg-neutral-900/10 rounded-[32px] border border-neutral-900/60 overflow-hidden shadow-2xl">
                  <div className="grid grid-cols-12 px-10 py-6 text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em] bg-neutral-900/20">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">Composition</div>
                    <div className="col-span-2 text-center">Tempo</div>
                    <div className="col-span-2 text-center">Duration</div>
                    <div className="col-span-2 text-right">License</div>
                  </div>

                  <div className="divide-y divide-neutral-900/40">
                    {displayTracks.length > 0 ? (
                      displayTracks.map((track, idx) => {
                        const isActive = track.id === currentTrack.id;
                        return (
                          <div 
                            key={track.id} 
                            onClick={() => playTrack(track)}
                            className={`grid grid-cols-12 px-10 py-8 items-center cursor-pointer transition-all hover:bg-neutral-900/30 group ${isActive ? 'bg-indigo-600/5' : ''}`}
                          >
                            <div className="col-span-1 text-sm font-bold text-neutral-700 group-hover:text-neutral-500">
                              {isActive ? (
                                <div className="flex items-end gap-[2px] h-4 w-4">
                                  <div className="flex-1 bg-indigo-500 animate-bounce h-full" style={{ animationDelay: '0s' }} />
                                  <div className="flex-1 bg-indigo-500 animate-bounce h-2/3" style={{ animationDelay: '0.1s' }} />
                                  <div className="flex-1 bg-indigo-500 animate-bounce h-1/2" style={{ animationDelay: '0.2s' }} />
                                </div>
                              ) : (
                                (idx + 1).toString().padStart(2, '0')
                              )}
                            </div>
                            <div className="col-span-5 flex items-center gap-6">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-lg shrink-0">
                                <img src={track.coverArtUrl || ''} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-semibold text-white">
                                  {track.title || "Untitled Track"}
                                </h4>
                                <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest">{track.producer || 'Pyrex Spinna'}</p>
                              </div>
                            </div>
                            <div className="col-span-2 text-center font-mono text-neutral-500 font-bold">
                              {track.bpm} BPM
                            </div>
                            <div className="col-span-2 text-center font-mono text-neutral-500 font-bold">
                              {formatTime(track.duration || 0) || '0:00'}
                            </div>
                            <div className="col-span-2 text-right">
                              <button className="bg-neutral-900 border border-neutral-800 hover:border-indigo-500/50 hover:bg-indigo-600/10 text-white font-black px-6 py-3 rounded-xl text-sm transition-all shadow-inner">
                                ${track.price}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-20 text-center text-neutral-700 font-black uppercase tracking-widest">
                        End of Catalog Reached
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="tab-comments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                {/* Comments Input */}
                <div className="relative group">
                  <textarea 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Leave a message for the producer..."
                    className="w-full bg-neutral-900/20 border border-neutral-900 rounded-[32px] px-10 py-10 text-xl text-white placeholder-neutral-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[200px] resize-none shadow-inner"
                  />
                  <div className="absolute right-8 bottom-8 flex items-center gap-8">
                     <span className="text-xs font-bold text-neutral-700 font-mono tracking-widest">{commentText.length} / 500</span>
                     <button className="bg-white text-black font-black px-10 py-5 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                       Broadcast
                     </button>
                  </div>
                </div>

                {/* Simulated Logs */}
                <div className="space-y-8">
                  <div className="bg-neutral-900/10 border border-neutral-900 p-8 rounded-3xl space-y-4">
                     <div className="flex items-center justify-between">
                       <span className="text-indigo-400 font-black text-xs uppercase tracking-widest">System Broadcast</span>
                       <span className="text-neutral-700 font-mono text-[10px]">2 MINUTES AGO</span>
                     </div>
                     <p className="text-neutral-400 leading-relaxed font-medium">
                       Welcome to the high-fidelity playback environment. Your current session is optimized for 24-bit audio depth at 48kHz. Any feedback left here will be routed directly to the engineering dashboard.
                     </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
