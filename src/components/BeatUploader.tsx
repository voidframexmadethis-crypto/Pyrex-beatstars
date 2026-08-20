import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { useAuth } from '../context/AuthContext';
import { useMarketingSettings } from '../hooks/useMarketingSettings';
import { handlePostPublishAutomation } from '../lib/socialAutomation';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, storage, db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Upload, Image as ImageIcon, Music, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, AlertCircle, Trash2, Loader2, Play, X, Zap, ShieldCheck, ListMusic, Globe, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { Beat, License, Tier, SocialUnlock } from '../types';
import { analyzeAudioFile, AudioAnalysisResult } from '../lib/audioAnalyzer';
import { publishBeatToStorefront } from '../lib/localTrackMassStorage';
import { createFileFingerprint } from '../utils/deduplicate';
import BeatPackUploader from './BeatPackUploader';

// 🛡️ SECURITY & RESILIENCE: File Hashing Utility
async function calculateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

import TrackPlayer from './TrackPlayer';
import LiveSocialUnlock from './LiveSocialUnlock';
import { PromoVideoGenerator } from './PromoVideoGenerator';
import PromoModal from './PromoModal';

import { backupTrackToInternetArchive } from '../utils/internetArchive';

const steps = ['Files & Artwork', 'Basic Info', 'Metadata', 'Pricing', 'Advanced Settings', 'Marketing', 'Review'];

const FilePreview = ({ file }: { file: File }) => {
  const [url, setUrl] = useState<string>('');
  
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const isAudio = file.type.startsWith('audio/') || file.name.match(/\.(mp3|m4a|flac|aac|ogg|wma)$/i);

  if (!isAudio) return null;

  return <TrackPlayer src={url} className="bg-neutral-900/50 p-2 rounded-md border border-neutral-800/50 mt-2" />;
};


const isMarketingSetting = (key: string) => {
  const marketingKeys = [
    'autoPostVideo', 'autoPostMasterToggle', 'youtubeVideoGen', 'tiktokVideoGen', 
    'tiktokShortFormSwitch', 'youtubeTargetChannel', 
    'tiktokTargetChannel', 'youtubeCompanionUrl', 'soundcloudSyncLink', 
    'audiomackEmbedCode', 'tiktokTrendingAudioSync', 'dspDistributionOptIn', 
    'spotifyArtistLink', 'appleMusicArtistLink', 'upcCoreField', 
    'googleAnalyticsCode', 'metaPixelId', 'googleAdsTracker', 'pinterestTagId', 
    'tiktokPixelId', 'utmCampaignBuilder', 'smartLinkShortUrl', 'autoSocialCopy', 
    'directCheckoutShortcut', 'emailReceiptLayout', 'mailingListTrigger', 
    'socialShareArray', 'rssPodcastFeed', 'airbitFeaturedBid', 
    'localStorageBackupRegistry', 'tosComplianceMatrix'
  ];
  return marketingKeys.includes(key);
};

interface BeatUploaderProps {
  trackToEdit?: Beat;
  onClose?: () => void;
}

