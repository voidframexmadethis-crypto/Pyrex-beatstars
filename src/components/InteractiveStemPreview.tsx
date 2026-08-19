import React, { useState } from 'react';

export function InteractiveStemPreview() {
  const [activeStem, setActiveStem] = useState<string | null>(null);

  const toggleStem = (stemName: string) => {
    setActiveStem(activeStem === stemName ? null : stemName);
  };

  return (
    <div className="bg-gray-950 border border-blue-900/40 rounded-2xl p-6 text-white shadow-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-black tracking-wide text-blue-400">STEM ISOLATION PREVIEW</h4>
          <p className="text-xs text-gray-400 mt-1">Test individual tracks before acquiring exclusive rights.</p>
        </div>
        <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-mono">
          STUDIO ENGINE
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Drums', 'Bass', 'Melody', 'Vocals'].map((stem) => {
          const isActive = activeStem === stem;
          return (
            <button
              key={stem}
              onClick={() => toggleStem(stem)}
              className={`p-4 rounded-xl border text-sm font-bold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2 ${
                isActive
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/50 scale-[1.02]'
                  : 'bg-black border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
              }`}
            >
              <span className="tracking-widest text-xs uppercase">{stem}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${isActive ? 'bg-black/30 text-white' : 'bg-gray-900 text-gray-500'}`}>
                {isActive ? 'SOLO ACTIVE' : 'MUTE'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
