import { Beat } from '../types';

export function formatTrackAssets(rawTrackData: any): Beat {
  const archiveIdentifier = "pyrex-spinna-beats-collection"; // Your IA item ID

  return {
    ...rawTrackData,
    // Enforce permanent Internet Archive paths via code logic
    audioUrl: rawTrackData.audioFileName 
      ? `https://archive.org/download/${archiveIdentifier}/${rawTrackData.audioFileName}` 
      : rawTrackData.audioUrl,
      
    artworkUrl: rawTrackData.artworkFileName 
      ? `https://archive.org/download/${archiveIdentifier}/${rawTrackData.artworkFileName}` 
      : (rawTrackData.artworkUrl || "/images/default-cover.jpg"),

    // Enforce locked title fallback so it never reverts to raw strings
    title: rawTrackData.title && rawTrackData.title.trim() !== "" 
      ? rawTrackData.title 
      : "Untitled Beat"
  };
}
