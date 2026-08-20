export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface MarketingConfig {
  autoPostVideo: boolean;
  autoPostMasterToggle?: boolean;
  youtubeVideoGen: boolean;
  tiktokVideoGen: boolean;
  tiktokShortFormSwitch?: boolean;
  youtubeTargetChannel: string;
  tiktokTargetChannel: string;
  youtubeCompanionUrl: string;
  soundcloudSyncLink: string;
  audiomackEmbedCode: string;
  tiktokTrendingAudioSync: string;
  dspDistributionOptIn: boolean;
  spotifyArtistLink: string;
  appleMusicArtistLink: string;
  upcCoreField: string;
  googleAnalyticsCode: string;
  metaPixelId: string;
  googleAdsTracker: string;
  pinterestTagId: string;
  tiktokPixelId: string;
  utmCampaignBuilder: string;
  smartLinkShortUrl: string;
  autoSocialCopy: string;
  directCheckoutShortcut: string;
  emailReceiptLayout: 'Standard' | 'Compact' | 'Custom';
  mailingListTrigger: boolean;
  socialShareArray: string;
  rssPodcastFeed: boolean;
  airbitFeaturedBid: string;
  localStorageBackupRegistry: boolean;
  tosComplianceMatrix: boolean;
  // Live Custom Pricing State
  defaultMp3Price?: number;
  defaultWavPrice?: number;
  defaultStemsPrice?: number;
  defaultUnlimitedPrice?: number;
  defaultExclusivePrice?: number;
  defaultVocalMixPrice?: number;
  defaultStemMixPrice?: number;
  defaultExecutiveSessionPrice?: number;
}

export interface Profile {
  name: string;
  bio: string;
  avatarUrl: string;
  bannerUrl?: string;
  voiceTagUrl?: string;
  paypalEmail?: string;
  socialLinks: SocialLink[];
  marketingConfig?: MarketingConfig;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  videoId: string;
}

export interface License {
  type: string;
  price: number;
  agreementUrl?: string;
}

export interface Tier {
  level: string;
  price: number;
}

export interface BulkDiscount {
  threshold: number;
  discountPercentage: number;
}

export interface SocialUnlock {
  id: string;
  requiredAction: 'SPOTIFY_FOLLOW' | 'YOUTUBE_SUBSCRIBE' | 'EMAIL_LIST';
  targetAccountId: string;
  freeDownloadFileType: 'MP3' | 'M4A';
}

export interface PublishingMetadata {
  ipiNumber: string;
  proName: 'ASCAP' | 'BMI' | 'PRS' | 'SESAC' | 'SOCAN' | 'None';
  writerSplit: number;
  publisherSplit: number;
  isRegistered: boolean;
  registrationId?: string;
  isrc?: string;
  iswc?: string;
}

