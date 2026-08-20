import React, { useState } from 'react';
import { initialBeatCatalog } from '../data/beatCatalog';
import type { CatalogBeat } from '../data/beatCatalog';

export type { CatalogBeat };

export default function BeatStore() {
  // 1. Replace your useState for beats with this persistent LocalStorage version:
  const [beats, setBeats] = useState<CatalogBeat[]>(() => {
    const savedBeats = localStorage.getItem('pyrexx_beat_catalog');
    if (savedBeats) {
      try {
        return JSON.parse(savedBeats);
      } catch (e) {
        console.error("Failed to parse saved beats", e);
      }
    }
    // Default starting beats if nothing is saved yet
    return [
      {
        id: 1,
        title: "Costly",
        bpm: 128,
        key: "B Minor",
        genre: "Trap",
        price: 29.99,
        audioUrl: "https://archive.org/download/test-audio-sample/sample.m4a",
        artwork: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60"
      }
    ];
  });

  // Save to localStorage automatically whenever your beats array changes:
  React.useEffect(() => {
    localStorage.setItem('pyrexx_beat_catalog', JSON.stringify(beats));
  }, [beats]);

  const [activeBeat, setActiveBeat] = useState<CatalogBeat | null>(null);
  const [customPrice, setCustomPrice] = useState<string | number>('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState('WAV Lease');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUploadNewBeat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      title: { value: string };
      bpm: { value: string };
      key: { value: string };
      genre: { value: string };
      price: { value: string };
      artworkUrl?: { value: string };
      audioUrl?: { value: string };
    };
    
    // Grab values from your form inputs
    const newBeat: CatalogBeat = {
      id: Date.now(), // unique timestamp ID
      title: target.title.value || "Untitled Beat",
      bpm: target.bpm.value || "140",
      key: target.key.value || "C Minor",
      genre: target.genre.value || "Trap",
      price: Number(target.price.value) || 29.99,
      // Falls back to a clean default artwork if none uploaded, preventing broken image text
      artwork: target.artworkUrl?.value || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60",
      audioUrl: target.audioUrl?.value || ""
    };

    // Updates state AND saves directly to LocalStorage automatically via your useEffect
    setBeats([newBeat, ...beats]);
    alert("Beat uploaded and permanently saved to local storage!");
    setShowUploadModal(false);
  };

  // Open checkout modal with the clicked beat
  const handleOpenCheckout = (beat: CatalogBeat) => {
    setActiveBeat(beat);
    setCustomPrice(beat.price);
    setShowCheckout(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex w-full" id="beat-store-container">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#120a1f]/50 border-r border-purple-500/20 p-6 hidden md:flex flex-col justify-between shrink-0">
        <div>
          <h1 className="text-xl font-extrabold tracking-widest text-purple-400 mb-8">
            PYREXX SHOP
          </h1>
          <nav className="space-y-4 text-sm font-medium text-purple-300/80">
            <a href="#/" className="block hover:text-white transition-all">🏠 Home</a>
            <a href="#/storefront" className="block hover:text-white transition-all">🔥 Catalog</a>
            <a href="#/player" className="block hover:text-white transition-all">💎 Player</a>
          </nav>
        </div>
        <div className="text-xs text-purple-400/50">
          API-Free Vite Build v1.0
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl">
        <header className="flex flex-wrap gap-4 justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-wide">Producer Catalog</h2>
            <p className="text-xs text-purple-300/60 mt-0.5">Manage and license custom instrumentals</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="open-upload-beat-modal-btn"
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg flex items-center gap-1.5"
            >
              <span>➕</span>
              <span>Upload Beat</span>
            </button>
            <div className="bg-purple-900/40 border border-purple-500/30 px-4 py-2 rounded-xl text-sm font-semibold text-purple-300">
              Pyrexx Spinna (Producer)
            </div>
          </div>
        </header>

        {/* Beat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {beats.map((beat) => (
            <div 
              key={beat.id}
              className="bg-[#140c22] border border-purple-500/20 rounded-2xl p-4 hover:border-purple-500/50 transition-all shadow-xl group flex flex-col justify-between"
            >
              <div>
                {/* Artwork */}
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-black">
                  <img 
                    src={beat.artwork} 
                    alt={beat.title} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Title & Metadata */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-white mb-1">{beat.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-purple-300/70">
                    <span className="bg-purple-950 px-2 py-1 rounded-md">{beat.bpm} BPM</span>
                    <span className="bg-purple-950 px-2 py-1 rounded-md">{beat.key}</span>
                    <span className="bg-purple-950 px-2 py-1 rounded-md">{beat.genre}</span>
                  </div>
                </div>
              </div>

              {/* Price & Buy Action */}
              <div className="flex items-center justify-between pt-3 border-t border-purple-500/10 mt-2">
                <div>
                  <p className="text-[10px] uppercase text-purple-400 font-semibold">Starting At</p>
                  <p className="text-lg font-black text-purple-200">${Number(beat.price).toFixed(2)}</p>
                </div>
                <button 
                  id={`buy-license-btn-${beat.id}`}
                  onClick={() => handleOpenCheckout(beat)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 active:scale-95 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all shadow-md text-white"
                >
                  BUY / LICENSE
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Secure Checkout Modal */}
      {showCheckout && activeBeat && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#120a1f] border border-purple-500/40 rounded-2xl max-w-lg w-full p-6 text-white relative shadow-2xl">
            
            {/* Close Button */}
            <button 
              id="close-checkout-modal-btn"
              type="button"
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 bg-purple-600/30 hover:bg-purple-600/60 p-2.5 rounded-xl text-white transition-all focus:outline-none"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold tracking-wider mb-5 text-purple-200">
              SECURE CHECKOUT TERMINAL
            </h2>

            {/* Dynamic Summary Card */}
            <div className="bg-purple-950/40 border border-purple-500/20 rounded-xl p-4 mb-5 flex justify-between items-center">
              <div>
                <p className="text-xs text-purple-400 uppercase tracking-widest font-semibold">{selectedLicense}</p>
                <p className="font-bold text-base text-white mt-1">{activeBeat.title}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-purple-300">
                  ${Number(customPrice || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Custom Producer Price Input */}
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-wider text-purple-400 mb-1.5 font-semibold">
                Custom Price (USD)
              </label>
              <input 
                id="modal-custom-price-input"
                type="number" 
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full bg-black/60 border border-purple-500/40 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 text-lg font-bold"
              />
            </div>

            {/* License Tier Selector */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider text-purple-400 mb-1.5 font-semibold">
                Select License Tier
              </label>
              <select 
                id="modal-license-tier-select"
                value={selectedLicense}
                onChange={(e) => {
                  const tier = e.target.value;
                  setSelectedLicense(tier);
                  if (tier === 'WAV Lease') setCustomPrice(activeBeat.price);
                  if (tier === 'Trackout Lease') setCustomPrice(activeBeat.price * 1.5);
                  if (tier === 'Exclusive Rights') setCustomPrice(activeBeat.price * 4);
                }}
                className="w-full bg-black/60 border border-purple-500/40 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 cursor-pointer"
              >
                <option value="WAV Lease">WAV Lease — ${Number(activeBeat.price).toFixed(2)} USD</option>
                <option value="Trackout Lease">Trackout Lease — ${(Number(activeBeat.price) * 1.5).toFixed(2)} USD</option>
                <option value="Exclusive Rights">Exclusive Rights — ${(Number(activeBeat.price) * 4).toFixed(2)} USD</option>
              </select>
            </div>

            {/* Payment Gateways */}
            <div className="grid grid-cols-3 gap-3">
              <button 
                id="gateway-1tap-btn"
                type="button"
                onClick={() => alert(`Initiating 1-Tap checkout for ${activeBeat.title} at $${Number(customPrice || 0).toFixed(2)}`)}
                className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-extrabold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg text-sm"
              >
                ⚡ 1-TAP
              </button>
              <button 
                id="gateway-paypal-btn"
                type="button"
                onClick={() => alert(`Initiating PayPal checkout for ${activeBeat.title} at $${Number(customPrice || 0).toFixed(2)}`)}
                className="bg-purple-600/50 hover:bg-purple-600/80 border border-purple-400/30 text-white font-bold py-3 rounded-xl active:scale-95 transition-all text-sm"
              >
                💳 PAYPAL
              </button>
              <button 
                id="gateway-crypto-btn"
                type="button"
                onClick={() => alert(`Initiating Crypto checkout for ${activeBeat.title} at $${Number(customPrice || 0).toFixed(2)}`)}
                className="bg-purple-600/50 hover:bg-purple-600/80 border border-purple-400/30 text-white font-bold py-3 rounded-xl active:scale-95 transition-all text-sm"
              >
                💎 CRYPTO
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Upload New Beat Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#120a1f] border border-purple-500/40 rounded-2xl max-w-lg w-full p-6 text-white relative shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button 
              id="close-upload-modal-btn"
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 bg-purple-600/30 hover:bg-purple-600/60 p-2.5 rounded-xl text-white transition-all focus:outline-none"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold tracking-wider mb-5 text-purple-200">
              UPLOAD NEW BEAT
            </h2>

            <form onSubmit={handleUploadNewBeat} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-purple-400 mb-1.5 font-semibold">
                  Beat Title
                </label>
                <input 
                  type="text" 
                  name="title" 
                  placeholder="e.g. Costly, Midnight Mirage"
                  required
                  className="w-full bg-black/60 border border-purple-500/40 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-purple-400 mb-1.5 font-semibold">
                    BPM
                  </label>
                  <input 
                    type="text" 
                    name="bpm" 
                    placeholder="140"
                    defaultValue="140"
                    className="w-full bg-black/60 border border-purple-500/40 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-purple-400 mb-1.5 font-semibold">
                    Musical Key
                  </label>
                  <input 
                    type="text" 
                    name="key" 
                    placeholder="C Minor"
                    defaultValue="C Minor"
                    className="w-full bg-black/60 border border-purple-500/40 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-purple-400 mb-1.5 font-semibold">
                    Genre
                  </label>
                  <input 
                    type="text" 
                    name="genre" 
                    placeholder="Trap"
                    defaultValue="Trap"
                    className="w-full bg-black/60 border border-purple-500/40 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-purple-400 mb-1.5 font-semibold">
                    Starting Price ($ USD)
                  </label>
                  <input 
                    type="number" 
                    name="price" 
                    step="0.01"
                    placeholder="29.99"
                    defaultValue="29.99"
                    className="w-full bg-black/60 border border-purple-500/40 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-purple-400 mb-1.5 font-semibold">
                  Artwork Image URL (Optional)
                </label>
                <input 
                  type="url" 
                  name="artworkUrl" 
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-black/60 border border-purple-500/40 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-purple-400 mb-1.5 font-semibold">
                  Audio Stream URL (Optional)
                </label>
                <input 
                  type="url" 
                  name="audioUrl" 
                  placeholder="https://archive.org/download/.../beat.mp3"
                  className="w-full bg-black/60 border border-purple-500/40 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 text-sm"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 active:scale-95 text-white font-bold py-3 rounded-xl transition-all shadow-lg text-sm tracking-wider"
                >
                  SAVE & PUBLISH BEAT
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
