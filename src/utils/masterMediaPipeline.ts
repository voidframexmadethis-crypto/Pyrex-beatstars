import { createClient } from '@supabase/supabase-js';

// 1. Hardcoded Supabase Table Anchor (Bypasses Firestore masking tape)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://your-project-id.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-public-anon-key-here";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Master Resolver locking down Title, Artwork, Audio, AND Pricing
export function resolveMasterTrackAsset(rawTrack: any) {
  const archiveItem = "pyrex-spinna-beats-collection";

  const audioSource = rawTrack.audioFileName 
    ? `https://archive.org/download/${archiveItem}/${rawTrack.audioFileName}` 
    : (rawTrack.audioUrl || "");

  const artworkSource = rawTrack.artworkFileName 
    ? `https://archive.org/download/${archiveItem}/${rawTrack.artworkFileName}` 
    : (rawTrack.artworkUrl || "/images/default-cover.jpg");

  const safeTitle = rawTrack.title && rawTrack.title.trim() !== "" 
    ? rawTrack.title 
    : "Untitled Production";

  // 3. Iron-clad Pricing Protection (Prevents prices from resetting or vanishing)
  const lockedBasicPrice = typeof rawTrack.basic_price === 'number' && !isNaN(rawTrack.basic_price) 
    ? rawTrack.basic_price 
    : 29.00; // Your default safe fallback price

  const lockedExclusivePrice = typeof rawTrack.exclusive_price === 'number' && !isNaN(rawTrack.exclusive_price) 
    ? rawTrack.exclusive_price 
    : 299.00;

  return {
    ...rawTrack,
    title: safeTitle,
    audioUrl: audioSource,
    artworkUrl: artworkSource,
    // Permanent pricing attached directly to the Supabase data row
    basicPrice: lockedBasicPrice,
    exclusivePrice: lockedExclusivePrice,
    edgePoweredBy: "Cloudflare-IA-Supabase-Harmony"
  };
}

// 3. Fetch function that pulls from Supabase and applies the master asset lock
export async function getMasterStoreBeats() {
  if (SUPABASE_URL === "https://your-project-id.supabase.co") {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Database table slip:", error.message);
      return [];
    }

    // Pass every track through the master pipeline so nothing ever drops
    return (data || []).map(track => resolveMasterTrackAsset(track));
  } catch (err) {
    console.error("Unexpected database error:", err);
    return [];
  }
}
