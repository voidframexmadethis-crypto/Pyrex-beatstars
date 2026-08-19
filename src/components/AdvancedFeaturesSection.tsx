import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Users, ShoppingBag, Map, TrendingUp, DollarSign, Gift, Send, Search, CheckCircle, Globe, ShieldCheck, CreditCard, Mail } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Beat, VocalMatchResult, SubscriptionTier, MerchItem, TourRoute, FanAnalytics } from '../types';

export default function AdvancedFeaturesSection() {
  const { state } = useStore();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'ai' | 'subs' | 'fans' | 'tour'>('ai');
  
  // 53. Vocal Match AI State
  const [vocalInput, setVocalInput] = useState('');
  const [vocalMatches, setVocalMatches] = useState<VocalMatchResult[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  // 54. Subscriptions State
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);

  // 62. Tour State
  const [tourRoutes, setTourRoutes] = useState<TourRoute[]>([]);

  // 56. Top Fan State
  const [fanStats, setFanStats] = useState<FanAnalytics | null>(null);

  useEffect(() => {
    // Fetch initial data
    fetch('/api/features/subscriptions/tiers').then(res => res.json()).then(setTiers);
    fetch('/api/features/tour-routing').then(res => res.json()).then(setTourRoutes);
    
    if (user) {
      // Mock fan stats for current user
      setFanStats({
        userId: user.uid || 'u1',
        email: user.email || '',
        totalSpent: 150,
        totalStreams: 450,
        loyaltyScore: 85,
        topGenres: ['Trap', 'R&B'],
        lastPurchaseDate: new Date().toISOString()
      });
    }
  }, [user]);

  const handleVocalMatch = async () => {
    if (!vocalInput.trim()) return;
    setIsMatching(true);
    try {
      const res = await fetch('/api/features/vocal-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vocalDescription: vocalInput, currentBeats: state.beats.slice(0, 5) })
      });
      const data = await res.json();
      setVocalMatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="bg-neutral-900/50 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      {/* Tabs Header */}
      <div className="flex overflow-x-auto border-b border-white/5 p-2 gap-2 scrollbar-hide">
        {[
          { id: 'ai', label: 'AI Match', icon: Sparkles },
          { id: 'subs', label: 'Subscriptions', icon: CreditCard },
          { id: 'fans', label: 'Fan Hub', icon: Users },
          { id: 'tour', label: 'Tour Routes', icon: Map },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-neutral-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="max-w-2xl">
                <h3 className="text-2xl font-black text-white mb-2">Vocal Match AI</h3>
                <p className="text-neutral-400 text-sm mb-6">Describe your vocals or the vibe you're going for, and our AI will find the perfect beat for you.</p>
                
                <div className="relative">
                  <input
                    type="text"
                    value={vocalInput}
                    onChange={(e) => setVocalInput(e.target.value)}
                    placeholder="e.g. 'Aggressive trap flow with high-pitched adlibs and a dark atmosphere'"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    onClick={handleVocalMatch}
                    disabled={isMatching}
                    className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-2 transition-all"
                  >
                    {isMatching ? 'Analyzing...' : <><Search size={18} /> Match</>}
                  </button>
                </div>
              </div>

              {vocalMatches.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                  {vocalMatches.map((match) => {
                    const beat = state.beats.find(b => b.id === match.trackId);
                    if (!beat) return null;
                    return (
                      <div key={match.trackId} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <img src={beat.coverArtUrl} alt={beat.title} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold truncate">{beat.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-black">
                                {match.confidence}% MATCH
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-neutral-500 leading-relaxed italic">"{match.reason}"</p>
                        <button className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all border border-neutral-800">
                          Listen & Buy
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'subs' && (
            <motion.div
              key="subs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {tiers.map((tier) => (
                <div key={tier.id} className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.id === 'gold' ? 'from-amber-500/20' : 'from-indigo-500/20'} to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="relative bg-neutral-950 border border-neutral-800 p-8 rounded-3xl space-y-6 flex flex-col h-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-black text-white">{tier.name}</h3>
                        <p className="text-neutral-500 text-sm">Direct-to-Fan Subscription</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-white">${tier.price}</div>
                        <div className="text-xs text-neutral-500 uppercase font-bold tracking-widest">per {tier.interval}</div>
                      </div>
                    </div>
                    
                    <ul className="space-y-4 flex-1">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-neutral-300">
                          <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-xl ${
                      tier.id === 'gold' 
                        ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}>
                      Get {tier.name} Access
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'fans' && (
            <motion.div
              key="fans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="md:col-span-2 space-y-8">
                <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-3xl">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-3xl font-black text-white">
                      {user?.displayName?.[0] || 'U'}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white">{user?.displayName || 'Top Fan'}</h3>
                      <p className="text-neutral-500 font-bold">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white/5 p-4 rounded-2xl text-center">
                      <div className="text-xs text-neutral-500 font-bold uppercase mb-1">Loyalty Score</div>
                      <div className="text-2xl font-black text-indigo-400">{fanStats?.loyaltyScore || 0}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl text-center">
                      <div className="text-xs text-neutral-500 font-bold uppercase mb-1">Total Streams</div>
                      <div className="text-2xl font-black text-white">{fanStats?.totalStreams || 0}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl text-center">
                      <div className="text-xs text-neutral-500 font-bold uppercase mb-1">Beats Owned</div>
                      <div className="text-2xl font-black text-white">12</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-3xl">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <TrendingUp size={18} className="text-indigo-400" />
                      Top Genres
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {fanStats?.topGenres.map(g => (
                        <span key={g} className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold border border-indigo-500/20">{g}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-3xl">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Gift size={18} className="text-amber-400" />
                      Fan Rewards
                    </h4>
                    <p className="text-xs text-neutral-500">You are <span className="text-white font-bold">150 streams</span> away from your next free exclusive license!</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-indigo-600 p-8 rounded-3xl text-white">
                  <h4 className="text-xl font-black mb-2 italic">FAN STATUS: PRO</h4>
                  <p className="text-indigo-200 text-sm mb-6">Enjoy 15% off all checkout transactions automatically applied.</p>
                  <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase shadow-xl">Redeem Points</button>
                </div>
                <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-3xl">
                   <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Mail size={18} className="text-neutral-400" />
                    Newsletter
                  </h4>
                  <div className="flex gap-2">
                    <input type="email" placeholder="Update Email" className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500" />
                    <button className="p-2 bg-white text-black rounded-lg"><Send size={14} /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tour' && (
            <motion.div
              key="tour"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-black text-white">Global Tour Intelligence</h3>
                  <p className="text-neutral-500 text-sm">Where your fans are listening. Optimized routing for your next tour.</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Highly Profitable
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span> Potential
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-neutral-950 border border-neutral-800 rounded-3xl h-[400px] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-neutral-900/50 flex items-center justify-center">
                    <Globe size={120} className="text-neutral-800/20" />
                  </div>
                  {/* Tour Route Markers Placeholder */}
                  {tourRoutes.map((route, idx) => (
                    <div 
                      key={route.id} 
                      className="absolute group cursor-pointer"
                      style={{ 
                        left: `${(route.lng + 180) / 3.6}%`, 
                        top: `${(90 - route.lat) / 1.8}%` 
                      }}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 border-white shadow-xl transform group-hover:scale-150 transition-all ${
                        route.fanCount > 20000 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                      }`}></div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-black px-3 py-1 rounded-lg text-[10px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {route.city} ({route.fanCount.toLocaleString()} fans)
                      </div>
                    </div>
                  ))}
                  <div className="absolute bottom-6 left-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 text-white">
                    <div className="text-[10px] uppercase font-black text-neutral-400 mb-1">Optimal Hub</div>
                    <div className="text-xl font-black">Atlanta, GA</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {tourRoutes.map(route => (
                    <div key={route.id} className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl flex justify-between items-center">
                      <div>
                        <div className="text-white font-bold">{route.city}</div>
                        <div className="text-[10px] text-neutral-500 uppercase">{route.recommendedVenueSize} Venue</div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-black">${(route.potentialRevenue / 1000).toFixed(0)}k</div>
                        <div className="text-[10px] text-neutral-600 font-bold">POTENTIAL</div>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase shadow-xl flex items-center justify-center gap-2">
                    <Map size={16} /> Export Tour Plan
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Marketing Tools Overlay (Promo Codes & Crypto) */}
      <div className="bg-neutral-950/80 border-t border-white/5 p-6 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Gift size={20} />
            </div>
            <div>
              <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Global Promo</div>
              <div className="text-white font-black">PYREX20 (20% OFF)</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Globe size={20} />
            </div>
            <div>
              <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Currency</div>
              <div className="text-white font-black">USD / EUR / GBP / BTC</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-xs font-bold text-neutral-400">DSP DISTRIBUTION ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl">
            <CreditCard size={16} className="text-indigo-400" />
            <span className="text-xs font-bold text-neutral-400">CRYPTO PAYMENTS ENABLED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
