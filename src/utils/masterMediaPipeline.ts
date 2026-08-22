import { createClient } from '@supabase/supabase-js';

// 1. Hardcoded Supabase Table Anchor (Bypasses Firestore masking tape)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://your-project-id.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-public-anon-key-here";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Master Resolver locking down Title, Artwork, Audio, AND Pricing
export function resolveMasterTrackAsset(rawTrack: any) {
  // Zero tolerance: If Supabase doesn't have it, log an explicit error
  if (!rawTrack.title || !rawTrack.audio_url) {
    console.error("Critical: Track missing required database fields!", rawTrack);
  }

  return {
    ...rawTrack,
    // NO MORE "Untitled Production" fallbacks — forces your exact database text
    title: rawTrack.title, 
    audioUrl: rawTrack.audio_url,
    artworkUrl: rawTrack.artwork_url, // No fake default images
    basicPrice: rawTrack.basic_price, // No fake pricing fallbacks
    exclusivePrice: rawTrack.exclusive_price,
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