export interface Beat {
  fileName?: string;
  fileSize?: number;
  fileLastModified?: number;
  fileSignature?: string;
  fileFingerprint?: string;
  isPlaceholder?: boolean;
  id: string;
  title: string;
  producer: string;
  bpm: number;
  key: string;
  camelotCode?: string;
  mode?: string;
  price: number;
  priceMp3?: number;
  priceWav?: number;
  coverArtUrl: string;
  artworkUrl?: string;
  artwork?: string; // New: direct artwork property
  coverUrl?: string; // New: direct cover property
  imageUrl?: string; // New: direct image property
  previewUrl?: string;
  directAudioUrl?: string; // External direct streaming URL (Internet Archive / S3)
  backupArtworkUrl?: string; // Fallback cloud graphic link
  r2ArtworkUrl?: string; // Ultra-fast CDN Fallback graphic link
  audioUrl: string; // The URL to play (tagged MP3)
  backupAudioUrl?: string; // Fallback cloud stream link
  archiveUrl?: string; // Permanent Internet Archive mirror link
  r2AudioUrl?: string; // Ultra-fast CDN Fallback stream link
  untaggedM4aUrl?: string; // High quality untagged M4A
  stemsZipUrl?: string; // ZIP file with stems
  watermarkedAudioUrl?: string; // Watermarked version for preview
  storageClusterNode?: string; // Infinite cluster mass storage shard partition
  visibility: 'Public' | 'Private' | 'Unlisted';
  trackType: 'Beat' | 'Chorus' | 'Song' | 'Top Line' | 'Vocals';
  flashSaleEnabled?: boolean;
  couponCode?: string;
  couponDiscountPercent?: number;
  couponExpirationMode?: string;
  couponExpirationDate?: string;
  couponExpirationHours?: number;
  originalPrice?: number;
  excludeFromBulkDiscounts?: boolean;
  licenses?: {
    mp3Lease: { enabled: boolean; price: number };
    wavLease: { enabled: boolean; price: number };
    premiumLease: { enabled: boolean; price: number };
    unlimitedLease: { enabled: boolean; price: number };
    exclusive: { enabled: boolean; price: number };
  };
  customLicenses?: License[];
  tieredPricing?: Tier[];
  bulkDiscount?: BulkDiscount;
  freeDownload?: { 
    enabled: boolean; 
    requirement: 'email' | 'social' | 'none';
    protection: 'tagged' | 'untagged';
    socialGate?: 'youtube' | 'soundcloud' | 'profile';
    redirectUrl?: string;
  };
  downloadMode?: string;
  isFreeDownload?: boolean;
  requireSocialUnlock?: boolean;
  youtubeChannelUrl?: string;
  tiktokProfileUrl?: string;
  taggedAudioUrl?: string;
  socialUnlocks?: SocialUnlock[];
  redirectUrl?: string;
  isExclusive?: boolean;
  contentIdEnabled?: boolean;
  likes?: number;
  dislikes?: number;
  plays?: number;
  shares?: number;
  purchases?: number;
  earnings?: number;
  downloads?: number;
  mood?: string[];
  moods?: string[];
  energyLevel?: 'Low' | 'Medium' | 'High';
  isAIFree?: boolean;
  isVerified?: boolean;
  tags?: string[];
  isLocal?: boolean;
  isHumanUploaded?: boolean;
  userId?: string;
  createdAt?: any;
  updatedAt?: any;
  releaseDate?: string;
  gear?: string;
  instruments?: string[];
  primaryGenre?: string;
  secondaryGenre?: string;
  isExplicit?: boolean;
  isInstrumental?: boolean;
  fileHash?: string;
  usedSamples?: boolean;
  sampleName?: string;
  sampleSource?: string;
  collaboratorsList?: { email: string; sharePercentage: number; publishingPercentage: number; role?: string }[];
  youtubeVideoUrl?: string;
  productionYear?: number;
  duration?: number; // Duration in seconds
  publishing?: PublishingMetadata;
  isrcCode?: string;
  iswcCode?: string;
  upcCode?: string;
  publisher?: string;
  composers?: string;
  proIpi?: string;
  copyrightLine?: string;
  licenseStatus?: 'active' | 'revoked' | 'flagged';
  streamingToken?: string;
  isPermanent?: boolean;
  packId?: string;
  packTitle?: string;
  isPackTrack?: boolean;
  directArchiveFileLink?: string;
}

export interface BeatPackData {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  beatCount: number;
  producer: string;
  bpmKey: string;
  price: number;
  originalValue?: number;
  coverArt: string;
  artworkUrl?: string;
  isMiniPack?: boolean;
  isExclusive?: boolean;
  archiveZipUrl?: string; // Direct download archive file link (ZIP / Full Audio Stems)
  directArchiveFileLink?: string; // Dedicated direct archive mirror link
  audioUrls?: string[]; // Array of audio stream URLs
  audioArray?: string[]; // Multi-track audio sources
  previewSequence?: string[]; // Array of track IDs or audio URLs for continuous 30-sec snippet playback order
  beats: Beat[]; // Full collection of individual child beats
  genre?: string;
  tags?: string[];
  createdAt?: string;
  isLocal?: boolean;
  isFreeDownload?: boolean;
  licenses?: {
    standardPack?: { enabled: boolean; price: number };
    unlimitedPack?: { enabled: boolean; price: number };
    exclusivePack?: { enabled: boolean; price: number };
  };
}

