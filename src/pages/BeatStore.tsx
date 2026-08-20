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
  const [currentView, setCurrentView] = useState<'catalog' | 'profile' | 'profile-home' | 'profile-settings' | 'merch'>('catalog');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Editable producer profile settings stored in state/localStorage
  const [profileSettings, setProfileSettings] = useState(() => {
    const saved = localStorage.getItem('pyrexx_profile_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      displayName: 'Pyrex Spinna',
      title: 'Verified Executive Producer',
      bio: 'Specializing in aggressive 808 patterns, dark ambient trap melodies, and cinematic sound design for charting recording artists and media sync licensing.',
      location: 'Atlanta / Worldwide',
      daws: 'FL Studio 21 Signature & Ableton 12',
      synths: 'Dave Smith Prophet-6, Moog Sub 37',
      monitoring: 'Yamaha HS8 + Focal Alpha 65 EVO',
      processing: 'Universal Audio Apollo x6, SSL Fusion',
      email: 'pyrexxspinna@gmail.com',
      instagram: '@pyrexxspinna',
      payoutAddress: 'pyrexxspinna@gmail.com'
    };
  });
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingBeatId, setPlayingBeatId] = useState<string | number | null>(null);

  const handlePlayBeat = (beat: CatalogBeat) => {
    if (!beat.audioUrl) {
      alert("No audio file linked to this track yet. Add a direct audio link!");
      return;
    }
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = new Audio(beat.audioUrl);
    audio.play().catch((err) => {
      console.error("Audio play error:", err);
    });
    audio.onended = () => {
      setIsPlaying(false);
      setPlayingBeatId(null);
    };
    setCurrentAudio(audio);
    setPlayingBeatId(beat.id);
    setIsPlaying(true);
  };

  const handleTogglePlay = (beat: CatalogBeat) => {
    if (playingBeatId === beat.id && isPlaying && currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
      return;
    }
    handlePlayBeat(beat);
  };

  // Clean up audio on unmount
  React.useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);

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
    <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col w-full" id="beat-store-container">
      
      {/* Top Header Bar */}
      <header className="w-full flex justify-between items-center px-6 py-4 border-b border-purple-900/40 bg-black/40 backdrop-blur-md shrink-0">
        {/* Left side: Brand or Logo */}
        <div 
          className="text-xl font-bold text-white tracking-wider cursor-pointer"
          onClick={() => setCurrentView('catalog')}
        >
          PyrexSpinna
        </div>

        {/* Right side: Top-Right Profile Trigger with Dropdown */}
        <div className="relative">
          {/* The Clickable Producer Sign In / Profile Trigger Button */}
          <button 
            id="top-producer-signin-trigger-btn"
            type="button"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #9333ea, #c084fc)',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
            }}
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-[10px]">
              PY
            </div>
            <span>PRODUCER SIGN IN ({profileSettings.displayName || 'Pyrex Spinna'})</span>
            <span className={`text-[10px] text-white transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {/* The Dropdown Menu Box */}
          {isProfileDropdownOpen && (
            <>
              {/* Backdrop for click outside */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsProfileDropdownOpen(false)} 
              />
              <div 
                id="profile-dropdown-menu"
                className="absolute right-0 mt-2 w-56 bg-zinc-900/95 backdrop-blur-md border border-purple-800/60 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-4 py-2 border-b border-purple-500/10 mb-1">
                  <p className="text-xs font-bold text-white truncate">{profileSettings.displayName || 'Pyrex Spinna'}</p>
                  <p className="text-[10px] text-purple-400 truncate">{profileSettings.email || 'pyrexxspinna@gmail.com'}</p>
                </div>
                <button 
                  id="dropdown-profile-home-btn"
                  type="button"
                  onClick={() => {
                    setCurrentView('profile-home');
                    setIsProfileDropdownOpen(false); // Closes menu after clicking
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-purple-200 hover:bg-purple-900/50 hover:text-white transition-all flex items-center gap-2.5 cursor-pointer font-medium"
                >
                  <span className="text-base">👤</span>
                  <span>My Profile Home Page</span>
                </button>
                <button 
                  id="dropdown-profile-settings-btn"
                  type="button"
                  onClick={() => {
                    setCurrentView('profile-settings');
                    setIsProfileDropdownOpen(false); // Closes menu after clicking
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-purple-200 hover:bg-purple-900/50 hover:text-white transition-all flex items-center gap-2.5 cursor-pointer font-medium"
                >
                  <span className="text-base">⚙️</span>
                  <span>Edit Profile Settings</span>
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-1 w-full overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[#120a1f]/50 border-r border-purple-500/20 p-6 hidden md:flex flex-col justify-between shrink-0">
          <div>
            <h1 className="text-xl font-extrabold tracking-widest text-purple-400 mb-8 cursor-pointer" onClick={() => setCurrentView('catalog')}>
              PYREXX SHOP
            </h1>
            <nav className="space-y-4 text-sm font-medium text-purple-300/80">
              <button 
                id="nav-catalog-btn"
                onClick={() => setCurrentView('catalog')} 
                className={`block hover:text-white transition-all text-left w-full ${currentView === 'catalog' ? 'text-white font-bold bg-purple-900/30 px-3 py-2 rounded-xl border border-purple-500/30' : 'px-3 py-1'}`}
              >
                🏠 Catalog (Home)
              </button>
              
              {/* Profile Dropdown Link */}
              <button 
                id="nav-profile-btn"
                onClick={() => setCurrentView('profile-home')} 
                className={`block hover:text-white transition-all text-left w-full ${currentView === 'profile' || currentView === 'profile-home' || currentView === 'profile-settings' ? 'text-white font-bold bg-purple-900/30 px-3 py-2 rounded-xl border border-purple-500/30' : 'px-3 py-1'}`}
              >
                👤 Producer Profile
              </button>

              <button 
                id="nav-merch-btn"
                onClick={() => setCurrentView('merch')} 
                className={`block hover:text-white transition-all text-left w-full ${currentView === 'merch' ? 'text-white font-bold bg-purple-900/30 px-3 py-2 rounded-xl border border-purple-500/30' : 'px-3 py-1'}`}
              >
                👕 Merch & Soundkits
              </button>
            </nav>
          </div>
          <div className="text-xs text-purple-400/50">
            API-Free Vite Build v1.0
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl">
          {/* Top Header */}
          <header className="flex flex-wrap gap-4 justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-wide">
                {currentView === 'catalog' && 'Producer Catalog'}
                {(currentView === 'profile' || currentView === 'profile-home') && 'My Profile Home Page'}
                {currentView === 'profile-settings' && 'Edit Profile Settings'}
                {currentView === 'merch' && 'Merchandise & Soundkits'}
              </h2>
              <p className="text-xs text-purple-300/60 mt-0.5">
                {currentView === 'catalog' && 'Manage, stream, and license custom instrumentals'}
                {(currentView === 'profile' || currentView === 'profile-home') && 'Official producer biography, studio gear, and placements'}
                {currentView === 'profile-settings' && 'Customize your producer alias, biography, studio gear, and payout accounts'}
                {currentView === 'merch' && 'Exclusive sound design packs, presets, and apparel'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {currentView === 'catalog' && (
                <button
                  id="open-upload-beat-modal-btn"
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg flex items-center gap-1.5"
                >
                  <span>➕</span>
                  <span>Upload Beat</span>
                </button>
              )}
            </div>
          </header>

        {/* View 1: Catalog */}
        {currentView === 'catalog' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {beats.map((beat) => {
              const isThisPlaying = playingBeatId === beat.id && isPlaying;
              return (
                <div 
                  key={beat.id}
                  className={`bg-[#140c22] border ${isThisPlaying ? 'border-purple-400 shadow-purple-500/20' : 'border-purple-500/20'} rounded-2xl p-4 hover:border-purple-500/50 transition-all shadow-xl group flex flex-col justify-between`}
                >
                  <div>
                    {/* Artwork & Play Overlay */}
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-black group/art">
                      <img 
                        src={beat.artwork} 
                        alt={beat.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {/* Play/Pause Button Overlay */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/art:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          id={`play-beat-btn-${beat.id}`}
                          type="button"
                          onClick={() => handleTogglePlay(beat)}
                          className="bg-purple-600/90 hover:bg-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-2xl transition-transform hover:scale-110 active:scale-95"
                          title={isThisPlaying ? "Pause Audio" : "Play Beat Audio"}
                        >
                          {isThisPlaying ? "⏸" : "▶"}
                        </button>
                      </div>
                      {/* Playing indicator badge */}
                      {isThisPlaying && (
                        <div className="absolute top-2.5 left-2.5 bg-purple-600/90 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>Playing</span>
                        </div>
                      )}
                    </div>

                    {/* Title & Metadata */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-bold text-lg text-white truncate">{beat.title}</h3>
                        <button
                          type="button"
                          onClick={() => handleTogglePlay(beat)}
                          className="text-purple-400 hover:text-white text-xs font-semibold px-2 py-1 rounded bg-purple-950/60 border border-purple-500/20 shrink-0"
                        >
                          {isThisPlaying ? "⏸ Pause" : "▶ Preview"}
                        </button>
                      </div>
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
              );
            })}
          </div>
        )}

        {/* View 2: Producer Profile */}
        {(currentView === 'profile' || currentView === 'profile-home') && (
          <div className="space-y-6 pb-20 max-w-5xl">
            {/* Banner Card */}
            <div className="bg-gradient-to-r from-purple-950/80 via-[#180d2b] to-[#120a1f] border border-purple-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60"
                    alt={profileSettings.displayName}
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-purple-400/50 shadow-2xl"
                  />
                  <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-black shadow">
                    Active
                  </span>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <div className="inline-block bg-purple-600/30 border border-purple-400/40 text-purple-200 text-xs font-bold px-3 py-1 rounded-full mb-2">
                    {profileSettings.title}
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {profileSettings.displayName}
                  </h3>
                  <p className="text-sm text-purple-300/80 mt-2 max-w-xl">
                    {profileSettings.bio}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-xs font-semibold text-purple-200">
                    <span className="bg-black/50 px-3 py-1.5 rounded-lg border border-purple-500/20">📍 {profileSettings.location}</span>
                    <span className="bg-black/50 px-3 py-1.5 rounded-lg border border-purple-500/20">🎹 {profileSettings.daws}</span>
                    <span className="bg-black/50 px-3 py-1.5 rounded-lg border border-purple-500/20">🔥 {beats.length} Instrumentals in Catalog</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#140c22] border border-purple-500/20 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-purple-300">120K+</p>
                <p className="text-xs text-purple-400/70 font-semibold uppercase mt-1">Total Plays</p>
              </div>
              <div className="bg-[#140c22] border border-purple-500/20 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-purple-300">{beats.length}</p>
                <p className="text-xs text-purple-400/70 font-semibold uppercase mt-1">Active Beats</p>
              </div>
              <div className="bg-[#140c22] border border-purple-500/20 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-purple-300">100%</p>
                <p className="text-xs text-purple-400/70 font-semibold uppercase mt-1">Royalty Free Leases</p>
              </div>
              <div className="bg-[#140c22] border border-purple-500/20 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-purple-300">24/7</p>
                <p className="text-xs text-purple-400/70 font-semibold uppercase mt-1">Instant Delivery</p>
              </div>
            </div>

            {/* Producer Bio & Studio Setup */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#140c22] border border-purple-500/20 rounded-2xl p-6">
                <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <span>📜</span> Biography & Production Philosophy
                </h4>
                <p className="text-sm text-purple-200/70 leading-relaxed">
                  {profileSettings.bio}
                </p>
                <div className="mt-4 pt-4 border-t border-purple-500/20 flex flex-wrap gap-3">
                  <button
                    onClick={() => setCurrentView('catalog')}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                  >
                    Browse Beat Catalog
                  </button>
                  <button
                    onClick={() => setCurrentView('profile-settings')}
                    className="bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 text-purple-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <span>⚙️</span>
                    <span>Edit Profile Settings</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#140c22] border border-purple-500/20 rounded-2xl p-6">
                <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <span>🎛️</span> Studio Rig & Sound Design
                </h4>
                <ul className="text-xs space-y-2.5 text-purple-200/80">
                  <li className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg border border-purple-500/10">
                    <span className="font-semibold text-purple-300">Primary DAW</span>
                    <span>{profileSettings.daws}</span>
                  </li>
                  <li className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg border border-purple-500/10">
                    <span className="font-semibold text-purple-300">Hardware Synths</span>
                    <span>{profileSettings.synths}</span>
                  </li>
                  <li className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg border border-purple-500/10">
                    <span className="font-semibold text-purple-300">Monitoring</span>
                    <span>{profileSettings.monitoring}</span>
                  </li>
                  <li className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg border border-purple-500/10">
                    <span className="font-semibold text-purple-300">Processing</span>
                    <span>{profileSettings.processing}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* View: Edit Profile Settings */}
        {currentView === 'profile-settings' && (
          <div className="space-y-6 pb-20 max-w-4xl">
            <div className="bg-[#140c22] border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>⚙️</span> Producer Profile & Account Settings
                  </h3>
                  <p className="text-xs text-purple-300/70 mt-1">
                    Update your public alias, producer bio, studio rig details, and payout email.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('profile-home')}
                  className="bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
                >
                  👁️ View Public Profile
                </button>
              </div>

              {settingsSavedMessage && (
                <div className="mb-6 p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                  <span>✅</span> Profile settings successfully saved!
                </div>
              )}

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  localStorage.setItem('pyrexx_profile_settings', JSON.stringify(profileSettings));
                  setSettingsSavedMessage(true);
                  setTimeout(() => setSettingsSavedMessage(false), 3000);
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-300 mb-1">Producer Display Name</label>
                    <input 
                      type="text" 
                      value={profileSettings.displayName}
                      onChange={(e) => setProfileSettings({ ...profileSettings, displayName: e.target.value })}
                      className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-300 mb-1">Professional Title / Badge</label>
                    <input 
                      type="text" 
                      value={profileSettings.title}
                      onChange={(e) => setProfileSettings({ ...profileSettings, title: e.target.value })}
                      className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">Producer Bio / Sound Description</label>
                  <textarea 
                    rows={3}
                    value={profileSettings.bio}
                    onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })}
                    className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-300 mb-1">Location / Base</label>
                    <input 
                      type="text" 
                      value={profileSettings.location}
                      onChange={(e) => setProfileSettings({ ...profileSettings, location: e.target.value })}
                      className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-300 mb-1">Primary DAWs</label>
                    <input 
                      type="text" 
                      value={profileSettings.daws}
                      onChange={(e) => setProfileSettings({ ...profileSettings, daws: e.target.value })}
                      className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-300 mb-1">Hardware Synths</label>
                    <input 
                      type="text" 
                      value={profileSettings.synths}
                      onChange={(e) => setProfileSettings({ ...profileSettings, synths: e.target.value })}
                      className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-300 mb-1">Monitoring Monitors</label>
                    <input 
                      type="text" 
                      value={profileSettings.monitoring}
                      onChange={(e) => setProfileSettings({ ...profileSettings, monitoring: e.target.value })}
                      className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-300 mb-1">Processing Gear</label>
                    <input 
                      type="text" 
                      value={profileSettings.processing}
                      onChange={(e) => setProfileSettings({ ...profileSettings, processing: e.target.value })}
                      className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-purple-500/10">
                  <div>
                    <label className="block text-xs font-semibold text-purple-300 mb-1">PayPal / Stripe Payout Email</label>
                    <input 
                      type="email" 
                      value={profileSettings.payoutAddress}
                      onChange={(e) => setProfileSettings({ ...profileSettings, payoutAddress: e.target.value })}
                      className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-300 mb-1">Instagram / Contact Handle</label>
                    <input 
                      type="text" 
                      value={profileSettings.instagram}
                      onChange={(e) => setProfileSettings({ ...profileSettings, instagram: e.target.value })}
                      className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 active:scale-95 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg cursor-pointer"
                  >
                    💾 Save Profile Settings
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCurrentView('catalog')}
                    className="text-xs text-purple-400 hover:text-white transition-all font-semibold cursor-pointer"
                  >
                    Cancel & Return to Catalog
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View 3: Merch & Soundkits */}
        {currentView === 'merch' && (
          <div className="space-y-6 pb-20 max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#140c22] border border-purple-500/20 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-purple-950 flex items-center justify-center text-4xl">
                    🥁
                  </div>
                  <h4 className="font-bold text-lg text-white">Pyrexx Trap Drumkit Vol. 1</h4>
                  <p className="text-xs text-purple-300/70 mt-1">150+ Custom 808s, Hard Snares, Crisp Hi-Hats, and Percussion One-Shots.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-purple-500/10 flex items-center justify-between">
                  <span className="text-lg font-black text-purple-200">$19.99</span>
                  <button 
                    onClick={() => alert("Soundkit purchase coming soon! Contact pyrexxspinna@gmail.com")}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Get Soundkit
                  </button>
                </div>
              </div>

              <div className="bg-[#140c22] border border-purple-500/20 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-purple-950 flex items-center justify-center text-4xl">
                    🎹
                  </div>
                  <h4 className="font-bold text-lg text-white">Dark Ambient Melodies (MIDI/WAV)</h4>
                  <p className="text-xs text-purple-300/70 mt-1">30 Royalty-Free placement-ready trap melody loops with key and BPM tagged.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-purple-500/10 flex items-center justify-between">
                  <span className="text-lg font-black text-purple-200">$24.99</span>
                  <button 
                    onClick={() => alert("Loop pack download available soon! Contact pyrexxspinna@gmail.com")}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Get Loop Pack
                  </button>
                </div>
              </div>

              <div className="bg-[#140c22] border border-purple-500/20 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-purple-950 flex items-center justify-center text-4xl">
                    👕
                  </div>
                  <h4 className="font-bold text-lg text-white">Official Pyrexx Heavyweight Hoodie</h4>
                  <p className="text-xs text-purple-300/70 mt-1">100% French Terry cotton producer hoodie with embroidered neon logo.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-purple-500/10 flex items-center justify-between">
                  <span className="text-lg font-black text-purple-200">$59.99</span>
                  <button 
                    onClick={() => alert("Merch order inquiries: pyrexxspinna@gmail.com")}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Order Merch
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>

      {/* Persistent Floating Audio Bar */}
      {playingBeatId && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0e0717]/95 border-t border-purple-500/30 backdrop-blur-md px-4 py-3 flex items-center justify-between z-40 shadow-2xl">
          {(() => {
            const currentPlayingTrack = beats.find(b => b.id === playingBeatId);
            if (!currentPlayingTrack) return null;
            return (
              <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={currentPlayingTrack.artwork} 
                    alt={currentPlayingTrack.title} 
                    className="w-10 h-10 rounded-lg object-cover border border-purple-500/30"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{currentPlayingTrack.title}</p>
                    <p className="text-xs text-purple-400/80">{currentPlayingTrack.bpm} BPM • {currentPlayingTrack.key} • {currentPlayingTrack.genre}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    id="audio-bar-play-toggle-btn"
                    type="button"
                    onClick={() => handleTogglePlay(currentPlayingTrack)}
                    className="bg-purple-600 hover:bg-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-md transition-all active:scale-95"
                  >
                    {isPlaying ? "⏸" : "▶"}
                  </button>
                  <button
                    id="audio-bar-buy-btn"
                    type="button"
                    onClick={() => handleOpenCheckout(currentPlayingTrack)}
                    className="bg-purple-900/60 border border-purple-500/40 hover:bg-purple-800/60 text-purple-200 px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    License ${Number(currentPlayingTrack.price).toFixed(2)}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

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
