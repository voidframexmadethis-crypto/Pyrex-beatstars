import React from 'react';
import { getCloudAssetUrl } from '../lib/cloudStorage';

export function CloudAudioPlayer({ trackPath, title }: { trackPath: string; title: string }) {
  // The audio stream pulls directly from cloud CDN, consuming zero Vercel bandwidth
  const streamingUrl = getCloudAssetUrl(trackPath);

  return (
    <div className="bg-gray-950 border border-blue-900/40 rounded-xl p-4 flex items-center justify-between text-white">
      <div>
        <h5 className="font-bold text-sm text-blue-400">{title}</h5>
        <span className="text-[10px] text-gray-500 font-mono">CDN STREAM • ZERO VERCEL LOAD</span>
      </div>
      <audio 
        controls 
        preload="metadata" 
        crossOrigin="anonymous" 
        src={streamingUrl} 
        className="h-10 accent-blue-500"
        onPlay={(e) => {
          if ((window as any).activeAudio && (window as any).activeAudio !== e.currentTarget) {
            (window as any).activeAudio.pause();
            (window as any).activeAudio.currentTime = 0;
          }
          (window as any).activeAudio = e.currentTarget;
        }}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
