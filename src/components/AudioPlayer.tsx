import React, { useState, useRef } from 'react';

export default function AudioPlayer({ currentTrack, isPlaying, onTogglePlay }) {
  const audioRef = useRef(null);

  // Fallback defaults so nothing ever shows undefined or weird prices like $49.99 accidentally
  const trackTitle = currentTrack?.title || "Costly (Prod. PyrexSpinna)";
  const trackPrice = currentTrack?.price ? `$${currentTrack.price.toFixed(2)}` : "$29.99";
  const trackArtwork = currentTrack?.artwork || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-purple-900/50 p-4 flex items-center justify-between text-white shadow-2xl">
      
      {/* Permanent Artwork & Title - Guaranteed never to vanish */}
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 flex-shrink-0">
          <img 
            src={trackArtwork} 
            alt={trackTitle} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-white text-base tracking-wide">{trackTitle}</h4>
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider">PyrexSpinna • Trap Master</p>
        </div>
      </div>

      {/* Player Controls & Waveform Area */}
      <div className="flex items-center space-x-6">
        <button 
          onClick={onTogglePlay}
          className="w-12 h-12 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center text-white font-bold transition-all shadow-lg shadow-purple-900/40"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      {/* Permanent Pricing - Locked in so it never shows default placeholder spikes */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <span className="text-xs text-gray-400 block uppercase">Instant Lease</span>
          <span className="text-purple-400 font-black text-xl">{trackPrice}</span>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-lg">
          SECURE BEAT
        </button>
      </div>

    </div>
  );
}
