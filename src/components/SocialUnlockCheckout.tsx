import { useState } from 'react';

export default function SocialUnlockCheckout({ beatId, downloadUrl }: { beatId: string, downloadUrl: string }) {
  const [tiktokFollowed, setTiktokFollowed] = useState(false);
  const [ytSubscribed, setYtSubscribed] = useState(false);

  const allUnlocked = tiktokFollowed && ytSubscribed;

  return (
    <div className="p-6 bg-neutral-950 border border-purple-900/40 rounded-xl text-white">
      <h3 className="text-lg font-bold mb-4">Unlock Your Beat Files</h3>
      
      {/* Step 1: TikTok Follow */}
      <div className="flex items-center justify-between mb-3 p-3 bg-neutral-900 rounded-lg">
        <span>1. Follow Pyrex Spinna on TikTok</span>
        <button 
          onClick={() => {
            window.open('https://www.tiktok.com/@pyrexspinna', '_blank');
            setTiktokFollowed(true);
          }}
          className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
            tiktokFollowed ? 'bg-green-600 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'
          }`}
        >
          {tiktokFollowed ? 'Verified ✓' : 'Follow TikTok'}
        </button>
      </div>

      {/* Step 2: YouTube Subscribe */}
      <div className="flex items-center justify-between mb-6 p-3 bg-neutral-900 rounded-lg">
        <span>2. Subscribe to YouTube Channel</span>
        <button 
          onClick={() => {
            window.open('https://www.youtube.com/@pyrexspinna?sub_confirmation=1', '_blank');
            setYtSubscribed(true);
          }}
          className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
            ytSubscribed ? 'bg-green-600 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'
          }`}
        >
          {ytSubscribed ? 'Verified ✓' : 'Subscribe YT'}
        </button>
      </div>

      {/* Final Unlock Action */}
      {allUnlocked ? (
        <a 
          href={downloadUrl} 
          className="block text-center w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 font-bold rounded-lg shadow-lg hover:opacity-90"
          download
        >
          Download Beat Files Now ⚡
        </a>
      ) : (
        <button disabled className="w-full py-3 bg-neutral-800 text-neutral-500 font-bold rounded-lg cursor-not-allowed">
          Complete Steps Above to Unlock Download
        </button>
      )}
    </div>
  );
}
