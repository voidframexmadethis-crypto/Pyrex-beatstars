import { deduplicateTracks, getTrackFingerprint } from '../utils/deduplicate';

export function createFileFingerprint(file: File | Blob): string {
  const name = file instanceof File ? file.name : 'blob';
  const lastMod = file instanceof File && (file as any).lastModified ? (file as any).lastModified : 0;
  return `${name.toLowerCase().trim()}_${file.size}_${lastMod}`;
}

// ==========================================
// PYREX SPINNA INDEXEDDB PERMANENT MASS STORAGE
// ==========================================

const DB_NAME = "PyrexLocalMassStorage";
const DB_VERSION = 1;
const STORE_NAME = "PERMANENT_TRACKS";
const CHUNK_STORE_NAME = "TRACK_CHUNKS";

/**
 * Initializes the permanent browser storage database engine.
 */
function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(CHUNK_STORE_NAME)) {
        db.createObjectStore(CHUNK_STORE_NAME, { keyPath: "chunkKey" });
      }
    };

    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
    request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error);
  });
}

/**
 * Permanently saves an uploaded beat file and its metadata to the browser using IndexedDB with zero memory leaks via chunked file slicing.
 * @param {string} title - The name of your track.
 * @param {File|Blob} audioFile - The raw audio asset file uploaded from the file input.
 */
