import { createClient } from '@supabase/supabase-js';

// Securely access environment variables, defaulting to placeholders if not set
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://your-project-id.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-public-anon-key-here";

// The single client instance holding the table flat
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getLockedTracks() {
  if (SUPABASE_URL === "https://your-project-id.supabase.co") {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*');

    if (error) {
      console.error("Database connection slip:", error.message);
      return [];
    }

    // Hardcoded asset locking pipeline for Internet Archive harmony
    return (data || []).map(track => ({
      ...track,
      title: track.title && track.title.trim() !== "" ? track.title : "Untitled Production",
      artworkUrl: track.artwork_url || "/images/default-cover.jpg",
      audioUrl: track.audio_url
    }));
  } catch (err) {
    console.error("Unexpected database error:", err);
    return [];
  }
}
