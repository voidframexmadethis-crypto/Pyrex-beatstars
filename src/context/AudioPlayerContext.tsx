import React, { createContext, useState, useRef, ReactNode, useContext, useEffect, useCallback } from 'react';
import { Beat } from '../types';
import { useStore } from './StoreContext';
import { db, auth } from '../lib/firebase';
import { doc, increment, updateDoc, getDoc } from 'firebase/firestore';
import { processTrackStreamMetric } from '../lib/milestoneTracker';
import { hardcodeBeatToBrowser, getHardcodedBeats } from '../lib/localTrackMassStorage';
import { formatArchiveUrl } from '../utils/formatArchiveUrl';

interface AudioPlayerContextType {
  currentTrack: Beat | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  error: string | null;
  playlist: Beat[];
  queue: Beat[];
  playTrack: (track: Beat) => void;
  handlePlayAudio: (beat: Beat) => void;
  loadLocalFile: (file: File) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  isInfiniteRadio: boolean;
  setIsInfiniteRadio: (active: boolean) => void;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  isTaggedMode: boolean;
  setIsTaggedMode: (active: boolean) => void;
  clearTrack: () => void;
  retryPlayback: () => void;
  setPlaylist: (tracks: Beat[]) => void;
  addToQueue: (track: Beat) => void;
  setCurrentTrack: (track: Beat | null) => void;
  setIsPlaying: (playing: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  offlineReadyTracks: Set<string>;
  checkOfflineStatus: (track: Beat) => Promise<boolean>;
}

export const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const sanitizePlaylist = (tracks: Beat[]): Beat[] => {
  const seen = new Set();
  return tracks.filter(track => {
    if (!track || !track.title) return false;
    const key = (track.id || track.title).toString().toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const resolveStreamUrl = (track: Beat | null, isTaggedMode: boolean = true): string => {
  if (!track) return '';
  
  let streamUrl = '';
  
  if (isTaggedMode) {
    streamUrl = track.watermarkedAudioUrl || track.audioUrl || track.r2AudioUrl || track.backupAudioUrl || '';
  } else {
    streamUrl = track.untaggedM4aUrl || track.audioUrl || track.r2AudioUrl || track.backupAudioUrl || track.watermarkedAudioUrl || '';
  }

  if (streamUrl && streamUrl.includes('archive.org')) {
    streamUrl = formatArchiveUrl(streamUrl);
  }
  return streamUrl;
};

// Helper to persist full track metadata to localStorage
const persistActiveTrackMetadata = (track: Beat | null) => {
  if (!track) {
    try {
      localStorage.removeItem('pyrex_current_track');
      localStorage.removeItem('pyrex_current_track_id');
      localStorage.removeItem('pyrex_active_track_id');
      localStorage.removeItem('pyrex_active_track_title');
      localStorage.removeItem('pyrex_active_track_producer');
      localStorage.removeItem('pyrex_active_track_artwork');
      localStorage.removeItem('pyrex_playback_position');
      localStorage.removeItem('pyrex_is_playing');
    } catch (e) {}
    return;
  }

  try {
    localStorage.setItem('pyrex_current_track', JSON.stringify(track));
    if (track.id) {
      localStorage.setItem('pyrex_current_track_id', track.id);
      localStorage.setItem('pyrex_active_track_id', track.id);
    }
    if (track.title) {
      localStorage.setItem('pyrex_active_track_title', track.title);
    }
    localStorage.setItem('pyrex_active_track_producer', track.producer || 'Pyrex Spinna');
    if (track.coverArtUrl) {
      localStorage.setItem('pyrex_active_track_artwork', track.coverArtUrl);
    }
  } catch (e) {
    console.warn("Storage write error for active track metadata:", e);
  }
};

// Helper to initialize active track from localStorage
const loadInitialActiveTrack = (): Beat | null => {
  try {
    const saved = localStorage.getItem('pyrex_current_track');
    let parsed: Partial<Beat> = {};
    if (saved) {
      try {
        parsed = JSON.parse(saved);
        if (parsed.audioUrl && parsed.audioUrl.startsWith('blob:')) {
          parsed.audioUrl = '';
        }
      } catch (e) {}
    }

    const id = parsed.id || localStorage.getItem('pyrex_active_track_id') || localStorage.getItem('pyrex_current_track_id') || '';
    const title = parsed.title || localStorage.getItem('pyrex_active_track_title') || '';
    const producer = parsed.producer || localStorage.getItem('pyrex_active_track_producer') || 'Pyrex Spinna';
    const coverArtUrl = parsed.coverArtUrl || localStorage.getItem('pyrex_active_track_artwork') || '';

    if (id || title) {
      return {
        id: id || 'saved-track',
        title: title || 'Untitled Track',
        producer: producer,
        bpm: parsed.bpm || 120,
        key: parsed.key || 'N/A',
        camelotCode: parsed.camelotCode,
        price: parsed.price || 0,
        coverArtUrl: coverArtUrl,
        audioUrl: parsed.audioUrl || '',
        visibility: parsed.visibility || 'Public',
        trackType: parsed.trackType || 'Beat',
        licenses: parsed.licenses || {
          mp3Lease: { enabled: true, price: 0 },
          wavLease: { enabled: true, price: 0 },
          premiumLease: { enabled: true, price: 0 },
          unlimitedLease: { enabled: true, price: 0 },
          exclusive: { enabled: true, price: 0 }
        }
      };
    }
  } catch (e) {
    console.warn("Failed to load initial active track from localStorage:", e);
  }
  return null;
};

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const { state: storeState } = useStore();
  const config = storeState.profile.marketingConfig;

  // Sync pricing defaults for restored tracks if they are 0
  const hydrateTrackWithDefaults = useCallback((track: Beat | null): Beat | null => {
    if (!track) return null;
    const mp3 = track.price || config?.defaultMp3Price || 29.99;
    const wav = track.licenses?.wavLease?.price || config?.defaultWavPrice || 49.99;
    const premium = track.licenses?.premiumLease?.price || config?.defaultStemsPrice || 99.99;
    const unlimited = track.licenses?.unlimitedLease?.price || config?.defaultUnlimitedPrice || 199.99;
    const exclusive = track.licenses?.exclusive?.price || config?.defaultExclusivePrice || 499.99;

    return {
      ...track,
      price: mp3,
      licenses: {
        mp3Lease: { enabled: true, ...track.licenses?.mp3Lease, price: mp3 },
        wavLease: { enabled: true, ...track.licenses?.wavLease, price: wav },
        premiumLease: { enabled: true, ...track.licenses?.premiumLease, price: premium },
        unlimitedLease: { enabled: true, ...track.licenses?.unlimitedLease, price: unlimited },
        exclusive: { enabled: true, ...track.licenses?.exclusive, price: exclusive }
      }
    };
  }, [config]);

  const [playlist, setPlaylistInternal] = useState<Beat[]>([]);
  const [queue, setQueueInternal] = useState<Beat[]>([]);

  const setPlaylist = (tracks: Beat[]) => {
    setPlaylistInternal(sanitizePlaylist(tracks));
  };

  const addToQueue = (track: Beat) => {
    setQueueInternal(prev => sanitizePlaylist([...prev, track]));
  };

  // Persistent HTMLAudioElement instance ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const pendingRestorePositionRef = useRef<number | null>(null);
  const lastSaveTimeRef = useRef<number>(0);

  // Audio Context Instantiation & Resume Helper
  const getOrCreateAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        try {
          audioCtxRef.current = new AudioCtxClass({
            latencyHint: 'playback',
            sampleRate: 48000
          });
          (window as any).globalAudioCtx = audioCtxRef.current;
        } catch (e) {
          console.warn("Could not create AudioContext:", e);
        }
      }
    }
    return audioCtxRef.current;
  }, []);

  const ensureAudioContextResumed = useCallback(async (): Promise<AudioContext | null> => {
    const audioCtx = getOrCreateAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') {
      try {
        await audioCtx.resume();
        console.log("AudioContext state resumed on click user gesture.");
      } catch (err) {
        console.warn("Failed to resume AudioContext state:", err);
      }
    }
    return audioCtx;
  }, [getOrCreateAudioContext]);

  // Restore initial state from localStorage immediately
  const [currentTrack, setCurrentTrackState] = useState<Beat | null>(loadInitialActiveTrack);

  const [currentTime, setCurrentTime] = useState<number>(() => {
    try {
      const savedPos = localStorage.getItem('pyrex_playback_position');
      if (savedPos) {
        const parsed = parseFloat(savedPos);
        return isNaN(parsed) ? 0 : parsed;
      }
    } catch (e) {}
    return 0;
  });

  const [isPlaying, setIsPlayingState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pyrex_is_playing') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [volume, setVolumeState] = useState<number>(() => {
    try {
      const savedVol = localStorage.getItem('pyrex_volume');
      if (savedVol) {
        const parsed = parseFloat(savedVol);
        return isNaN(parsed) ? 0.85 : Math.max(0, Math.min(1, parsed));
      }
    } catch (e) {}
    return 0.85;
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pyrex_muted') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRateState] = useState<number>(1.0);
  const [isTaggedMode, setIsTaggedModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pyrex_tagged_mode') !== 'false';
    } catch (e) {
      return true;
    }
  });
  const [isInfiniteRadio, setIsInfiniteRadio] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offlineReadyTracks, setOfflineReadyTracks] = useState<Set<string>>(new Set());

  const setIsTaggedMode = (active: boolean) => {
    setIsTaggedModeState(active);
    try {
      localStorage.setItem('pyrex_tagged_mode', active ? 'true' : 'false');
    } catch (e) {}
  };

  // Wrapper for setCurrentTrack to automatically sync metadata to localStorage
  const setCurrentTrack = useCallback((track: Beat | null) => {
    setCurrentTrackState(track);
    persistActiveTrackMetadata(track);
  }, []);

  // Initialize playback position to 0 (always start from beginning)
  useEffect(() => {
    try {
      localStorage.setItem('pyrex_playback_position', '0');
    } catch (e) {}
  }, []);

  // Save beat into localStorage (glove box)
  const saveBeat = (file: File) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      if (e.target?.result) {
        try {
          localStorage.setItem('myPermanentBeat', e.target.result as string);
          localStorage.setItem('myPermanentBeat_title', file.name);
          console.log("Beat locked in the glove box.");
        } catch (err) {
          console.warn("Storage quota limit notice for local beat storage:", err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    // Register global window helpers
    (window as any).saveBeat = saveBeat;
    (window as any).hardcodeBeatToBrowser = hardcodeBeatToBrowser;
    (window as any).getHardcodedBeats = getHardcodedBeats;

    // Check IndexedDB for permanent hardcoded beats
    getHardcodedBeats().then(indexedBeats => {
      if (indexedBeats && indexedBeats.length > 0) {
        setCurrentTrackState(prev => {
          if (!prev || prev.id === 'myPermanentBeatTrack') {
            const latestBeat = indexedBeats[indexedBeats.length - 1];
            const restoredTrack: Beat = {
              id: latestBeat.id,
              title: latestBeat.title,
              producer: latestBeat.producer || 'Pyrex Spinna',
              bpm: 120,
              key: 'N/A',
              price: 0,
              coverArtUrl: latestBeat.artworkUrl || '',
              audioUrl: latestBeat.audioUrl,
              visibility: 'Private',
              trackType: 'Beat',
              licenses: {
                mp3Lease: { enabled: false, price: 0 },
                wavLease: { enabled: false, price: 0 },
                premiumLease: { enabled: false, price: 0 },
                unlimitedLease: { enabled: false, price: 0 },
                exclusive: { enabled: false, price: 0 },
              },
              isLocal: true
            };
            persistActiveTrackMetadata(restoredTrack);
            return restoredTrack;
          }
          if (!prev.audioUrl) {
            const matchingBeat = indexedBeats.find(b => b.id === prev.id || `indexeddb-${b.id}` === prev.id) || indexedBeats[indexedBeats.length - 1];
            const updated = {
              ...prev,
              audioUrl: matchingBeat.audioUrl,
              coverArtUrl: matchingBeat.artworkUrl || prev.coverArtUrl || ''
            };
            persistActiveTrackMetadata(updated);
            return updated;
          }
          return prev;
        });
      }
    }).catch(err => {
      console.warn("Failed to load IndexedDB hardcoded beats:", err);
    });

    // Check storage for saved permanent beat (glove box)
    const savedBeat = localStorage.getItem('myPermanentBeat');
    if (savedBeat) {
      const title = localStorage.getItem('myPermanentBeat_title') || 'Permanent Glovebox Beat';
      setCurrentTrackState(prev => {
        if (!prev) {
          const gloveBoxTrack: Beat = {
            id: 'myPermanentBeatTrack',
            title,
            producer: 'Glovebox Storage',
            bpm: 120,
            key: 'N/A',
            price: 0,
            coverArtUrl: '',
            audioUrl: savedBeat,
            visibility: 'Private',
            trackType: 'Beat',
            licenses: {
              mp3Lease: { enabled: false, price: 0 },
              wavLease: { enabled: false, price: 0 },
              premiumLease: { enabled: false, price: 0 },
              unlimitedLease: { enabled: false, price: 0 },
              exclusive: { enabled: false, price: 0 },
            },
            isLocal: true
          };
          persistActiveTrackMetadata(gloveBoxTrack);
          return gloveBoxTrack;
        }
        if (!prev.audioUrl && prev.id !== 'myPermanentBeatTrack') {
           const updated = {
             ...prev,
             audioUrl: savedBeat
           };
           persistActiveTrackMetadata(updated);
           return updated;
        }
        return prev;
      });
    }
  }, []);

  // Resilience: Offline Cache Status Checker
  const checkOfflineStatus = async (track: Beat): Promise<boolean> => {
    if (!track.audioUrl) return false;
    if (track.isLocal || track.audioUrl.startsWith('blob:')) return true;
    
    try {
      const cache = await caches.open('pyrex-spinna-audio-cache');
      const match = await cache.match(track.audioUrl);
      const isReady = !!match;
      if (isReady && track.id) {
        setOfflineReadyTracks(prev => {
          if (prev.has(track.id)) return prev;
          const next = new Set(prev);
          next.add(track.id);
          return next;
        });
      }
      return isReady;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (currentTrack) {
      checkOfflineStatus(currentTrack);
    }
  }, [currentTrack]);

  // Sync volume with audio element and localStorage
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    try {
      localStorage.setItem('pyrex_volume', volume.toString());
      localStorage.setItem('pyrex_muted', isMuted ? 'true' : 'false');
    } catch (e) {}
  }, [volume, isMuted]);

  // Sync playback rate with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Re-initializes blob source URL if track reference is null, detached, or broken
  const reinitializeTrackSource = useCallback(async (track: Beat | null): Promise<string | null> => {
    let activeTrack = track;
    if (!activeTrack) {
      activeTrack = loadInitialActiveTrack();
      if (activeTrack) {
        setCurrentTrackState(activeTrack);
        persistActiveTrackMetadata(activeTrack);
      }
    }

    if (!activeTrack) {
      try {
        const indexedBeats = await getHardcodedBeats();
        if (indexedBeats && indexedBeats.length > 0) {
          const latest = indexedBeats[indexedBeats.length - 1];
          activeTrack = {
            id: latest.id,
            title: latest.title,
            producer: latest.producer || 'Pyrex Spinna',
            bpm: 120,
            key: 'N/A',
            price: 0,
            coverArtUrl: latest.artworkUrl || '',
            audioUrl: latest.audioUrl,
            visibility: 'Private',
            trackType: 'Beat',
            licenses: {
              mp3Lease: { enabled: false, price: 0 },
              wavLease: { enabled: false, price: 0 },
              premiumLease: { enabled: false, price: 0 },
              unlimitedLease: { enabled: false, price: 0 },
              exclusive: { enabled: false, price: 0 },
            },
            isLocal: true
          };
          setCurrentTrackState(activeTrack);
          persistActiveTrackMetadata(activeTrack);
        }
      } catch (e) {
        console.warn("Failed to retrieve hardcoded beats during recovery:", e);
      }
    }

    if (!activeTrack) return null;

    let streamUrl = resolveStreamUrl(activeTrack, isTaggedMode);

    if (!streamUrl || (streamUrl.startsWith('blob:') && (!audioRef.current?.src || audioRef.current.src === '' || audioRef.current.error))) {
      try {
        const savedBeat = localStorage.getItem('myPermanentBeat');
        if (savedBeat && (activeTrack.id === 'myPermanentBeatTrack' || !activeTrack.audioUrl)) {
          streamUrl = savedBeat;
          activeTrack = { ...activeTrack, audioUrl: savedBeat };
          setCurrentTrackState(activeTrack);
          persistActiveTrackMetadata(activeTrack);
        } else {
          const indexedBeats = await getHardcodedBeats();
          const match = indexedBeats.find(b => b.id === activeTrack?.id || `indexeddb-${b.id}` === activeTrack?.id) || indexedBeats[indexedBeats.length - 1];
          if (match && match.audioUrl) {
            streamUrl = match.audioUrl;
            activeTrack = { ...activeTrack, audioUrl: match.audioUrl, coverArtUrl: match.artworkUrl || activeTrack.coverArtUrl };
            setCurrentTrackState(activeTrack);
            persistActiveTrackMetadata(activeTrack);
          }
        }
      } catch (e) {
        console.warn("Failed re-initializing blob source URL:", e);
      }
    }

    return streamUrl || resolveStreamUrl(activeTrack, isTaggedMode);
  }, [isTaggedMode]);

  // Safe Audio Play Handler with AudioContext check & error recovery Promise catch block
  const executePlayWithCatch = useCallback(async (targetTrack?: Beat | null) => {
    const audio = audioRef.current;
    if (!audio) return;

    // 1. Explicitly check and resume the browser's AudioContext state
    await ensureAudioContextResumed();

    const trackToPlay = targetTrack !== undefined ? targetTrack : currentTrack;

    let streamUrl = resolveStreamUrl(trackToPlay || currentTrack, isTaggedMode);
    if (!streamUrl || !audio.src || audio.src === '' || audio.src.endsWith('/null') || audio.src.endsWith('/undefined')) {
      const newUrl = await reinitializeTrackSource(trackToPlay || currentTrack);
      if (newUrl) {
        streamUrl = newUrl;
        audio.src = newUrl;
        audio.load();
      }
    }

    if (!audio.src && streamUrl) {
      audio.src = streamUrl;
      audio.load();
    }

    // 2. Wrap audioElement.play() execution in a proper Promise catch block
    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlayingState(true);
        setError(null);
        try {
          localStorage.setItem('pyrex_is_playing', 'true');
        } catch (e) {}
      }
    } catch (err: any) {
      console.warn("Playback prevented or interrupted (NotAllowedError / media interruption):", err);

      if (
        err.name === 'NotAllowedError' || 
        err.name === 'AbortError' || 
        err.name === 'NotSupportedError' || 
        err.message?.includes('interrupted') ||
        err.message?.includes('supported') ||
        !audio.src ||
        audio.src.startsWith('blob:')
      ) {
        try {
          console.log("Automatically re-initializing blob source URL and retrying playback...");
          const restoredSource = await reinitializeTrackSource(trackToPlay || currentTrack);
          if (restoredSource) {
            audio.src = restoredSource;
            audio.load();
            const retryPromise = audio.play();
            if (retryPromise !== undefined) {
              await retryPromise;
              setIsPlayingState(true);
              setError(null);
              try {
                localStorage.setItem('pyrex_is_playing', 'true');
              } catch (e) {}
              return;
            }
          }
        } catch (recoveryErr) {
          console.error("Playback recovery failed after re-initializing blob source URL:", recoveryErr);
        }
      }

      setIsPlayingState(false);
      try {
        localStorage.setItem('pyrex_is_playing', 'false');
      } catch (e) {}
    }
  }, [ensureAudioContextResumed, reinitializeTrackSource, currentTrack]);

  // Track & Audio URL Synchronization
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrack || !currentTrack.audioUrl) {
      audio.pause();
      audio.removeAttribute('src');
      setCurrentTime(0);
      setDuration(0);
      setIsPlayingState(false);
      try {
        localStorage.setItem('pyrex_is_playing', 'false');
      } catch (e) {}
      return;
    }

    const streamUrl = resolveStreamUrl(currentTrack, isTaggedMode);
    if (!streamUrl) return;

    // Check if source changed
    const needsNewSource = !audio.src || !audio.src.includes(streamUrl);
    if (needsNewSource) {
      audio.src = streamUrl;
      audio.currentTime = 0;
      setCurrentTime(0);
      audio.load();
    }

    if (isPlaying) {
      executePlayWithCatch(currentTrack);
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying, executePlayWithCatch]);

  // isPlaying State Synchronization
  const setIsPlaying = useCallback((playing: boolean) => {
    setIsPlayingState(playing);
    try {
      localStorage.setItem('pyrex_is_playing', playing ? 'true' : 'false');
    } catch (e) {}
  }, []);

  // Audio Event Listeners for seamless state persistence
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const pos = audio.currentTime;
      setCurrentTime(pos);

      // Throttled save to localStorage
      const now = Date.now();
      if (now - lastSaveTimeRef.current > 500) {
        lastSaveTimeRef.current = now;
        try {
          localStorage.setItem('pyrex_playback_position', pos.toFixed(2));
        } catch (e) {}
      }
    };

    const onLoadedMetadata = () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
      // Always start audio from beginning (0:00) when played
      audio.currentTime = 0;
      setCurrentTime(0);
    };

    const onPlay = () => {
      setIsPlayingState(true);
      setError(null);
      try {
        localStorage.setItem('pyrex_is_playing', 'true');
      } catch (e) {}
    };

    const onPause = () => {
      setIsPlayingState(false);
      try {
        localStorage.setItem('pyrex_is_playing', 'false');
        localStorage.setItem('pyrex_playback_position', audio.currentTime.toFixed(2));
      } catch (e) {}
    };

    const onEnded = () => {
      try {
        localStorage.setItem('pyrex_is_playing', 'false');
        localStorage.setItem('pyrex_playback_position', '0');
      } catch (e) {}
      playNext();
    };

    const onError = (e: Event) => {
      console.warn("Audio element load error:", e);
      setIsPlayingState(false);
      try {
        localStorage.setItem('pyrex_is_playing', 'false');
      } catch (err) {}
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [playlist, currentTrack]);

  const retryPlayback = async () => {
    setError(null);
    await ensureAudioContextResumed();
    setIsPlaying(true);
    await executePlayWithCatch(currentTrack);
  };

  const checkUserHasExclusiveAccess = (beat: Beat): boolean => {
    if (!beat.isExclusive) return true;
    if (typeof window !== 'undefined') {
      const user = auth.currentUser;
      if (user?.email === 'pyrex@gmail.com' || user?.email === 'pyrexxspinna@gmail.com') return true;
      if (localStorage.getItem('pyrex_is_admin') === 'true' || localStorage.getItem('pyrex_is_producer') === 'true') return true;
      if (localStorage.getItem('pyrex_user_has_exclusive') === 'true') return true;
      try {
        const purchased = localStorage.getItem('pyrex_purchased_exclusive_beats');
        if (purchased) {
          const list = JSON.parse(purchased);
          if (Array.isArray(list) && list.includes(beat.id)) return true;
        }
      } catch (e) {}
    }
    return false;
  };

  const handlePlayAudio = (beat: Beat) => {
    const userHasExclusiveAccess = checkUserHasExclusiveAccess(beat);
    if (beat.isExclusive && !userHasExclusiveAccess) {
      alert("This is an exclusive mini-pack beat. License required to play.");
      return;
    }
    playTrack(beat);
  };

  const playTrack = async (track: Beat) => {
    setError(null);

    const userHasExclusiveAccess = checkUserHasExclusiveAccess(track);
    if (track.isExclusive && !userHasExclusiveAccess) {
      alert("This is an exclusive mini-pack beat. License required to play.");
      return;
    }

    // 1. Explicitly check and resume the browser's AudioContext state
    await ensureAudioContextResumed();

    const audio = audioRef.current;
    if (currentTrack?.id === track.id) {
      if (audio && (audio.ended || !isPlaying || audio.currentTime >= (audio.duration || 1) - 0.5)) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }
      togglePlay();
      return;
    }

    pendingRestorePositionRef.current = null;
    if (audio) {
      try {
        audio.currentTime = 0;
      } catch (e) {}
    }

    let streamUrl = resolveStreamUrl(track, isTaggedMode);
    if (!streamUrl || streamUrl.startsWith('blob:')) {
      const restored = await reinitializeTrackSource(track);
      if (restored) streamUrl = restored;
    }

    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);

    if (audio && streamUrl) {
      audio.src = streamUrl;
      audio.load();
    }
    await executePlayWithCatch(track);

    try {
      localStorage.setItem('pyrex_playback_position', '0');
      localStorage.setItem('pyrex_is_playing', 'true');
    } catch (e) {}

    // Milestone & analytics tracking
    (async () => {
      try {
        if (track.id && !track.id.startsWith('local_') && !track.id.startsWith('default_')) {
          fetch('/api/streams/increment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: track.id })
          }).catch(() => {});

          const user = auth.currentUser;
          const isProducerOwner = user?.email === 'pyrex@gmail.com';

          if (!isProducerOwner) {
            const beatRef = doc(db, 'beats', track.id);
            await updateDoc(beatRef, { plays: increment(1) });
            const snap = await getDoc(beatRef);
            if (snap.exists()) {
              const currentPlays = snap.data().plays || 0;
              await processTrackStreamMetric(track.id, currentPlays);
            }
          }
        }
      } catch (error) {
        console.warn("Milestone tracking error:", error);
      }
    })();
  };

  const loadLocalFile = (file: File) => {
    setError(null);

    try {
      if (!file.type.startsWith('audio/')) {
        setError("Invalid Audio File");
        return;
      }

      const objectURL = URL.createObjectURL(file);
      const localTrack: Beat = {
        id: `local-${Date.now()}`,
        title: file.name,
        producer: 'Local Upload',
        bpm: 120,
        key: 'N/A',
        price: 0,
        coverArtUrl: '',
        audioUrl: objectURL,
        visibility: 'Private',
        trackType: 'Beat',
        licenses: {
          mp3Lease: { enabled: false, price: 0 },
          wavLease: { enabled: false, price: 0 },
          premiumLease: { enabled: false, price: 0 },
          unlimitedLease: { enabled: false, price: 0 },
          exclusive: { enabled: false, price: 0 },
        },
        isLocal: true
      };
      
      setCurrentTrack(localTrack);
      setIsPlaying(true);
    } catch (err) {
      console.error("Local file load error:", err);
      setError("Read Error");
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (isPlaying) {
      setIsPlaying(false);
      if (audio) audio.pause();
    } else {
      setError(null);
      // 1. Explicitly check and resume the browser's AudioContext state
      await ensureAudioContextResumed();

      if (currentTrack) {
        if (audio && (audio.ended || audio.currentTime >= (audio.duration || 1) - 0.5)) {
          audio.currentTime = 0;
          setCurrentTime(0);
        }
        setIsPlaying(true);
        await executePlayWithCatch(currentTrack);
      } else {
        // Automatically re-initialize track if reference is null or detached
        const restoredSource = await reinitializeTrackSource(null);
        if (restoredSource) {
          setIsPlaying(true);
          await executePlayWithCatch(currentTrack);
        }
      }
    }
  };

  const seek = (time: number) => {
    const safeTime = Math.max(0, isNaN(time) ? 0 : time);
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = safeTime;
      } catch (e) {
        console.warn("Seek error:", e);
      }
    }
    setCurrentTime(safeTime);
    try {
      localStorage.setItem('pyrex_playback_position', safeTime.toFixed(2));
    } catch (e) {}
  };

  const setVolume = (vol: number) => {
    const safeVol = Math.max(0, Math.min(1, isNaN(vol) ? 0.85 : vol));
    setVolumeState(safeVol);
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
  };

  const clearTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    try {
      localStorage.removeItem('pyrex_current_track');
      localStorage.removeItem('pyrex_current_track_id');
      localStorage.removeItem('pyrex_active_track_id');
      localStorage.removeItem('pyrex_active_track_title');
      localStorage.removeItem('pyrex_active_track_producer');
      localStorage.removeItem('pyrex_active_track_artwork');
      localStorage.removeItem('pyrex_playback_position');
      localStorage.removeItem('pyrex_is_playing');
    } catch (e) {}
  };

  const playNext = () => {
    if (playlist.length === 0) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playTrack(playlist[nextIndex]);
  };

  const playPrevious = () => {
    if (playlist.length === 0) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrack(playlist[prevIndex]);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return (
    <AudioPlayerContext.Provider value={{ 
      currentTrack, 
      isPlaying, 
      currentTime, 
      duration, 
      volume,
      error,
      playlist,
      queue,
      playTrack, 
      handlePlayAudio,
      loadLocalFile,
      pauseTrack, 
      togglePlay,
      seek,
      setVolume,
      isInfiniteRadio,
      setIsInfiniteRadio,
      playbackRate,
      setPlaybackRate,
      isTaggedMode,
      setIsTaggedMode,
      clearTrack,
      retryPlayback,
      setPlaylist,
      addToQueue,
      setCurrentTrack,
      setIsPlaying,
      playNext,
      playPrevious,
      isMuted,
      toggleMute,
      offlineReadyTracks,
      checkOfflineStatus
    }}>
      {/* Root Persistent HTML Audio Element - Persists across all pages & routes */}
      <audio
        id="beatAudioPlayer"
        ref={audioRef}
        preload="auto"
        crossOrigin="anonymous"
        style={{ display: 'none' }}
      />
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