export interface FlashSaleAnnouncement {
  id: string;
  title: string;
  message: string;
  targetId: string; // ID of the beat or beat pack on sale
  targetType: 'beat' | 'pack';
  discountPrice: number;
  expiresAt: string; // ISO date string
  isActive: boolean;
}

export interface PrivateVault {
  id: string;
  clientName: string;
  passcode: string;
  beatIds: string[];
  expiresAt: string;
}

export type MarketingErrorCode = 
  | 'AD_BLOCKER_DETECTED' 
  | 'API_RATE_LIMIT_EXCEEDED' 
  | 'OAUTH_POPUP_BLOCKED' 
  | 'UNKNOWN_MARKETING_ERROR';

export interface MarketingErrorContext {
  componentName: string;
  context?: Record<string, any>;
  onEmailCaptureFallback?: () => void;
  onBypassSocialCheck?: () => void;
  onCheckoutFallback?: () => void;
}

export interface Analytics {
  siteVisits: number;
  uniqueVisitors: number;
  totalPlays: number;
  totalShares: number;
  downloads: number;
  totalEarnings?: number;
  platformFees?: number;
}

export interface Subscriber {
  email: string;
  subscribedAt: string;
}

export interface VocalMatchResult {
  trackId: string;
  confidence: number;
  reason: string;
  matchType: 'Voice' | 'Mood' | 'Genre';
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId?: string;
}

export interface UserSubscription {
  userId: string;
  tierId: string;
  status: 'active' | 'canceled' | 'past_due';
  expiresAt: string;
}

export interface DSPDistributionStatus {
  trackId: string;
  platforms: {
    spotify: 'pending' | 'published' | 'failed';
    apple: 'pending' | 'published' | 'failed';
    amazon: 'pending' | 'published' | 'failed';
  };
  upc?: string;
  isrc?: string;
}

export interface FanAnalytics {
  userId: string;
  email: string;
  totalSpent: number;
  totalStreams: number;
  loyaltyScore: number;
  topGenres: string[];
  lastPurchaseDate: string;
}

export interface MerchItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'Clothing' | 'Hardware' | 'Accessories' | 'Other';
  stock: number;
  variants?: string[];
}

export interface ExclusiveBid {
  id: string;
  trackId: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface TaxFormStatus {
  userId: string;
  formType: 'W-9' | 'W-8BEN';
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
}

export interface TourRoute {
  id: string;
  city: string;
  country: string;
  fanCount: number;
  recommendedVenueSize: string;
  potentialRevenue: number;
  lat: number;
  lng: number;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  expiresAt?: string;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
}

export interface StoreState {
  profile: Profile;
  videos: YouTubeVideo[];
  beats: Beat[];
  beatPacks?: BeatPackData[];
  vaults?: PrivateVault[];
  archivedBeats: Beat[];
  subscribers?: Subscriber[];
  analytics: Analytics;
  merch?: MerchItem[];
  promoCodes?: PromoCode[];
  bids?: ExclusiveBid[];
  subscriptions?: SubscriptionTier[];
  isLoading: boolean;
  error?: { message: string; type: 'error' | 'warning' | 'info' } | null;
}

declare global {
  interface Window {
    puter?: any;
    saveBeat?: (file: File) => void;
    hardcodeBeatToBrowser?: (title: string, audioFile: File | Blob) => Promise<boolean>;
    getHardcodedBeats?: () => Promise<any[]>;
    resolvePyrexSpinnaAudioStream?: (trackObject: any) => string;
    PyrexSpinnaMasterAudio?: any;
    PyrexSpinnaPlayer?: {
      playBeat: (url: string) => void;
      pause: () => void;
      setVolume: (val: number) => void;
      seek?: (time: number) => void;
      play?: (target?: any) => void;
      getStats?: () => any;
    };
  }
}

