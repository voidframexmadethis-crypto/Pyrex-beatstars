
/**
 * Utility for generating music industry identifiers and managing metadata.
 */

/**
 * Generates a compliant ISRC (International Standard Recording Code).
 * Format: CC-XXX-YY-NNNNN
 * CC: Country Code (e.g., US)
 * XXX: Registrant Code (e.g., PXS)
 * YY: Last two digits of the year
 * NNNNN: Unique 5-digit number
 */
export const generateISRC = (sequence: number = 1): string => {
  const countryCode = 'US';
  const registrantCode = 'PXS';
  const year = new Date().getFullYear().toString().slice(-2);
  const serialNumber = sequence.toString().padStart(5, '0');
  
  return `${countryCode}-${registrantCode}-${year}-${serialNumber}`;
};

/**
 * Generates a mock ISWC (International Standard Musical Work Code).
 * Format: T-NNNNNNNNN-C
 * T: Prefix
 * NNNNNNNNN: 9 digits
 * C: Check digit
 */
export const generateISWC = (): string => {
  const prefix = 'T';
  const digits = Math.floor(100000000 + Math.random() * 900000000).toString();
  const checkDigit = Math.floor(Math.random() * 10).toString();
  
  return `${prefix}-${digits}-${checkDigit}`;
};

export const validateSplits = (writer: number, publisher: number): boolean => {
  return (Number(writer) + Number(publisher)) === 100;
};

/**
 * Formats track details for DDEX/Distribution payloads.
 */
export const formatDistributionPayload = (beat: any) => {
  return {
    release_info: {
      title: beat.title,
      artist: beat.producer,
      release_date: beat.releaseDate || new Date().toISOString().split('T')[0],
      genre: beat.primaryGenre || 'Hip Hop',
    },
    track_metadata: {
      isrc: beat.publishing?.isrc || beat.isrcCode,
      iswc: beat.publishing?.iswc || beat.iswcCode,
      duration: beat.duration,
      explicit: beat.isExplicit || false,
    },
    publishing: {
      pro: beat.publishing?.proName,
      ipi: beat.publishing?.ipiNumber,
      splits: {
        writer: beat.publishing?.writerSplit,
        publisher: beat.publishing?.publisherSplit,
      }
    },
    files: {
      audio_url: beat.audioUrl,
      artwork_url: beat.coverArtUrl,
    }
  };
};
