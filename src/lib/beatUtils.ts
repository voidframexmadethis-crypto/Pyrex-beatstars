import { Beat } from '../types';
import { getOptimizedMediaUrl } from './cdnProxy';

/**
 * Preloads audio stream headers into browser cache before user even hits 'Play'
 */
export const preloadAudioHeader = (audioUrl: string) => {
  try {
    if (!audioUrl) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'fetch';
    link.href = audioUrl;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  } catch (err) {
    console.warn('Preload audio header failed:', err);
  }
};

/**
 * Fast local fuzzy search running directly in client memory (0 ms latency)
 */
export const instantSearch = (beats: Beat[], query: string): Beat[] => {
  if (!query) return beats;
  const cleanQuery = query.toLowerCase().trim();
  return beats.filter(beat => 
    (beat.title && beat.title.toLowerCase().includes(cleanQuery)) ||
    (beat.key && beat.key.toLowerCase().includes(cleanQuery)) ||
    (beat.bpm && beat.bpm.toString().includes(cleanQuery)) ||
    ((beat as any).genre && (beat as any).genre.toLowerCase().includes(cleanQuery))
  );
};

/**
 * Validates whether a beat is an AI placeholder or fake beat.
 * Returns true if the beat is an AI/placeholder beat, false if it's a real human beat.
 */
export function isAIPlaceholderBeat(beat: Partial<Beat> | null | undefined): boolean {
  if (!beat) return true;
  if (beat.isPlaceholder === true) return true;

  const idLower = (beat.id || '').toLowerCase();
  const titleLower = (beat.title || '').toLowerCase();

  if (
    idLower.includes('placeholder') ||
    idLower.includes('ai_') ||
    titleLower.includes('placeholder') ||
    titleLower.includes('ai beat') ||
    titleLower.includes('ai generated') ||
    titleLower.includes('sample beat')
  ) {
    return true;
  }

  return false;
}

/**
 * Filters an array of beats to only retain genuine human-produced beats.
 */
export function filterHumanBeats(beats: Beat[]): Beat[] {
  if (!Array.isArray(beats)) return [];
  return beats.filter((beat) => !isAIPlaceholderBeat(beat));
}

/**
 * STRICT RENDER-LEVEL DEDUPLICATION LOCK:
 * Before mapping over beats to display them or load them into the audio player, 
 * pass the array through this strict normalized deduplicator.
 */
export const getUniqueBeats = (beats: Beat[]): Beat[] => {
  if (!Array.isArray(beats)) return [];
  return beats.reduce((acc: Beat[], current: Beat) => {
    if (!current || !current.title) return acc;
    const normalizedCurrentTitle = current.title.trim().toLowerCase();
    const isDuplicate = acc.some(item => 
      (item.id && current.id && item.id === current.id) || 
      item.title.trim().toLowerCase() === normalizedCurrentTitle
    );
    return isDuplicate ? acc : [...acc, current];
  }, []);
};

/**
 * Simple helper to save your track list locally so placeholders never return
 */
export const saveCatalogToStore = (beatsArray: Beat[]) => {
  try {
    const validBeats = filterHumanBeats(beatsArray);
    localStorage.setItem('pyrex_beats', JSON.stringify(validBeats));
    localStorage.setItem('my_beat_catalog', JSON.stringify(validBeats));
    localStorage.setItem('pyrex_user_tracks', JSON.stringify(validBeats));
  } catch (err) {
    console.warn('Failed to save catalog to store:', err);
  }
};

/**
 * Robustly downloads an audio track to the user's local device.
 * Handles blob URLs, same-origin, and cross-origin audio links seamlessly.
 */
export async function downloadAudioFile(fileUrl: string, title: string) {
  if (!fileUrl) return;

  const optimizedUrl = getOptimizedMediaUrl(fileUrl);
  const cleanTitle = (title || 'beat-track').replace(/[/\\?%*:|"<>]/g, '-').trim();
  const hasExt = cleanTitle.toLowerCase().endsWith('.mp3') || cleanTitle.toLowerCase().endsWith('.wav');
  const fileName = hasExt ? cleanTitle : `${cleanTitle}.mp3`;

  try {
    // 1. Direct download for Blob or Data URLs
    if (optimizedUrl.startsWith('blob:') || optimizedUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = optimizedUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // 2. Fetch as blob for remote/local audio files to force browser download prompt
    const res = await fetch(optimizedUrl, { mode: 'cors' });
    if (res.ok) {
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      return;
    }
  } catch (err) {
    console.warn('Direct blob download attempt failed, attempting fallback download:', err);
  }

  // 3. Fallback direct anchor click
  const a = document.createElement('a');
  a.href = optimizedUrl;
  a.download = fileName;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

