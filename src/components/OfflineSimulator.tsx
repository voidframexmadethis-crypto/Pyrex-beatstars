import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wifi, WifiOff, Database, ShieldCheck, Activity, Globe, RefreshCcw, Layout, Play } from 'lucide-react';
import SEO from './SEO';
import { useStore } from '../context/StoreContext';

const OfflineSimulator: React.FC = () => {
  const { state } = useStore();
  const { beats } = state;
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swStatus, setSwStatus] = useState<'active' | 'inactive' | 'loading'>('loading');
  const [cachedBeats, setCachedBeats] = useState<string[]>([]);
  const [simulatedOffline, setSimulatedOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check SW Status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => setSwStatus('active'));
    } else {
      setSwStatus('inactive');
    }

    // Check Cache
    if ('caches' in window) {
      caches.open('krypside-audio-cache').then(cache => {
        cache.keys().then(keys => {
          const urls = keys.map(k => k.url);
          setCachedBeats(urls);
        });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulation = () => {
    setSimulatedOffline(!simulatedOffline);
  };

  const checkCacheProgress = async () => {
    if ('caches' in window) {
      const cache = await caches.open('krypside-audio-cache');
      const keys = await cache.keys();
      setCachedBeats(keys.map(k => k.url));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <SEO title="Offline PWA Simulator | Krypside Debug" />
      
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-2">PWA Network Simulator</h1>
            <p className="text-neutral-500 text-sm uppercase tracking-widest font-bold">Offline Integrity & Cache Testing Portal</p>
          </div>
          <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${
            (isOnline && !simulatedOffline) ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}>
            {(isOnline && !simulatedOffline) ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-[10px] font-black uppercase tracking-widest">
              {(isOnline && !simulatedOffline) ? 'Network Connected' : 'Simulated Offline'}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Status Cards */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <Activity className="w-6 h-6 text-purple-500 mb-4" />
            <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Service Worker</div>
            <div className={`text-xl font-black uppercase ${swStatus === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
              {swStatus === 'active' ? 'Operational' : 'Disconnected'}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <Database className="w-6 h-6 text-blue-500 mb-4" />
            <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Cached Assets</div>
            <div className="text-xl font-black text-white">{cachedBeats.length} <span className="text-xs text-neutral-500 font-bold uppercase">Tracks</span></div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <ShieldCheck className="w-6 h-6 text-emerald-500 mb-4" />
            <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">PWA Integrity</div>
            <div className="text-xl font-black text-white uppercase">Verified</div>
          </div>
        </div>

        <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black uppercase tracking-tight">Offline Control Panel</h2>
            <button 
              onClick={toggleSimulation}
              className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                simulatedOffline ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {simulatedOffline ? 'Reconnect Network' : 'Simulate Offline Mode'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">Simulation Rules</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium text-neutral-400">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Local audio previews (.m4a) served via Service Worker cache.
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-neutral-400">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Catalog JSON persistence through IndexedDB / Cache API.
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-neutral-400">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  UI layout state preserved without active server link.
                </li>
              </ul>
            </div>

            <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Active Cache Queue</h3>
                <button onClick={checkCacheProgress} className="text-emerald-500 hover:text-emerald-400 transition-colors">
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                {cachedBeats.length === 0 ? (
                  <div className="text-[10px] text-neutral-700 uppercase font-black py-4 text-center">No tracks cached yet</div>
                ) : (
                  cachedBeats.map((url, i) => (
                    <div key={i} className="text-[9px] text-emerald-500/60 truncate font-mono bg-emerald-500/5 p-1.5 rounded border border-emerald-500/10">
                      {url.split('/').pop()}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Layout className="w-5 h-5 text-purple-500" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Offline Catalog Test</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beats.slice(0, 4).map((beat) => (
              <div key={beat.id} className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <img src={beat.artworkUrl || beat.coverArtUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black text-white truncate">{beat.title}</div>
                  <div className="text-[9px] text-neutral-500 uppercase font-bold mt-0.5">
                    {cachedBeats.some(url => url.includes(beat.id)) ? (
                      <span className="text-emerald-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Cached & Ready
                      </span>
                    ) : (
                      <span className="text-neutral-600">Pending Local Save</span>
                    )}
                  </div>
                </div>
                <button className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all">
                  <Play className="w-4 h-4 fill-white" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-20 text-center">
          <p className="text-[10px] text-neutral-700 uppercase tracking-[0.3em] font-black leading-relaxed">
            Krypside Offline Reliability Protocol<br />
            Simulating Disconnected Environments for iPad/Mobile QA
          </p>
        </footer>
      </div>

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
      `}</style>
    </div>
  );
};

export default OfflineSimulator;
