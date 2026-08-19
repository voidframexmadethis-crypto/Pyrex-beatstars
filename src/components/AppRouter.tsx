import React, { useState } from 'react';
import PublicStorefront from './PublicStorefront';
import PurpleWaterUploader from './PurpleWaterUploader';

export default function AppRouter() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [beats, setBeats] = useState<any[]>([]);

  const handleNewBeatUpload = async (newBeat: any) => {
    setBeats([newBeat, ...beats]);
    setIsAdminMode(false);
  };

  return (
    <div>
      {/* Quick Admin Toggle Button (Hidden or secure for your eyes only) */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={() => setIsAdminMode(!isAdminMode)}
          className="bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 text-xs px-3 py-1.5 rounded-md backdrop-blur-md transition-all"
        >
          {isAdminMode ? 'Switch to Public Store' : '⚙️ Admin Uploader'}
        </button>
      </div>

      {isAdminMode ? (
        <div className="p-6 max-w-xl mx-auto mt-10">
          <PurpleWaterUploader onUpload={handleNewBeatUpload} />
        </div>
      ) : (
        <PublicStorefront beats={beats} />
      )}
    </div>
  );
}
