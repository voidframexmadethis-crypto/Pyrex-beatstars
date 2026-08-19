/**
 * Utility to sanitize track titles by stripping out technical metadata
 * and formatting them for clean display.
 */
export const sanitizeTitle = (title: string): string => {
  if (!title) return '';

  return title
    // Strip suffixes like "- MAIN OUT", "- MASTER", etc.
    .replace(/\s*-\s*(MAIN OUT|MASTER|MIX|FINAL|BOUNCE|INSTRUMENTAL|WAV|MP3|STEMS|TRACKED OUT)\s*$/i, '')
    // Strip BPM markers like "128BPM" or "(128 BPM)"
    .replace(/\s*\(?\s*\d+\s*(BPM|bpm)\s*\)?\s*/gi, ' ')
    // Strip Key markers like "B minor" or "C# Major"
    .replace(/\s*\(?\s*[A-G][#b]?\s+(minor|major|Min|Maj)\s*\)?\s*/gi, ' ')
    // Clean up any double spaces or leading/trailing whitespace
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Extracts BPM from a title string if it exists
 */
export const extractBpm = (title: string): number | null => {
  const match = title.match(/(\d+)\s*(BPM|bpm)/i);
  return match ? parseInt(match[1]) : null;
};

/**
 * Extracts Key from a title string if it exists
 */
export const extractKey = (title: string): string | null => {
  const match = title.match(/([A-G][#b]?\s+(minor|major|Min|Maj))/i);
  return match ? match[1] : null;
};
