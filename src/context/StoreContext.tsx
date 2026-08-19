import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Beat, BeatPackData, Profile, StoreState, YouTubeVideo, Analytics } from '../types';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { filterHumanBeats, isAIPlaceholderBeat, saveCatalogToStore } from '../lib/beatUtils';
import { getHardcodedBeats, updateTrackInDB, loadStorefrontBeats, deleteTrackFromDB } from '../lib/localTrackMassStorage';
import { initGA, trackPageView } from '../utils/gtag';

const BEAT_PACKS_STORAGE_KEY = 'pyrex_spinna_beat_packs_data_v1';

interface StoreContextType {
  state: StoreState;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  addVideo: (video: YouTubeVideo) => void;
  removeVideo: (id: string) => void;
  addBeat: (beat: Beat) => Promise<void>;
  removeBeat: (id: string) => Promise<void>;
  restoreBeat: (id: string) => Promise<void>;
  updateBeat: (id: string, updates: Partial<Beat>) => Promise<void>;
  addBeatPack: (pack: BeatPackData) => Promise<void>;
  removeBeatPack: (id: string) => Promise<void>;
  updateBeatPack: (id: string, updates: Partial<BeatPackData>) => Promise<void>;
  updateStore: (newState: StoreState) => void;
  addSubscriber: (email: string) => void;
  incrementAnalytics: (metric: keyof Analytics, amount?: number) => void;
  resetAnalytics: (metric: keyof Analytics) => void;
  isCryptoModalOpen: boolean;
  setIsCryptoModalOpen: (open: boolean) => void;
  error: { message: string; type: 'error' | 'warning' | 'info' } | null;
  clearError: () => void;
}

import { deduplicateTracks, getTrackFingerprint } from '../utils/deduplicate';

const dedupe = (items: Beat[]) => deduplicateTracks(items as any) as Beat[];

// Nuclear Deduplication Purge - Run on script load
try {
  const raw = localStorage.getItem('pyrex_beats');
  if (raw) {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const clean = deduplicateTracks(parsed);
      localStorage.setItem('pyrex_beats', JSON.stringify(clean));
    }
  }
} catch (e) {
  // Ignore
}

