import { useState, useEffect } from 'react';

export interface TrackItem {
  id: string;
  title: string;
  bpm: string;
  musicalKey: string;
  audioUrl: string;
  coverArtUrl: string | null;
  fileHash: string;
  tags: string[];
}

const STORAGE_KEY = 'pyrex_store_persistent_tracks_v1';

export function usePersistentTracks() {
  const [tracks, setTracks] = useState<TrackItem[]>([]);

  // Load saved tracks on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: TrackItem[] = JSON.parse(saved);
        // Ensure initial load is deduplicated by fileHash
        const uniqueTracks = Array.from(
          new Map(parsed.map(track => [track.fileHash, track])).values()
        );
        setTracks(uniqueTracks);
      }
    } catch (e) {
      console.error('Failed to load persistent tracks from storage:', e);
    }
  }, []);

  // Save tracks whenever the list updates
  const saveTracksToStorage = (newTracks: TrackItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTracks));
    } catch (e) {
      console.error('Failed to save tracks to storage (quota exceeded?):', e);
    }
  };

  const addTrack = (newTrack: TrackItem) => {
    setTracks(prev => {
      // Strict Deduplication Check: Block if fileHash already exists in state
      if (prev.some(t => t.fileHash === newTrack.fileHash)) {
        console.warn('Duplicate track detected in state—skipping addition.');
        return prev;
      }
      const updated = [newTrack, ...prev];
      saveTracksToStorage(updated);
      return updated;
    });
  };

  const clearAllTracks = () => {
    setTracks([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { tracks, addTrack, clearAllTracks };
}
