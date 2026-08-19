
import { Beat } from '../types';

export const createFileFingerprint = (file: File | Blob): string => {
  const name = file instanceof File ? file.name.trim().toLowerCase() : 'audio_blob';
  const size = file.size;
  const lastModified = file instanceof File && (file as any).lastModified ? (file as any).lastModified : '';
  return `${name}_${size}_${lastModified}`;
};

export const getTrackFingerprint = (track: Partial<Beat> & { 
  fileName?: string; 
  fileSize?: number; 
  fileLastModified?: number;
  fileFingerprint?: string; 
  fileSignature?: string;
  fileHash?: string; 
  title?: string; 
  bpm?: number 
}): string => {
  if (track.fileSignature && track.fileSignature.trim()) {
    return `fp:${track.fileSignature.trim().toLowerCase()}`;
  }
  if (track.fileFingerprint && track.fileFingerprint.trim()) {
    return `fp:${track.fileFingerprint.trim().toLowerCase()}`;
  }
  if (track.fileName && track.fileSize) {
    const lm = track.fileLastModified ? `_${track.fileLastModified}` : '';
    return `fp:${track.fileName.trim().toLowerCase()}_${track.fileSize}${lm}`;
  }
  if (track.fileHash && track.fileHash.trim()) {
    return `hash:${track.fileHash.trim().toLowerCase()}`;
  }
  const cleanTitle = (track.title || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const bpm = track.bpm || 0;
  return `title:${cleanTitle}_${bpm}`;
};

export const deduplicateTracks = <T extends Partial<Beat> & { id: string; title: string }>(tracks: T[]): T[] => {
  if (!Array.isArray(tracks)) return [];
  const trackMap = new Map<string, T>();

  for (const track of tracks) {
    if (!track || !track.title) continue;
    const key = getTrackFingerprint(track);

    if (trackMap.has(key)) {
      const existing = trackMap.get(key)!;
      // Replace existing item with updated metadata while preserving valid audio/artwork URLs
      trackMap.set(key, {
        ...existing,
        ...track,
        id: existing.id || track.id,
        audioUrl: track.audioUrl || existing.audioUrl,
        coverArtUrl: track.coverArtUrl || existing.coverArtUrl,
        plays: Math.max(existing.plays || 0, track.plays || 0),
        likes: Math.max(existing.likes || 0, track.likes || 0),
        updatedAt: new Date().toISOString()
      });
    } else {
      trackMap.set(key, track);
    }
  }

  return Array.from(trackMap.values());
};

