import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { getUniqueBeats } from '../lib/beatUtils';
import { CustomRequestModal } from './CustomRequestModal';
import { Target } from 'lucide-react';

export default function CatalogGrid() {
    const { state } = useStore();
    const { playTrack } = useAudioPlayer();
    const [inquiryBeat, setInquiryBeat] = useState<any | null>(null);
    
    // ABSOLUTE RENDER DEDUPLICATION
    const safeBeats = Array.isArray(state.beats) ? state.beats : [];
    const tracks = Array.from(new Map(safeBeats.map(b => [(b.id || b.title).toString().toLowerCase().trim(), b])).values()) as any[];

    if (state.isLoading) {
        return (
            <div id="catalogGrid" className="catalog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="beat-card bg-[#0e0e10] border border-[#1c1c1f] rounded-lg p-4 animate-pulse">
                        <div className="w-full h-40 mb-4 bg-neutral-800 rounded-xl" />
                        <div className="h-6 bg-neutral-800 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-neutral-800 rounded w-1/2 mb-4" />
                        <div className="flex gap-2">
                            <div className="h-10 bg-neutral-800 rounded flex-1" />
                            <div className="h-10 bg-neutral-800 rounded flex-1" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!tracks || tracks.length === 0) {
        return (
            <div id="catalogGrid" className="catalog-grid text-center py-16 px-4 text-neutral-400 bg-neutral-900/40 border border-neutral-800 rounded-2xl max-w-xl mx-auto my-8">
                <p className="text-base font-semibold text-white mb-1">No beats currently available.</p>
                <p className="text-sm text-neutral-400">Upload new tracks in the admin panel.</p>
            </div>
        );
    }

    return (
        <div id="catalogGrid" className="catalog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(tracks) && tracks.map((track) => (
                <div key={track.id} className="beat-card bg-[#0e0e10] border border-[#1c1c1f] rounded-lg p-4" data-audio-url={track.audioUrl}>
                    <div className="w-full h-40 mb-4 overflow-hidden rounded-xl">
                        <img 
                          src={(track as any).artwork || track.coverArtUrl || track.backupArtworkUrl || track.r2ArtworkUrl || (track as any).artworkUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60'} 
                          alt={track.title} 
                          className="w-full h-full object-cover" 
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60';
                          }}
                        />
                    </div>
                    <div className="beat-title text-lg font-bold mb-1 text-white">{track.title}</div>
                    <div className="beat-meta text-sm text-neutral-400 mb-4">
                        <span>{track.bpm || '140'} BPM</span> • <span>Key: {track.key || 'C Min'}</span>
                    </div>
                    <div className="card-actions flex gap-2">
                        <button 
                            onClick={() => playTrack(track)}
                            className="play-pause-btn flex-1 bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-500 transition-all cursor-pointer"
                        >
                            Stream
                        </button>
                        <button 
                            className="checkout-btn flex-1 border border-indigo-600 text-indigo-400 py-2 rounded font-bold hover:bg-indigo-600 hover:text-white transition-all cursor-pointer" 
                            data-beat-id={track.id} 
                            data-price={track.price}
                        >
                            ${track.price} License
                        </button>
                        <button 
                            onClick={() => setInquiryBeat(track)}
                            className="p-2 border border-neutral-800 rounded text-neutral-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                            title="Custom Request"
                        >
                            <Target size={18} />
                        </button>
                        {localStorage.getItem('KRYPSIDE_ADMIN_AUTH') === 'true' && (
                            <button 
                                onClick={() => {
                                    window.location.href = `/admin-portal?edit=${track.id}`;
                                }}
                                className="p-2 border border-neutral-800 rounded text-neutral-400 hover:text-indigo-400"
                                title="Edit in Admin Portal"
                            >
                                ⚙️
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {inquiryBeat && (
                <CustomRequestModal 
                    beatName={inquiryBeat.title} 
                    onClose={() => setInquiryBeat(null)} 
                />
            )}
        </div>
    );
}
