import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, Headphones, ShieldCheck, Zap } from 'lucide-react';

export const AudioTagToggle = ({ onToggleTag, initialMode = true }: { onToggleTag: (isTagged: boolean) => void, initialMode?: boolean }) => {
  const [taggedMode, setTaggedMode] = useState(initialMode);

  const handleSwitch = (state: boolean) => {
    if (state === taggedMode) return;
    setTaggedMode(state);
    onToggleTag(state);
  };

  return (
    <div className="flex items-center bg-neutral-900/80 backdrop-blur-md p-1 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest shadow-2xl overflow-hidden">
      <button 
        onClick={() => handleSwitch(true)}
        className={`relative px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 z-10 ${
          taggedMode ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
        }`}
      >
        {taggedMode && (
          <motion.div 
            layoutId="active-tag-bg"
            className="absolute inset-0 bg-purple-600 rounded-lg -z-10 shadow-lg shadow-purple-600/20"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Volume2 size={12} className={taggedMode ? 'animate-pulse' : ''} />
        <span>Tagged Preview</span>
      </button>
      
      <button 
        onClick={() => handleSwitch(false)}
        className={`relative px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 z-10 ${
          !taggedMode ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
        }`}
      >
        {!taggedMode && (
          <motion.div 
            layoutId="active-tag-bg"
            className="absolute inset-0 bg-indigo-600 rounded-lg -z-10 shadow-lg shadow-indigo-600/20"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Headphones size={12} className={!taggedMode ? 'animate-bounce' : ''} />
        <div className="flex flex-col items-start leading-none">
          <span>Clean Audition</span>
          <span className="text-[7px] text-white/40 mt-0.5 flex items-center gap-0.5">
            <ShieldCheck size={8} /> Studio Quality
          </span>
        </div>
      </button>

      <div className="mx-2 flex items-center gap-1 opacity-20 hidden md:flex">
        <Zap size={10} className="text-amber-400" />
      </div>
    </div>
  );
};
