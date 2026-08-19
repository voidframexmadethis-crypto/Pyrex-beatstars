import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, Info, Radio, Layers, TrendingUp, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const LicenseCalculator = () => {
  const { state } = useStore();
  const config = state.profile.marketingConfig;
  const [streams, setStreams] = useState(10000);
  const [needsRadio, setNeedsRadio] = useState(false);
  const [needsStems, setNeedsStems] = useState(false);

  // Dynamic recommendation logic
  const getRecommendation = () => {
    if (needsStems || needsRadio || streams > 100000) {
      return { 
        tier: "Unlimited Exclusive", 
        price: config?.defaultExclusivePrice ?? 499.99, 
        desc: "Full master ownership, unlimited streams, stems included.",
        color: "from-amber-400 to-orange-600",
        shadow: "shadow-amber-500/20"
      };
    }
    if (streams > 25000) {
      return { 
        tier: "Professional Lease", 
        price: config?.defaultWavPrice ?? 74.99, 
        desc: "Up to 100,000 streams, high-quality audio files.",
        color: "from-purple-500 to-indigo-600",
        shadow: "shadow-purple-500/20"
      };
    }
    return { 
      tier: "Basic Lease", 
      price: config?.defaultMp3Price ?? 29.99, 
      desc: "Ideal for starting out, up to 10,000 streams.",
      color: "from-neutral-400 to-neutral-600",
      shadow: "shadow-neutral-500/10"
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl w-full max-w-xl mx-auto shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 blur-[100px] rounded-full group-hover:bg-purple-600/20 transition-colors duration-700" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-purple-600 rounded-xl shadow-lg shadow-purple-600/20">
          <Scale size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">License Matcher</h3>
          <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Intelligent Rights Optimizer</p>
        </div>
      </div>

      <div className="space-y-8 mb-10">
        <div>
          <div className="flex justify-between items-end mb-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
              <TrendingUp size={14} className="text-purple-500" /> Projected Streams
            </label>
            <span className="text-lg font-black text-white tabular-nums">
              {streams.toLocaleString()} <span className="text-xs text-neutral-600">PLAYS</span>
            </span>
          </div>
          <div className="relative pt-1">
            <input 
              type="range" 
              min="5000" 
              max="250000" 
              step="5000"
              value={streams} 
              onChange={e => setStreams(Number(e.target.value))} 
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-500" 
            />
            <div className="flex justify-between mt-2 text-[9px] font-black text-neutral-600 uppercase tracking-tighter">
              <span>5K</span>
              <span>100K</span>
              <span>250K+</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => setNeedsRadio(!needsRadio)}
            className={`p-4 rounded-2xl border transition-all flex items-center gap-4 text-left ${
              needsRadio 
              ? 'bg-purple-600/10 border-purple-500 shadow-inner' 
              : 'bg-neutral-950/50 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className={`p-2 rounded-lg ${needsRadio ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-neutral-500'}`}>
              <Radio size={16} />
            </div>
            <div>
              <span className="block text-[11px] font-black text-white uppercase tracking-tight">Radio / Broadcast</span>
              <span className="block text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Commercial Use</span>
            </div>
          </button>

          <button 
            onClick={() => setNeedsStems(!needsStems)}
            className={`p-4 rounded-2xl border transition-all flex items-center gap-4 text-left ${
              needsStems 
              ? 'bg-purple-600/10 border-purple-500 shadow-inner' 
              : 'bg-neutral-950/50 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className={`p-2 rounded-lg ${needsStems ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-neutral-500'}`}>
              <Layers size={16} />
            </div>
            <div>
              <span className="block text-[11px] font-black text-white uppercase tracking-tight">Track Stems</span>
              <span className="block text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Full Trackouts</span>
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={recommendation.tier}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`bg-neutral-950 border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-2xl ${recommendation.shadow}`}
        >
          <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${recommendation.color}`} />
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Recommended Solution</span>
                <Sparkles size={12} className="text-amber-400" />
              </div>
              <h4 className="text-xl font-black text-white uppercase tracking-tighter">{recommendation.tier}</h4>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white">${recommendation.price}</span>
            </div>
          </div>
          
          <p className="text-xs text-neutral-400 font-medium leading-relaxed mb-6">
            {recommendation.desc}
          </p>

          <div className="flex items-center gap-3">
            <button className="flex-1 py-3 bg-white hover:bg-neutral-200 text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 group">
              View Terms <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className={`flex-1 py-3 bg-gradient-to-r ${recommendation.color} text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg`}>
              <CheckCircle2 size={14} /> Buy Now
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center gap-2 justify-center">
        <Info size={12} className="text-neutral-600" />
        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Calculations based on standard industry usage rates</span>
      </div>
    </div>
  );
};
