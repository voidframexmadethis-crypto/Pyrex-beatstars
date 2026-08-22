import React from 'react';
import { Beat } from '../types';

interface BeatCardProps {
  track: Beat & { producerName?: string };
}

export function BeatCard({ track }: BeatCardProps) {
  return (
    <div className="beat-card bg-[#16161c] rounded-xl overflow-hidden border border-white/10 p-4">
      <div className="aspect-square bg-gray-800 rounded-lg mb-3 overflow-hidden relative">
        <img src={track.artworkUrl || track.coverArtUrl || '/favicon.png'} alt={track.title} className="w-full h-full object-cover" />
      </div>
      
      <h3 className="font-bold text-white truncate">{track.title}</h3>
      <p className="text-sm text-gray-400">{track.producerName || track.producer}</p>
      
      {/* 2. Dynamically render the price straight from the database object */}
      <button className="mt-4 w-full bg-white text-black font-semibold rounded-lg py-2 text-sm hover:bg-gray-200 transition">
        Instant Lease — ${track.price ? track.price.toFixed(2) : '29.00'}
      </button>
    </div>
  );
}
