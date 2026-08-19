import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { Beat } from '../types';
import SEO from '../components/SEO';
import { 
  Play, 
  Pause, 
  Heart, 
  Repeat2, 
  MessageSquare, 
  Share2, 
  Sparkles, 
  Disc, 
  Radio, 
  CheckCircle2, 
  Flame, 
  Volume2,
  ExternalLink,
  ShieldCheck,
  Instagram,
  Twitter,
  Youtube,
  Music2,
  Trash2,
  AlertTriangle,
  X,
  RotateCcw
} from 'lucide-react';
import { filterHumanBeats } from '../lib/beatUtils';
import BeatPackPreview from '../components/BeatPackPreview';

export default function Feed() {
  const navigate = useNavigate();
  const { state, removeBeat, incrementAnalytics } = useStore();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudioPlayer();
  const [likedTracks, setLikedTracks] = useState<Record<string, boolean>>({});
  const [repostedTracks, setRepostedTracks] = useState<Record<string, boolean>>({});
  const [beatToDelete, setBeatToDelete] = useState<Beat | null>(null);

  const confirmDeleteBeat = async () => {
    if (!beatToDelete) return;
    await removeBeat(beatToDelete.id);
    setBeatToDelete(null);
  };

  // Official Social Accounts (Pyrex Spinna Verified Profiles)
  const instagramUrl = "https://www.instagram.com/accounts/onetap/";
  const tiktokUrl = "https://www.tiktok.com/@pyrexspinna";
  const twitterUrl = "https://x.com/Pyrex_spinna";
  const youtubeUrl = "https://youtube.com/@pyrexxspinna?si=wBg36bHi2MIgTrnv";

  // Filter and sort top-rated tracks
  const safeBeats = filterHumanBeats([...state.beats]);
  const topRatedTracks = safeBeats.sort((a, b) => {
    const scoreA = (a.likes || 120) + (a.plays || 500);
    const scoreB = (b.likes || 120) + (b.plays || 500);
    return scoreB - scoreA;
  });

  const handlePlayToggle = (beat: Beat) => {
    if (currentTrack?.id === beat.id) {
      togglePlay();
    } else {
      playTrack(beat);
      incrementAnalytics('totalPlays');
    }
  };

  const toggleLike = (beatId: string) => {
    setLikedTracks(prev => ({ ...prev, [beatId]: !prev[beatId] }));
  };

  const toggleRepost = (beatId: string) => {
    setRepostedTracks(prev => ({ ...prev, [beatId]: !prev[beatId] }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-28 pt-6 px-4 sm:px-6 lg:px-8">
      <SEO title="Trending Feed & Official Beats | Pyrex Spinna" />
      
      <div className="max-w-7xl mx-auto">
        {/* Top Header Banner */}
        <div className="mb-8 bg-gradient-to-r from-purple-900/40 via-indigo-950/40 to-neutral-900/60 border border-purple-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest mb-2">
              <Flame size={16} className="text-amber-400 animate-pulse" />
              <span>Most Played Beats Feed</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Top Rated & Most Played Feed</h1>
            <p className="text-neutral-300 text-xs sm:text-sm mt-1.5 leading-relaxed font-medium max-w-2xl">
              Only the most played & top-trending beats qualify to be in the Feed stream. If a beat is deleted, it will no longer be in the feed.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/storefront')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 flex-shrink-0"
            >
              <Disc size={18} />
              <span>Browse All Beats</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar: Official Pyrex Spinna Profile & Direct Follow Links */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
              {/* Creator Card */}
              <div className="flex flex-col items-center text-center pb-6 border-b border-neutral-800">
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-xl">
                    <div className="w-full h-full bg-neutral-950 rounded-2xl flex items-center justify-center font-black text-2xl text-white">
                      PS
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-neutral-950 shadow-md">
                    <CheckCircle2 size={14} className="fill-current text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-black text-white flex items-center justify-center gap-1.5">
                  <span>Pyrex Spinna</span>
                </h3>
                <p className="text-xs text-purple-400 font-mono mt-0.5">@pyrexspinna</p>
                <p className="text-xs text-neutral-400 mt-2.5 leading-relaxed">
                  Official music producer & sound designer. Exclusive trap, hip-hop & dark melody productions.
                </p>
              </div>

              {/* Hardcoded Official Follow Channels */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider">
                    Official Follow Links
                  </h4>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                    VERIFIED
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Instagram Direct Link */}
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-pink-500/50 hover:bg-neutral-950 transition-all group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                        <Instagram size={18} />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">Instagram</div>
                        <div className="text-[10px] text-neutral-500 font-mono">@pyrexspinna</div>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-md group-hover:shadow-pink-600/20 transition-all">
                      <span>Follow</span>
                      <ExternalLink size={11} />
                    </span>
                  </a>

                  {/* TikTok Direct Link */}
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-cyan-500/50 hover:bg-neutral-950 transition-all group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                        <Music2 size={18} />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">TikTok</div>
                        <div className="text-[10px] text-neutral-500 font-mono">@pyrexspinna</div>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-md group-hover:shadow-cyan-600/20 transition-all">
                      <span>Follow</span>
                      <ExternalLink size={11} />
                    </span>
                  </a>

                  {/* Twitter / X Direct Link */}
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-sky-500/50 hover:bg-neutral-950 transition-all group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                        <Twitter size={18} />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">Twitter / X</div>
                        <div className="text-[10px] text-neutral-500 font-mono">@Pyrex_spinna</div>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl border border-neutral-700 flex items-center gap-1 shadow-md transition-all">
                      <span>Follow</span>
                      <ExternalLink size={11} />
                    </span>
                  </a>

                  {/* YouTube Direct Link */}
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-red-500/50 hover:bg-neutral-950 transition-all group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                        <Youtube size={18} />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white group-hover:text-red-300 transition-colors">YouTube</div>
                        <div className="text-[10px] text-neutral-500 font-mono">@pyrexxspinna</div>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-md group-hover:shadow-red-600/20 transition-all">
                      <span>Subscribe</span>
                      <ExternalLink size={11} />
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Stats Box */}
            <div className="bg-gradient-to-br from-indigo-950/50 to-purple-950/30 border border-indigo-500/20 rounded-3xl p-5 backdrop-blur-xl shadow-xl">
              <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>Pyrex Guaranteed Quality</span>
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                All tracks on the Pyrex Spinna feed are mastered in 24-bit studio quality with instant WAV & Stem delivery upon purchase.
              </p>
            </div>
          </div>

          {/* Main Feed Stream */}
          <div className="lg:col-span-3 space-y-6">
            {/* Feed Section Header Notice */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 pb-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                <Flame size={15} className="text-amber-400 animate-pulse" />
                <span>Most Played Beats Feed</span>
              </div>
              <span className="text-xs text-neutral-400 font-medium">
                Only top played beats rank in Feed • Deleted beats will no longer be in the feed
              </span>
            </div>

            {/* Featured Beat Pack Drop */}
            <BeatPackPreview 
              packTitle="THE GRAIL VAULT • VOL. 1"
              subtitle="Featured 6-Track Producer Pack by Pyrex Spinna"
              price={79.99}
              originalValue={189.99}
            />

            {topRatedTracks.length === 0 ? (
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-12 text-center">
                <Radio size={48} className="mx-auto text-neutral-600 mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-white mb-2">No Tracks in Feed Yet</h3>
                <p className="text-neutral-400 text-sm mb-6">Upload your first hit beat to populate the global creator feed.</p>
                <button
                  onClick={() => navigate('/upload')}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all"
                >
                  Upload Beat Now
                </button>
              </div>
            ) : (
              topRatedTracks.map((beat, index) => {
                const isThisActive = currentTrack?.id === beat.id;
                const isThisPlaying = isThisActive && isPlaying;
                const isLiked = likedTracks[beat.id] || false;
                const isReposted = repostedTracks[beat.id] || false;
                const baseLikes = (beat.likes || 124) + (isLiked ? 1 : 0);
                const baseReposts = 18 + (isReposted ? 1 : 0);
                const commentsCount = 12 + index;

                return (
                  <div 
                    key={beat.id || index}
                    className={`bg-neutral-900/80 border rounded-3xl p-6 backdrop-blur-xl shadow-2xl transition-all group ${
                      isThisActive 
                        ? 'border-purple-500/60 ring-1 ring-purple-500/30 shadow-purple-950/30' 
                        : 'border-neutral-800/80 hover:border-purple-500/30'
                    }`}
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                          PS
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white">Pyrex Spinna</span>
                            <CheckCircle2 size={14} className="text-blue-400" />
                            <span className="text-xs text-neutral-500">• @pyrexspinna</span>
                          </div>
                          <p className="text-[11px] text-neutral-500 font-medium">
                            {isThisActive ? (
                              <span className="text-purple-400 font-semibold animate-pulse">Now Active in Player</span>
                            ) : (
                              'Trending #1 in Trap & Hip-Hop'
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-purple-400 bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full">
                          {beat.bpm} BPM • {beat.key || 'Cm'}
                        </span>
                        <button
                          onClick={() => setBeatToDelete(beat)}
                          title={`Delete "${beat.title}"`}
                          className="p-1.5 rounded-full bg-red-950/40 hover:bg-red-900/80 border border-red-800/60 hover:border-red-500 text-red-400 hover:text-white transition-all shadow-sm flex items-center justify-center active:scale-95 group"
                        >
                          <Trash2 size={15} className="group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* Track Card Body */}
                    <div className="bg-neutral-950/60 border border-neutral-800/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-6 mb-4">
                      <div className="relative w-full sm:w-40 h-40 rounded-xl overflow-hidden flex-shrink-0 group/art shadow-xl bg-neutral-900">
                        <img 
                          src={beat.coverArtUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80'} 
                          alt={beat.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/art:scale-110"
                        />
                        <div className={`absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center ${
                          isThisActive ? 'opacity-100' : 'opacity-0 group-hover/art:opacity-100'
                        }`}>
                          <button
                            onClick={() => handlePlayToggle(beat)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95 text-white ${
                              isThisPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-purple-600 hover:bg-purple-500'
                            }`}
                          >
                            {isThisPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Exclusive Beat</span>
                          <span className="text-neutral-600">•</span>
                          <span className="text-xs text-neutral-400 font-medium">Produced by Pyrex Spinna</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2 truncate">{beat.title}</h2>
                        <p className="text-sm text-neutral-400 line-clamp-2 mb-4">
                          Professional high-energy trap instrumental featuring pristine 808s, crisp hi-hats, and atmospheric melodic soundscapes. Ready for immediate release.
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                          <button
                            onClick={() => handlePlayToggle(beat)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg ${
                              isThisPlaying 
                                ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                                : isThisActive
                                  ? 'bg-purple-600 hover:bg-purple-500 text-white ring-2 ring-purple-400/50'
                                  : 'bg-purple-600 hover:bg-purple-500 text-white'
                            }`}
                          >
                            {isThisPlaying ? <Pause size={16} /> : <Play size={16} />}
                            <span>{isThisPlaying ? 'Pause Beat' : isThisActive ? 'Resume Beat' : 'Play Beat'}</span>
                          </button>
                          
                          <button
                            onClick={() => navigate(`/storefront?beat=${beat.id}`)}
                            className="transition-all active:scale-95"
                          >
                            <div className="beat-price-tag">
                              <span>${beat.price !== undefined && beat.price !== "" ? beat.price : 29.99} - Buy License</span>
                            </div>
                          </button>

                          <button
                            onClick={() => setBeatToDelete(beat)}
                            className="px-4 py-2.5 bg-red-950/40 hover:bg-red-900/80 text-red-400 hover:text-white font-bold text-sm rounded-xl transition-all border border-red-800/60 flex items-center gap-1.5 active:scale-95"
                            title={`Delete "${beat.title}"`}
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Engagement Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-neutral-400 text-sm font-medium">
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => toggleLike(beat.id)}
                          className={`flex items-center gap-2 transition-colors hover:text-pink-400 ${isLiked ? 'text-pink-500 font-bold' : ''}`}
                        >
                          <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                          <span>{baseLikes}</span>
                        </button>

                        <button 
                          onClick={() => toggleRepost(beat.id)}
                          className={`flex items-center gap-2 transition-colors hover:text-emerald-400 ${isReposted ? 'text-emerald-400 font-bold' : ''}`}
                        >
                          <Repeat2 size={18} />
                          <span>{baseReposts}</span>
                        </button>

                        <button className="flex items-center gap-2 transition-colors hover:text-indigo-400">
                          <MessageSquare size={18} />
                          <span>{commentsCount}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setBeatToDelete(beat)}
                          className="flex items-center gap-1.5 text-neutral-500 hover:text-red-400 transition-colors text-xs font-semibold"
                          title={`Delete "${beat.title}"`}
                        >
                          <Trash2 size={16} className="text-red-400/80 hover:text-red-400" />
                          <span className="hidden sm:inline text-red-400/90">Delete</span>
                        </button>

                        <button 
                          onClick={() => {
                            navigator.clipboard?.writeText(window.location.origin + `/storefront?beat=${beat.id}`);
                            alert('Beat link copied to clipboard!');
                          }}
                          className="flex items-center gap-2 hover:text-white transition-colors"
                        >
                          <Share2 size={18} />
                          <span className="hidden sm:inline">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL FOR DELETING A BEAT */}
      {beatToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-[#121218] border border-red-900/50 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top red glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-pink-600 to-red-600" />
            
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/80 flex items-center justify-center text-red-400 shadow-inner">
                <AlertTriangle size={24} />
              </div>
              <button
                onClick={() => setBeatToDelete(null)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Delete Beat from Feed & Store?</h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Are you sure you want to delete <span className="text-purple-300 font-bold">"{beatToDelete.title}"</span>?
              </p>
              <p className="text-xs text-neutral-400">
                This will remove the track permanently from your Feed stream, Beat Packs, and Storefront catalog.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800/60">
              <button
                onClick={() => setBeatToDelete(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteBeat()}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 active:scale-95"
              >
                <Trash2 size={16} />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
