import { Beat } from '../types';

export interface LicenseTier {
  name: string;
  price: number;
  format?: string;
  description?: string;
  features?: string[];
}

/**
 * Helper to generate dynamic license tiers for any beat.
 * Automatically pulls the WAV Lease price from `beat.price` or `beat.licenses.wavLease.price`.
 */
export function getBeatLicenses(beat?: Beat | null, defaultWavPrice: number = 49.99): LicenseTier[] {
  const wavPrice = beat?.licenses?.wavLease?.price ?? beat?.price ?? defaultWavPrice;
  const mp3Price = beat?.licenses?.mp3Lease?.price ?? 29.99;
  const stemsPrice = beat?.licenses?.premiumLease?.price ?? 99.99;
  const exclusivePrice = beat?.licenses?.exclusive?.price ?? 999.99;

  return [
    { 
      name: "MP3 Lease", 
      price: typeof mp3Price === 'number' ? mp3Price : Number(mp3Price) || 29.99, 
      format: "Tagged/Untagged MP3", 
      description: "Standard MP3 distribution license" 
    },
    { 
      name: "WAV Lease", 
      price: typeof wavPrice === 'number' ? wavPrice : Number(wavPrice) || 49.99, 
      format: "Lossless 24-bit WAV", 
      description: "Studio quality uncompressed master lease" 
    },
    { 
      name: "Trackout Stems", 
      price: typeof stemsPrice === 'number' ? stemsPrice : Number(stemsPrice) || 99.99, 
      format: "Full WAV Stem Tracks", 
      description: "Multi-track audio stems for professional mixing" 
    },
    { 
      name: "Exclusive Rights", 
      price: typeof exclusivePrice === 'number' ? exclusivePrice : Number(exclusivePrice) || 999.99, 
      format: "Master + Stems + Full Ownership", 
      description: "Complete ownership transfer, removed from store" 
    }
  ];
}