const defaultState: StoreState = {
  profile: {
    name: 'Pyrex Spinna',
    bio: 'Pro Audio Loops & Instrumental Beats',
    avatarUrl: '',
    socialLinks: [],
    marketingConfig: {
      autoPostVideo: false,
      youtubeVideoGen: false,
      tiktokVideoGen: false,
      youtubeTargetChannel: '',
      tiktokTargetChannel: '',
      youtubeCompanionUrl: '',
      soundcloudSyncLink: '',
      audiomackEmbedCode: '',
      tiktokTrendingAudioSync: '',
      dspDistributionOptIn: false,
      spotifyArtistLink: '',
      appleMusicArtistLink: '',
      upcCoreField: '',
      googleAnalyticsCode: '',
      metaPixelId: '',
      googleAdsTracker: '',
      pinterestTagId: '',
      tiktokPixelId: '',
      utmCampaignBuilder: '',
      smartLinkShortUrl: '',
      autoSocialCopy: '',
      directCheckoutShortcut: '',
      emailReceiptLayout: 'Standard',
      mailingListTrigger: false,
      socialShareArray: 'Twitter, Facebook, WhatsApp, Email',
      rssPodcastFeed: false,
      airbitFeaturedBid: '',
      localStorageBackupRegistry: true,
      tosComplianceMatrix: false,
      defaultVocalMixPrice: 149.99,
      defaultStemMixPrice: 249.99,
      defaultExecutiveSessionPrice: 499.99,
      // Default Global Prices
      defaultMp3Price: 29.99,
      defaultWavPrice: 49.99,
      defaultStemsPrice: 99.99,
      defaultUnlimitedPrice: 199.99,
      defaultExclusivePrice: 999.99,
    }
  },
  videos: [],
  beats: [],
  beatPacks: [],
  vaults: [],
  archivedBeats: [],
  subscribers: [],
  analytics: {
    siteVisits: 0,
    uniqueVisitors: 0,
    totalPlays: 0,
    totalShares: 0,
    downloads: 0,
    totalEarnings: 0,
    platformFees: 0,
  } as any,
  isLoading: false,
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<StoreState>(() => {
    try {
      const savedProfile = localStorage.getItem('pyrex_profile_backup');
      const savedArchived = localStorage.getItem('pyrex_archived_backup');
      const savedSubscribers = localStorage.getItem('pyrex_subscribers');
      const savedBeatPacks = localStorage.getItem(BEAT_PACKS_STORAGE_KEY);
      const savedVaults = localStorage.getItem('pyrex_vaults');
      
      return {
        profile: savedProfile ? JSON.parse(savedProfile) : defaultState.profile,
        videos: [],
        beats: [],
        beatPacks: savedBeatPacks ? JSON.parse(savedBeatPacks) : [],
        vaults: savedVaults ? JSON.parse(savedVaults) : [],
        archivedBeats: savedArchived ? JSON.parse(savedArchived) : [],
        subscribers: savedSubscribers ? JSON.parse(savedSubscribers) : [],
        analytics: defaultState.analytics,
        isLoading: true,
      };
    } catch (e) {
      return { ...defaultState, beats: [], isLoading: true };
    }
  });

  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [error, setError] = useState<{ message: string; type: 'error' | 'warning' | 'info' } | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    initGA();
  }, []);

  // Single-Source Hydration (Local Beats and Packs)
  useEffect(() => {
    try {
      const savedBeats = localStorage.getItem('pyrex_beats');
      const savedBeatPacks = localStorage.getItem(BEAT_PACKS_STORAGE_KEY);
      let parsedPacks: BeatPackData[] = [];
      if (savedBeatPacks) {
        try {
          parsedPacks = JSON.parse(savedBeatPacks);
        } catch (err) {
          console.warn("Hydration of beat packs failed:", err);
        }
      }

      if (savedBeats) {
        const parsedBeats = JSON.parse(savedBeats);
        if (Array.isArray(parsedBeats)) {
          // Filter out legacy dummy beats if present in local storage
          const cleanUserBeats = parsedBeats.filter(b => b && !b.id.startsWith('ps-00') && !b.id.startsWith('tev1-') && !b.id.startsWith('pack-beat-'));
          setState(prev => ({
            ...prev,
            beats: dedupe(cleanUserBeats),
            beatPacks: parsedPacks.length > 0 ? parsedPacks : prev.beatPacks,
            isLoading: false
          }));
        }
      } else {
        setState(prev => ({ 
          ...prev, 
          beats: [],
          beatPacks: parsedPacks.length > 0 ? parsedPacks : prev.beatPacks,
          isLoading: false 
        }));
      }
    } catch (e) {
      console.warn("Hydration failed:", e);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Cross-Tab Storage Event Listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pyrex_beats' && e.newValue) {
        try {
          const remoteBeats = JSON.parse(e.newValue);
          if (Array.isArray(remoteBeats)) {
            setState(prev => ({
              ...prev,
              beats: dedupe(remoteBeats)
            }));
          }
        } catch (err) {
          console.error("Cross-tab sync failed for beats:", err);
        }
      }
      if (e.key === BEAT_PACKS_STORAGE_KEY && e.newValue) {
        try {
          const remotePacks = JSON.parse(e.newValue);
          if (Array.isArray(remotePacks)) {
            setState(prev => ({
              ...prev,
              beatPacks: remotePacks
            }));
          }
        } catch (err) {
          console.error("Cross-tab sync failed for beat packs:", err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const incrementAnalytics = (metric: keyof Analytics, amount: number = 1) => {
    const isAdmin = localStorage.getItem('pyrex_admin_session') === 'true';
    if (isAdmin) return;

    setState(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        [metric]: (prev.analytics[metric] || 0) + amount
      }
    }));
  };

  const resetAnalytics = (metric: keyof Analytics) => {
    setState(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        [metric]: 0
      }
    }));
  };

  // Save to localStorage whenever beats/archivedBeats/profile/beatPacks change
  useEffect(() => {
    try {
      const validBeats = filterHumanBeats(state.beats);
      saveCatalogToStore(validBeats);
      // STRICT FIX: Explicitly save to pyrex_beats for persistence
      localStorage.setItem('pyrex_beats', JSON.stringify(validBeats));
      if (state.beatPacks && Array.isArray(state.beatPacks) && state.beatPacks.length > 0) {
        localStorage.setItem(BEAT_PACKS_STORAGE_KEY, JSON.stringify(state.beatPacks));
      }
      if (state.vaults && Array.isArray(state.vaults)) {
        localStorage.setItem('pyrex_vaults', JSON.stringify(state.vaults));
      }
      localStorage.setItem('pyrex_archived_backup', JSON.stringify(state.archivedBeats));
      localStorage.setItem('pyrex_profile_backup', JSON.stringify(state.profile));
      localStorage.setItem('pyrex_subscribers', JSON.stringify(state.subscribers || []));
    } catch (e) {
      console.error("Failed to save local backup", e);
    }
  }, [state.beats, state.beatPacks, state.archivedBeats, state.profile]);

  // Load backend cloud database beats from /api/beats on mount
  useEffect(() => {
    const fetchCloudBeats = async () => {
      try {
        const res = await fetch('/api/beats');
        const data = await res.json();
        if (data && data.beats && Array.isArray(data.beats) && data.beats.length > 0) {
          const fetchedCloudBeats: Beat[] = data.beats.map((item: any) => {
            const config = state.profile.marketingConfig;
            const mp3 = Number(item.priceMp3) || config?.defaultMp3Price || 29.99;
            const wav = Number(item.priceWav) || config?.defaultWavPrice || 49.99;
            const stems = Number(item.priceStems) || config?.defaultStemsPrice || 99.99;
            const unlimited = config?.defaultUnlimitedPrice || 199.99;
            const exclusive = Number(item.priceExclusive) || config?.defaultExclusivePrice || 999.99;

            return {
              id: item.id,
              title: item.title,
              producer: item.producer || 'Pyrex Spinna',
              bpm: Number(item.bpm) || 120,
              key: item.musicalKey || 'C Min',
              price: mp3,
              coverArtUrl: item.coverArtUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
              backupArtworkUrl: item.backupArtworkUrl,
              r2ArtworkUrl: item.r2ArtworkUrl,
              audioUrl: item.taggedMp3Url || item.audioUrl,
              backupAudioUrl: item.backupAudioUrl,
              r2AudioUrl: item.r2AudioUrl,
              watermarkedAudioUrl: item.watermarkedAudioUrl,
              storageClusterNode: item.storageClusterNode,
              visibility: 'Public',
              trackType: 'Beat',
              licenses: {
                mp3Lease: { enabled: true, price: mp3 },
                wavLease: { enabled: true, price: wav },
                premiumLease: { enabled: true, price: stems },
                unlimitedLease: { enabled: true, price: unlimited },
                exclusive: { enabled: true, price: exclusive },
              },
              isLocal: false,
              createdAt: item.createdAt || new Date().toISOString()
            };
          });

          setState(prev => {
            const combined = [...prev.beats, ...fetchedCloudBeats];
            return {
              ...prev,
              beats: dedupe(combined),
              isLoading: false
            };
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        console.warn("Failed to load cloud database beats from backend:", err);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchCloudBeats();
  }, []);

  // Load IndexedDB hardcoded beats on mount and listen to publish events
  useEffect(() => {
    const loadIndexedBeats = () => {
      loadStorefrontBeats().then(indexedBeats => {
        if (indexedBeats && indexedBeats.length > 0) {
          const fetchedIndexedBeats: Beat[] = indexedBeats.map((item: any) => {
            const config = state.profile.marketingConfig;
            const mp3 = config?.defaultMp3Price || 29.99;
            const wav = config?.defaultWavPrice || 49.99;
            const stems = config?.defaultStemsPrice || 99.99;
            const unlimited = config?.defaultUnlimitedPrice || 199.99;
            const exclusive = config?.defaultExclusivePrice || 499.99;

            return {
              id: item.id.startsWith('indexeddb-') ? item.id : `indexeddb-${item.id}`,
              title: item.title,
              producer: item.producer || 'Pyrex Spinna',
              bpm: Number(item.bpm) || 120,
              key: item.keySignature || item.key || 'C Min',
              price: mp3,
              coverArtUrl: item.coverArtUrl || item.artworkUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
              audioUrl: item.audioUrl,
              visibility: 'Public',
              trackType: 'Beat',
              fileName: item.fileName,
              fileSize: item.fileSize,
              fileLastModified: item.fileLastModified,
              fileSignature: item.fileSignature,
              fileFingerprint: item.fileFingerprint || item.fileSignature,
              licenses: item.licenses || {
                mp3Lease: { enabled: true, price: mp3 },
                wavLease: { enabled: true, price: wav },
                premiumLease: { enabled: true, price: stems },
                unlimitedLease: { enabled: true, price: unlimited },
                exclusive: { enabled: true, price: exclusive },
              },
              isLocal: true,
              createdAt: item.publishedAt || item.uploadedAt || new Date().toISOString()
            };
          });

          setState(prev => {
            const combined = [...prev.beats, ...fetchedIndexedBeats];
            return {
              ...prev,
              beats: dedupe(combined),
              isLoading: false
            };
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }).catch(err => {
        console.warn("Failed to load storefront beats in StoreContext:", err);
        setState(prev => ({ ...prev, isLoading: false }));
      });
    };

    loadIndexedBeats();

    const handleTrackPublished = () => {
      loadIndexedBeats();
    };

    document.addEventListener('KRYPSIDE_TRACK_PUBLISHED', handleTrackPublished);
    document.addEventListener('PYREX_TRACK_PUBLISHED', handleTrackPublished);
    return () => {
      document.removeEventListener('KRYPSIDE_TRACK_PUBLISHED', handleTrackPublished);
      document.removeEventListener('PYREX_TRACK_PUBLISHED', handleTrackPublished);
    };
  }, []);

  // Sync Beats from Firestore
  useEffect(() => {
    // Public beats listener
    const publicQ = query(
      collection(db, 'beats'),
      where('visibility', '==', 'Public'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribePublic = onSnapshot(publicQ, (snapshot) => {
      const publicBeats: Beat[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const b = { id: doc.id, ...data } as Beat;
        if (!isAIPlaceholderBeat(b)) {
          publicBeats.push(b);
        }
      });
      
      setState(prev => {
        const combined = [...prev.beats, ...publicBeats];
        const uniqueBeats = dedupe(combined);
        
        // Final sanity filter
        const seen = new Set<string>();
        const filtered = uniqueBeats.filter(b => {
          const key = `${(b.title || '').toLowerCase().trim()}_${(b.producer || '').toLowerCase().trim()}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        return {
          ...prev,
          beats: filtered
        };
      });
    }, (error: any) => {
      // Ignore standard gRPC idle disconnects and transient availability issues
      const isIdleDisconnect = error?.code === 'cancelled' || 
                               error?.code === 'unavailable' || 
                               (error?.message && (error.message.includes('CANCELLED') || error.message.includes('idle stream')));
      
      if (isIdleDisconnect) {
        return;
      }
      console.warn("Firestore public beats listener notice:", error);
    });

    // User-specific beats listener (for private/unlisted)
    let unsubscribeUser = () => {};
    if (user) {
      const userQ = query(
        collection(db, 'beats'),
        where('userId', '==', user.uid),
        where('visibility', 'in', ['Private', 'Unlisted'])
      );

      unsubscribeUser = onSnapshot(userQ, (snapshot) => {
        const privateBeats: Beat[] = [];
        snapshot.forEach((doc) => {
          privateBeats.push({ id: doc.id, ...doc.data() } as Beat);
        });

        setState(prev => ({
          ...prev,
          archivedBeats: privateBeats
        }));
      }, (error: any) => {
        // Ignore standard gRPC idle disconnects and transient availability issues
        const isIdleDisconnect = error?.code === 'cancelled' || 
                                 error?.code === 'unavailable' || 
                                 (error?.message && (error.message.includes('CANCELLED') || error.message.includes('idle stream')));
        
        if (isIdleDisconnect) {
          return;
        }
        console.warn("Firestore private beats listener notice:", error);
      });
    }

    return () => {
      unsubscribePublic();
      unsubscribeUser();
    };
  }, [user]);

  // Sync Profile from Firestore
  useEffect(() => {
    if (!user) return;

    const profileRef = doc(db, 'profiles', user.uid);
    const unsubscribe = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        setState(prev => ({
          ...prev,
          profile: { ...prev.profile, ...docSnap.data() } as Profile
        }));
      }
    }, (error: any) => {
      // Ignore standard gRPC idle disconnects and transient availability issues
      const isIdleDisconnect = error?.code === 'cancelled' || 
                               error?.code === 'unavailable' || 
                               (error?.message && (error.message.includes('CANCELLED') || error.message.includes('idle stream')));
      
      if (isIdleDisconnect) {
        return;
      }
      console.warn("Firestore profile listener notice:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const updateProfile = async (profileUpdate: Partial<Profile>) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdate }
    }));
    if (!user) return;
    const profileRef = doc(db, 'profiles', user.uid);
    try {
      await updateDoc(profileRef, { 
        ...profileUpdate, 
        updatedAt: serverTimestamp() 
      } as any);
    } catch (error) {
      setError({ message: "Failed to sync profile changes. Your edits are saved locally.", type: 'warning' });
      handleFirestoreError(error, OperationType.WRITE, `profiles/${user.uid}`);
    }
  };

  const addVideo = (video: YouTubeVideo) => {
    setState((prev) => ({
      ...prev,
      videos: [...prev.videos, video],
    }));
  };

  const removeVideo = (id: string) => {
    setState((prev) => ({
      ...prev,
      videos: prev.videos.filter((v) => v.id !== id),
    }));
  };

  const sanitizeForFirestore = (obj: any): any => {
    if (obj === null || obj === undefined) return null;
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
    
    const clean: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== undefined) {
        clean[key] = sanitizeForFirestore(val);
      }
    }
    return clean;
  };

  const addBeat = async (newBeat: Beat) => {
    try {
      setState(prev => {
        const fingerprint = getTrackFingerprint(newBeat);
        const beatToAdd = {
          ...newBeat,
          id: newBeat.id || `track-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
        };

        let existingFound = false;
        const updatedBeats = prev.beats.map(existing => {
          if (getTrackFingerprint(existing) === fingerprint || existing.id === beatToAdd.id) {
            existingFound = true;
            return {
              ...existing,
              ...beatToAdd,
              id: existing.id || beatToAdd.id,
              updatedAt: new Date().toISOString()
            };
          }
          return existing;
        });

        const listToClean = existingFound ? updatedBeats : [...prev.beats, beatToAdd];
        const deduplicated = deduplicateTracks(listToClean);
        try {
          localStorage.setItem('pyrex_beats', JSON.stringify(deduplicated));
        } catch (e) {
          console.warn("Local storage write error:", e);
        }
        return { ...prev, beats: deduplicated };
      });
    } catch (e) {
      setError({ message: "Failed to save track to local storage. Quota might be full.", type: 'error' });
      console.error("Local save error:", e);
    }
  };

  const removeBeat = async (id: string) => {
    if (id.startsWith('indexeddb-')) {
      const rawId = id.replace('indexeddb-', '');
      try {
        await deleteTrackFromDB(rawId);
      } catch (err) {
        console.warn("Failed to delete track from IndexedDB:", err);
      }
    }

    setState(prev => {
      const updatedBeats = prev.beats.filter(b => b.id !== id);
      try {
        localStorage.setItem('pyrex_beats', JSON.stringify(updatedBeats));
      } catch (e) {
        console.warn("Failed to update localStorage on removeBeat:", e);
      }
      return {
        ...prev,
        beats: updatedBeats,
        archivedBeats: prev.archivedBeats.filter(b => b.id !== id)
      };
    });

    if (user && !id.startsWith('local_') && !id.startsWith('default_') && !id.startsWith('indexeddb-')) {
      const beatRef = doc(db, 'beats', id);
      try {
        await deleteDoc(beatRef);
      } catch (error) {
        try {
          await updateDoc(beatRef, { 
            visibility: 'Private',
            updatedAt: serverTimestamp()
          });
        } catch (e) {
          handleFirestoreError(error, OperationType.UPDATE, `beats/${id}`);
        }
      }
    }
  };

  const restoreBeat = async (id: string) => {
    if (!user || id.startsWith('local_')) return;
    const beatRef = doc(db, 'beats', id);
    try {
      await updateDoc(beatRef, { 
        visibility: 'Public',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `beats/${id}`);
    }
  };

  const updateBeat = async (id: string, updates: Partial<Beat>) => {
    if (id.startsWith('indexeddb-')) {
      const rawId = id.replace('indexeddb-', '');
      try {
        await updateTrackInDB(rawId, updates);
      } catch (err) {
        console.warn("Failed to update track in IndexedDB:", err);
      }
    }
    if (!user || id.startsWith('local_') || id.startsWith('indexeddb-')) {
      setState(prev => ({
        ...prev,
        beats: prev.beats.map(b => b.id === id ? { ...b, ...updates } : b),
        archivedBeats: prev.archivedBeats.map(b => b.id === id ? { ...b, ...updates } : b)
      }));
      return;
    }
    const beatRef = doc(db, 'beats', id);
    try {
      await updateDoc(beatRef, { 
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `beats/${id}`);
    }
  };

  const addBeatPack = async (newPack: BeatPackData) => {
    try {
      const packId = newPack.id || `pack-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      
      const config = state.profile.marketingConfig;
      const mp3Default = config?.defaultMp3Price || 29.99;
      const wavDefault = config?.defaultWavPrice || 49.99;
      const stemsDefault = config?.defaultStemsPrice || 99.99;
      const unlimitedDefault = config?.defaultUnlimitedPrice || 199.99;
      const exclusiveDefault = config?.defaultExclusivePrice || 499.99;

      // Ensure all child tracks in the beat pack are complete Beat objects
      const packBeats: Beat[] = (newPack.beats || []).map((b, idx) => ({
        ...b,
        id: b.id || `${packId}-beat-${idx + 1}`,
        producer: b.producer || newPack.producer || 'PyrexSpinna',
        packId: packId,
        packTitle: newPack.title,
        isPackTrack: true,
        coverArtUrl: b.coverArtUrl || newPack.coverArt || newPack.artworkUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
        directArchiveFileLink: b.directArchiveFileLink || newPack.directArchiveFileLink || newPack.archiveZipUrl,
        archiveUrl: b.archiveUrl || newPack.archiveZipUrl,
        visibility: b.visibility || 'Public',
        trackType: b.trackType || 'Beat',
        licenses: b.licenses || {
          mp3Lease: { enabled: true, price: b.price || mp3Default },
          wavLease: { enabled: true, price: (b.price || mp3Default) + 20 },
          premiumLease: { enabled: true, price: (b.price || mp3Default) + 50 },
          unlimitedLease: { enabled: true, price: (b.price || mp3Default) + 150 },
          exclusive: { enabled: true, price: exclusiveDefault }
        }
      }));

      const fullPack: BeatPackData = {
        ...newPack,
        id: packId,
        beats: packBeats,
        beatCount: packBeats.length,
        audioUrls: newPack.audioUrls || packBeats.map(b => b.audioUrl),
        audioArray: newPack.audioArray || packBeats.map(b => b.audioUrl),
        previewSequence: newPack.previewSequence || packBeats.map(b => b.id),
        artworkUrl: newPack.artworkUrl || newPack.coverArt,
        coverArt: newPack.coverArt || newPack.artworkUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
        isLocal: true,
        createdAt: newPack.createdAt || new Date().toISOString()
      };

      setState(prev => {
        const existingPacks = prev.beatPacks || [];
        const filteredPacks = existingPacks.filter(p => p.id !== packId);
        const updatedPacks = [fullPack, ...filteredPacks];
        
        // Also register child beats into the main catalog
        const combinedBeats = deduplicateTracks([...prev.beats, ...packBeats]);
        
        localStorage.setItem(BEAT_PACKS_STORAGE_KEY, JSON.stringify(updatedPacks));
        localStorage.setItem('pyrex_beats', JSON.stringify(combinedBeats));

        return {
          ...prev,
          beatPacks: updatedPacks,
          beats: combinedBeats
        };
      });
    } catch (e) {
      setError({ message: "Failed to save beat pack to local storage.", type: 'error' });
      console.error("Local pack save error:", e);
    }
  };

  const removeBeatPack = async (id: string) => {
    setState(prev => {
      const updatedPacks = (prev.beatPacks || []).filter(p => p.id !== id);
      localStorage.setItem(BEAT_PACKS_STORAGE_KEY, JSON.stringify(updatedPacks));
      return {
        ...prev,
        beatPacks: updatedPacks
      };
    });
  };

  const updateBeatPack = async (id: string, updates: Partial<BeatPackData>) => {
    setState(prev => {
      const updatedPacks = (prev.beatPacks || []).map(p => p.id === id ? { ...p, ...updates } : p);
      localStorage.setItem(BEAT_PACKS_STORAGE_KEY, JSON.stringify(updatedPacks));
      return {
        ...prev,
        beatPacks: updatedPacks
      };
    });
  };

  const updateStore = (newState: StoreState) => {
    setState(newState);
  };

  const addSubscriber = (email: string) => {
    setState(prev => {
      const currentSubscribers = prev.subscribers || [];
      if (currentSubscribers.some(s => s.email === email)) return prev;
      
      const newSubscribers = [...currentSubscribers, { email, subscribedAt: new Date().toISOString() }];
      return { ...prev, subscribers: newSubscribers };
    });
  };

  return (
    <StoreContext.Provider
      value={{
        state,
        updateProfile,
        addVideo,
        removeVideo,
        addBeat,
        removeBeat,
        restoreBeat,
        updateBeat,
        addBeatPack,
        removeBeatPack,
        updateBeatPack,
        updateStore,
        addSubscriber,
        incrementAnalytics,
        resetAnalytics,
        isCryptoModalOpen,
        setIsCryptoModalOpen,
        error,
        clearError,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
