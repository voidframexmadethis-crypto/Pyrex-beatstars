
/**
 * Formats a track URL to a direct Internet Archive download/stream link.
 * Format: https://archive.org/download/{IDENTIFIER}/{FILENAME}.m4a
 */
export const formatArchiveUrl = (audioUrl: string): string => {
  if (!audioUrl) return '';
  
  // If it's already an archive URL, return as is
  if (audioUrl.includes('archive.org/download')) return audioUrl;

  // Extract filename
  const parts = audioUrl.split('/');
  const filename = parts[parts.length - 1];
  
  // Standard identifier
  const identifier = 'pyrex-spinna-vault-2026';
  
  return `https://archive.org/download/${identifier}/${filename}`;
};
