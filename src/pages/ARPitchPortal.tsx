import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Layout, MapPin, Music, FileText, Send, Lock, ChevronRight, Play, Pause, Download } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import SEO from '../components/SEO';

const ARPitchPortal: React.FC = () => {
  const { state } = useStore();
  const { beats } = state;
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(beats[0] || null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auto-expiring / secure link logic
    if (password.toLowerCase() === 'pitch2026') {
      setIsUnlocked(true);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
        <SEO title="Secure A&R Portal | Pyrex spinna" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">A&R Pitch Portal</h1>
          <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
            This is a secure, invite-only gateway for label executives and A&Rs. Enter your pitch-deck credentials to access the exclusive catalog.
          </p>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input 
              type="password"
              placeholder="Access Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-neutral-700 focus:outline-none focus:border-purple-500 transition-all text-center font-mono"
            />
            <button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/20 transition-all active:scale-[0.98]"
            >
              Authorize Access
            </button>
          </form>
          <p className="mt-8 text-[10px] text-neutral-600 uppercase tracking-[0.2em] font-medium">
            Proprietary PyrexSpinna Pipeline • Auto-Expiring Link
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500/30">
      <SEO title="Producer Pitch Deck | Pyrex spinna" />
      
      {/* Standalone Header */}
      <nav className="border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-black font-black flex items-center justify-center rounded-lg text-xl tracking-tighter">
            PS
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-white leading-none">Pyrex spinna</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-purple-400 mt-1">A&R Executive Portal</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Active Pitch</span>
          </div>
          <button className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-all">
            <Layout className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Pitch Info & Catalog */}
        <div className="lg:col-span-4 space-y-8">
          <section>
            <h2 className="text-xs font-black text-purple-500 uppercase tracking-[0.2em] mb-4">Current Campaign</h2>
            <h1 className="text-4xl font-black mb-4 leading-[0.95]">SONIC SYNC REEL 2026</h1>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              A curated selection of high-energy trap and melodic drill masters designed for sync placement and major label project placement.
            </p>
            <div className="flex items-center gap-3">
              <button className="bg-white text-black font-bold px-6 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center gap-2">
                <Send className="w-4 h-4" />
                Request Stems
              </button>
            </div>
          </section>

          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-400" />
              Pitch Catalog
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {beats.map((beat) => (
                <button
                  key={beat.id}
                  onClick={() => setSelectedTrack(beat)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 group ${
                    selectedTrack?.id === beat.id 
                      ? 'bg-purple-600 border-purple-500' 
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                    <img src={beat.artworkUrl || beat.coverArtUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{beat.title}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-widest group-hover:text-neutral-300">
                      {beat.bpm} BPM • {beat.key}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${selectedTrack?.id === beat.id ? 'text-white' : 'text-neutral-700 group-hover:text-neutral-500'}`} />
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Detailed View & Waveform */}
        <div className="lg:col-span-8 space-y-8">
          {selectedTrack ? (
            <motion.div 
              key={selectedTrack.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] -mr-48 -mt-48 rounded-full" />
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row gap-10 mb-12">
                  <div className="w-48 h-48 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800 shrink-0">
                    <img src={selectedTrack.artworkUrl || selectedTrack.coverArtUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-purple-500/20 text-purple-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-purple-500/20">
                        Priority Pitch
                      </span>
                      <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">
                        ISRC: {selectedTrack.isrcCode || 'PENDING'}
                      </span>
                    </div>
                    <h2 className="text-5xl font-black mb-4 leading-none">{selectedTrack.title}</h2>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                        <div className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">Tempo</div>
                        <div className="text-lg font-bold">{selectedTrack.bpm} <span className="text-xs text-neutral-500 uppercase font-medium">BPM</span></div>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                        <div className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">Key</div>
                        <div className="text-lg font-bold">{selectedTrack.key}</div>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                        <div className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">Format</div>
                        <div className="text-lg font-bold text-emerald-400">.m4a</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Markers & Waveform (Mock) */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Sonic Structure</h3>
                    <div className="flex gap-4">
                      <span className="text-[10px] font-bold text-neutral-600">0:00 - Intro</span>
                      <span className="text-[10px] font-bold text-purple-400">0:24 - Drop 1</span>
                      <span className="text-[10px] font-bold text-neutral-600">0:48 - Verse</span>
                    </div>
                  </div>
                  <div className="h-24 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center p-4 relative group">
                    {/* Simulated Waveform Visualizer */}
                    <div className="flex items-end gap-1 h-full w-full">
                      {[...Array(60)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 rounded-full transition-all bg-neutral-800 group-hover:bg-purple-600/40`}
                          style={{ height: `${Math.random() * 80 + 20}%` }}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-xl transform scale-110">
                        <Play className="w-6 h-6 fill-black" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all">
                    <FileText className="w-5 h-5 text-neutral-500" />
                    Review License Agreement
                  </button>
                  <button className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all">
                    <Download className="w-5 h-5 text-neutral-500" />
                    Download Pitch .m4a
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-neutral-700 bg-slate-900/20 border border-dashed border-slate-800 rounded-[2.5rem] p-12">
              <Music className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-sm font-bold uppercase tracking-widest opacity-30">Select a track to review pitch details</p>
            </div>
          )}
        </div>
      </div>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-900 text-center">
        <p className="text-[10px] text-neutral-600 uppercase tracking-[0.2em] font-medium leading-relaxed">
          Proprietary Pitch Pipeline • Pyrex spinna Enterprise • Powered by PyrexSpinna Engine<br />
          © 2026 Pyrex spinna. All Rights Reserved. Private & Confidential.
        </p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
};

export default ARPitchPortal;
