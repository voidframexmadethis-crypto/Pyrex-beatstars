import { getMasterStoreBeats } from '../utils/masterMediaPipeline';

export async function loadStoreBeats() {
  // This bypasses Firestore completely and pulls straight from your solid Supabase table
  const tracks = await getMasterStoreBeats();
  return tracks;
}
