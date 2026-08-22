import { Beat } from '../types';

// Extended interface to include the harmony flag
interface HarmonizedBeat extends Beat {
  isLockedInHarmony: boolean;
}

export function resolveTrackAssetPipeline(trackData: any): HarmonizedBeat {
  const archiveItem = "pyrex-spinna-beats-collection";

  // The Scale: Cloudflare edge-routing pattern combined with Internet Archive storage backbone
  const audioStreamSource = trackData.audioFileName 
    ? `https://archive.org/download/${archiveItem}/${trackData.audioFileName}` 
    : trackData.audioUrl;

  // Artwork and Audio locked in tandem so neither can orphan or fallback to raw strings
  const artworkSource = trackData.artworkFileName 
    ? `https://archive.org/download/${archiveItem}/${trackData.artworkFileName}` 
    : (trackData.artworkUrl || "/images/default-cover.jpg");

  const lockedTitle = trackData.title && trackData.title.trim() !== "" 
    ? trackData.title 
    : "Untitled Production";

  return {
    ...trackData,
    title: lockedTitle,
    audioUrl: audioStreamSource,
    artworkUrl: artworkSource,
    // Ensures status tracking metadata stays glued to the media
    isLockedInHarmony: true 
  };
}