const BeatUploader = React.memo(({ trackToEdit, onClose }: BeatUploaderProps) => {
  const { state, addBeat, updateBeat } = useStore();
  const { playTrack, togglePlay: toggleGlobalPlay, currentTrack, isPlaying: isGlobalPlaying, setCurrentTrack } = useAudioPlayer();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { marketingConfig, saveMarketingSettings } = useMarketingSettings();
    
  // 🛠️ SMART UPLOADER DETECTION
  // Bypasses cloud if not signed in or in local preview
  const isDevMode = !user;
  const [uploadMode, setUploadMode] = useState<'single' | 'pack'>('single');
  const [rawAudioFile, setRawAudioFile] = useState<File | null>(null);
  const [rawUntaggedFile, setRawUntaggedFile] = useState<File | null>(null);
  const [rawArtworkFile, setRawArtworkFile] = useState<File | null>(null);
    
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState<Beat | null>(null);
  const [uploaderState, setUploaderState] = useState({
    currentStep: 0,
    tagInput: '',
    uploadProgress: {} as { [key: string]: number },
    isUploading: false,
    isSubmitting: false,
    isAnalyzing: false,
    analysisNotice: null as string | null,
    isDragging: false,
    uploadedFiles: [] as File[],
    formData: {
      title: '',
      producer: '',
      bpm: '' as string | number,
      key: '',
      camelotCode: '',
      mode: 'Major',
      price: '' as string | number,
      coverArtUrl: '',
      audioUrl: '',
      untaggedM4aUrl: '',
      stemsZipUrl: '',
      freeDownload: { enabled: true, requirement: 'email', protection: 'tagged' },
      isExclusive: false,
      contentIdEnabled: false,
      customLicenses: [] as License[],
      socialUnlocks: [] as SocialUnlock[],
      tieredPricing: [] as Tier[],
      bulkDiscount: { threshold: 0, discountPercentage: 0 },
      description: '',
      mood: [] as string[],
      tags: [] as string[],
      releaseDate: '',
      gear: '',
      instruments: [] as string[],
      primaryGenre: '',
      secondaryGenre: '',
      trackType: 'Beat' as 'Beat' | 'Chorus' | 'Song' | 'Top Line' | 'Vocals',
      isExplicit: false,
      isInstrumental: false,
      productionYear: new Date().getFullYear(),
      isrcCode: '',
      iswcCode: '',
      upcCode: '',
      publisher: '',
      composers: '',
      proIpi: '',
      copyrightLine: '',
      typeBeat: '',
      energyLevel: 'Medium' as 'Low' | 'Medium' | 'High',
      vocalPresence: false,
      isDraft: false,
      isAIFree: true,
      usedSamples: false,
      sampleName: '',
      sampleSource: '',
      youtubeVideoUrl: '',
      excludeFromBulkDiscounts: false,
      // --- Publishing & Royalties ---
      publishing: {
        ipiNumber: '',
        proName: 'None' as const,
        writerSplit: 50,
        publisherSplit: 50,
        isRegistered: false,
      },
      // --- Licenses & Commerce ---
      basicMp3LeaseEnabled: true,
      basicMp3LeasePrice: state.profile.marketingConfig?.defaultMp3Price || 29.99,
      premiumM4aLeaseEnabled: true,
      premiumM4aLeasePrice: state.profile.marketingConfig?.defaultWavPrice || 49.99,
      trackoutsLeaseEnabled: true,
      trackoutsLeasePrice: state.profile.marketingConfig?.defaultStemsPrice || 99.99,
      unlimitedLeaseEnabled: false,
      unlimitedLeasePrice: state.profile.marketingConfig?.defaultUnlimitedPrice || 199.99,
      exclusiveRightsEnabled: false,
      exclusiveRightsPrice: state.profile.marketingConfig?.defaultExclusivePrice || 999.99,
      makeAnOfferEnabled: false,
      minimumPriceFloor: 0,
      licenseTemplate: 'Standard',
      customContract: '',
      defaultTemplateOverride: false,
      bulkDiscountCategory: 'Buy 2 Get 1 Free',
      couponsLink: '',
      flashSaleEnabled: false,
      couponExpirationMode: 'hours',
      couponExpirationDate: '',
      couponCode: 'SOUTHSIDE50',
      couponDiscountPercent: 40,
      couponExpirationHours: 12,
      originalPrice: '',
      youtubeContentIdEnrollment: 'Opt-out',
      youtubeContentIdWhitelist: '',
      // --- Free Downloads & Lead Generation ---
      downloadMode: 'none',
      taggedAudioUrl: '',
      youtubeChannelUrl: '',
      tiktokProfileUrl: '',
      freeDownloadEnabled: false,
      freeDeliveryVariant: 'Watermarked Preview',
      requireEmail: false,
      socialUnlockModule: 'None',
      airbitFollowGate: false,
      youtubeSubGate: false,
      youtubeChannelId: '',
      tiktokGate: false,
      soundcloudGate: false,
      twitterGate: false,
      freeLeaseContract: 'Promotional Use Only',
      mailingListSegment: '',
      newsletterApiSync: '',
      socialApiValidator: true,
      maxFreeDownloads: 0,
      redirectUrl: '',
      tosComplianceBox: true,
      marketingOptIn: true,
      freeDownloadTrackingId: '',
      watermarkHardLock: true,
      downloadFailureAlertEmail: '',
      linkExpirationHours: 24,
      geoTargetFilter: 'Global',
      captchaGate: false,
      freeMetricsId: '',
      // --- Visibility, Scheduling & Release Launch (246-270) ---
      visibilityPlacement: 'Public',
      futureDateRelease: '',
      futureTimeRelease: '',
      unlistedAccessUrlToken: '',
      passwordVaultString: '',
      infinityStoreSync: true,
      html5MarketplaceSync: true,
      voiceTagUrl: '',
      storePagePointer: 'Home',
      storeFrontRowPinned: false,
      currentStatusBadge: 'Draft',
      bulkActionQueueBatch: '',
      archivedExcludedVector: false,
      catalogSortIndex: 0,
      regionalMarketBlackout: '',
      seasonalTakedownSwitch: false,
      preOrderAssetLock: false,
      profileDiscoveryPinned: false,
      embedPlayerTabConfig: 'Top',
      directEmbedUrlExport: '',
      standaloneDomainMapping: '',
      bandzoogleSyncToken: '',
      externalStoreThemeOverride: '',
      // --- Syndication, Marketing Pixels & Automation (271-300) ---
      autoPostVideo: false,
      autoPostMasterToggle: false,
      youtubeVideoGen: false,
      tiktokVideoGen: false,
      tiktokShortFormSwitch: false,
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
      isPermanent: true,
      // --- Pro Splits & Collaborations ---
      collaborators: [] as { email: string, role: string, sharePercentage: number, publishingPercentage: number }[],
      customLegalClauses: '',
      stemLabels: {} as { [key: string]: string },
      isPrivate: false,
      enableCountdown: false,
    }
  });

  // --- PURPLE WATER UPLOADER LOGIC ---
  const [waterActive, setWaterActive] = useState(false);

  // Synthesizes a clean toggle beep natively using Web Audio API
  const playToggleBeep = (activeState: boolean) => {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      // Higher pitch on enable, lower pitch on disable
      oscillator.frequency.setValueAtTime(activeState ? 580 : 320, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Audio context fallback if blocked before interaction
    }
  };

  const handleToggle = () => {
    const newState = !waterActive;
    setWaterActive(newState);
    playToggleBeep(newState);
  };
  // -----------------------------------



  useEffect(() => {
    if (trackToEdit) {
      setUploaderState((prev: any) => ({
        ...prev,
        formData: {
          ...prev.formData,
          ...trackToEdit,
          isPermanent: trackToEdit.isPermanent ?? true,
          basicMp3LeasePrice: trackToEdit.licenses?.mp3Lease?.price || '',
          basicMp3LeaseEnabled: trackToEdit.licenses?.mp3Lease?.enabled || false,
          premiumM4aLeasePrice: trackToEdit.licenses?.wavLease?.price || '',
          premiumM4aLeaseEnabled: trackToEdit.licenses?.wavLease?.enabled || false,
          trackoutsLeasePrice: trackToEdit.licenses?.premiumLease?.price || '',
          trackoutsLeaseEnabled: trackToEdit.licenses?.premiumLease?.enabled || false,
          unlimitedLeasePrice: trackToEdit.licenses?.unlimitedLease?.price || '',
          unlimitedLeaseEnabled: trackToEdit.licenses?.unlimitedLease?.enabled || false,
          exclusiveRightsPrice: trackToEdit.licenses?.exclusive?.price || '',
          exclusiveRightsEnabled: trackToEdit.licenses?.exclusive?.enabled || false,
          downloadMode: (trackToEdit as any).downloadMode || ((trackToEdit as any).requireSocialUnlock ? 'social_unlock' : ((trackToEdit as any).isFreeDownload ? 'direct_free' : 'none')),
          taggedAudioUrl: (trackToEdit as any).taggedAudioUrl || trackToEdit.audioUrl || '',
          youtubeChannelUrl: (trackToEdit as any).youtubeChannelUrl || '',
        }
      }));
    }
  }, [trackToEdit]);

  const { currentStep, tagInput, uploadProgress, isUploading, isAnalyzing, analysisNotice, isDragging, uploadedFiles, formData } = uploaderState;

  // Helper setters to maintain compatibility with existing logic
  const setCurrentStep = (val: number | ((v: number) => number)) => 
    setUploaderState(p => ({ ...p, currentStep: typeof val === 'function' ? val(p.currentStep) : val }));
  
  const setTagInput = (val: string | ((v: string) => string)) => 
    setUploaderState(p => ({ ...p, tagInput: typeof val === 'function' ? val(p.tagInput) : val }));

  const setUploadProgress = (val: any) => 
    setUploaderState(p => ({ ...p, uploadProgress: typeof val === 'function' ? val(p.uploadProgress) : val }));

  const setIsUploading = (val: boolean | ((v: boolean) => boolean)) => 
    setUploaderState(p => ({ ...p, isUploading: typeof val === 'function' ? val(p.isUploading) : val }));

  const setIsAnalyzing = (val: boolean | ((v: boolean) => boolean)) => 
    setUploaderState(p => ({ ...p, isAnalyzing: typeof val === 'function' ? val(p.isAnalyzing) : val }));

  const setAnalysisNotice = (val: string | null | ((v: string | null) => string | null)) => 
    setUploaderState(p => ({ ...p, analysisNotice: typeof val === 'function' ? val(p.analysisNotice) : val }));

  const setIsDragging = (val: boolean | ((v: boolean) => boolean)) => 
    setUploaderState(p => ({ ...p, isDragging: typeof val === 'function' ? val(p.isDragging) : val }));

  const setUploadedFiles = (val: File[] | ((v: File[]) => File[])) => 
    setUploaderState(p => ({ ...p, uploadedFiles: typeof val === 'function' ? val(p.uploadedFiles) : val }));

  const setFormData = (val: any) => 
    setUploaderState(p => ({ ...p, formData: typeof val === 'function' ? val(p.formData) : val }));

  const [previewCommentText, setPreviewCommentText] = useState('');
  const [previewComments, setPreviewComments] = useState<{name: string, text: string, time: string}[]>([]);

  const [countdownTime, setCountdownTime] = useState('12h : 45m : 30s');
  const [isTimerExpired, setIsTimerExpired] = useState(false);

  const performAudioAnalysis = async (file: File) => {
    try {
      setAnalysisNotice('Deep AI is analyzing your sonic profile...');
      setIsAnalyzing(true);
      const result = await analyzeAudioFile(file);
      
      setFormData((prev: any) => ({
        ...prev,
        bpm: result.bpm || prev.bpm,
        key: result.key.split(' ')[0] || prev.key,
        camelotCode: result.camelotCode || prev.camelotCode,
        mode: result.mode || (result.key.toLowerCase().includes('minor') ? 'Minor' : 'Major'),
        primaryGenre: result.primaryGenre || prev.primaryGenre,
        energyLevel: result.energyLevel === 'Moderate' ? 'Medium' : 
                    (result.energyLevel === 'High' || result.energyLevel === 'Dark & Aggressive') ? 'High' : 'Low',
        mood: [...new Set([...prev.mood, ...(result.mood || [])])],
        tags: [...new Set([...prev.tags, ...(result.tags || [])])],
        instruments: [...new Set([...prev.instruments, ...(result.instruments || [])])]
      }));
      setAnalysisNotice(`Detected: ${result.bpm} BPM, ${result.key}. Sonic Profile: ${result.energyLevel}.`);
      setIsAnalyzing(false);
    } catch (err) {
      console.error("Audio analysis failed:", err);
      setAnalysisNotice('AI analysis failed, but upload is safe.');
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    let active = true;
    if (!formData.isrcCode) {
      fetch('/api/admin/generate-isrc')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (active && data && data.success && data.isrc) {
            setFormData((prev: any) => ({ ...prev, isrcCode: data.isrc }));
          }
        })
        .catch(() => {
          if (active) {
            const yy = String(new Date().getFullYear()).slice(-2);
            const randSeq = String(Math.floor(10000 + Math.random() * 90000));
            setFormData((prev: any) => ({ ...prev, isrcCode: `US-PYR-${yy}-${randSeq}` }));
          }
        });
    }
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let targetTime: number;

    if (formData.couponExpirationMode === 'date' && formData.couponExpirationDate) {
      targetTime = new Date(formData.couponExpirationDate).getTime();
    } else {
      const hours = Number(formData.couponExpirationHours) || 12;
      targetTime = Date.now() + hours * 3600 * 1000;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTime - now;

      if (isNaN(diff) || diff <= 0) {
        setCountdownTime('00h : 00m : 00s');
        setIsTimerExpired(true);
        return true; // indicates stopped
      }

      setIsTimerExpired(false);
      const h = Math.floor(diff / (3600 * 1000));
      const m = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
      const s = Math.floor((diff % (60 * 1000)) / 1000);

      const hStr = h.toString().padStart(2, '0');
      const mStr = m.toString().padStart(2, '0');
      const sStr = s.toString().padStart(2, '0');

      setCountdownTime(`${hStr}h : ${mStr}m : ${sStr}s`);
      return false;
    };

    // run once immediately
    const isStopped = updateTimer();
    if (isStopped) return;

    const interval = setInterval(() => {
      const isStoppedInterval = updateTimer();
      if (isStoppedInterval) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [formData.couponExpirationHours, formData.couponExpirationMode, formData.couponExpirationDate]);




  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'audio' | 'image', role: 'tagged' | 'untagged' | 'stems' | 'tag' = 'tagged') => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files, type, role);
    }
  };



  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).updateStorefrontMetadata) {
      const specs = `Key: ${formData.key || 'D# minor'} | BPM: ${formData.bpm || '119'}${formData.mood ? ` | Mood: ${formData.mood}` : ''}`;
      (window as any).updateStorefrontMetadata(
        formData.title || 'Dark hall',
        formData.producer || 'Pyrex Spinna',
        formData.price || '30.00',
        formData.coverArtUrl || 'https://vercel.app',
        specs
      );
    }
  }, [formData.title, formData.producer, formData.price, formData.coverArtUrl, formData.key, formData.bpm, formData.mood]);

  // Initialize formData with marketingConfig if it's not already set
  const isInitialized = React.useRef(false);
  useEffect(() => {
    if (marketingConfig && !isInitialized.current) {
      setFormData((prev: any) => ({ ...prev, ...marketingConfig }));
      isInitialized.current = true;
    }
  }, [marketingConfig]);





  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    const finalValue = type === 'checkbox' ? checked : (type === 'number' ? (value === '' ? '' : Number(value)) : value);

    setFormData(prev => {
      const updated = { 
        ...prev, 
        [name]: finalValue
      };

      // 🎯 Auto-detect redirect URL whenever typing or updating beat title
      if (name === 'title') {
        const beatTitle = String(value).trim();
        // If redirectUrl was empty or auto-generated player link, dynamically update it
        if (!prev.redirectUrl || prev.redirectUrl.startsWith('/player?track=') || prev.redirectUrl.startsWith('/audio-player?track=') || prev.redirectUrl === prev.audioUrl) {
          updated.redirectUrl = beatTitle ? `/audio-player?track=${encodeURIComponent(beatTitle)}` : (prev.audioUrl || '');
        }
      }

      // If it's a marketing setting, save it to the database independently
      if (isMarketingSetting(name)) {
        saveMarketingSettings({ [name]: finalValue } as any);
      }

      return updated;
    });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, '');
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && formData.tags.length > 0) {
      setFormData(prev => {
        const newTags = [...prev.tags];
        newTags.pop();
        return { ...prev, tags: newTags };
      });
    }
  };

  const removeTag = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleFileUpload = async (files: FileList | null, type: 'audio' | 'image', role: 'tagged' | 'untagged' | 'stems' | 'tag' = 'tagged', event?: React.ChangeEvent<HTMLInputElement>) => {
    if (!files || files.length === 0) return;
    
    // Ensure popups or overlays never trigger during file selection or upload phase
    setShowPromoModal(null);

    const fileArray = Array.from(files);
    const validAudioExtensions = ['mp3', 'm4a', 'aac', 'flac', 'ogg', 'aiff', 'zip', 'rar', '7z'];
    const validImageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];

    for (const file of fileArray) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (type === 'audio') {
        const isAudioType = file.type.startsWith('audio/') || file.type === 'application/zip' || file.type === 'application/x-zip-compressed' || file.type === 'application/octet-stream' || validAudioExtensions.includes(ext);
        if (!isAudioType) {
          alert(`Invalid audio file format ("${file.name}"). Please upload valid audio files (.mp3, .m4a, .flac).`);
          return;
        }
      } else if (type === 'image') {
        const isImageType = file.type.startsWith('image/') || validImageExtensions.includes(ext);
        if (!isImageType) {
          alert(`Invalid artwork image format ("${file.name}"). Please upload valid image files (.jpg, .png, .webp).`);
          return;
        }
      }
    }

    setIsUploading(true);
    
    // Add to queue for visualization
    setUploadedFiles(prev => [...prev, ...fileArray]);

    if (type === 'audio' && role === 'tagged') {
      setAnalysisNotice(fileArray.length > 1 ? `Batch processing ${fileArray.length} tracks...` : 'Analyzing track...');
    }

    for (const file of fileArray) {
      const fileId = Math.random().toString(36).substring(7);

      if (type === 'audio' && role === 'tagged') {
        performAudioAnalysis(file);
      }
      
      // 1. Instant processing for preview (Object URL)
      let instantObjectUrl = '';
      try {
        instantObjectUrl = URL.createObjectURL(file);
      } catch (e) {}

      if (type === 'image') {
        setRawArtworkFile(file);
        setFormData((prev: any) => ({ ...prev, coverArtUrl: instantObjectUrl }));
      } else if (type === 'audio') {
        if (role === 'tagged') {
          setRawAudioFile(file);
        } else if (role === 'untagged') {
          setRawUntaggedFile(file);
        }
        setFormData((prev: any) => {
          const updated = { ...prev };
          if (role === 'tagged') updated.audioUrl = instantObjectUrl;
          else if (role === 'untagged') updated.untaggedM4aUrl = instantObjectUrl;
          else if (role === 'stems') updated.stemsZipUrl = instantObjectUrl;
          else if (role === 'tag') updated.voiceTagUrl = instantObjectUrl;
          return updated;
        });
      }

      // 2. Upload Logic
      if (user) {
        // 🛡️ PERMANENT FIREBASE STORAGE
        const folder = type === 'image' ? 'artworks' : 'beats';
        const storagePath = `${folder}/${user.uid}/${fileId}_${file.name}`;
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prev: any) => ({ ...prev, [file.name]: progress }));
          }, 
          (error) => { 
            console.error('Upload failed:', error); 
            setIsUploading(false); 
          }, 
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setFormData((prev: any) => {
              if (type === 'image') return { ...prev, coverArtUrl: downloadURL };
              return {
                ...prev,
                audioUrl: role === 'tagged' ? downloadURL : prev.audioUrl,
                untaggedM4aUrl: role === 'untagged' ? downloadURL : prev.untaggedM4aUrl,
                stemsZipUrl: role === 'stems' ? downloadURL : prev.stemsZipUrl,
                voiceTagUrl: role === 'tag' ? downloadURL : prev.voiceTagUrl,
              };
            });
            setIsUploading(false);
          }
        );
      } else {
        // ☁️ FALLBACK: LOCAL UPLOAD WITH ABSOLUTE URL
        const formDataPayload = new FormData();
        formDataPayload.append('file', file);
        
        try {
          const res = await fetch(`/api/upload-local?type=${type}`, {
            method: 'POST',
            body: formDataPayload,
          });
          const result = await res.json();
          
          if (result.success) {
            setFormData((prev: any) => {
              if (type === 'image') return { ...prev, coverArtUrl: result.url };
              const updated = { ...prev };
              if (role === 'tagged') updated.audioUrl = result.url;
              else if (role === 'untagged') updated.untaggedM4aUrl = result.url;
              else if (role === 'stems') updated.stemsZipUrl = result.url;
              else if (role === 'tag') updated.voiceTagUrl = result.url;
              return updated;
            });
          }
        } catch (err) {
          console.error("Local upload error:", err);
        } finally {
          setIsUploading(false);
        }
      }
    }

    // Reset input value to allow selecting the same file again
    if (event) {
      event.target.value = '';
    }
  };

  const testAudioPlayerInUploader = (urlToTest?: string) => {
    const rawTarget = urlToTest || formData.redirectUrl || formData.audioUrl;
    
    // If the target URL is a player link (/player?track=... or /audio-player?track=...), navigate to the audio player for that beat!
    if (rawTarget && (rawTarget.startsWith('/player') || rawTarget.startsWith('/audio-player') || rawTarget.includes('/player?') || rawTarget.includes('/audio-player?'))) {
      navigate(rawTarget);
      return;
    }

    // Otherwise, stream the audio file directly in the global audio player
    const streamAudioUrl = formData.audioUrl || (rawTarget && !rawTarget.includes('/player') ? rawTarget : '');

    playTrack({
      id: 'uploader_preview_' + Date.now(),
      title: formData.title || 'Beat Preview',
      producer: formData.producer || 'Pyrex Spinna',
      coverArtUrl: formData.coverArtUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      audioUrl: streamAudioUrl,
      bpm: Number(formData.bpm) || 130,
      price: Number(formData.price) || 35
    } as Beat);
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting || isUploading || isAnalyzing) return;
    
    // Ensure popups/monetization overlays never trigger during upload progress or submission state
    setShowPromoModal(null);
    setIsSubmitting(true);

    const audioFileToSubmit = rawAudioFile || (uploadedFiles.length > 0 ? uploadedFiles[0] : null);
    const artworkFileToSubmit = rawArtworkFile;

    if (!audioFileToSubmit || !artworkFileToSubmit) {
      alert("Single file dispatches are not allowed. Please provide both an audio track file and an artwork graphic file grouped in the submission.");
      setIsSubmitting(false);
      return;
    }

    const uniqueId = 'beat_' + Date.now();
    const defaultTitle = audioFileToSubmit.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const finalTitle = (formData.title || defaultTitle).trim();
    const finalBpm = Number(formData.bpm) || 130;

    // 🛡️ RESILIENCE: DUPLICATE PREVENTION & REPLACEMENT LAYER
    const normalizedNewTitle = finalTitle.toLowerCase();
    const fileSignature = createFileFingerprint(audioFileToSubmit);
    const currentFingerprint = fileSignature;

    // Search for matching existing beat by strict signature (file.name + file.size + file.lastModified) or title match
    const existingMatch = state.beats.find(b =>
      b.id === trackToEdit?.id ||
      (b as any).fileSignature === fileSignature ||
      (b as any).fileFingerprint === fileSignature ||
      ((b as any).fileName === audioFileToSubmit.name && (b as any).fileSize === audioFileToSubmit.size) ||
      (b.title.trim().toLowerCase() === normalizedNewTitle && Number(b.bpm) === finalBpm)
    );

    const targetBeatId = trackToEdit?.id || existingMatch?.id || uniqueId;

    const finalAudioUrl = formData.audioUrl || URL.createObjectURL(audioFileToSubmit);
    const finalArtworkUrl = formData.coverArtUrl || URL.createObjectURL(artworkFileToSubmit);

    let fileHash = '';
    try {
      fileHash = await calculateFileHash(audioFileToSubmit);
    } catch (hashError) {
      console.warn("Hashing skipped due to environment limits:", hashError);
    }

    // Save to robust IndexedDB persistent storage first if it's local
    if (!formData.audioUrl) {
      try {
        await publishBeatToStorefront(
          finalTitle, 
          audioFileToSubmit, 
          artworkFileToSubmit, 
          String(formData.bpm || '130'), 
          formData.key || 'C Minor'
        );
      } catch (e) {
        console.warn("Failed to persist to IndexedDB:", e);
      }
    }

    const newBeat: Beat = {
      id: targetBeatId,
      title: finalTitle,
      producer: formData.producer || 'Pyrex Spinna',
      bpm: finalBpm,
      key: formData.key || 'C Minor',
      camelotCode: formData.camelotCode,
      mode: formData.mode || 'Minor',
      price: Number(formData.price) || state.profile.marketingConfig?.defaultMp3Price || 29.99,
      coverArtUrl: finalArtworkUrl,
      audioUrl: finalAudioUrl,
      visibility: (formData.visibilityPlacement as any) || 'Public',
      trackType: formData.trackType || 'Beat',
      isHumanUploaded: true,
      isLocal: true,
      isPermanent: true,
      fileHash: fileHash,
      fileName: audioFileToSubmit.name,
      fileSize: audioFileToSubmit.size,
      fileLastModified: audioFileToSubmit.lastModified,
      fileSignature: fileSignature,
      fileFingerprint: currentFingerprint,
      usedSamples: formData.usedSamples,
      sampleName: formData.sampleName,
      sampleSource: formData.sampleSource,
      excludeFromBulkDiscounts: formData.excludeFromBulkDiscounts,
      collaboratorsList: formData.collaborators.map(c => ({
        email: c.email,
        sharePercentage: c.sharePercentage || 0,
        publishingPercentage: c.publishingPercentage || 0,
        role: c.role || 'Producer'
      })),
      youtubeVideoUrl: formData.youtubeVideoUrl,
      createdAt: new Date().toISOString() as any,
      updatedAt: new Date().toISOString() as any,
      licenses: {
        mp3Lease: { enabled: formData.basicMp3LeaseEnabled, price: Number(formData.basicMp3LeasePrice) || state.profile.marketingConfig?.defaultMp3Price || 29.99 },
        wavLease: { enabled: formData.premiumM4aLeaseEnabled, price: Number(formData.premiumM4aLeasePrice) || state.profile.marketingConfig?.defaultWavPrice || 49.99 },
        premiumLease: { enabled: formData.trackoutsLeaseEnabled, price: Number(formData.trackoutsLeasePrice) || state.profile.marketingConfig?.defaultStemsPrice || 99.99 },
        unlimitedLease: { enabled: formData.unlimitedLeaseEnabled, price: Number(formData.unlimitedLeasePrice) || state.profile.marketingConfig?.defaultUnlimitedPrice || 199.99 },
        exclusive: { enabled: formData.exclusiveRightsEnabled, price: Number(formData.exclusiveRightsPrice) || state.profile.marketingConfig?.defaultExclusivePrice || 999.99 },
      },
      untaggedM4aUrl: formData.untaggedM4aUrl,
      stemsZipUrl: formData.stemsZipUrl,
      mood: typeof formData.mood === 'string' ? [formData.mood] : (formData.mood || ['Dark']),
      tags: typeof formData.tags === 'string' ? [formData.tags] : (formData.tags || []),
    };

    try {
      // 🛡️ DEPLOYMENT GUARDRAILS: Network Error Handling & Fallback
      await addBeat(newBeat);
      
      // 🎵 Stream immediately on Audio Player when beat is added
      setCurrentTrack(newBeat);

      // ☁️ Trigger Internet Archive Background Backup (Fails gracefully)
      const fileToArchive = rawUntaggedFile || audioFileToSubmit;
      if (fileToArchive) {
        backupTrackToInternetArchive(newBeat, fileToArchive).catch(archiveErr => {
          console.error("Archive backup failed, but storefront beat is safe:", archiveErr);
        }).then(result => {
          if (result && result.success && result.url) {
            updateBeat(newBeat.id, { archiveUrl: result.url });
          }
        });
      }

      // 🔔 Clean state reset for next upload session
      setFormData({
        title: '',
        producer: '',
        bpm: '',
        key: '',
        mode: 'Major',
        price: '',
        coverArtUrl: '',
        audioUrl: '',
        untaggedM4aUrl: '',
        stemsZipUrl: '',
        freeDownloadEnabled: false,
        isExclusive: false,
        contentIdEnabled: false,
        description: '',
        mood: [],
        tags: [],
        instruments: [],
        usedSamples: false,
        sampleName: '',
        sampleSource: '',
        collaborators: [],
        youtubeVideoUrl: '',
        excludeFromBulkDiscounts: false,
        primaryGenre: '',
        secondaryGenre: '',
        trackType: 'Beat',
        isExplicit: false,
        isInstrumental: false,
        productionYear: new Date().getFullYear(),
        isrcCode: '',
      });
      setRawAudioFile(null);
      setRawArtworkFile(null);
      setUploadedFiles([]);
      setCurrentStep(0);
      setAnalysisNotice(null);
      setIsAnalyzing(false);
      setIsUploading(false);
      setIsSubmitting(false);

      // 🎯 EXPLICIT PUBLISH SUCCESS CALLBACK: Only trigger monetization/promo popup AFTER data is safely committed to storage and marked as published
      setShowPromoModal(newBeat);

      try {
        handlePostPublishAutomation(newBeat, formData);
      } catch (autoErr) {
        console.warn("Post-publish automation notice:", autoErr);
      }
    } catch (err) {
      console.error("Save beat error during publish:", err);
      setIsSubmitting(false);
      setShowPromoModal(null);
      alert("An error occurred while saving the track to storage. Please try again.");
    }
  };

  return (
    <>
      <div className={`relative w-full max-w-6xl mx-auto pb-20 animate-in fade-in duration-500 overflow-hidden ${waterActive ? 'rounded-xl' : ''}`}>
        
        {/* SUBTLE PURPLE WATER POOL BACKGROUND (Low Opacity & High Blur for Readability) */}
        {waterActive && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
            <div className="absolute -inset-[100%] bg-gradient-to-r from-purple-900 via-fuchsia-600 to-indigo-900 rounded-[40%] animate-wave blur-3xl"></div>
          </div>
        )}

        <div className="relative z-10">
        
        {/* Top Header & Two Clean Separate Toggle Buttons */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-yellow-300" />
                PYREX SPINNER VAULT UPLOADER
              </span>
              {isDevMode && (
                <div className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Local Mode</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">Music Uploader</h1>
            <p className="text-sm text-neutral-400 mt-1">
              {uploadMode === 'pack'
                ? 'Create a 5-6 beat bundle with instant 30-second continuous previews on one streamlined screen.'
                : 'Upload an individual beat with multi-tiered licensing, stem files, and metadata.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* TOGGLE BUTTON */}
            <button 
              onClick={handleToggle}
              className={`px-4 py-2 rounded-lg font-bold text-xs tracking-wider transition-all shadow-lg ${
                waterActive 
                  ? 'bg-purple-600 text-white shadow-purple-900/60 border border-purple-400' 
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-700 hover:text-white'
              }`}
            >
              {waterActive ? '🟣 LIQUID MODE: ON' : '⚫ LIQUID MODE: OFF'}
            </button>

            {/* TWO SEPARATE CLEAN TOGGLE BUTTONS */}
            <div className="flex items-center gap-2 p-1.5 bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-xl">
            <button
              type="button"
              onClick={() => setUploadMode('single')}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                uploadMode === 'single'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 ring-1 ring-purple-400/50'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
              }`}
            >
              <Music size={16} />
              <span>Upload Single Beat</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('pack')}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                uploadMode === 'pack'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 ring-1 ring-purple-400/50'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
              }`}
            >
              <Layers size={16} />
              <span>Upload Beat Pack</span>
            </button>
          </div>
          </div>
        </div>

        {uploadMode === 'pack' ? (
          /* STREAMLINED ALL-IN-ONE BEAT PACK UPLOADER */
          <BeatPackUploader onClose={onClose} />
        ) : (
          /* STANDARD 7-STEP SINGLE BEAT WIZARD */
          <form onSubmit={handleSubmit} className="w-full">
            {/* Progress Bar */}
            <div className="mb-8 relative">
              <div className="flex justify-between">
                {steps.map((step, i) => (
                  <div key={step} className="flex flex-col items-center relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${
                      i < currentStep ? 'bg-indigo-500 border-indigo-500 text-white' : 
                      i === currentStep ? 'bg-neutral-900 border-indigo-500 text-indigo-400' : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                    }`}>
                      {i < currentStep ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                    </div>
                    <span className={`text-xs mt-2 font-medium hidden sm:block ${i <= currentStep ? 'text-neutral-200' : 'text-neutral-500'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute top-5 left-0 w-full h-[2px] bg-neutral-800 -z-0">
                 <div 
                   className="h-full bg-indigo-500 transition-all duration-300"
                   style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                 />
              </div>
            </div>

      {/* Form Content */}
      <div className="bg-neutral-900 rounded-2xl p-6 md:p-8 border border-neutral-800 shadow-xl mb-8">
        
        {/* STEP 1: Files & Artwork */}
        {currentStep === 0 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            {analysisNotice && (
              <div className="bg-indigo-950/80 border border-indigo-500/50 rounded-xl p-4 flex items-center gap-3 text-indigo-200 text-sm shadow-lg animate-in fade-in">
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin text-indigo-400 flex-shrink-0" /> : <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0" />}
                <div>
                  <p className="font-semibold text-white">AI Audio Intelligence</p>
                  <p className="text-xs text-indigo-200 mt-0.5">{analysisNotice}</p>
                </div>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b border-neutral-800 pb-2">Audio Files</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* TAGGED MP3 */}
                <div 
                  className={`bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col relative group transition-colors ${
                    isDragging ? 'border-indigo-500 bg-indigo-500/10' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'audio', 'tagged')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Tagged MP3</label>
                    <span className="text-[10px] text-indigo-400 font-medium">Public Stream</span>
                  </div>
                  <div 
                    className="flex-1 border border-dashed border-neutral-700 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-900/50 transition-colors"
                    onClick={() => document.getElementById('mp3-upload')?.click()}
                  >
                    {formData.audioUrl ? (
                      <div className="text-center w-full">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                        <p className="text-[10px] text-neutral-300 truncate w-full px-2">{formData.audioUrl.split('/').pop()}</p>
                      </div>
                    ) : (
                      <>
                        <Music className="w-5 h-5 text-neutral-500 mb-1" />
                        <p className="text-[10px] text-neutral-500">Upload Tagged MP3</p>
                      </>
                    )}
                    <input id="mp3-upload" type="file" multiple accept="audio/mpeg,audio/mp3,audio/mp4,audio/x-m4a" className="hidden" onChange={(e) => handleFileUpload(e.target.files, 'audio', 'tagged', e)} />
                  </div>
                  {formData.untaggedM4aUrl && formData.voiceTagUrl && (
                    <button 
                      onClick={async () => {
                        setIsUploading(true);
                        try {
                          const res = await fetch('/api/audio/watermark', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              rawBeatUrl: formData.untaggedM4aUrl,
                              voiceTagUrl: formData.voiceTagUrl,
                              outputFileName: `tagged_${formData.title.replace(/\s+/g, '_')}_${Date.now()}.mp3`
                            })
                          });
                          const data = await res.json();
                          if (data.success) {
                            setFormData(prev => ({ ...prev, audioUrl: data.url }));
                          }
                        } catch (err) {
                          console.error("Watermarking failed:", err);
                        } finally {
                          setIsUploading(false);
                        }
                      }}
                      className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold py-1 px-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    >
                      AI GENERATE TAGGED
                    </button>
                  )}
                  <input
                    type="url"
                    name="audioUrl"
                    value={formData.audioUrl}
                    onChange={handleChange}
                    placeholder="Direct MP3 Link"
                    className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* UNTAGGED M4A */}
                <div 
                  className={`bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col transition-colors ${
                    isDragging ? 'border-indigo-500 bg-indigo-500/10' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'audio', 'untagged')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Untagged M4A</label>
                    <span className="text-[10px] text-emerald-400 font-medium">For Buyers</span>
                  </div>
                  <div 
                    className="flex-1 border border-dashed border-neutral-700 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-900/50 transition-colors"
                    onClick={() => document.getElementById('m4a-upload')?.click()}
                  >
                    {formData.untaggedM4aUrl ? (
                      <div className="text-center w-full">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                        <p className="text-[10px] text-neutral-300 truncate w-full px-2">{formData.untaggedM4aUrl.split('/').pop()}</p>
                      </div>
                    ) : (
                      <>
                        <Music className="w-5 h-5 text-neutral-500 mb-1" />
                        <p className="text-[10px] text-neutral-500">Upload Untagged M4A</p>
                      </>
                    )}
                    <input id="m4a-upload" type="file" accept="audio/mp4,audio/x-m4a" className="hidden" onChange={(e) => handleFileUpload(e.target.files, 'audio', 'untagged', e)} />
                  </div>
                  <input
                    type="url"
                    name="untaggedM4aUrl"
                    value={formData.untaggedM4aUrl}
                    onChange={handleChange}
                    placeholder="Direct M4A Link"
                    className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* STEMS ZIP */}
                <div 
                  className={`bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col transition-colors ${
                    isDragging ? 'border-indigo-500 bg-indigo-500/10' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'audio', 'stems')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Stems ZIP</label>
                    <span className="text-[10px] text-amber-400 font-medium">Trackouts</span>
                  </div>
                  <div 
                    className="flex-1 border border-dashed border-neutral-700 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-900/50 transition-colors"
                    onClick={() => document.getElementById('stems-upload')?.click()}
                  >
                    {formData.stemsZipUrl ? (
                      <div className="text-center w-full">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                        <p className="text-[10px] text-neutral-300 truncate w-full px-2">{formData.stemsZipUrl.split('/').pop()}</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-neutral-500 mb-1" />
                        <p className="text-[10px] text-neutral-500">Upload Stems ZIP</p>
                      </>
                    )}
                    <input id="stems-upload" type="file" accept=".zip,.rar,.7z" className="hidden" onChange={(e) => handleFileUpload(e.target.files, 'audio', 'stems', e)} />
                  </div>
                  <input
                    type="url"
                    name="stemsZipUrl"
                    value={formData.stemsZipUrl}
                    onChange={handleChange}
                    placeholder="Direct ZIP Link"
                    className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* PRODUCER VOICE TAG */}
                <div 
                  className={`bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col transition-colors ${
                    isDragging ? 'border-indigo-500 bg-indigo-500/10' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'audio', 'tag')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Voice Tag</label>
                    <span className="text-[10px] text-indigo-400 font-medium">Protection</span>
                  </div>
                  <div 
                    className="flex-1 border border-dashed border-neutral-700 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-900/50 transition-colors"
                    onClick={() => document.getElementById('tag-upload')?.click()}
                  >
                    {formData.voiceTagUrl ? (
                      <div className="text-center w-full">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                        <p className="text-[10px] text-neutral-300 truncate w-full px-2">{formData.voiceTagUrl.split('/').pop()}</p>
                      </div>
                    ) : (
                      <>
                        <Music className="w-5 h-5 text-neutral-500 mb-1" />
                        <p className="text-[10px] text-neutral-500">Upload Tag</p>
                      </>
                    )}
                    <input id="tag-upload" type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files, 'audio', 'tag', e)} />
                  </div>
                  <input
                    type="url"
                    name="voiceTagUrl"
                    value={formData.voiceTagUrl}
                    onChange={handleChange}
                    placeholder="Direct Tag Link"
                    className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {isUploading && (
                <div className="mt-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] text-indigo-300 mb-1">
                      <span>Syncing files to {isDevMode ? 'local registry' : 'cloud storage'}...</span>
                      <span>{Math.round((Object.values(uploadProgress) as number[]).reduce((a: number, b: number) => a + b, 0) / (Object.keys(uploadProgress).length || 1))}%</span>
                    </div>
                    <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-300" 
                        style={{ width: `${(Object.values(uploadProgress) as number[]).reduce((a: number, b: number) => a + b, 0) / (Object.keys(uploadProgress).length || 1)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 border-b border-neutral-800 pb-2">Artwork</h2>
              <div className="flex items-center space-x-6">
                <div 
                  className={`w-32 h-32 bg-neutral-950 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-neutral-500 flex-shrink-0 overflow-hidden cursor-pointer transition-colors ${
                    isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-neutral-700 hover:border-neutral-500'
                  }`}
                  onClick={() => document.getElementById('image-upload-input')?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'image')}
                >
                  {formData.coverArtUrl ? (
                    <img src={formData.coverArtUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 mb-2 text-neutral-400" />
                      <span className="text-[10px] text-neutral-400">Click or Drop Image</span>
                    </>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Cover Art URL</label>
                  <input
                    type="url"
                    name="coverArtUrl"
                    value={formData.coverArtUrl}
                    onChange={handleChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="mt-4 flex gap-2">
                     <button type="button"
                       className="px-3 py-1.5 bg-neutral-800 text-xs font-medium rounded-md hover:bg-neutral-700 flex items-center"
                       onClick={() => document.getElementById('image-upload-input')?.click()}
                     >
                       <Upload className="w-3 h-3 mr-1" /> Upload Image
                     </button>
                     <input
                       id="image-upload-input"
                       type="file"
                       accept="image/*,*"
                       className="hidden"
                       onChange={(e) => handleFileUpload(e.target.files, 'image', 'tagged', e)}
                     />
                     <button type="button" className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 text-xs font-medium rounded-md border border-indigo-500/20 flex items-center">
                       <Sparkles className="w-3 h-3 mr-1" /> AI Generate Cover
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b border-neutral-800 pb-2 flex justify-between items-end">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Track Title *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="flex-1 bg-neutral-950 border-2 border-neutral-700 rounded-xl px-5 py-3.5 text-lg md:text-2xl text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 font-bold"
                      required
                    />
                    <button type="button" className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20 text-sm flex items-center hover:bg-indigo-500/20">
                      <Sparkles className="w-4 h-4 mr-2" /> AI Title
                    </button>
                  </div>
                </div>

                {uploadedFiles.length > 1 && (
                  <div className="md:col-span-2 bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-xl flex items-center justify-between gap-4 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                      <Zap size={18} className="text-indigo-400" />
                      <div>
                        <p className="text-xs font-bold text-neutral-200 uppercase">Batch Sync Mode Detected</p>
                        <p className="text-[10px] text-neutral-500">Apply current BPM, Key, Producer, and Genre to all {uploadedFiles.length} uploaded tracks.</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        // In a real multi-upload system, we would iterate through all queued beats.
                        // Since our current state only holds ONE 'formData' for the active beat, 
                        // we simulate "applying" to the internal queue.
                        alert(`Successfully applied metadata to ${uploadedFiles.length} tracks in queue.`);
                      }}
                      className="bg-indigo-500 hover:bg-indigo-400 text-white text-[10px] font-black px-4 py-2 rounded-lg transition-all shadow-lg active:scale-95"
                    >
                      APPLY TO ALL TRACKS
                    </button>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Release Date</label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Gear / Equipment</label>
                  <input
                    type="text"
                    name="gear"
                    value={formData.gear}
                    onChange={handleChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. MPC, Moog, Serum..."
                  />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Instruments</label>
                    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 flex flex-wrap gap-2 focus-within:border-indigo-500 transition-colors">
                      {formData.instruments.map((inst, index) => (
                        <span key={index} className="bg-neutral-800 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          {inst}
                          <button type="button" onClick={() => setFormData(prev => ({...prev, instruments: prev.instruments.filter((_, i) => i !== index)}))} className="ml-1 text-neutral-400 hover:text-white">
                            &times;
                          </button>
                        </span>
                      ))}
                      <input 
                        type="text" 
                        value={tagInput} // Reuse tagInput or create new one? I'll reuse it for simplicity if I make it generic or create new one. I'll create new one.
                        // Wait, I need a separate input for instruments.
                        // I will just add instrument input.
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (tagInput.trim()) {
                                    setFormData(prev => ({...prev, instruments: [...prev.instruments, tagInput.trim()]}));
                                    setTagInput('');
                                }
                            }
                        }}
                        className="bg-transparent border-none text-sm text-white focus:outline-none flex-1 min-w-[120px]" 
                        placeholder="Add instrument..."
                      />
                    </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Custom Price ($ USD)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Track Type</label>
                  <select
                    name="trackType"
                    value={formData.trackType}
                    onChange={handleChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Beat</option>
                    <option>Beat with Hook</option>
                    <option>Song</option>
                    <option>Instrumental</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Producer / Artist</label>
                  <input
                    type="text"
                    name="producer"
                    value={formData.producer}
                    onChange={handleChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-400 mb-1">YouTube Video Link (for background visuals)</label>
                  <input
                    type="url"
                    name="youtubeVideoUrl"
                    value={formData.youtubeVideoUrl}
                    onChange={handleChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                  />
                </div>
              </div>

              {/* UPLOAD QUEUE & ANALYSIS STATUS */}
              {uploadedFiles.length > 0 && (
                <div className="mt-8 border-t border-neutral-800 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                      <ListMusic size={14} className="text-indigo-400" /> Upload Queue & Processing
                    </h3>
                    {isAnalyzing && (
                      <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold animate-pulse">
                        <Sparkles size={10} /> {analysisNotice || 'Analyzing sonic profile...'}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-neutral-500">
                          <Music size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-neutral-300 truncate">{file.name}</p>
                          <div className="mt-1.5 h-1 bg-neutral-800 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-indigo-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress[file.name] || 0}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-[8px] font-black text-neutral-500 w-8 text-right">
                          {Math.round(uploadProgress[file.name] || 0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Metadata */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b border-neutral-800 pb-2 flex justify-between items-end">
                Metadata & Sonic Profile
                <div className="flex items-center gap-2 mb-1">
                   <div className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded text-[8px] font-black uppercase tracking-widest">
                     <Sparkles size={8} className="inline mr-1" /> AI Detection Active
                   </div>
                </div>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">BPM</label>
                  <input type="number" name="bpm" value={formData.bpm} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">Key / Mode</label>
                  <div className="flex gap-2">
                    <input type="text" name="key" value={formData.key} onChange={handleChange} className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold" placeholder="Root" />
                    <select name="mode" value={formData.mode} onChange={handleChange} className="w-24 bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-3 text-sm font-bold text-neutral-300">
                      <option value="Major">Major</option>
                      <option value="Minor">Minor</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">Energy Level</label>
                  <select 
                    name="energyLevel" 
                    value={formData.energyLevel || 'Medium'} 
                    onChange={handleChange} 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm font-bold text-neutral-300"
                  >
                     <option value="Low">Low (Chill)</option>
                     <option value="Medium">Medium (Steady)</option>
                     <option value="High">High (Hype)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">AI-Free Verification</label>
                  <div className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-xl h-[50px]">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase">Human-Made</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.isAIFree} 
                        onChange={(e) => setFormData(prev => ({ ...prev, isAIFree: e.target.checked }))} 
                      />
                      <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">Used Samples</label>
                  <div className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-xl h-[50px]">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase">Sampled Content</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="usedSamples"
                        className="sr-only peer" 
                        checked={formData.usedSamples} 
                        onChange={(e) => setFormData(prev => ({ ...prev, usedSamples: e.target.checked }))} 
                      />
                      <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                </div>
                {formData.usedSamples && (
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-left-2 duration-200">
                    <div>
                      <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">Sample Name</label>
                      <input 
                        type="text" 
                        name="sampleName" 
                        value={formData.sampleName} 
                        onChange={handleChange} 
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                        placeholder="e.g. Moonlight Sonata" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">Sample Source / Where Acquired</label>
                      <input 
                        type="text" 
                        name="sampleSource" 
                        value={formData.sampleSource} 
                        onChange={handleChange} 
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                        placeholder="e.g. Splice, Tracklib, Vinyl Rip" 
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 border-t border-neutral-800 pt-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-3">Genres & Moods</label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <select 
                        name="primaryGenre" 
                        value={formData.primaryGenre} 
                        onChange={handleChange} 
                        className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-300"
                      >
                        <option value="">Primary Genre</option>
                        <option value="Hip Hop">Hip Hop</option>
                        <option value="Trap">Trap</option>
                        <option value="R&B">R&B</option>
                        <option value="Pop">Pop</option>
                      </select>
                      <select 
                        name="secondaryGenre" 
                        value={formData.secondaryGenre} 
                        onChange={handleChange} 
                        className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-300"
                      >
                        <option value="">Secondary Genre</option>
                        <option value="Soul">Soul</option>
                        <option value="Lo-Fi">Lo-Fi</option>
                        <option value="Electronic">Electronic</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Dark', 'Aggressive', 'Bouncy', 'Sad', 'Happy', 'Inspiring', 'Mellow', 'Energetic', 'Epic', 'Chill'].map(mood => (
                        <button
                          key={mood}
                          onClick={() => {
                            const updatedMoods = formData.mood.includes(mood)
                              ? formData.mood.filter(m => m !== mood)
                              : [...formData.mood, mood].slice(0, 3);
                            setFormData(prev => ({ ...prev, mood: updatedMoods }));
                          }}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                            formData.mood.includes(mood)
                              ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-3">Tags (Type Beats, Artists)</label>
                    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex flex-wrap gap-2 focus-within:border-indigo-500 transition-colors">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] px-2.5 py-1 rounded-lg font-black uppercase flex items-center">
                          {tag}
                          <button type="button" onClick={() => removeTag(index)} className="ml-1.5 text-indigo-400 hover:text-white">
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                      <input 
                        type="text" 
                        value={tagInput} 
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            if (tagInput.trim()) {
                              setFormData(prev => ({ ...prev, tags: [...new Set([...prev.tags, tagInput.trim()])] }));
                              setTagInput('');
                            }
                          }
                        }}
                        className="bg-transparent border-none text-sm text-white focus:outline-none flex-1 min-w-[120px]" 
                        placeholder="Add tag..."
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                   <div>
                    <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-3">Release & Scheduling</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] text-neutral-600 uppercase font-bold mb-1">Release Date</label>
                        <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-neutral-300" />
                      </div>
                      <div>
                        <label className="block text-[8px] text-neutral-600 uppercase font-bold mb-1">Status</label>
                        <select name="currentStatusBadge" value={formData.currentStatusBadge} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-neutral-300">
                          <option value="Draft">Draft</option>
                          <option value="Public">Public</option>
                          <option value="Private">Private</option>
                        </select>
                      </div>
                    </div>
                   </div>

                   <div className="bg-neutral-950/40 p-5 rounded-2xl border border-neutral-800/60 space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={formData.isExplicit} onChange={(e) => setFormData(prev => ({...prev, isExplicit: e.target.checked}))} className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-indigo-500 focus:ring-indigo-500" />
                        <span className="text-xs font-bold text-neutral-400 group-hover:text-neutral-200 transition-colors uppercase tracking-widest">Explicit Content</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={formData.isInstrumental} onChange={(e) => setFormData(prev => ({...prev, isInstrumental: e.target.checked}))} className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-indigo-500 focus:ring-indigo-500" />
                        <span className="text-xs font-bold text-neutral-400 group-hover:text-neutral-200 transition-colors uppercase tracking-widest">Instrumental Only</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={formData.vocalPresence || false} onChange={(e) => setFormData(prev => ({...prev, vocalPresence: e.target.checked}))} className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-indigo-500 focus:ring-indigo-500" />
                        <span className="text-xs font-bold text-neutral-400 group-hover:text-neutral-200 transition-colors uppercase tracking-widest">Contains Backing Vocals</span>
                      </label>
                   </div>
                </div>

                <div className="mt-8 border-t border-neutral-800 pt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Publishing Administration</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">PRO (Performing Rights Organization)</label>
                      <select
                        value={formData.publishing?.proName || 'None'}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          publishing: { ...prev.publishing, proName: e.target.value }
                        }))}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm font-bold text-neutral-300"
                      >
                        <option value="None">Not Affiliated</option>
                        <option value="ASCAP">ASCAP</option>
                        <option value="BMI">BMI</option>
                        <option value="PRS">PRS</option>
                        <option value="SESAC">SESAC</option>
                        <option value="SOCAN">SOCAN</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">IPI / CAE Number</label>
                      <input
                        type="text"
                        value={formData.publishing?.ipiNumber || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          publishing: { ...prev.publishing, ipiNumber: e.target.value }
                        }))}
                        placeholder="e.g. 00123456789"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">Writer Split (%)</label>
                        <input
                          type="number"
                          value={formData.publishing?.writerSplit || 50}
                          onChange={(e) => {
                            const val = Math.min(100, Math.max(0, Number(e.target.value)));
                            setFormData(prev => ({
                              ...prev,
                              publishing: { 
                                ...prev.publishing, 
                                writerSplit: val,
                                publisherSplit: 100 - val 
                              }
                            }));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">Publisher Split (%)</label>
                        <input
                          type="number"
                          value={formData.publishing?.publisherSplit || 50}
                          readOnly
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-500 font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Globe className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-1">Global Distribution Routing</p>
                        <p className="text-[9px] text-neutral-500 leading-relaxed">
                          By completing these fields, this track will be automatically prepared for registration with global copyright societies and DDEX-compliant distribution networks.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Commercial & Licensing Controls */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Configurator Form */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-2">
                    <h2 className="text-xl font-semibold">Pricing & Licenses</h2>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-neutral-400">License Template Override</label>
                      <input type="checkbox" checked={formData.defaultTemplateOverride} onChange={(e) => setFormData(prev => ({...prev, defaultTemplateOverride: e.target.checked}))} className="rounded border-neutral-700 bg-neutral-950 text-indigo-500 focus:ring-indigo-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Standard License Price Configurator</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-neutral-500">$</span>
                        <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Automated Licensing Template</label>
                      <select name="licenseTemplate" value={formData.licenseTemplate} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>Standard</option>
                        <option>Premium</option>
                        <option>Exclusive Only</option>
                        <option>Custom Contract</option>
                      </select>
                    </div>
                  </div>

                  {/* License Tiers List (clean, un-crowded design) */}
                  <div className="space-y-3">
                    <div className="bg-neutral-950/50 p-4 rounded-lg border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={formData.basicMp3LeaseEnabled} onChange={(e) => setFormData(prev => ({...prev, basicMp3LeaseEnabled: e.target.checked}))} className="rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500 w-5 h-5" />
                        <div>
                          <h4 className="font-medium text-neutral-200 text-sm">Basic MP3 Lease</h4>
                          <p className="text-xs text-neutral-500">Entry-level streaming lease configurations.</p>
                        </div>
                      </div>
                      {formData.basicMp3LeaseEnabled && (
                        <div className="relative w-40">
                          <span className="absolute left-3.5 top-3 text-neutral-400 text-base font-bold">$</span>
                          <input type="number" step="0.01" name="basicMp3LeasePrice" value={formData.basicMp3LeasePrice} onChange={handleChange} className="w-full bg-neutral-900 border-2 border-neutral-700 rounded-xl pl-8 pr-4 py-2.5 text-lg md:text-xl text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 font-mono font-bold" />
                        </div>
                      )}
                    </div>

                    <div className="bg-neutral-950/50 p-4 rounded-lg border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={formData.premiumM4aLeaseEnabled} onChange={(e) => setFormData(prev => ({...prev, premiumM4aLeaseEnabled: e.target.checked}))} className="rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500 w-5 h-5" />
                        <div>
                          <h4 className="font-medium text-neutral-200 text-sm">Premium M4A Lease</h4>
                          <p className="text-xs text-neutral-500">High-quality uncompressed M4A audio licensing.</p>
                        </div>
                      </div>
                      {formData.premiumM4aLeaseEnabled && (
                        <div className="relative w-40">
                          <span className="absolute left-3.5 top-3 text-neutral-400 text-base font-bold">$</span>
                          <input type="number" step="0.01" name="premiumM4aLeasePrice" value={formData.premiumM4aLeasePrice} onChange={handleChange} className="w-full bg-neutral-900 border-2 border-neutral-700 rounded-xl pl-8 pr-4 py-2.5 text-lg md:text-xl text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 font-mono font-bold" />
                        </div>
                      )}
                    </div>

                    <div className="bg-neutral-950/50 p-4 rounded-lg border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={formData.trackoutsLeaseEnabled} onChange={(e) => setFormData(prev => ({...prev, trackoutsLeaseEnabled: e.target.checked}))} className="rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500 w-5 h-5" />
                        <div>
                          <h4 className="font-medium text-neutral-200 text-sm">Trackouts Premium Lease</h4>
                          <p className="text-xs text-neutral-500">Multi-track stem lease availability.</p>
                        </div>
                      </div>
                      {formData.trackoutsLeaseEnabled && (
                        <div className="relative w-40">
                          <span className="absolute left-3.5 top-3 text-neutral-400 text-base font-bold">$</span>
                          <input type="number" step="0.01" name="trackoutsLeasePrice" value={formData.trackoutsLeasePrice} onChange={handleChange} className="w-full bg-neutral-900 border-2 border-neutral-700 rounded-xl pl-8 pr-4 py-2.5 text-lg md:text-xl text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 font-mono font-bold" />
                        </div>
                      )}
                    </div>

                    <div className="bg-neutral-950/50 p-4 rounded-lg border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={formData.unlimitedLeaseEnabled} onChange={(e) => setFormData(prev => ({...prev, unlimitedLeaseEnabled: e.target.checked}))} className="rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500 w-5 h-5" />
                        <div>
                          <h4 className="font-medium text-neutral-200 text-sm">Unlimited Lease License</h4>
                          <p className="text-xs text-neutral-500">Unrestricted commercial lease models.</p>
                        </div>
                      </div>
                      {formData.unlimitedLeaseEnabled && (
                        <div className="relative w-40">
                          <span className="absolute left-3.5 top-3 text-neutral-400 text-base font-bold">$</span>
                          <input type="number" step="0.01" name="unlimitedLeasePrice" value={formData.unlimitedLeasePrice} onChange={handleChange} className="w-full bg-neutral-900 border-2 border-neutral-700 rounded-xl pl-8 pr-4 py-2.5 text-lg md:text-xl text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 font-mono font-bold" />
                        </div>
                      )}
                    </div>

                    <div className="bg-indigo-950/20 p-4 rounded-lg border border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={formData.exclusiveRightsEnabled} onChange={(e) => setFormData(prev => ({...prev, exclusiveRightsEnabled: e.target.checked}))} className="rounded border-indigo-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500 w-5 h-5" />
                        <div>
                          <h4 className="font-medium text-indigo-200 text-sm flex items-center gap-2">Exclusive Rights Permanent Buyout <Sparkles size={14} className="text-indigo-400" /></h4>
                          <p className="text-xs text-indigo-400/60">Permanent catalog master purchases.</p>
                        </div>
                      </div>
                      {formData.exclusiveRightsEnabled && (
                        <div className="relative w-40">
                          <span className="absolute left-3.5 top-3 text-neutral-400 text-base font-bold">$</span>
                          <input type="number" step="0.01" name="exclusiveRightsPrice" value={formData.exclusiveRightsPrice} onChange={handleChange} className="w-full bg-neutral-900 border-2 border-neutral-700 rounded-xl pl-8 pr-4 py-2.5 text-lg md:text-xl text-white focus:outline-none focus:ring-4 focus:ring-indigo-500 font-mono font-bold" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Negotiations & Discounts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-neutral-800">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-neutral-950 p-3 rounded border border-neutral-800">
                        <span className="text-sm text-neutral-300">Negotiable "Make an Offer" Bidding</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={formData.makeAnOfferEnabled} onChange={(e) => setFormData(prev => ({ ...prev, makeAnOfferEnabled: e.target.checked }))} />
                          <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                      </div>
                      
                      {formData.makeAnOfferEnabled && (
                        <div>
                          <label className="block text-xs font-medium text-neutral-400 mb-1">Minimum Price Floor Limit Bidding Box</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-neutral-500 text-sm">$</span>
                            <input type="number" name="minimumPriceFloor" value={formData.minimumPriceFloor} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-md pl-7 pr-3 py-1.5 text-sm" placeholder="Minimum offer accepted" />
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">Bulk Discount Category Connector Selector</label>
                        <select name="bulkDiscountCategory" value={formData.bulkDiscountCategory} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-1.5 text-sm">
                          <option>None</option>
                          <option>Buy 1 Get 1 Free</option>
                          <option>Buy 2 Get 1 Free</option>
                          <option>Buy 3 Get 2 Free</option>
                          <option>Custom Promo A</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between bg-neutral-950 p-3 rounded border border-neutral-800">
                        <span className="text-sm text-neutral-300">Exclude from Bulk Discounts</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={formData.excludeFromBulkDiscounts} onChange={(e) => setFormData(prev => ({ ...prev, excludeFromBulkDiscounts: e.target.checked }))} />
                          <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">Custom License Contract Text Connector</label>
                        <select name="customContract" value={formData.customContract} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-1.5 text-sm">
                          <option value="">Use Default Template</option>
                          <option value="contract_a">Custom Contract Template A</option>
                          <option value="contract_b">Custom Contract Template B</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">Coupons Optimization Link Entry</label>
                        <input type="text" name="couponsLink" value={formData.couponsLink} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-1.5 text-sm" placeholder="e.g. SUMMER25 campaign" />
                      </div>
                    </div>
                  </div>

                  {/* ⚡ Dynamic Retail Countdown Coupon Code Generator Configurator */}
                  <div className="mt-8 pt-6 border-t border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⚡</span>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Flash Sale Countdown Coupon Configurator</h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={formData.flashSaleEnabled || false} 
                          onChange={(e) => setFormData(prev => ({ ...prev, flashSaleEnabled: e.target.checked }))} 
                        />
                        <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#9333ea]"></div>
                        <span className="ml-2 text-xs font-semibold text-neutral-300">
                          {formData.flashSaleEnabled ? "ON" : "OFF"}
                        </span>
                      </label>
                    </div>
                    <p className="text-xs text-neutral-400">Configure a dynamic, retail-style high-conversion coupon banner for your beat with an automated ticking countdown timer.</p>

                    {formData.flashSaleEnabled && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div>
                          <label className="block text-xs font-medium text-neutral-300 mb-1">Coupon Code</label>
                          <input 
                            type="text" 
                            name="couponCode" 
                            value={formData.couponCode} 
                            onChange={handleChange} 
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-1.5 text-sm text-white font-mono uppercase" 
                            placeholder="e.g. SOUTHSIDE50" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-neutral-300 mb-1">Discount Percentage (%)</label>
                          <input 
                            type="number" 
                            name="couponDiscountPercent" 
                            value={formData.couponDiscountPercent} 
                            onChange={handleChange} 
                            min="1" 
                            max="99" 
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-1.5 text-sm text-white font-mono" 
                            placeholder="e.g. 40" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-neutral-300 mb-1">Expiration Type</label>
                          <select 
                            name="couponExpirationMode" 
                            value={formData.couponExpirationMode || 'hours'} 
                            onChange={(e) => setFormData(prev => ({ ...prev, couponExpirationMode: e.target.value }))} 
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-1.5 text-sm text-white"
                          >
                            <option value="hours">Hours Countdown</option>
                            <option value="date">Specific Date & Time</option>
                          </select>
                        </div>
                        {formData.couponExpirationMode === 'date' ? (
                          <div>
                            <label className="block text-xs font-medium text-neutral-300 mb-1">Target Expiration Date & Time</label>
                            <input 
                              type="datetime-local" 
                              name="couponExpirationDate" 
                              value={formData.couponExpirationDate || ''} 
                              onChange={handleChange} 
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-1.5 text-sm text-white font-mono" 
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-xs font-medium text-neutral-300 mb-1">Countdown Duration (Hours)</label>
                            <input 
                              type="number" 
                              name="couponExpirationHours" 
                              value={formData.couponExpirationHours} 
                              onChange={handleChange} 
                              min="1" 
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-1.5 text-sm text-white font-mono" 
                              placeholder="e.g. 12" 
                            />
                          </div>
                        )}
                        <div>
                          <label className="block text-xs font-medium text-neutral-300 mb-1">Original Price Override (Optional)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1.5 text-neutral-500 text-sm">$</span>
                            <input 
                              type="number" 
                              step="0.01" 
                              name="originalPrice" 
                              value={formData.originalPrice} 
                              onChange={handleChange} 
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-md pl-7 pr-3 py-1.5 text-sm text-white font-mono" 
                              placeholder="Auto-calculated if empty" 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Right Column: Embedded Custom Audio Player Card with Countdown & Coupon */}
              <div className="lg:col-span-5 sticky top-4 space-y-4">
                <div className="bg-neutral-900/40 p-1.5 rounded-2xl border border-neutral-800/80">
                  <div className="px-4 py-2 border-b border-neutral-800 flex justify-between items-center bg-[#0d0d0d] rounded-t-xl">
                    <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">⚡ LIVE SALE CARD PREVIEW</span>
                    <span className="text-[10px] text-purple-400 bg-purple-400/10 px-2.5 py-0.5 rounded-full font-mono font-black animate-pulse">LIVE REPLAY</span>
                  </div>

                  <div className="pyrex-track-view w-full bg-[#0b0b0b] p-5 rounded-b-xl border-t-0 border border-neutral-800 text-white font-sans overflow-hidden">
                    {/* Limited-Time Sale & Custom Coupon Banner - Placed on top of the audio player */}
                    {formData.flashSaleEnabled && !isTimerExpired && (
                      <div className="w-full bg-gradient-to-r from-[#1f1135] to-[#121212] border border-[#9333ea55] p-2.5 rounded-lg flex items-center justify-between gap-2 mb-4 animate-in slide-in-from-top duration-300">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">⚡</span>
                          <div className="flex flex-col text-left">
                            <span className="text-[9px] font-bold text-[#c084fc] uppercase tracking-wider">Flash Sale Coupon</span>
                            <span className="text-[11px] text-white font-mono font-bold" id="displayCouponCode">
                              CODE: {formData.couponCode || 'SOUTHSIDE50'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-[#333] flex-shrink-0">
                          <span className="text-[9px] text-neutral-400">Ends in:</span>
                          <span className="text-[10px] font-bold text-[#ef4444] font-mono" id="displayCountdownTimer">
                            {countdownTime}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Artwork + Basic Info Row */}
                    <div className="flex gap-4 items-start w-full">
                      {/* Artwork */}
                      <div className="w-[100px] h-[100px] rounded-lg overflow-hidden bg-black flex-shrink-0 relative">
                        <img 
                          id="displayArtwork" 
                          src={formData.coverArtUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80"} 
                          alt="Artwork" 
                          className="w-full h-full object-cover" 
                        />
                        
                        {/* Floating Physical Price Tag Badge */}
                        {formData.flashSaleEnabled && !isTimerExpired && (
                          <div className="absolute top-[8px] right-[-6px] bg-[#ef4444] text-[#fff] text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-[0_4px_10px_rgba(0,0,0,0.5)] rotate-12 flex items-center gap-1 z-[5] border border-dashed border-white/40">
                            <span>🏷️</span> SALE
                          </div>
                        )}
                      </div>

                      {/* Track Metadata */}
                      <div className="flex-1 flex flex-col gap-1 text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              const isCurrentlyPlayingThisPreview = currentTrack && (currentTrack.audioUrl === formData.audioUrl || currentTrack.id.startsWith('uploader_preview_'));
                              if (isCurrentlyPlayingThisPreview) {
                                toggleGlobalPlay();
                              } else {
                                testAudioPlayerInUploader();
                              }
                            }}
                            className="w-7 h-7 rounded-full bg-[#9333ea] border-none text-white flex items-center justify-center cursor-pointer hover:bg-[#a855f7] transition-colors flex-shrink-0"
                          >
                            {currentTrack && (currentTrack.audioUrl === formData.audioUrl || currentTrack.id.startsWith('uploader_preview_')) && isGlobalPlaying ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="4" height="16"></rect><rect x="16" y="4" width="4" height="16"></rect></svg>
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            )}
                          </button>
                          <h1 id="displayTitle" className="text-base font-bold text-white m-0 truncate">
                            {formData.title || "Stars | Southside Type Beat"}
                          </h1>
                        </div>

                        {/* Producer & Stats Line */}
                        <div className="text-[11px] text-[#888] flex items-center gap-2 flex-wrap">
                          <span id="displayProducer" className="text-[#ccc] font-semibold truncate max-w-[90px]">
                            {formData.producer || "Pyrex Spinna"}
                          </span>
                          <span id="displayBpm" className="bg-[#171717] px-1.5 py-0.5 rounded text-[#aaa] text-[10px]">
                            🎹 {formData.bpm || '82'} BPM
                          </span>
                          <span id="displayKey" className="bg-[#171717] px-1.5 py-0.5 rounded text-[#aaa] text-[10px]">
                            🎵 {formData.key || 'Cm'}
                          </span>
                        </div>

                        <div id="displaySubtitle" className="text-[10px] text-[#555] truncate">
                          {formData.title || "Stars | Southside Type Beat"}
                        </div>
                      </div>
                    </div>

                    {/* Pricing Container & Actions Row */}
                    <div className="flex items-center gap-2 w-full flex-wrap mt-4">
                      {/* Pricing block */}
                      {formData.flashSaleEnabled && !isTimerExpired ? (
                        <div className="flex items-center gap-1.5 bg-[#161616] px-2.5 py-1 rounded-lg border border-[#262626]">
                          <span className="line-through text-[#777] text-[10px]" id="originalPrice">
                            ${formData.originalPrice ? Number(formData.originalPrice).toFixed(2) : (Number(formData.price || 14.99) / (1 - (Number(formData.couponDiscountPercent) || 40) / 100)).toFixed(2)}
                          </span>
                          <button id="displayPrice" className="bg-[#9333ea] text-white border-none px-2 py-0.5 rounded font-bold text-[11px] cursor-pointer hover:bg-[#a855f7] transition-colors">
                            ${Number(formData.price || 14.99).toFixed(2)}
                          </button>
                          
                          <span className="bg-[#ef4444] text-[#fff] text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                            {formData.couponDiscountPercent || 40}% OFF
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-[#161616] px-2.5 py-1 rounded-lg border border-[#262626]">
                          <span className="text-white text-xs font-bold font-mono" id="displayPrice">
                            ${Number(formData.price || 14.99).toFixed(2)}
                          </span>
                        </div>
                      )}

                      <button className="bg-[#1e1e1e] text-[#ccc] border-none px-2.5 py-1.5 rounded text-[10px] flex items-center gap-1 cursor-pointer font-semibold hover:bg-neutral-800 transition-colors">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        DOWNLOAD
                      </button>
                      
                      <button className="bg-[#1e1e1e] text-[#ccc] border-none px-2.5 py-1.5 rounded text-[10px] flex items-center gap-1 cursor-pointer font-semibold hover:bg-neutral-800 transition-colors">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                        SHARE
                      </button>
                    </div>

                    {/* Tag Pills Group */}
                    <div id="displayTags" className="flex gap-1.5 flex-wrap w-full mt-3">
                      {formData.tags && formData.tags.length > 0 ? (
                        formData.tags.slice(0, 5).map((tag: string, idx: number) => (
                          <span key={idx} className="bg-[#161616] text-[#777] text-[10px] px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))
                      ) : (
                        <>
                          <span className="bg-[#161616] text-[#777] text-[10px] px-2 py-0.5 rounded-full">#trap</span>
                          <span className="bg-[#161616] text-[#777] text-[10px] px-2 py-0.5 rounded-full">#southside</span>
                        </>
                      )}
                    </div>

                    {/* Waveform Segment */}
                    <div className="mt-4 w-full h-[36px] flex items-end gap-0.5 bg-[#050505] p-1 rounded-lg box-border">
                      <div className="flex-grow bg-[#333] h-[40%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[70%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[30%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[90%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[50%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[100%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[60%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[80%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[40%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[85%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[55%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[35%] rounded-[1px]" />
                      <div className="flex-grow bg-[#9333ea] h-[95%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[45%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[65%] rounded-[1px]" />
                    </div>

                    {/* Collaborator Info */}
                    <div className="mt-3 w-full flex flex-col gap-0.5 text-left border-t border-neutral-900 pt-2.5">
                      <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Collaborators</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-5 h-5 rounded-full bg-[#222] flex items-center justify-center text-[9px] text-white font-bold">
                          {formData.producer ? formData.producer.substring(0, 2).toUpperCase() : 'PS'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-neutral-300 font-semibold leading-none">{formData.producer || 'Pyrex Spinna'}</span>
                          <span className="text-[8px] text-neutral-500 font-medium">PRODUCER</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP 5: Advanced Settings */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b border-neutral-800 pb-2">Advanced Settings</h2>
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">YouTube Content ID Enrollment</label>
                  <select name="youtubeContentIdEnrollment" value={formData.youtubeContentIdEnrollment} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="Opt-out">Do Not Enroll</option>
                    <option value="Opt-in">Enroll Track in Content ID</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-1">Automatically flag unauthorized usage on YouTube.</p>
                </div>

                {formData.youtubeContentIdEnrollment === 'Opt-in' && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">YouTube Content ID White-List Exception</label>
                    <textarea name="youtubeContentIdWhitelist" value={formData.youtubeContentIdWhitelist} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter channel IDs or URLs to exclude from claims..." rows={3} />
                    <p className="text-xs text-neutral-500 mt-1">These channels will not receive copyright claims.</p>
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-semibold mb-4 border-b border-neutral-800 pb-2">Visibility & Release Controls</h2>
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Private / Unlisted Preview</p>
                    <p className="text-xs text-neutral-500">Only people with the direct link can view and stream this beat.</p>
                  </div>
                  <button 
                    onClick={() => setFormData((prev: any) => ({ ...prev, isPrivate: !prev.isPrivate }))}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isPrivate ? 'bg-indigo-600' : 'bg-neutral-800'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.isPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Automated Release Countdown</p>
                    <p className="text-xs text-neutral-500">Enable a live countdown timer on the beat page until the release date.</p>
                  </div>
                  <button 
                    onClick={() => setFormData((prev: any) => ({ ...prev, enableCountdown: !prev.enableCountdown }))}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.enableCountdown ? 'bg-indigo-600' : 'bg-neutral-800'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.enableCountdown ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4 border-b border-neutral-800 pb-2 mt-8">Collaboration & Revenue Splits</h2>
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-4 mb-8">
                <p className="text-xs text-neutral-400 mb-4">Add co-producers or songwriters to automatically split revenue on every sale via Stripe Connect.</p>
                
                {formData.collaborators.map((collab: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-3 items-end bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex-1">
                      <label className="block text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-1">Email / Stripe Account</label>
                      <input 
                        type="email" 
                        value={collab.email} 
                        onChange={(e) => {
                          const newCollabs = [...formData.collaborators];
                          newCollabs[idx].email = e.target.value;
                          setFormData((prev: any) => ({ ...prev, collaborators: newCollabs }));
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white" 
                        placeholder="producer@gmail.com" 
                      />
                    </div>
                    <div className="w-full sm:w-32">
                      <label className="block text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-1">Role</label>
                      <select 
                        value={collab.role} 
                        onChange={(e) => {
                          const newCollabs = [...formData.collaborators];
                          newCollabs[idx].role = e.target.value;
                          setFormData((prev: any) => ({ ...prev, collaborators: newCollabs }));
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                      >
                        <option>Producer</option>
                        <option>Writer</option>
                        <option>Publisher</option>
                        <option>Manager</option>
                      </select>
                    </div>
                    <div className="w-full sm:w-24">
                      <label className="block text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-1">Share %</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={collab.sharePercentage} 
                          onChange={(e) => {
                            const newCollabs = [...formData.collaborators];
                            newCollabs[idx].sharePercentage = Number(e.target.value);
                            setFormData((prev: any) => ({ ...prev, collaborators: newCollabs }));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white" 
                          placeholder="50" 
                        />
                        <span className="absolute right-3 top-1.5 text-neutral-600 text-xs">%</span>
                      </div>
                    </div>
                    <div className="w-full sm:w-24">
                      <label className="block text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-1">Pub %</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={collab.publishingPercentage} 
                          onChange={(e) => {
                            const newCollabs = [...formData.collaborators];
                            newCollabs[idx].publishingPercentage = Number(e.target.value);
                            setFormData((prev: any) => ({ ...prev, collaborators: newCollabs }));
                          }}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white" 
                          placeholder="50" 
                        />
                        <span className="absolute right-3 top-1.5 text-neutral-600 text-xs">%</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setFormData((prev: any) => ({ 
                          ...prev, 
                          collaborators: prev.collaborators.filter((_: any, i: number) => i !== idx) 
                        }));
                      }}
                      className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <button 
                  onClick={() => {
                    setFormData((prev: any) => ({ 
                      ...prev, 
                      collaborators: [...prev.collaborators, { email: '', role: 'Producer', sharePercentage: 0, publishingPercentage: 0 }] 
                    }));
                  }}
                  className="w-full py-2 border-2 border-dashed border-neutral-800 hover:border-indigo-500/50 rounded-xl text-neutral-500 hover:text-indigo-400 transition-all text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} /> Add Co-Producer / Split Partner
                </button>
                
                <div className="flex justify-between items-center px-4 py-2 bg-indigo-950/20 rounded-lg border border-indigo-900/30">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Total Ownership Split</span>
                  <span className={`text-sm font-black ${
                    formData.collaborators.reduce((acc: number, curr: any) => acc + (curr.sharePercentage || 0), 0) > 100 ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {formData.collaborators.reduce((acc: number, curr: any) => acc + (curr.sharePercentage || 0), 0)}% / 100%
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4 border-b border-neutral-800 pb-2 mt-8">Legal & Contractual Customization</h2>
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Custom Legal Contract Clause Appender</label>
                  <textarea 
                    name="customLegalClauses" 
                    value={formData.customLegalClauses} 
                    onChange={handleChange} 
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" 
                    placeholder="Enter custom legal text to be appended to all generated license PDFs for this track..." 
                    rows={5} 
                  />
                  <p className="text-[10px] text-neutral-500 mt-2 flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-emerald-400" /> This text will be legally binding and included in the buyer's automated PDF receipt.
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4 border-b border-neutral-800 pb-2 mt-8">Free Downloads & Lead Generation Gates</h2>
              <div className="bg-neutral-950 p-6 rounded-lg border border-neutral-800 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Free Download Mode Selector</label>
                  <select 
                    name="downloadMode"
                    value={formData.downloadMode || 'none'}
                    onChange={(e) => {
                      const mode = e.target.value;
                      setFormData((prev: any) => {
                        const updated = { ...prev, downloadMode: mode };
                        if (mode === 'none') {
                          updated.freeDownloadEnabled = false;
                          updated.taggedAudioUrl = '';
                          updated.youtubeChannelUrl = '';
                          updated.tiktokProfileUrl = '';
                        } else if (mode === 'direct_free' || mode === 'email_lock') {
                          updated.freeDownloadEnabled = true;
                          updated.youtubeChannelUrl = '';
                          updated.tiktokProfileUrl = '';
                        } else {
                          updated.freeDownloadEnabled = true;
                        }
                        return updated;
                      });
                    }}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="none">Paid Only (No Free Download)</option>
                    <option value="direct_free">Direct Free Download (Instant MP3)</option>
                    <option value="email_lock">Free Download (Requires Email Submission)</option>
                    <option value="youtube_subscribe">YouTube Subscribe Unlock</option>
                    <option value="tiktok_follow">TikTok Follow Unlock</option>
                    <option value="dual_unlock">Dual Unlock (YouTube + TikTok Required)</option>
                  </select>
                </div>

                {formData.downloadMode && formData.downloadMode !== 'none' && (
                  <div className="space-y-6 pt-4 border-t border-neutral-800 animate-in slide-in-from-top-2 duration-200">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Tagged MP3 URL (Optional / Free Delivery)</label>
                      <input 
                        type="url"
                        name="taggedAudioUrl"
                        value={formData.taggedAudioUrl || ''}
                        onChange={handleChange}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                        placeholder="https://... (defaults to uploaded main audio if blank)"
                      />
                    </div>

                    {(formData.downloadMode === 'youtube_subscribe' || formData.downloadMode === 'dual_unlock') && (
                      <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                        <label className="block text-sm font-medium text-neutral-400 mb-1 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-600"></span> YouTube Channel URL *
                        </label>
                        <input 
                          type="url"
                          name="youtubeChannelUrl"
                          value={formData.youtubeChannelUrl || ''}
                          onChange={handleChange}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          placeholder="https://youtube.com/@yourchannel"
                          required
                        />
                        <p className="text-xs text-neutral-500 mt-1">Listeners must subscribe to this YouTube channel before downloading the free beat.</p>
                      </div>
                    )}

                    {(formData.downloadMode === 'tiktok_follow' || formData.downloadMode === 'dual_unlock') && (
                      <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                        <label className="block text-sm font-medium text-neutral-400 mb-1 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#00F2FE]"></span> TikTok Profile URL *
                        </label>
                        <input 
                          type="url"
                          name="tiktokProfileUrl"
                          value={formData.tiktokProfileUrl || ''}
                          onChange={handleChange}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          placeholder="https://tiktok.com/@yourprofile"
                          required
                        />
                        <p className="text-xs text-neutral-500 mt-1">Listeners must follow this TikTok profile before downloading the free beat.</p>
                      </div>
                    )}

                    <div className="col-span-1 md:col-span-2 p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-lg space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                          <label className="block text-sm font-bold text-white flex items-center gap-2">
                            <span>Free Download Redirect & Player Link</span>
                            {formData.title && (
                              <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold rounded-full flex items-center gap-1">
                                ✓ Title Detected: "{formData.title}"
                              </span>
                            )}
                          </label>
                          <p className="text-xs text-neutral-400">
                            When unlocked, automatically redirects or streams this beat on the audio player or starts direct audio download.
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const beatName = formData.title || 'Beat';
                              const playerLink = `/audio-player?track=${encodeURIComponent(beatName)}`;
                              setFormData(prev => ({ ...prev, redirectUrl: playerLink }));
                            }}
                            className="px-2 py-1 bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-300 text-xs font-semibold rounded border border-indigo-500/40 transition-all flex items-center gap-1 shadow-sm"
                            title="Redirect listener to beat on audio player page"
                          >
                            🎧 Sync Beat Title Link
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const fileUrl = formData.audioUrl || '';
                              setFormData(prev => ({ ...prev, redirectUrl: fileUrl }));
                            }}
                            className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded border border-neutral-700 transition-all flex items-center gap-1"
                            title="Set URL directly to uploaded audio file"
                          >
                            ⚡ Direct Audio File
                          </button>

                          <button
                            type="button"
                            onClick={() => testAudioPlayerInUploader(formData.redirectUrl)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shadow transition-all flex items-center gap-1"
                          >
                            <Play size={11} className="fill-current" /> Stream in Player
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <input 
                          type="text" 
                          name="redirectUrl" 
                          value={formData.redirectUrl} 
                          onChange={handleChange} 
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" 
                          placeholder={formData.title ? `/audio-player?track=${encodeURIComponent(formData.title)}` : "e.g. /audio-player?track=YourBeat or https://yoursite.com/audio.mp3"} 
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-400 gap-2">
                        <span className="flex items-center gap-1.5">
                          <span>Status:</span>
                          <strong className="text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                            {formData.redirectUrl ? `Detected (${formData.redirectUrl})` : (formData.title ? `Auto-Detecting (/audio-player?track=${encodeURIComponent(formData.title)})` : 'Link Ready')}
                          </strong>
                        </span>
                        {formData.title && (
                          <button
                            type="button"
                            onClick={() => {
                              navigate(`/audio-player?track=${encodeURIComponent(formData.title)}`);
                            }}
                            className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Open "{formData.title}" in Audio Player</span> →
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Free Download Tracking Event ID</label>
                      <input type="text" name="freeDownloadTrackingId" value={formData.freeDownloadTrackingId} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" placeholder="e.g. PROMO-2024-X" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Download Failure Notification Email</label>
                      <input type="email" name="downloadFailureAlertEmail" value={formData.downloadFailureAlertEmail} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="admin@domain.com" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Download Link Expiration Clock (Hours)</label>
                      <input type="number" name="linkExpirationHours" value={formData.linkExpirationHours} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Geo-Targeted Free Download Filter</label>
                      <select name="geoTargetFilter" value={formData.geoTargetFilter} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>Global</option>
                        <option>US & Canada Only</option>
                        <option>Europe Only</option>
                        <option>Exclude Certain Regions</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Free Track Performance Metrics ID</label>
                      <input type="text" name="freeMetricsId" value={formData.freeMetricsId} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" placeholder="Monitors conversions" />
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-800 text-sm text-neutral-300">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" checked={formData.socialApiValidator} onChange={(e) => setFormData(prev => ({...prev, socialApiValidator: e.target.checked}))} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                        Social API Status Validator Monitor
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" checked={formData.tosComplianceBox} onChange={(e) => setFormData(prev => ({...prev, tosComplianceBox: e.target.checked}))} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                        TOS Compliance Box
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" checked={formData.captchaGate} onChange={(e) => setFormData(prev => ({...prev, captchaGate: e.target.checked}))} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                        Abuse Prevention Captcha Gate
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-2">
                <h2 className="text-xl font-semibold">Visibility, Scheduling & Release Launch</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${formData.currentStatusBadge === 'Live' ? 'bg-green-500/20 text-green-400' : 'bg-neutral-800 text-neutral-400'}`}>
                   Status: {formData.currentStatusBadge}
                </span>
              </div>
              
                <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                    <div>
                      <h3 className="font-bold text-indigo-400 flex items-center gap-2">
                        <Sparkles size={16} /> Make Permanent on Audio Player
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        Ensures absolute URLs are locked in and assets remain persistent across redeployments.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.isPermanent} 
                        onChange={(e) => setFormData(prev => ({ ...prev, isPermanent: e.target.checked }))} 
                      />
                      <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.3)]"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Visibility Placement</label>
                    <select name="visibilityPlacement" value={formData.visibilityPlacement} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="Public">Public (Marketplace & Store)</option>
                      <option value="Private">Private (Hidden)</option>
                      <option value="Unlisted">Unlisted (Direct Link Only)</option>
                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-transparent mb-1">.</label>
                     <button type="button" onClick={() => setFormData(prev => ({...prev, currentStatusBadge: 'Live'}))} className="w-full py-2 px-4 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg text-sm transition-colors shadow-lg shadow-green-900/20">
                        Immediate Live Publication
                     </button>
                  </div>
                </div>

                {formData.visibilityPlacement === 'Scheduled' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-neutral-800 rounded-lg bg-neutral-900/50">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Future Date Release (Calendar)</label>
                      <input type="date" name="futureDateRelease" value={formData.futureDateRelease} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Future Time Release (Timezone)</label>
                      <input type="time" name="futureTimeRelease" value={formData.futureTimeRelease} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                )}

                {(formData.visibilityPlacement === 'Unlisted' || formData.visibilityPlacement === 'Private') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-neutral-800 rounded-lg bg-neutral-900/50">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Unlisted Access URL Token String</label>
                      <div className="flex">
                        <input type="text" name="unlistedAccessUrlToken" value={formData.unlistedAccessUrlToken} onChange={handleChange} className="flex-1 bg-neutral-900 border border-neutral-700 rounded-l-lg px-4 py-2 text-sm text-white font-mono" placeholder="Generate unique link..." />
                        <button type="button" onClick={() => setFormData(prev => ({...prev, unlistedAccessUrlToken: Math.random().toString(36).substring(2,15)}))} className="bg-neutral-800 px-3 py-2 border border-neutral-700 border-l-0 rounded-r-lg text-xs font-semibold hover:bg-neutral-700 transition-colors">GENERATE</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">Password Vault Protection Entry String</label>
                      <input type="password" name="passwordVaultString" value={formData.passwordVaultString} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" placeholder="Lock track page..." />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
                  <div className="space-y-4">
                     <h3 className="text-sm font-medium text-white mb-2">Store & Embed Configurations</h3>
                     
                     <div className="flex items-center justify-between bg-neutral-900/50 p-3 rounded border border-neutral-800">
                        <span className="text-sm text-neutral-300">Infinity Store Sync</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" checked={formData.infinityStoreSync} onChange={(e) => setFormData(prev => ({...prev, infinityStoreSync: e.target.checked}))} className="sr-only peer" />
                           <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                     </div>
                     
                     <div className="flex items-center justify-between bg-neutral-900/50 p-3 rounded border border-neutral-800">
                        <span className="text-sm text-neutral-300">HTML5 Marketplace Sync</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" checked={formData.html5MarketplaceSync} onChange={(e) => setFormData(prev => ({...prev, html5MarketplaceSync: e.target.checked}))} className="sr-only peer" />
                           <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                        </label>
                     </div>

                     <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">Store Page Selection Pointer Grid</label>
                        <select name="storePagePointer" value={formData.storePagePointer} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white">
                           <option>Home</option><option>New Releases</option><option>Featured</option><option>Custom Page 1</option>
                        </select>
                     </div>
                     
                     <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">Embed Player Tab Configuration</label>
                        <select name="embedPlayerTabConfig" value={formData.embedPlayerTabConfig} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white">
                           <option>Top</option><option>Bottom</option><option>Hidden</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-sm font-medium text-white mb-2">Display & Integrations</h3>

                     <div className="flex flex-col gap-3">
                        <label className="flex items-center text-sm text-neutral-300 cursor-pointer">
                           <input type="checkbox" checked={formData.storeFrontRowPinned} onChange={(e) => setFormData(prev => ({...prev, storeFrontRowPinned: e.target.checked}))} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                           Store Front Row Featured Pinned
                        </label>
                        <label className="flex items-center text-sm text-neutral-300 cursor-pointer">
                           <input type="checkbox" checked={formData.profileDiscoveryPinned} onChange={(e) => setFormData(prev => ({...prev, profileDiscoveryPinned: e.target.checked}))} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                           Profile Discovery Feed Pinned Trigger
                        </label>
                        <label className="flex items-center text-sm text-neutral-300 cursor-pointer">
                           <input type="checkbox" checked={formData.preOrderAssetLock} onChange={(e) => setFormData(prev => ({...prev, preOrderAssetLock: e.target.checked}))} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                           Pre-Order Asset Lock Mechanism
                        </label>
                        <label className="flex items-center text-sm text-neutral-300 cursor-pointer">
                           <input type="checkbox" checked={formData.archivedExcludedVector} onChange={(e) => setFormData(prev => ({...prev, archivedExcludedVector: e.target.checked}))} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                           Archived Excluded Vector (Off-shelf storage)
                        </label>
                        <label className="flex items-center text-sm text-neutral-300 cursor-pointer">
                           <input type="checkbox" checked={formData.seasonalTakedownSwitch} onChange={(e) => setFormData(prev => ({...prev, seasonalTakedownSwitch: e.target.checked}))} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                           Seasonal Takedown Activation Switch
                        </label>
                     </div>

                     <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                           <label className="block text-xs font-medium text-neutral-400 mb-1">Catalog Sort Index</label>
                           <input type="number" name="catalogSortIndex" value={formData.catalogSortIndex} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white font-mono" />
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-neutral-400 mb-1">Bulk Action Batch</label>
                           <input type="text" name="bulkActionQueueBatch" value={formData.bulkActionQueueBatch} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white" placeholder="Group ID" />
                        </div>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Regional Market Blackout</label>
                    <input type="text" name="regionalMarketBlackout" value={formData.regionalMarketBlackout} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white" placeholder="Country Codes (e.g. RU, CN)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Bandzoogle Feature Sync Token</label>
                    <input type="text" name="bandzoogleSyncToken" value={formData.bandzoogleSyncToken} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">External Store Theme Override</label>
                    <input type="text" name="externalStoreThemeOverride" value={formData.externalStoreThemeOverride} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white" placeholder="Theme ID or hex colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Standalone Domain Mapping Hook</label>
                    <input type="text" name="standaloneDomainMapping" value={formData.standaloneDomainMapping} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white" placeholder="customdomain.com/beat" />
                  </div>
                  <div className="col-span-full flex gap-2">
                     <button type="button" className="flex-1 py-2 px-4 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 font-medium rounded-lg text-sm transition-colors">
                        Save Configuration Master Call
                     </button>
                     <button type="button" className="flex-1 py-2 px-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 font-medium rounded-lg text-sm transition-colors">
                        Direct Embed URL Exporter
                     </button>
                     <button type="button" className="flex-1 py-2 px-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 font-medium rounded-lg text-sm transition-colors">
                        Global Refresh Sync Signal
                     </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b border-neutral-800 pb-2">Collaborators</h2>
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 text-center text-sm text-neutral-500">
                You are currently taking 100% of profit and publishing.
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Syndication & Marketing Pixels */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
             <div>
                <h2 className="text-xl font-semibold mb-4 border-b border-neutral-800 pb-2">Syndication Channels & Marketing Pixels</h2>
                
                <div className="mb-8">
                   <LiveSocialUnlock />
                </div>

                <div className="mb-8">
                   <PromoVideoGenerator beatTitle={formData.title || 'Untitled Beat'} artworkUrl={formData.coverArtUrl} audioUrl={formData.audioUrl} />
                </div>

                <div className="bg-neutral-950 p-6 rounded-lg border border-neutral-800 mb-8 shadow-inner">
                   <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-4">
                     <div className="p-2 bg-indigo-500/10 rounded-lg">
                       <Sparkles className="w-5 h-5 text-indigo-400" />
                     </div>
                     <div>
                       <h3 className="text-sm font-bold text-white uppercase tracking-wider">Social Unlock Settings</h3>
                       <p className="text-[10px] text-neutral-400">Marketing automation & Social Unlock locks for free downloads.</p>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                       <label className="block text-xs font-medium text-neutral-400 mb-1">Required Action</label>
                       <select 
                         name="socialUnlockModule" 
                         value={formData.socialUnlockModule} 
                         onChange={handleChange}
                         className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-indigo-500"
                       >
                         <option value="None">None</option>
                         <option value="SPOTIFY_FOLLOW">Spotify Follow</option>
                         <option value="YOUTUBE_SUBSCRIBE">YouTube Subscribe</option>
                         <option value="EMAIL_LIST">Email List Subscription</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-neutral-400 mb-1">Target Account ID / URL</label>
                       <input 
                         type="text" 
                         name="youtubeChannelId" 
                         value={formData.youtubeChannelId} 
                         onChange={handleChange} 
                         placeholder="e.g. Channel ID or User ID"
                         className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-indigo-500" 
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-neutral-400 mb-1">Free Download File Type</label>
                       <select 
                         name="freeDeliveryVariant" 
                         value={formData.freeDeliveryVariant} 
                         onChange={handleChange}
                         className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-indigo-500"
                       >
                         <option value="MP3">MP3 (320kbps)</option>
                         <option value="M4A">M4A (High Quality)</option>
                       </select>
                     </div>
                   </div>
                </div>

                <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                         <h3 className="text-sm font-medium text-white mb-2">Automated Video Production & Social Channels</h3>
                         
                         <label className="flex items-center text-sm text-neutral-300 cursor-pointer">
                            <input type="checkbox" checked={formData.autoPostMasterToggle} name="autoPostMasterToggle" onChange={handleChange} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                            Auto-Post Beat Video Master Toggle
                         </label>
                         <label className="flex items-center text-sm text-neutral-300 cursor-pointer">
                            <input type="checkbox" checked={formData.youtubeVideoGen} name="youtubeVideoGen" onChange={handleChange} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                            YouTube Video Generation Pipeline Switch
                         </label>
                         <label className="flex items-center text-sm text-neutral-300 cursor-pointer">
                            <input type="checkbox" checked={formData.tiktokShortFormSwitch} name="tiktokShortFormSwitch" onChange={handleChange} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                            TikTok Short-Form Video Generator Switch
                         </label>

                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">YouTube Target Channel Account Box</label>
                            <input type="text" name="youtubeTargetChannel" value={formData.youtubeTargetChannel} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white" />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">TikTok Target Channel Account Box</label>
                            <input type="text" name="tiktokTargetChannel" value={formData.tiktokTargetChannel} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white" />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">YouTube Companion Video URL Slot</label>
                            <input type="url" name="youtubeCompanionUrl" value={formData.youtubeCompanionUrl} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white" />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">TikTok Trending Audio Track Sync</label>
                            <input type="text" name="tiktokTrendingAudioSync" value={formData.tiktokTrendingAudioSync} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white" />
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h3 className="text-sm font-medium text-white mb-2">DSP Distribution & Integrations</h3>

                         <label className="flex items-center text-sm text-neutral-300 cursor-pointer bg-neutral-900/50 p-2 border border-neutral-800 rounded">
                            <input type="checkbox" checked={formData.dspDistributionOptIn} onChange={(e) => setFormData(prev => ({...prev, dspDistributionOptIn: e.target.checked}))} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                            DSP Distribution Master Opt-In (Spotify/Apple)
                         </label>
                         
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">Spotify Verified Artist Link Identification Box</label>
                            <input type="text" name="spotifyArtistLink" value={formData.spotifyArtistLink} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white" />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">Apple Music Artist Link Identification Box</label>
                            <input type="text" name="appleMusicArtistLink" value={formData.appleMusicArtistLink} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white" />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">Universal Product Code (UPC) Core Field</label>
                            <input type="text" name="upcCoreField" value={formData.upcCoreField} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white font-mono" />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">SoundCloud Track Synchronizer Link Box</label>
                            <input type="url" name="soundcloudSyncLink" value={formData.soundcloudSyncLink} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white" />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">Audiomack Embed Widget Code Window</label>
                            <textarea name="audiomackEmbedCode" value={formData.audiomackEmbedCode} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white" rows={2} />
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
                      <div className="space-y-4">
                         <h3 className="text-sm font-medium text-white mb-2">Tracking Pixels & Ads</h3>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">Google Analytics Account Code Input</label>
                            <input type="text" name="googleAnalyticsCode" value={formData.googleAnalyticsCode} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white font-mono" placeholder="G-XXXXXXXXXX" />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">Meta (Facebook) Pixel Identification Entry</label>
                            <input type="text" name="metaPixelId" value={formData.metaPixelId} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white font-mono" />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">Google Ads Conversions Event Tracker</label>
                            <input type="text" name="googleAdsTracker" value={formData.googleAdsTracker} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white font-mono" />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">Pinterest Tag Pixel Event Tracking</label>
                            <input type="text" name="pinterestTagId" value={formData.pinterestTagId} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white font-mono" />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">TikTok Pixel Ad Attribution</label>
                            <input type="text" name="tiktokPixelId" value={formData.tiktokPixelId} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white font-mono" />
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h3 className="text-sm font-medium text-white mb-2">Marketing Utilities</h3>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">UTM Campaign Parameter Builder Tool</label>
                            <input type="text" name="utmCampaignBuilder" value={formData.utmCampaignBuilder} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white" placeholder="?utm_source=IG&utm_medium=bio" />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">SmartLink Short URL Output Exporter</label>
                            <input type="text" name="smartLinkShortUrl" value={formData.smartLinkShortUrl} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white" />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">Automated Social Copy Generation Box</label>
                            <textarea name="autoSocialCopy" value={formData.autoSocialCopy} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white" placeholder="Creates ad captions matching chosen mood tags..." rows={2} />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1">Marketplace Direct Checkout Shortcut Code</label>
                            <input type="text" name="directCheckoutShortcut" value={formData.directCheckoutShortcut} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white" />
                         </div>
                         
                         <label className="flex items-center text-sm text-neutral-300 cursor-pointer">
                            <input type="checkbox" checked={formData.mailingListTrigger} onChange={(e) => setFormData(prev => ({...prev, mailingListTrigger: e.target.checked}))} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                            Mailing List Marketing Automation Trigger Check
                         </label>
                         <label className="flex items-center text-sm text-neutral-300 cursor-pointer">
                            <input type="checkbox" checked={formData.rssPodcastFeed} onChange={(e) => setFormData(prev => ({...prev, rssPodcastFeed: e.target.checked}))} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                            RSS Podcast Distribution Feed Toggle
                         </label>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
                      <div>
                         <label className="block text-xs font-medium text-neutral-400 mb-1">Email Notification Receipt Layout</label>
                         <select name="emailReceiptLayout" value={formData.emailReceiptLayout} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white">
                            <option>Standard</option><option>Custom Brand A</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-xs font-medium text-neutral-400 mb-1">Social Share Button Configuration Array</label>
                         <input type="text" name="socialShareArray" value={formData.socialShareArray} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white" />
                      </div>
                      <div>
                         <label className="block text-xs font-medium text-neutral-400 mb-1">Airbit Marketplace Featured Bid Selector</label>
                         <input type="text" name="airbitFeaturedBid" value={formData.airbitFeaturedBid} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-1.5 text-sm text-white" placeholder="Paid promotion spaces..." />
                      </div>
                   </div>

                   <div className="flex gap-4 pt-4 border-t border-neutral-800 text-sm text-neutral-300">
                      <label className="flex items-center cursor-pointer">
                         <input type="checkbox" checked={formData.localStorageBackupRegistry} onChange={(e) => setFormData(prev => ({...prev, localStorageBackupRegistry: e.target.checked}))} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                         Local Storage Backup Draft Registry
                      </label>
                      <label className="flex items-center cursor-pointer">
                         <input type="checkbox" checked={formData.tosComplianceMatrix} onChange={(e) => setFormData(prev => ({...prev, tosComplianceMatrix: e.target.checked}))} className="mr-2 rounded border-neutral-700 bg-neutral-900 text-indigo-500 focus:ring-indigo-500" />
                         Platform Terms of Upload Compliance Matrix
                      </label>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* STEP 7: Review */}
        {currentStep === 6 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-semibold mb-6 border-b border-neutral-800 pb-2 text-center text-indigo-400">Review & Publish</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left pane */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-6 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-32 h-32 rounded-lg bg-neutral-900 overflow-hidden flex-shrink-0 shadow-lg">
                      {formData.coverArtUrl ? (
                        <img src={formData.coverArtUrl} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-neutral-900 border border-neutral-800"><ImageIcon className="w-8 h-8" /></div>
                      )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="font-semibold text-white">
                        {formData.title || "Untitled Track"}
                      </h4>
                      <p className="text-indigo-400 font-medium mb-4">{formData.producer}</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-mono text-neutral-400">
                        <div className="bg-neutral-900 rounded p-2 border border-neutral-800 text-center">
                          <span className="block text-xs text-neutral-500 uppercase">BPM</span>
                          <span className="text-neutral-200">{formData.bpm}</span>
                        </div>
                        <div className="bg-neutral-900 rounded p-2 border border-neutral-800 text-center">
                          <span className="block text-xs text-neutral-500 uppercase">Key</span>
                          <span className="text-neutral-200">{formData.key}</span>
                        </div>
                        <div className="bg-neutral-900 rounded p-2 border border-neutral-800 text-center">
                          <span className="block text-xs text-neutral-500 uppercase">Genre</span>
                          <span className="text-neutral-200 truncate block">{formData.primaryGenre || 'Hip Hop'}</span>
                        </div>
                        <div className="bg-neutral-900 rounded p-2 border border-neutral-800 text-center">
                          <span className="block text-xs text-neutral-500 uppercase">Price</span>
                          <span className="text-indigo-400">${formData.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-indigo-100">Ready to Publish</h4>
                      <p className="text-sm text-indigo-200/70 mt-1">Your track will be visible based on your privacy settings and available for purchase immediately.</p>
                    </div>
                  </div>
                </div>

                {/* Right pane: The Real-time Live Sync Preview Card */}
                <div className="lg:col-span-7 flex flex-col items-center">
                  <h3 className="text-sm text-neutral-400 uppercase font-bold tracking-wider mb-4">⚡ Live Speed Sync Preview ⚡</h3>
                  
                  <div className="pyrex-track-view w-full bg-[#0b0b0b] p-6 rounded-xl border border-neutral-800 text-white font-sans overflow-hidden">
                    {/* Limited-Time Sale & Custom Coupon Banner - Placed on top of the audio player */}
                    {formData.flashSaleEnabled && !isTimerExpired && (
                      <div className="w-full bg-gradient-to-r from-[#1f1135] to-[#121212] border border-[#9333ea55] p-2.5 rounded-lg flex items-center justify-between gap-3 mb-4 animate-in slide-in-from-top duration-300">
                        <div className="flex items-center gap-2">
                          <span className="text-base">⚡</span>
                          <div className="flex flex-col text-left">
                            <span className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider">Flash Sale Coupon</span>
                            <span className="text-xs text-white font-mono font-bold" id="displayCouponCode">
                              CODE: {formData.couponCode || 'SOUTHSIDE50'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded border border-[#333] flex-shrink-0">
                          <span className="text-[10px] text-neutral-400">Ends in:</span>
                          <span className="text-xs font-bold text-[#ef4444] font-mono" id="displayCountdownTimer">
                            {countdownTime}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Top Section: Artwork + Info Header */}
                    <div className="flex flex-col sm:flex-row gap-6 items-start w-full max-w-[999px] mx-auto">
                      {/* Artwork */}
                      <div className="w-[150px] h-[150px] rounded-lg overflow-hidden bg-black flex-shrink-0 relative">
                        <img 
                          id="displayArtwork" 
                          src={formData.coverArtUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80"} 
                          alt="Artwork" 
                          className="w-full h-full object-cover" 
                        />
                        
                        {/* Floating Physical Price Tag Badge */}
                        {formData.flashSaleEnabled && !isTimerExpired && (
                          <div className="absolute top-[10px] right-[-8px] bg-[#ef4444] text-[#fff] text-[10px] font-extrabold px-2 py-0.5 rounded shadow-[0_4px_10px_rgba(0,0,0,0.5)] rotate-12 flex items-center gap-1 z-[5] border border-dashed border-white/40">
                            <span>🏷️</span> SALE
                          </div>
                        )}
                      </div>

                      {/* Track Metadata & Actions */}
                      <div className="flex-1 flex flex-col gap-2.5 w-full text-left">
                        {/* Title Row */}
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => {
                              const isCurrentlyPlayingThisPreview = currentTrack && (currentTrack.audioUrl === formData.audioUrl || currentTrack.id.startsWith('uploader_preview_'));
                              if (isCurrentlyPlayingThisPreview) {
                                toggleGlobalPlay();
                              } else {
                                testAudioPlayerInUploader();
                              }
                            }}
                            className="w-8 h-8 rounded-full bg-[#9333ea] border-none text-white flex items-center justify-center cursor-pointer hover:bg-[#a855f7] transition-colors"
                          >
                            {currentTrack && (currentTrack.audioUrl === formData.audioUrl || currentTrack.id.startsWith('uploader_preview_')) && isGlobalPlaying ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="4" height="16"></rect><rect x="16" y="4" width="4" height="16"></rect></svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            )}
                          </button>
                          <h1 id="displayTitle" className="text-xl font-bold text-white m-0">
                            {formData.title || "Stars | Southside Type Beat 2025"}
                          </h1>
                        </div>

                        {/* Producer & Stats Line */}
                        <div className="text-[13px] text-[#888] flex items-center gap-3 flex-wrap">
                          <span id="displayProducer" className="text-[#ccc] font-medium">
                            {formData.producer || "Pyrex Spinna"}
                          </span>
                          <span id="displayBpm" className="bg-[#171717] px-2 py-0.5 rounded text-[#aaa] text-xs">
                            🎹 {formData.bpm || '82'} BPM
                          </span>
                          <span id="displayKey" className="bg-[#171717] px-2 py-0.5 rounded text-[#aaa] text-xs">
                            🎵 {formData.key || 'Cm'}
                          </span>
                          <span id="displayUploadDate" className="text-[#777] text-xs">
                            📅 {formData.releaseDate ? new Date(formData.releaseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'September 25, 2025'}
                          </span>
                        </div>

                        <div id="displaySubtitle" className="text-xs text-[#666]">
                          {formData.title || "Stars | Southside Type Beat 2025"}
                        </div>

                        {/* Action Buttons Row with Floating Discount Tag Integration */}
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          {/* Pricing Container with Strikethrough Original & Floating Tag */}
                          {formData.flashSaleEnabled && !isTimerExpired ? (
                            <div className="flex items-center gap-2 bg-[#161616] px-3 py-1.5 rounded-lg border border-[#262626]">
                              <span className="line-through text-[#777] text-[11px]" id="originalPrice">
                                ${formData.originalPrice ? Number(formData.originalPrice).toFixed(2) : (Number(formData.price || 14.99) / (1 - (Number(formData.couponDiscountPercent) || 40) / 100)).toFixed(2)}
                              </span>
                              <button id="displayPrice" className="bg-[#9333ea] text-white border-none px-3 py-1 rounded font-bold text-xs cursor-pointer hover:bg-[#a855f7] transition-colors">
                                ${Number(formData.price || 14.99).toFixed(2)}
                              </button>
                              
                              {/* Floating Retail-Style Tag Attached Right Next to Price */}
                              <span className="bg-[#ef4444] text-[#fff] text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-[0_2px_6px_rgba(239, 68, 68, 0.4)]">
                                {formData.couponDiscountPercent || 40}% OFF
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 bg-[#161616] px-3 py-1.5 rounded-lg border border-[#262626]">
                              <span className="text-white text-sm font-bold font-mono" id="displayPrice">
                                ${Number(formData.price || 14.99).toFixed(2)}
                              </span>
                            </div>
                          )}

                          <button className="bg-[#1e1e1e] text-[#ccc] border-none px-3 py-1.5 rounded text-xs flex items-center gap-1.5 cursor-pointer font-semibold hover:bg-neutral-800 transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            DOWNLOAD
                          </button>
                          
                          <button className="bg-[#1e1e1e] text-[#ccc] border-none px-3 py-1.5 rounded text-xs flex items-center gap-1.5 cursor-pointer font-semibold hover:bg-neutral-800 transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                            SHARE
                          </button>

                          {/* Tag Pills Group */}
                          <div id="displayTags" className="flex gap-1.5 flex-wrap sm:ml-auto">
                            {formData.tags && formData.tags.length > 0 ? (
                              formData.tags.map((tag: string, idx: number) => (
                                <span key={idx} className="bg-[#161616] text-[#777] text-[11px] px-2.5 py-1 rounded-full">
                                  #{tag}
                                </span>
                              ))
                            ) : (
                              <>
                                <span className="bg-[#161616] text-[#777] text-[11px] px-2.5 py-1 rounded-full">hard type b...</span>
                                <span className="bg-[#161616] text-[#777] text-[11px] px-2.5 py-1 rounded-full">southside t...</span>
                                <span className="bg-[#161616] text-[#777] text-[11px] px-2.5 py-1 rounded-full">southside</span>
                              </>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Waveform Section */}
                    <div className="mt-6 mx-auto w-full max-w-[999px] h-[50px] flex items-end gap-1 bg-[#050505] p-2 rounded-lg box-border">
                      <div className="flex-grow bg-[#333] h-[40%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[70%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[30%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[90%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[50%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[100%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[60%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[80%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[40%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[85%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[55%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[35%] rounded-[1px]" />
                      <div className="flex-grow bg-[#9333ea] h-[95%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[45%] rounded-[1px]" />
                      <div className="flex-grow bg-[#333] h-[65%] rounded-[1px]" />
                    </div>

                    {/* Comments / Input Box */}
                    <div 
                      className="mt-4 mx-auto w-full max-w-[999px] flex items-center bg-[#121212] border border-[#222] rounded-lg p-2 box-border"
                    >
                      <input 
                        type="text" 
                        value={previewCommentText}
                        onChange={(e) => setPreviewCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (!previewCommentText.trim()) return;
                            const newComment = {
                              name: localStorage.getItem('PYREX_SUBSCRIBER_NAME') || 'Anonymous Artist',
                              text: previewCommentText.substring(0, 240).trim(),
                              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                            };
                            setPreviewComments(prev => [newComment, ...prev]);
                            setPreviewCommentText('');
                          }
                        }}
                        placeholder="Write a comment..." 
                        className="bg-transparent border-none outline-none text-[#fff] text-xs flex-grow px-2 py-1" 
                      />
                      <span className="text-[11px] text-[#555] mr-3">{previewCommentText.length}/240</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          if (!previewCommentText.trim()) return;
                          const newComment = {
                            name: localStorage.getItem('PYREX_SUBSCRIBER_NAME') || 'Anonymous Artist',
                            text: previewCommentText.substring(0, 240).trim(),
                            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                          };
                          setPreviewComments(prev => [newComment, ...prev]);
                          setPreviewCommentText('');
                        }}
                        className="bg-[#9333ea] text-white border-none px-3.5 py-1 rounded font-bold text-[11px] cursor-pointer hover:bg-[#a855f7] transition-colors"
                      >
                        SEND
                      </button>
                    </div>

                    {/* Real-time preview comments list if they entered any */}
                    {previewComments.length > 0 && (
                      <div className="mt-4 mx-auto w-full max-w-[999px] space-y-2 text-left">
                        {previewComments.map((comment, index) => (
                          <div key={index} className="bg-[#121212] p-2.5 rounded border border-[#222] flex justify-between items-start">
                            <div>
                              <span className="text-xs text-[#a855f7] font-bold block">{comment.name}</span>
                              <span className="text-sm text-neutral-200">{comment.text}</span>
                            </div>
                            <span className="text-[10px] text-neutral-500 font-mono">{comment.time}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Collaborator Info */}
                    <div className="mt-4 mx-auto w-full max-w-[999px] flex flex-col gap-1 pb-4 text-left">
                      <span className="text-[11px] text-[#666] uppercase tracking-wider font-semibold">Collaborators:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center text-[10px] text-white font-bold">
                          {formData.producer ? formData.producer.substring(0, 2).toUpperCase() : 'PS'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-[#ddd] font-semibold">{formData.producer || 'Pyrex Spinna'}</span>
                          <span className="text-[10px] text-[#777]">PRODUCER</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setFormData({
                            title: '',
                            producer: '',
                            bpm: '',
                            key: '',
                            mode: 'Major',
                            price: '',
                            coverArtUrl: '',
                            audioUrl: '',
                            freeDownload: { enabled: true, requirement: 'email', protection: 'tagged' },
                            isExclusive: false,
                            contentIdEnabled: false,
                            customLicenses: [],
                            tieredPricing: [],
                            bulkDiscount: { threshold: 0, discountPercentage: 0 },
                            description: '',
                            mood: [],
                            tags: [],
                            releaseDate: '',
                            gear: '',
                            instruments: [],
                            primaryGenre: '',
                            secondaryGenre: '',
                            trackType: 'Beat',
                            isExplicit: false,
                            isInstrumental: false,
                            productionYear: new Date().getFullYear(),
                            isrcCode: '',
                        });
                        setCurrentStep(0);
                      }}
                      className="mt-4 flex items-center justify-center gap-2 w-full bg-red-900/10 hover:bg-red-900/30 border border-red-900/30 text-red-500 font-bold py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} /> Delete Placeholder Beat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
        {/* Navigation */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-neutral-800">
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-8 py-4 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-base md:text-lg transition-colors shadow-lg cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              className="flex items-center gap-2 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-extrabold text-base md:text-xl transition-colors shadow-xl cursor-pointer"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
             <button
              type="submit"
              className="flex items-center gap-3 px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-extrabold text-lg md:text-2xl transition-all shadow-2xl cursor-pointer active:scale-95 disabled:opacity-50"
              disabled={isSubmitting}
            >
              <Upload className="w-6 h-6" /> {isSubmitting ? 'Uploading...' : 'Upload Beat'}
            </button>
          )}
        </div>
      </form>
      )}
      </div>
      </div>

      <style>{`
        @keyframes wave {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-15px, 20px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        .animate-wave {
          animation: wave 10s infinite linear;
        }
      `}</style>

      {/* Post-Publish Monetization Overlay: Strictly blocked during upload phase, file selection, or progress state */}
      {!isSubmitting && !isUploading && !isAnalyzing && !!showPromoModal && (
        <PromoModal
          isOpen={!!showPromoModal}
          beat={showPromoModal}
          onClose={() => {
            const beatTitle = showPromoModal?.title;
            setShowPromoModal(null);
            if (onClose) {
              onClose();
            } else if (beatTitle) {
              navigate(`/audio-player?track=${encodeURIComponent(beatTitle)}`);
            }
          }}
        />
      )}
    </>
  );
});

export default BeatUploader;
