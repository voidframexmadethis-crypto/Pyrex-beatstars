import MP4Tag from 'mp4-tag';
import { Beat } from '../types';
import { generateISRC } from './isrc';

export interface MetadataOptions {
  title?: string;
  artist?: string;
  copyright?: string;
  publisher?: string;
  genre?: string;
  isrc?: string;
}

export const embedM4AMetadata = async (
  audioBuffer: ArrayBuffer,
  beat: Beat,
  customOptions?: MetadataOptions
): Promise<ArrayBuffer> => {
  const isrc = customOptions?.isrc || beat.isrcCode || generateISRC(beat.id);
  const artist = customOptions?.artist || 'Pyrex spinna';
  const copyright = customOptions?.copyright || `© ${new Date().getFullYear()} Pyrex spinna. All Rights Reserved.`;
  const publisher = customOptions?.publisher || 'Pyrex spinna Music';
  const genre = customOptions?.genre || 'Hip-Hop / Trap';

  try {
    const mp4tag = new MP4Tag(audioBuffer);
    mp4tag.read();

    // Standard iTunes tags
    mp4tag.metadata = {
      ...mp4tag.metadata,
      title: beat.title,
      artist: artist,
      album_artist: artist,
      composer: artist,
      copyright: copyright,
      genre: genre,
      encoding_tool: 'PyrexSpinna M4A Engine',
      description: `ISRC: ${isrc} | BPM: ${beat.bpm} | Key: ${beat.key} | Camelot: ${beat.camelotCode || 'N/A'}`,
      comment: `Licensed to PyrexSpinna Customer. ISRC: ${isrc}. Publisher: ${publisher}`
    };

    const updatedBuffer = mp4tag.save();
    return updatedBuffer as any as ArrayBuffer;
  } catch (error) {
    console.error('Error embedding M4A metadata:', error);
    return audioBuffer; // Return original if error
  }
};

/**
 * Downloads a file with embedded metadata
 */
export const downloadTaggedM4A = async (
  audioUrl: string,
  beat: Beat,
  isrc: string
) => {
  // STRICT REQUIREMENT: Force Internet Archive URL
  const iaUrl = audioUrl.replace(/https?:\/\/.*\.r2\.dev/, 'https://archive.org/download/pyrex-spinna-vault-2026');
  
  try {
    const response = await fetch(iaUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    const taggedBuffer = await embedM4AMetadata(arrayBuffer, beat, { isrc });
    const taggedBlob = new Blob([taggedBuffer], { type: 'audio/mp4' });
    
    const url = window.URL.createObjectURL(taggedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${beat.title.replace(/\s+/g, '_')}.m4a`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download failed:', error);
    // Direct trigger as fallback
    const a = document.createElement('a');
    a.href = iaUrl;
    a.download = `${beat.title.replace(/\s+/g, '_')}.m4a`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
