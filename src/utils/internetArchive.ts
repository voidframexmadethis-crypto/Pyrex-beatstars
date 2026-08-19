import { Beat } from '../types';

/**
 * Internet Archive S3-compatible API utility
 * Handles background backup tasks for audio files and metadata.
 */

interface ArchiveResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Automatically backs up a track to the Internet Archive in the background.
 * Uses the server-side /api/upload-beat endpoint which handles IA S3 authentication.
 */
export async function backupTrackToInternetArchive(beat: Beat, audioFile: File): Promise<ArchiveResult> {
  try {
    console.log(`[IA Backup] Starting background backup for: ${beat.title}`);
    
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('metadata', JSON.stringify({
      title: beat.title,
      producer: beat.producer,
      bpm: beat.bpm,
      key: beat.key,
      isrc: beat.isrcCode,
      source: 'PyrexSpinna BeatStore Catalog'
    }));

    const response = await fetch('/api/upload-beat', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload to Internet Archive');
    }

    const data = await response.json();
    console.log(`[IA Backup] Successfully archived track at: ${data.url}`);
    
    return {
      success: true,
      url: data.url
    };
  } catch (error) {
    console.error('[IA Backup] Archive failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generates a standard metadata JSON file for the IA collection.
 */
export function generateArchiveMetadata(beat: Beat) {
  return {
    identifier: `pyrex_${beat.id.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    title: beat.title,
    creator: beat.producer,
    date: new Date().toISOString().split('T')[0],
    collection: 'opensource_audio',
    mediatype: 'audio',
    description: `Official backup of ${beat.title} by ${beat.producer}. Catalog ID: ${beat.id}`,
    subject: ['hiphop', 'trap', 'beat', 'music'],
    licenseurl: 'http://creativecommons.org/licenses/by-nc-nd/4.0/',
    isrc: beat.isrcCode,
    bpm: beat.bpm,
    key: beat.key
  };
}
