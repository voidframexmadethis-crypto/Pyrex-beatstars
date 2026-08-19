// Krypside Dynamic Lossless Catalog (Starts Empty for Solo Producer Ingestion)
export let krypsideCatalog: any[] = [];
export const initialCatalog = [];

// Admin Uploader Function: Adds only verified human-made beats directly into your live catalog
export function uploadNewBeat(beatData: any) {
  const { title, bpm, key, price, audioUrl, isHumanMade } = beatData;

  // Strict guardrail: Rejects any track flagged as AI or unverified
  if (!isHumanMade) {
    throw new Error("Upload rejected: Krypside strictly accepts human-produced beats only.");
  }

  const newTrack = {
    id: `ks-${Date.now()}`,
    title,
    producer: "KRYPSIDE", // Locked exclusively to your solo enterprise brand
    bpm,
    key,
    price,
    audioUrl,
    storeLive: true,
    isHumanVerified: true
  };

  // Push straight to your live catalog array
  krypsideCatalog.push(newTrack);

  console.log(`"${title}" successfully deployed to Lossless Catalog and Audio Engine.`);
  return newTrack;
}

// Dynamic renderer for your store view
export function RenderLosslessCatalog({ catalogArray }: { catalogArray: any[] }) {
  if (catalogArray.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl bg-gray-950/40 my-6">
        <p className="text-sm font-mono text-gray-400 uppercase tracking-widest">Vault is Currently Empty</p>
        <p className="text-xs text-gray-600 mt-1">Upload your human-produced master beats via the admin panel to deploy them here.</p>
      </div>
    );
  }
  
  return (
    <>
      {catalogArray.map(beat => (
        <div key={beat.id} className="bg-gray-950 border border-blue-900/40 rounded-xl p-5 mb-4 text-white flex justify-between items-center">
          <div>
            <h4 className="font-bold text-blue-400">{beat.title}</h4>
            <p className="text-xs text-gray-400 mt-1">BPM: {beat.bpm} | Key: {beat.key} | Producer: {beat.producer}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-white mb-2">${beat.price}</p>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">Store Live</span>
          </div>
        </div>
      ))}
    </>
  );
}
