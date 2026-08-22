import React from 'react';
import { Beat } from '../types';

interface SafeTrackCardProps {
  track: Beat;
}

export function SafeTrackCard({ track }: SafeTrackCardProps) {
  // 1. Enforce custom title, fallback only to a clean default string (never the raw filename)
  const displayTitle = track.title && track.title.trim() !== "" 
    ? track.title 
    : "Untitled Beat";

  // 2. Enforce custom artwork, fallback to a default store placeholder image
  const displayArtwork = track.artworkUrl && track.artworkUrl.trim() !== "" 
    ? track.artworkUrl 
    : "/images/default-cover.jpg";

  return (
    <div className="beat-card bg-[#16161c] rounded-xl overflow-hidden border border-white/10 p-4">
      {/* Artwork Container */}
      <div className="aspect-square bg-gray-800 rounded-lg mb-3 overflow-hidden relative">
        <img 
          src={displayArtwork} 
          alt={displayTitle} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Emergency fallback if the image URL fails to load
            e.currentTarget.src = "/images/default-cover.jpg";
          }}
        />
      </div>
      
      {/* Locked Custom Title */}
      <h3 className="font-bold text-white truncate">{displayTitle}</h3>
      <p className="text-sm text-gray-400">{track.producer || track.producerName || "Pyrex Spinna"}</p>
    </div>
  );
}
