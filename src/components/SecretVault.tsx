import React, { useState } from 'react';
import { PrivateVault, Beat } from '../types';
import { useStore } from '../context/StoreContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { Lock, Play, Pause, Download, Music, ShieldCheck, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const SecretVault = ({ vaultData }: { vaultData: PrivateVault }) => {
  const [enteredPass, setEnteredPass] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const { state } = useStore();
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPass === vaultData.passcode) {
      setUnlocked(true);
    } else {
      alert("Invalid passcode. Access denied.");
    }
  };

  const vaultBeats = (state.beats || []).filter(beat => vaultData.beatIds.includes(beat.id));

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900 p-8 rounded-2xl border border-purple-500/30 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-600" />
          
          <div className="w-16 h-16 bg-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
            <Lock className="text-purple-400" size={32} />
          </div>
          
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Private Client Vault</h2>
          <p className="text-neutral-400 text-sm mb-8 font-medium">Prepared exclusively for <span className="text-purple-300 font-bold">{vaultData.clientName}</span></p>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input 
                type="password" 
                value={enteredPass} 
                onChange={(e) => setEnteredPass(e.target.value)} 
                placeholder="Enter Client Passcode" 
                className="w-full p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-center text-white font-mono tracking-[0.5em] focus:outline-none focus:border-purple-500 transition-all placeholder:tracking-normal placeholder:font-sans"
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-black text-white transition-all transform active:scale-95 shadow-lg shadow-purple-600/20 uppercase tracking-widest text-xs"
            >
              Access Vault Beats
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center justify-center gap-4 text-neutral-500 text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Secure Access</span>
            </div>
            <div className="w-1 h-1 bg-neutral-800 rounded-full" />
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-amber-500" />
              <span>Expires {new Date(vaultData.expiresAt).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
            <div className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-widest">
              Exclusive Client Access
            </div>
            {vaultData.expiresAt && (
              <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-500 uppercase tracking-widest">
                Expires: {new Date(vaultData.expiresAt).toLocaleDateString()}
              </div>
            )}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tighter uppercase">
            Vault: <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">{vaultData.clientName}</span>
          </h1>
          <p className="text-neutral-400 text-lg font-medium max-w-2xl">
            Strictly confidential curated catalog selections and unreleased drafts. 
            License rights are reserved for {vaultData.clientName} only.
          </p>
        </header>

        <div className="space-y-4">
          {vaultBeats.length === 0 ? (
            <div className="p-12 bg-neutral-900/50 border border-neutral-800 rounded-3xl text-center">
              <Music className="mx-auto text-neutral-700 mb-4" size={48} />
              <p className="text-neutral-400 font-bold italic">No beats currently assigned to this vault.</p>
            </div>
          ) : (
            vaultBeats.map((beat) => {
              const isCurrent = currentTrack?.id === beat.id;
              const playing = isCurrent && isPlaying;

              return (
                <motion.div 
                  key={beat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`group p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-center gap-4 sm:gap-6 ${
                    isCurrent 
                    ? 'bg-purple-900/10 border-purple-500/40 shadow-xl shadow-purple-900/5' 
                    : 'bg-neutral-900/40 border-neutral-800/60 hover:border-neutral-700'
                  }`}
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                    <img 
                      src={beat.coverArtUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'} 
                      alt={beat.title}
                      className="w-full h-full object-cover rounded-xl shadow-lg"
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={() => playTrack(beat)}
                      className={`absolute inset-0 flex items-center justify-center rounded-xl transition-all ${
                        playing ? 'bg-black/40' : 'bg-black/0 group-hover:bg-black/40'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        playing ? 'bg-purple-500 scale-110' : 'bg-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'
                      }`}>
                        {playing ? <Pause className="text-white fill-current" size={20} /> : <Play className="text-black fill-current ml-1" size={20} />}
                      </div>
                    </button>
                  </div>

                  <div className="flex-grow text-center sm:text-left min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate uppercase tracking-tight">
                      {beat.title}
                    </h3>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span>{beat.bpm} BPM</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-purple-400/80">
                        <span>KEY: {beat.key}</span>
                      </div>
                      {beat.tags && beat.tags.length > 0 && (
                        <div className="hidden md:flex items-center gap-2">
                          <span className="text-neutral-700">•</span>
                          <span className="text-neutral-600">{beat.tags.slice(0, 3).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => {
                        if (beat.audioUrl) {
                          const link = document.createElement('a');
                          link.href = beat.audioUrl;
                          link.download = `${beat.title}.mp3`;
                          link.click();
                        }
                      }}
                      className="flex-1 sm:flex-initial px-6 py-3 bg-neutral-950 border border-neutral-800 hover:border-purple-500/50 hover:text-purple-400 rounded-xl text-xs font-black text-neutral-400 uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        <footer className="mt-16 pt-8 border-t border-neutral-900 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600">
            Pyrex Spinna Enterprise • Secure Client Portal • {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};
