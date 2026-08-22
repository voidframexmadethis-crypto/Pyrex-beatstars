// utils/enforceMasterData.ts
export function cleanTrackData(rawTrack: any) {
  return {
    id: rawTrack.id,
    // Forces exact database fields with zero fallback placeholders
    title: rawTrack.title,
    artworkUrl: rawTrack.artwork_url || rawTrack.artworkUrl,
    audioUrl: rawTrack.audio_url || rawTrack.audioUrl,
    basicPrice: rawTrack.basic_price ?? rawTrack.basicPrice,
    exclusivePrice: rawTrack.exclusive_price ?? rawTrack.exclusivePrice
  };
}