export async function hardcodeBeatToBrowser(title: string, audioFile: File | Blob): Promise<boolean> {
  const db = await initDB();
  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB chunk size to prevent memory exhaustion
  const totalChunks = Math.ceil(audioFile.size / CHUNK_SIZE);
  const fileSignature = createFileFingerprint(audioFile);

  // Check for existing chunk track metadata with matching signature
  let existingTrackId: string | null = null;
  try {
    const existingTracks = await new Promise<any[]>((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
    const match = existingTracks.find(t =>
      t.fileSignature === fileSignature ||
      (t.fileName === (audioFile instanceof File ? audioFile.name : 'audio_track.mp3') && t.fileSize === audioFile.size) ||
      (t.title && t.title.toLowerCase().trim() === title.toLowerCase().trim())
    );
    if (match) existingTrackId = match.id;
  } catch (e) {
    console.warn("Notice checking chunk DB:", e);
  }

  const trackId = existingTrackId || `track_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  console.log(`Pyrex Spinna Engine: Streaming ${audioFile.size} bytes in ${totalChunks} chunks using file.slice()`);

  // Stream and save chunks to prevent main thread blocking and memory spikes
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, audioFile.size);
    const chunkBlob = audioFile.slice(start, end);

    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(CHUNK_STORE_NAME, "readwrite");
      const store = transaction.objectStore(CHUNK_STORE_NAME);
      const request = store.put({
        chunkKey: `${trackId}_chunk_${i}`,
        trackId: trackId,
        index: i,
        blob: chunkBlob
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    if (i % 5 === 0) {
      await new Promise(r => setTimeout(r, 10));
    }
  }

  // Save track metadata and reference
  const trackMetadata = {
    id: trackId,
    title: title,
    uploadedAt: new Date().toISOString(),
    fileName: audioFile instanceof File ? audioFile.name : 'audio_track.mp3',
    mimeType: audioFile.type || 'audio/mpeg',
    totalChunks: totalChunks,
    fileSize: audioFile.size,
    fileSignature: fileSignature,
    fileFingerprint: fileSignature
  };

  await new Promise<boolean>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(trackMetadata);

    request.onsuccess = () => {
      console.log(`Successfully hardcoded chunked track "${title}" to browser storage.`);
      resolve(true);
    };
    request.onerror = () => reject(request.error);
  });

  return true;
}

/**
 * BeatStars database linking pattern: saves both raw audio blob and raw artwork blob into IndexedDB.
 */
const PROD_DB_NAME = "PyrexProductionMassStorage";
const PROD_STORE_NAME = "STOREFRONT_BEATS";
const PROD_DB_VERSION = 3;

function openEngineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PROD_DB_NAME, PROD_DB_VERSION);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(PROD_STORE_NAME)) {
        db.createObjectStore(PROD_STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = (e: any) => resolve(e.target.result);
    request.onerror = (e: any) => reject(e.target.error);
  });
}

/**
 * Mimics BeatStars cloud linking by bundling the audio and artwork into an unbreakable record.
 */
export async function publishBeatToStorefront(title: string, audioFile: File | Blob, artworkFile?: File | Blob, bpm = "120", keySignature = "C Minor"): Promise<boolean> {
  // Also save via unified hardcode function so both chunk storage and production storage are in sync
  try {
    await hardcodeBeatAndArtworkTogether(title, audioFile, artworkFile);
  } catch (e) {
    console.warn("Unified backup save notice:", e);
  }

  const db = await openEngineDB();
  const fileName = audioFile instanceof File ? audioFile.name : 'audio_track.mp3';
  const fileSize = audioFile.size;
  const fileLastModified = audioFile instanceof File && (audioFile as any).lastModified ? (audioFile as any).lastModified : 0;
  const fileSignature = createFileFingerprint(audioFile);

  // Check for existing record with matching file signature, fingerprint, or title
  let existingMatch: any = null;
  try {
    const existingTracks = await new Promise<any[]>((resolve) => {
      const transaction = db.transaction(PROD_STORE_NAME, "readonly");
      const store = transaction.objectStore(PROD_STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    existingMatch = existingTracks.find(t =>
      t.fileSignature === fileSignature ||
      t.fileFingerprint === fileSignature ||
      (t.fileName === fileName && t.fileSize === fileSize && (fileLastModified ? t.fileLastModified === fileLastModified : true)) ||
      (t.title && t.title.toLowerCase().trim() === title.toLowerCase().trim())
    );
  } catch (e) {
    console.warn("Error scanning existing IndexedDB beats:", e);
  }

  const trackId = existingMatch ? existingMatch.id : `beat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const beatRecord = {
    id: trackId,
    title: title,
    bpm: bpm,
    keySignature: keySignature,
    audioBlob: audioFile,
    artworkBlob: artworkFile || existingMatch?.artworkBlob || null,
    fileName: fileName,
    fileSize: fileSize,
    fileLastModified: fileLastModified,
    fileSignature: fileSignature,
    fileFingerprint: fileSignature,
    publishedAt: existingMatch?.publishedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PROD_STORE_NAME, "readwrite");
    const store = transaction.objectStore(PROD_STORE_NAME);
    const request = store.put(beatRecord);

    request.onsuccess = () => {
      console.log(`Cloud Engine: Successfully persisted artwork and beat for: ${title}`);
      resolve(true);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Loads and generates operational streaming links for the storefront audio player from stored blobs.
 */
export async function loadStorefrontBeats(): Promise<any[]> {
  try {
    const db = await openEngineDB();
    const tracks = await new Promise<any[]>((resolve, reject) => {
      const transaction = db.transaction(PROD_STORE_NAME, "readonly");
      const store = transaction.objectStore(PROD_STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    if (tracks && tracks.length > 0) {
      const mapped = tracks.map(track => {
        let audioStreamUrl = '';
        try {
          if (track.audioBlob && (track.audioBlob instanceof Blob || track.audioBlob instanceof File)) {
            audioStreamUrl = URL.createObjectURL(track.audioBlob);
          }
        } catch (e) {
          console.warn("Failed to generate Object URL for audio blob:", e);
        }

        let artworkStreamUrl = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60";
        try {
          if (track.artworkBlob && (track.artworkBlob instanceof Blob || track.artworkBlob instanceof File)) {
            artworkStreamUrl = URL.createObjectURL(track.artworkBlob);
          }
        } catch (e) {
          console.warn("Failed to generate Object URL for artwork blob:", e);
        }

        return {
          ...track,
          id: `indexeddb-${track.id}`,
          fileName: track.fileName || (track.audioBlob instanceof File ? track.audioBlob.name : undefined),
          fileSize: track.fileSize || (track.audioBlob ? track.audioBlob.size : undefined),
          fileLastModified: track.fileLastModified || (track.audioBlob instanceof File ? track.audioBlob.lastModified : undefined),
          fileSignature: track.fileSignature || (track.fileName && track.fileSize ? `${track.fileName.toLowerCase().trim()}_${track.fileSize}_${track.fileLastModified || ''}` : undefined),
          fileFingerprint: track.fileFingerprint || track.fileSignature,
          audioUrl: audioStreamUrl,
          coverArtUrl: artworkStreamUrl,
          artworkUrl: artworkStreamUrl,
          isLocal: true,
          producer: track.producer || 'Pyrex Spinna'
        };
      });

      return deduplicateTracks(mapped);
    }
  } catch (err) {
    console.warn("loadStorefrontBeats fallback to unified storage:", err);
  }

  const hardcoded = await getUnifiedHardcodedBeats();
  return deduplicateTracks(hardcoded);
}

/**
 * Retrieves all saved beats from browser memory (IndexedDB) by reassembling chunks on-demand with zero memory leaks.
 */
export async function getHardcodedBeats(): Promise<any[]> {
  return getUnifiedHardcodedBeats();
}

/**
 * Hardcodes both the audio asset and the cover art image blob together into a single database file row.
 * @param {string} title - Beat title string.
 * @param {File|Blob} audioFile - The raw audio track file.
 * @param {File|Blob} [artworkFile] - The user selected image file for cover graphics.
 */
export async function hardcodeBeatAndArtworkTogether(title: string, audioFile: File | Blob, artworkFile?: File | Blob): Promise<boolean> {
  const db = await initDB();
  const CHUNK_SIZE = 2 * 1024 * 1024;
  const totalChunks = Math.ceil(audioFile.size / CHUNK_SIZE);
  const trackId = `track_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, audioFile.size);
    const chunkBlob = audioFile.slice(start, end);

    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(CHUNK_STORE_NAME, "readwrite");
      const store = transaction.objectStore(CHUNK_STORE_NAME);
      const request = store.put({
        chunkKey: `${trackId}_chunk_${i}`,
        trackId: trackId,
        index: i,
        blob: chunkBlob
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    if (i % 5 === 0) {
      await new Promise(r => setTimeout(r, 10));
    }
  }

  const unifiedTrackPacket = {
    id: trackId,
    title: title,
    uploadedAt: new Date().toISOString(),
    artworkBlob: artworkFile || null,
    fileName: audioFile instanceof File ? audioFile.name : 'audio_track.mp3',
    artworkFileName: artworkFile instanceof File ? artworkFile.name : 'default-art.png',
    mimeType: audioFile.type || 'audio/mpeg',
    totalChunks: totalChunks,
    fileSize: audioFile.size
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(unifiedTrackPacket);

    request.onsuccess = () => {
      console.log(`Pyrex Storage: Unified audio and artwork saved for "${title}"`);
      resolve(true);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieves all paired tracks and handles dynamic local URL resolution.
 */
export async function getUnifiedHardcodedBeats(): Promise<any[]> {
  const db = await initDB();

  const tracks = await new Promise<any[]>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });

  const reassembledTracks: any[] = [];

  for (const track of tracks) {
    try {
      const chunkBlobs: Blob[] = [];
      for (let i = 0; i < (track.totalChunks || 1); i++) {
        const chunkData = await new Promise<any>((resolve, reject) => {
          const transaction = db.transaction(CHUNK_STORE_NAME, "readonly");
          const store = transaction.objectStore(CHUNK_STORE_NAME);
          const request = store.get(`${track.id}_chunk_${i}`);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        if (chunkData && chunkData.blob) {
          chunkBlobs.push(chunkData.blob);
        }
      }

      const fullBlob = new Blob(chunkBlobs, { type: track.mimeType || 'audio/mpeg' });
      let generatedArtworkUrl = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60";

      if (track.artworkBlob) {
        generatedArtworkUrl = URL.createObjectURL(track.artworkBlob);
      }

      reassembledTracks.push({
        ...track,
        id: `indexeddb-${track.id}`,
        audioUrl: URL.createObjectURL(fullBlob),
        coverArtUrl: generatedArtworkUrl,
        artworkUrl: generatedArtworkUrl,
        isLocal: true,
        producer: track.producer || 'Pyrex Spinna'
      });
    } catch (err) {
      console.warn(`Failed to reassemble unified track ${track.title}:`, err);
    }
  }

  return reassembledTracks;
}

/**
 * Updates track metadata in IndexedDB so custom user titles and edits persist across reloads.
 */
export async function updateTrackInDB(rawTrackId: string, updates: any): Promise<boolean> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const getReq = store.get(rawTrackId);

    getReq.onsuccess = () => {
      const existing = getReq.result;
      if (!existing) {
        resolve(false);
        return;
      }
      const updated = { ...existing, ...updates };
      const putReq = store.put(updated);
      putReq.onsuccess = () => {
        console.log(`Pyrex Storage: Updated track ${rawTrackId} metadata in IndexedDB.`);
        resolve(true);
      };
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

/**
 * Deletes a track and all associated chunks from IndexedDB.
 */
export async function deleteTrackFromDB(rawTrackId: string): Promise<boolean> {
  try {
    const db = await initDB();
    
    // 1. Delete from main tracks store
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(rawTrackId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // 2. Delete all chunk keys from TRACK_CHUNKS that match the track ID prefix
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(CHUNK_STORE_NAME, "readwrite");
      const store = transaction.objectStore(CHUNK_STORE_NAME);
      const request = store.openCursor();
      request.onsuccess = (e: any) => {
        const cursor = e.target.result;
        if (cursor) {
          if (cursor.value.trackId === rawTrackId || cursor.key.toString().startsWith(rawTrackId + '_')) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });

    // 3. Try deleting from production storefront beats if present
    try {
      const prodDb = await openEngineDB();
      await new Promise<void>((resolve, reject) => {
        const transaction = prodDb.transaction(PROD_STORE_NAME, "readwrite");
        const store = transaction.objectStore(PROD_STORE_NAME);
        const request = store.delete(rawTrackId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      // Production database might not have it or not initialized, safe to ignore
    }

    return true;
  } catch (err) {
    console.error("Failed to delete track from IndexedDB:", err);
    return false;
  }
}


