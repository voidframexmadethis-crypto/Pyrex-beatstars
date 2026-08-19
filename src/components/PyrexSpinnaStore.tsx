import React, { useState, useRef } from 'react';
import M4AProcessor from './M4AProcessor';

export default function KrypsideStore() {
  const [queue, setQueue] = useState<File[]>([]);
  const [socialCopy, setSocialCopy] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSocialCopy = (trackTitle: string) => {
    const copy = `🔥 NEW HEAT: ${trackTitle.toUpperCase()} just dropped on Pyrex Spinna. Exclusive trap production. Link: https://krypside.com/track/${trackTitle.toLowerCase().replace(/\s+/g, '-')} #PyrexSpinna #TrapBeats #Producer`;
    setSocialCopy(copy);
  };

  return (
    <main className="min-h-screen bg-black text-blue-400 p-4 sm:p-6 md:p-8 font-mono border-t-4 border-blue-600">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter uppercase text-white">PYREX SPINNA // V.2.0</h1>
      <p className="text-[10px] sm:text-xs text-gray-500 mt-1 uppercase tracking-widest">Enterprise Ingestion Pipeline: Online</p>
      
      {/* Bundle Promotion */}
      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-950 text-blue-200 border border-blue-700 text-center font-bold text-xs sm:text-sm">
        ⚡ PROMO: BUY 2 GET 1 FREE // AUTOMATIC BUNDLE DISCOUNTS ACTIVE
      </div>

      <div className="mt-8 sm:mt-12 border border-blue-900 bg-zinc-900 p-4 sm:p-8 rounded-none">
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          className="hidden" 
          onChange={(e) => setQueue(Array.from(e.target.files || []))}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-blue-600 p-8 sm:p-12 md:p-16 text-blue-300 hover:border-blue-400 hover:text-white transition-all"
        >
          {queue.length > 0 ? `${queue.length} Beats Queued` : 'DRAG & DROP MASTER WAV/FLAC + MP3 PACKS'}
        </button>
      </div>

      <M4AProcessor />

      {/* Social Asset Generator */}
      <div className="mt-8 p-4 sm:p-6 bg-zinc-900 border border-zinc-700">
        <h3 className="text-white font-bold mb-3 sm:mb-4">SOCIAL ASSET GENERATOR</h3>
        <button onClick={() => generateSocialCopy('New Trap Pack')} className="bg-blue-600 text-white px-3 sm:px-4 py-2 hover:bg-blue-500 text-sm">
          Generate Promo Copy
        </button>
        {socialCopy && <p className="mt-4 p-3 sm:p-4 bg-black text-blue-300 text-[10px] sm:text-sm">{socialCopy}</p>}
      </div>
    </main>
  );
}
