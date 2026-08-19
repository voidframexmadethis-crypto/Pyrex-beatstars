export interface CamelotInfo {
  code: string;
  key: string;
  mode: 'Major' | 'Minor';
}

export const CAMELOT_WHEEL: CamelotInfo[] = [
  { code: '1A', key: 'Ab Minor', mode: 'Minor' },
  { code: '1B', key: 'B Major', mode: 'Major' },
  { code: '2A', key: 'Eb Minor', mode: 'Minor' },
  { code: '2B', key: 'F# Major', mode: 'Major' },
  { code: '3A', key: 'Bb Minor', mode: 'Minor' },
  { code: '3B', key: 'Db Major', mode: 'Major' },
  { code: '4A', key: 'F Minor', mode: 'Minor' },
  { code: '4B', key: 'Ab Major', mode: 'Major' },
  { code: '5A', key: 'C Minor', mode: 'Minor' },
  { code: '5B', key: 'Eb Major', mode: 'Major' },
  { code: '6A', key: 'G Minor', mode: 'Minor' },
  { code: '6B', key: 'Bb Major', mode: 'Major' },
  { code: '7A', key: 'D Minor', mode: 'Minor' },
  { code: '7B', key: 'F Major', mode: 'Major' },
  { code: '8A', key: 'A Minor', mode: 'Minor' },
  { code: '8B', key: 'C Major', mode: 'Major' },
  { code: '9A', key: 'E Minor', mode: 'Minor' },
  { code: '9B', key: 'G Major', mode: 'Major' },
  { code: '10A', key: 'B Minor', mode: 'Minor' },
  { code: '10B', key: 'D Major', mode: 'Major' },
  { code: '11A', key: 'F# Minor', mode: 'Minor' },
  { code: '11B', key: 'A Major', mode: 'Major' },
  { code: '12A', key: 'C# Minor', mode: 'Minor' },
  { code: '12B', key: 'E Major', mode: 'Major' },
];

// Map standard keys to Camelot codes
const KEY_TO_CAMELOT: Record<string, string> = {
  'Ab Minor': '1A', 'G# Minor': '1A', 'B Major': '1B',
  'Eb Minor': '2A', 'D# Minor': '2A', 'F# Major': '2B', 'Gb Major': '2B',
  'Bb Minor': '3A', 'A# Minor': '3A', 'Db Major': '3B', 'C# Major': '3B',
  'F Minor': '4A', 'Ab Major': '4B', 'G# Major': '4B',
  'C Minor': '5A', 'Eb Major': '5B', 'D# Major': '5B',
  'G Minor': '6A', 'Bb Major': '6B', 'A# Major': '6B',
  'D Minor': '7A', 'F Major': '7B',
  'A Minor': '8A', 'C Major': '8B',
  'E Minor': '9A', 'G Major': '9B',
  'B Minor': '10A', 'D Major': '10B',
  'F# Minor': '11A', 'Gb Minor': '11A', 'A Major': '11B',
  'C# Minor': '12A', 'Db Minor': '12A', 'E Major': '12B',
};

export const getCamelotCode = (key: string, mode: 'Major' | 'Minor'): string => {
  // Normalize key string (e.g., "C# Minor" or "Db Major")
  let normalizedKey = key.trim();
  if (!normalizedKey.includes('Major') && !normalizedKey.includes('Minor')) {
    normalizedKey = `${normalizedKey} ${mode}`;
  }
  
  // Try direct lookup
  if (KEY_TO_CAMELOT[normalizedKey]) return KEY_TO_CAMELOT[normalizedKey];
  
  // Try capitalized first letter
  const capitalized = normalizedKey.charAt(0).toUpperCase() + normalizedKey.slice(1);
  if (KEY_TO_CAMELOT[capitalized]) return KEY_TO_CAMELOT[capitalized];

  return '8A'; // Fallback to A Minor
};

export const getHarmonicMatches = (camelotCode: string): string[] => {
  if (!camelotCode || camelotCode.length < 2) return [];
  
  const num = parseInt(camelotCode.slice(0, -1), 10);
  const letter = camelotCode.slice(-1).toUpperCase();
  
  if (isNaN(num)) return [];

  const matches: string[] = [camelotCode];
  
  // Opposite letter (A <-> B)
  matches.push(`${num}${letter === 'A' ? 'B' : 'A'}`);
  
  // Neighbors (+1, -1)
  const prevNum = num === 1 ? 12 : num - 1;
  const nextNum = num === 12 ? 1 : num + 1;
  
  matches.push(`${prevNum}${letter}`);
  matches.push(`${nextNum}${letter}`);
  
  return Array.from(new Set(matches));
};

export const getCamelotInfoByCode = (code: string): CamelotInfo | undefined => {
  return CAMELOT_WHEEL.find(c => c.code === code.toUpperCase());
};
