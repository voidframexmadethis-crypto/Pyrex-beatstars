import React, { useState } from 'react';

export default function PurpleWaterUploader({ onUpload }: { onUpload: (beat: any) => void }) {
  const [waterActive, setWaterActive] = useState(false);
  const [title, setTitle] = useState('');
  const [bpm, setBpm] = useState('');
  const [scale, setScale] = useState('');
  const [price, setPrice] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const playToggleBeep = (activeState: boolean) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(activeState ? 580 : 320, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.error('Audio beep error', e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBeat = {
      title,
      genre: 'Trap', // Permanently locked to Trap
      bpm,
      scale,
      customPrice: price,
      audioUrl: audioFile ? URL.createObjectURL(audioFile) : ''
    };
    onUpload(newBeat);
  };

  return (
    <div className={`relative bg-zinc-950 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4 shadow-xl overflow-hidden transition-all duration-500 ${waterActive ? 'shadow-purple-900/50' : ''}`}>
      {/* PURPLE WATER POOL VISUAL EFFECT CONTAINER */}
      {waterActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
          <div className="absolute -inset-[100%] bg-gradient-to-r from-purple-900 via-fuchsia-600 to-indigo-900 rounded-[40%] animate-wave blur-3xl"></div>
        </div>
      )}
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-bold text-xl tracking-wide">Upload New Beat</h2>
          <button
            type="button"
            onClick={() => {
              const newState = !waterActive;
              setWaterActive(newState);
              playToggleBeep(newState);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${waterActive ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
          >
            Liquid Mode {waterActive ? 'ON' : 'OFF'}
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title Field */}
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Beat Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              placeholder="Enter title..."
              required
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-zinc-400 block mb-1">BPM</label>
              <input 
                type="text"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                placeholder="140"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-zinc-400 block mb-1">Scale</label>
              <input 
                type="text"
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                placeholder="C Minor"
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Custom Price ($ USD)</label>
            <input 
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              placeholder="e.g. 50"
              required
            />
          </div>
          
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Audio File</label>
            <input 
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="mt-4 w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg cursor-pointer active:scale-95"
          >
            UPLOAD BEAT
          </button>
        </form>
      </div>

      <style>{`
        @keyframes wave {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-15px, 20px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        .animate-wave {
          animation: wave 10s infinite linear;
        }
      `}</style>
    </div>
  );
}
