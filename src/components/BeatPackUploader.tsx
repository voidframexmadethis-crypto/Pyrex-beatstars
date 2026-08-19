import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Image as ImageIcon, 
  Music, 
  CheckCircle2, 
  Trash2, 
  Play, 
  Pause, 
  Plus, 
  Layers, 
  Sparkles, 
  DollarSign, 
  Disc, 
  AlertCircle,
  FileAudio,
  FolderPlus,
  ArrowRight,
  ShieldCheck,
  Archive,
  Link as LinkIcon,
  ArrowUp,
  ArrowDown,
  Radio,
  Share2,
  FileArchive,
  Volume2,
  Search
} from 'lucide-react';
import { Beat, BeatPackData } from '../types';
import { useStore } from '../context/StoreContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { sanitizeTitle } from '../utils/sanitizeTitle';
import trapVol1Art from '../assets/images/trap_vol1_art_1787016520272.jpg';
import trapVol2Art from '../assets/images/trap_vol2_art_1787016554260.jpg';
import trapVol3Art from '../assets/images/trap_vol3_art_1787016564316.jpg';
import trapVol4Art from '../assets/images/trap_vol4_art_1787016573765.jpg';

const STORAGE_KEY = 'pyrex_spinna_beat_packs_data_v1';

// Automatic Mini Pack Classification based on file count
export const processBeatPackUpload = (uploadedFiles: File[] | any[], packDetails: any) => {
  const isMiniPack = uploadedFiles.length === 3;
  
  const newBeatPack = {
    ...packDetails,
    beats: uploadedFiles,
    isMiniPack: isMiniPack,
    isExclusive: isMiniPack, // Automatically flag as exclusive if it's a mini pack
    artworkUrl: packDetails.artworkUrl || '/default-artwork.jpg',
  };

  return newBeatPack;
};

interface BeatPackUploaderProps {
  onSuccess?: (newPack: BeatPackData) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

interface NewPackTrack {
  id: string;
  title: string;
  bpm: number;
  key: string;
  camelotCode: string;
  price: number;
  audioUrl: string;
  directAudioUrl?: string;
  audioFile?: File;
}

export default function BeatPackUploader({ onSuccess, onCancel, onClose }: BeatPackUploaderProps) {
  const { state, addBeatPack, addBeat } = useStore();
  const { playTrack, currentTrack, isPlaying, pauseTrack } = useAudioPlayer();
  const navigate = useNavigate();

  // Core Form State
  const [packTitle, setPackTitle] = useState('Trap Essentials Vol. 5');
  const [subtitle, setSubtitle] = useState('6 Exclusive Beats • Produced by PyrexSpinna');
  const [producer, setProducer] = useState('PyrexSpinna');
  const [bpmKeySummary, setBpmKeySummary] = useState('140 BPM / D Minor');
  const [price, setPrice] = useState(String(state.profile.marketingConfig?.defaultUnlimitedPrice || '99.99'));
  const [description, setDescription] = useState('Complete commercial instrumental collection with WAV stems, untagged audio, and instant licensing.');
  const [genre, setGenre] = useState('Trap');
  const [tags, setTags] = useState('Trap, Hard 808, Dark, Atlanta, Club');
  const [isFreeDownload, setIsFreeDownload] = useState(false);
  
  // Direct Archive File Link & Archive Upload State
  const [directArchiveFileLink, setDirectArchiveFileLink] = useState('https://archive.org/download/pyrex-spinna-vault-2026/TrapEssentialsVol5_FullArchive.zip');
  const [archiveFileName, setArchiveFileName] = useState<string | null>(null);
  const [archiveFileSize, setArchiveFileSize] = useState<string | null>(null);
  const archiveInputRef = useRef<HTMLInputElement>(null);

  // Artwork state
  const [artworkPreview, setArtworkPreview] = useState<string>(trapVol1Art);
  const [artworkUrlInput, setArtworkUrlInput] = useState<string>('');
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const artworkInputRef = useRef<HTMLInputElement>(null);

  // Audio Tracks in Pack (User uploads audio tracks)
  const [packTracks, setPackTracks] = useState<NewPackTrack[]>([]);

  // Direct Audio URL Modal / Popover State
  const [showDirectUrlModal, setShowDirectUrlModal] = useState(false);
  const [newTrackDirectUrl, setNewTrackDirectUrl] = useState('');
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackBpm, setNewTrackBpm] = useState(140);
  const [newTrackKey, setNewTrackKey] = useState('C Minor');

  // Modals & UI helpers
  const [showStorePicker, setShowStorePicker] = useState(false);
  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPack, setCreatedPack] = useState<BeatPackData | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Snippet Sequence Testing in Uploader
  const [testingSequenceIndex, setTestingSequenceIndex] = useState<number | null>(null);

  const audioFilesInputRef = useRef<HTMLInputElement>(null);

  // Handle Artwork File Selection
  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArtworkFile(file);
      const url = URL.createObjectURL(file);
      setArtworkPreview(url);
      setArtworkUrlInput('');
    }
  };

  // Handle Artwork Custom URL Input
  const handleApplyArtworkUrl = (url: string) => {
    setArtworkUrlInput(url);
    if (url.trim()) {
      setArtworkPreview(url.trim());
      setArtworkFile(null);
    }
  };

  // Handle Archive File Upload (.zip, .rar, .7z, .tar.gz)
  const handleArchiveFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchiveFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setArchiveFileSize(`${sizeMb} MB`);
      const fileBlobUrl = URL.createObjectURL(file);
      setDirectArchiveFileLink(fileBlobUrl);
    }
  };

  // Handle Audio Files Upload (Multi-file select)
  const handleAudioFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newTracks: NewPackTrack[] = files.map((file, idx) => {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      // Try to parse BPM from filename (e.g. "Track 140BPM")
      const bpmMatch = file.name.match(/(\d{2,3})\s*bpm/i);
      const parsedBpm = bpmMatch ? parseInt(bpmMatch[1]) : 135 + (idx * 2);

      const blobUrl = URL.createObjectURL(file);
      const config = state.profile.marketingConfig;
      const mp3Price = config?.defaultMp3Price || 29.99;

      return {
        id: `pack-upload-${Date.now()}-${idx}`,
        title: cleanName,
        bpm: parsedBpm,
        key: 'C Minor',
        camelotCode: '5A',
        price: mp3Price,
        audioUrl: blobUrl,
        directAudioUrl: blobUrl,
        audioFile: file
      };
    });

    setPackTracks(prev => [...prev, ...newTracks]);
    if (audioFilesInputRef.current) audioFilesInputRef.current.value = '';
  };

  // Add Track via Direct Audio URL
  const handleAddDirectUrlTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackDirectUrl.trim()) return;

    const trackTitle = newTrackTitle.trim() || `Track ${packTracks.length + 1} (${newTrackBpm} BPM)`;
    const config = state.profile.marketingConfig;
    const mp3Price = config?.defaultMp3Price || 29.99;

    const newTrack: NewPackTrack = {
      id: `url-track-${Date.now()}`,
      title: trackTitle,
      bpm: Number(newTrackBpm) || 140,
      key: newTrackKey.trim() || 'C Minor',
      camelotCode: '5A',
      price: mp3Price,
      audioUrl: newTrackDirectUrl.trim(),
      directAudioUrl: newTrackDirectUrl.trim()
    };

    setPackTracks(prev => [...prev, newTrack]);
    setNewTrackDirectUrl('');
    setNewTrackTitle('');
    setShowDirectUrlModal(false);
  };

  // Select existing track from store inventory
  const handleAddStoreTrack = (beat: Beat) => {
    if (packTracks.some(t => t.id === beat.id || t.title === beat.title)) return;

    const config = state.profile.marketingConfig;
    const mp3Price = config?.defaultMp3Price || 29.99;

    setPackTracks(prev => [
      ...prev,
      {
        id: beat.id,
        title: beat.title,
        bpm: beat.bpm || 130,
        key: beat.key || 'C Minor',
        camelotCode: beat.camelotCode || '5A',
        price: beat.price !== undefined && beat.price !== "" ? beat.price : mp3Price,
        audioUrl: beat.audioUrl,
        directAudioUrl: beat.directAudioUrl || beat.audioUrl
      }
    ]);
  };

  // Remove track from pack
  const handleRemoveTrack = (trackId: string) => {
    setPackTracks(prev => prev.filter(t => t.id !== trackId));
  };

  // Re-order track up in the preview sequence
  const handleMoveTrackUp = (index: number) => {
    if (index <= 0) return;
    setPackTracks(prev => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Re-order track down in the preview sequence
  const handleMoveTrackDown = (index: number) => {
    if (index >= packTracks.length - 1) return;
    setPackTracks(prev => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Update track inline
  const handleUpdateTrack = (id: string, field: keyof NewPackTrack, value: any) => {
    setPackTracks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  // Preview track audio playback
  const handlePreviewTrack = (track: NewPackTrack, index?: number) => {
    if (index !== undefined) {
      setTestingSequenceIndex(index);
    }

    const config = state.profile.marketingConfig;
    const exclusivePrice = config?.defaultExclusivePrice || 999.99;

    const mockBeat: Beat = {
      id: track.id,
      title: track.title,
      producer: producer,
      bpm: track.bpm,
      key: track.key,
      camelotCode: track.camelotCode,
      price: track.price,
      audioUrl: track.audioUrl,
      directAudioUrl: track.directAudioUrl || track.audioUrl,
      coverArtUrl: artworkPreview,
      visibility: 'Public',
      trackType: 'Beat',
      licenses: {
        mp3Lease: { enabled: true, price: track.price },
        wavLease: { enabled: true, price: track.price + 20 },
        premiumLease: { enabled: true, price: track.price + 50 },
        unlimitedLease: { enabled: true, price: track.price + 150 },
        exclusive: { enabled: true, price: exclusivePrice }
      }
    };
    playTrack(mockBeat);
  };

  // One-Click Form Submission with Complete Data Structure & Persistence
  const handleSubmitPack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packTitle.trim()) {
      setErrorNotice('Please provide a Beat Pack Title.');
      return;
    }
    if (packTracks.length === 0) {
      setErrorNotice('Please add at least 1 audio track to your beat pack.');
      return;
    }

    setIsSubmitting(true);
    setErrorNotice(null);

    const config = state.profile.marketingConfig;
    const mp3Default = config?.defaultMp3Price || 29.99;
    const exclusiveDefault = config?.defaultExclusivePrice || 999.99;

    const packId = `pack-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const parsedPrice = parseFloat(price) || config?.defaultUnlimitedPrice || 99.99;
    const effectiveArchiveLink = directArchiveFileLink.trim() || 'https://archive.org/download/pyrex-spinna-vault-2026/TrapEssentialsVol5_FullArchive.zip';
    const effectiveArtwork = artworkPreview || trapVol1Art;
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

    // Convert tracks to full Beat objects with complete pack reference metadata
    const beatsForPack: Beat[] = packTracks.map((t, idx) => ({
      id: `${packId}-beat-${idx + 1}`,
      title: t.title,
      producer: producer.trim() || 'PyrexSpinna',
      bpm: t.bpm || 140,
      key: t.key || 'C Minor',
      camelotCode: t.camelotCode || '5A',
      price: t.price || mp3Default,
      audioUrl: t.audioUrl,
      directAudioUrl: t.directAudioUrl || t.audioUrl,
      coverArtUrl: effectiveArtwork,
      visibility: 'Public',
      trackType: 'Beat',
      packId: packId,
      packTitle: packTitle.trim(),
      isPackTrack: true,
      directArchiveFileLink: effectiveArchiveLink,
      archiveUrl: effectiveArchiveLink,
      licenses: {
        mp3Lease: { enabled: true, price: t.price || mp3Default },
        wavLease: { enabled: true, price: (t.price || mp3Default) + 20 },
        premiumLease: { enabled: true, price: (t.price || mp3Default) + 50 },
        unlimitedLease: { enabled: true, price: (t.price || mp3Default) + 150 },
        exclusive: { enabled: true, price: exclusiveDefault }
      }
    }));

    const audioArray = beatsForPack.map(b => b.audioUrl);
    const previewSequence = beatsForPack.map(b => b.id);

    const packDetails = {
      id: packId,
      title: packTitle.trim(),
      subtitle: subtitle.trim() || `${beatsForPack.length} Exclusive Beats • Produced by ${producer}`,
      description: description.trim(),
      beatCount: beatsForPack.length,
      producer: producer.trim() || 'PyrexSpinna',
      bpmKey: bpmKeySummary.trim() || `${beatsForPack[0]?.bpm || 135} BPM / ${beatsForPack[0]?.key || 'C Minor'}`,
      price: parsedPrice,
      originalValue: parsedPrice * 2.5,
      coverArt: effectiveArtwork,
      artworkUrl: effectiveArtwork,
      archiveZipUrl: effectiveArchiveLink,
      directArchiveFileLink: effectiveArchiveLink,
      audioUrls: audioArray,
      audioArray: audioArray,
      previewSequence: previewSequence,
      genre: genre,
      tags: tagList,
      isFreeDownload: isFreeDownload,
      isLocal: true,
      createdAt: new Date().toISOString()
    };

    const newPack: BeatPackData = processBeatPackUpload(beatsForPack, packDetails);

    // Save to StoreContext (which persists to localStorage & syncs catalog)
    try {
      await addBeatPack(newPack);
    } catch (err) {
      console.warn('Error saving via addBeatPack, falling back to direct localStorage write:', err);
    }

    // Direct localStorage backup guarantee
    try {
      const existingSaved = localStorage.getItem(STORAGE_KEY);
      let currentList: BeatPackData[] = [];
      if (existingSaved) {
        currentList = JSON.parse(existingSaved);
      }
      const updatedList = [newPack, ...currentList.filter(p => p.id !== newPack.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

      // Also ensure pyrex_beats contains individual beats
      const existingBeatsStr = localStorage.getItem('pyrex_beats');
      if (existingBeatsStr) {
        const existingBeats = JSON.parse(existingBeatsStr);
        if (Array.isArray(existingBeats)) {
          const merged = [...existingBeats, ...beatsForPack];
          localStorage.setItem('pyrex_beats', JSON.stringify(merged));
        }
      }
    } catch (e) {
      console.warn('Failed to save to localStorage directly:', e);
    }

    setIsSubmitting(false);
    setCreatedPack(newPack);
    if (onSuccess) onSuccess(newPack);
  };

  // Preset Artwork selector
  const PRESET_ARTWORKS = [
    { label: 'Graffiti Vol 1', art: trapVol1Art },
    { label: 'Street Gold Vol 2', art: trapVol2Art },
    { label: 'Neon Cyber Vol 3', art: trapVol3Art },
    { label: 'Dark Matter Vol 4', art: trapVol4Art },
  ];

  const filteredStoreBeats = state.beats.filter(b => 
    b.title.toLowerCase().includes(storeSearchQuery.toLowerCase()) ||
    (b.key && b.key.toLowerCase().includes(storeSearchQuery.toLowerCase()))
  );

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 animate-in fade-in duration-300">
      
      {/* SUCCESS MODAL AFTER PUBLISHING */}
      {createdPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-[#111118] border border-purple-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-400 shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Beat Pack Published Successfully!</h2>
              <p className="text-sm text-neutral-300">
                <span className="text-white font-bold">{createdPack.title}</span> ({createdPack.beatCount} tracks) and its audio array have been saved to local storage alongside your single beats!
              </p>
            </div>

            <div className="flex items-center gap-4 p-3.5 bg-neutral-900/90 rounded-2xl border border-neutral-800 text-left">
              <img 
                src={createdPack.coverArt} 
                alt={createdPack.title} 
                className="w-16 h-16 rounded-xl object-cover border border-neutral-700 flex-shrink-0"
              />
              <div className="min-w-0 flex-1 space-y-0.5">
                <h4 className="text-sm font-black text-white truncate">{createdPack.title}</h4>
                <p className="text-xs text-neutral-400 font-mono">${createdPack.price.toFixed(2)} • {createdPack.beatCount} Audio Tracks</p>
                <p className="text-xs text-purple-400 font-medium truncate">Archive: {createdPack.directArchiveFileLink || 'Ready for download'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCreatedPack(null);
                  setPackTitle('');
                  setPackTracks([]);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm transition-all"
              >
                Upload Another Pack
              </button>
              <button
                type="button"
                onClick={() => navigate(`/beat-packs?pack=${createdPack.id}`)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
              >
                <span>View Beat Pack</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STREAMLINED ALL-IN-ONE CARD */}
      <form onSubmit={handleSubmitPack} className="bg-[#0e0e14] border border-neutral-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} />
                STREAMLINED ALL-IN-ONE UPLOADER
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Create & Publish Beat Pack
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Upload multi-track audio files, set direct archive download links, configure artwork, and save to local storage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-purple-300 font-bold">
              {packTracks.length} Audio Tracks Ready
            </span>
          </div>
        </div>

        {errorNotice && (
          <div className="p-4 bg-red-950/50 border border-red-800/60 rounded-2xl flex items-center gap-3 text-red-300 text-sm">
            <AlertCircle size={18} className="flex-shrink-0 text-red-400" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* SECTION 1: CORE DETAILS & ARTWORK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Artwork Upload & Presets (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <label className="block text-xs font-black uppercase tracking-wider text-neutral-300">
              Pack Cover Artwork *
            </label>

            <div 
              onClick={() => artworkInputRef.current?.click()}
              className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-neutral-700 hover:border-purple-500 bg-neutral-950 cursor-pointer relative group transition-all flex flex-col items-center justify-center p-4 text-center shadow-inner"
            >
              {artworkPreview ? (
                <>
                  <img 
                    src={artworkPreview} 
                    alt="Artwork Preview" 
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                    <ImageIcon size={32} className="mb-2 text-purple-400" />
                    <span className="text-xs font-bold">Click to upload custom cover</span>
                    <span className="text-[10px] text-neutral-400 mt-1">PNG, JPG, WEBP up to 10MB</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-neutral-400">
                  <Upload size={32} className="mb-2 text-purple-400" />
                  <span className="text-xs font-bold text-neutral-200">Upload Pack Cover</span>
                  <span className="text-[11px] text-neutral-500 mt-1">Drag & Drop or Click to Browse</span>
                </div>
              )}
            </div>

            <input 
              ref={artworkInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleArtworkChange} 
              className="hidden" 
            />

            {/* Direct Artwork URL Input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <LinkIcon size={12} className="text-purple-400" />
                <span>Or Direct Artwork Image Link</span>
              </label>
              <input 
                type="url"
                value={artworkUrlInput}
                onChange={(e) => handleApplyArtworkUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or CDN link"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Quick Artwork Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Or choose preset:</span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_ARTWORKS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setArtworkPreview(preset.art);
                      setArtworkFile(null);
                      setArtworkUrlInput('');
                    }}
                    className={`aspect-square rounded-xl overflow-hidden border transition-all ${
                      artworkPreview === preset.art ? 'border-purple-500 ring-2 ring-purple-500/50 scale-105' : 'border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <img src={preset.art} alt={preset.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pack Metadata Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Pack Title */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-neutral-300 mb-1.5">
                Pack Title *
              </label>
              <input 
                type="text" 
                value={packTitle}
                onChange={(e) => setPackTitle(e.target.value)}
                placeholder="e.g. Trap Essentials Vol. 5"
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 font-bold transition-colors"
              />
            </div>

            {/* Subtitle & Producer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-neutral-300 mb-1.5">
                  Producer Credit
                </label>
                <input 
                  type="text" 
                  value={producer}
                  onChange={(e) => setProducer(e.target.value)}
                  placeholder="PyrexSpinna"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-neutral-300 mb-1.5">
                  Bundle Price ($) *
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-grow">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="99.99"
                      disabled={isFreeDownload}
                      required={!isFreeDownload}
                      className={`w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 font-mono font-bold text-sm transition-colors ${isFreeDownload ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  
                  {/* Free Download Toggle */}
                  <div className="flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFreeDownload(!isFreeDownload);
                        if (!isFreeDownload) setPrice('0.00');
                        else setPrice('99.99');
                      }}
                      className={`h-[42px] px-4 rounded-xl border flex items-center gap-2 transition-all font-black text-[10px] uppercase tracking-wider ${
                        isFreeDownload 
                        ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600'
                      }`}
                    >
                      <Sparkles size={14} className={isFreeDownload ? 'animate-pulse' : ''} />
                      <span>{isFreeDownload ? 'FREE' : 'PAID'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtitle & Tagline */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-neutral-300 mb-1.5">
                Pack Subtitle / Tagline
              </label>
              <input 
                type="text" 
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. 6 Exclusive Beats • Produced by PyrexSpinna"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 text-sm transition-colors"
              />
            </div>

            {/* BPM & Key Summary & Genre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-neutral-300 mb-1.5">
                  BPM & Key Summary
                </label>
                <input 
                  type="text" 
                  value={bpmKeySummary}
                  onChange={(e) => setBpmKeySummary(e.target.value)}
                  placeholder="e.g. 140 BPM / D Minor or 130-145 BPM"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 text-sm font-mono transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-neutral-300 mb-1.5">
                  Primary Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm transition-colors"
                >
                  <option value="Trap">Trap</option>
                  <option value="Drill">Drill</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="Boom Bap">Boom Bap</option>
                  <option value="R&B">R&B</option>
                  <option value="Melodic Trap">Melodic Trap</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-neutral-300 mb-1.5">
                Tags & Moods (Comma separated)
              </label>
              <input 
                type="text" 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Trap, 808, Club, Dark, Atlanta"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 text-xs transition-colors"
              />
            </div>

          </div>
        </div>

        {/* SECTION 2: DIRECT ARCHIVE FILE LINK (.ZIP / .RAR) */}
        <div className="p-5 bg-neutral-950/80 border border-purple-900/30 rounded-2xl space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Archive size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <span>Direct Archive File Link (Full Pack ZIP / Stems)</span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                    BUYER DOWNLOAD
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Direct archive file delivered to buyers containing uncompressed master WAVs, MP3s, and track stems.
                </p>
              </div>
            </div>

            {/* Upload Zip Button */}
            <div>
              <button
                type="button"
                onClick={() => archiveInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <FileArchive size={14} />
                <span>Upload .ZIP Archive</span>
              </button>
              <input 
                ref={archiveInputRef}
                type="file" 
                accept=".zip,.rar,.7z,.tar.gz" 
                onChange={handleArchiveFileUpload} 
                className="hidden" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                <LinkIcon size={14} />
              </span>
              <input 
                type="url"
                value={directArchiveFileLink}
                onChange={(e) => setDirectArchiveFileLink(e.target.value)}
                placeholder="https://archive.org/download/.../FullPack.zip or S3/Dropbox direct link"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm font-mono text-purple-200 placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {archiveFileName && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 p-2 rounded-xl">
                <CheckCircle2 size={14} />
                <span>Selected Archive File: <strong>{archiveFileName}</strong> ({archiveFileSize})</span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: MULTI-TRACK AUDIO SOURCES & PREVIEW SEQUENCE */}
        <div className="space-y-4 pt-4 border-t border-neutral-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Audio Tracks & Preview Sequence ({packTracks.length})</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                  30s AUTO PREVIEW
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Manage audio sources and customize the continuous 30s playback sequence order using the arrow controls.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Multi-Audio Files Upload Button */}
              <button
                type="button"
                onClick={() => audioFilesInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <Plus size={15} />
                <span>Upload Audio Files</span>
              </button>

              {/* Direct Audio URL Track Button */}
              <button
                type="button"
                onClick={() => setShowDirectUrlModal(true)}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <LinkIcon size={14} />
                <span>Add Audio URL</span>
              </button>

              {/* Pick From Store Beats Button */}
              <button
                type="button"
                onClick={() => setShowStorePicker(true)}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-bold transition-all border border-neutral-700 flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <FolderPlus size={15} className="text-neutral-400" />
                <span>Pick Store Beats ({state.beats.length})</span>
              </button>
            </div>

            <input 
              ref={audioFilesInputRef}
              type="file" 
              multiple 
              accept="audio/*,.mp3,.wav,.m4a,.flac" 
              onChange={handleAudioFilesUpload} 
              className="hidden" 
            />
          </div>

          {/* Tracklist Display */}
          {packTracks.length === 0 ? (
            <div 
              onClick={() => audioFilesInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-neutral-800 hover:border-purple-500 rounded-2xl text-center cursor-pointer bg-neutral-950/60 transition-colors"
            >
              <FileAudio size={32} className="mx-auto text-neutral-500 mb-2" />
              <p className="text-sm font-bold text-neutral-300">No tracks added to this beat pack yet</p>
              <p className="text-xs text-neutral-500 mt-1">Click to upload multiple audio files (MP3, WAV, M4A), add direct audio URLs, or pick from your store inventory</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {packTracks.map((track, index) => {
                const isThisPlaying = currentTrack?.id === track.id && isPlaying;

                return (
                  <div 
                    key={track.id}
                    className={`p-3 bg-neutral-950 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition-all ${
                      isThisPlaying ? 'border-purple-500/80 bg-purple-950/20' : 'border-neutral-800/90 hover:border-neutral-700'
                    }`}
                  >
                    {/* Left: Sequence index, Re-order Arrows & Play Preview */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      
                      {/* Sequence Index & Sequence Up/Down */}
                      <div className="flex items-center gap-1">
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveTrackUp(index)}
                            title="Move up in sequence"
                            className="p-1 rounded text-neutral-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
                          >
                            <ArrowUp size={11} />
                          </button>
                          <button
                            type="button"
                            disabled={index === packTracks.length - 1}
                            onClick={() => handleMoveTrackDown(index)}
                            title="Move down in sequence"
                            className="p-1 rounded text-neutral-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
                          >
                            <ArrowDown size={11} />
                          </button>
                        </div>
                        <span className="w-5 text-xs font-mono font-bold text-neutral-400 text-center">
                          #{index + 1}
                        </span>
                      </div>

                      {/* Play Snippet Test Button */}
                      <button
                        type="button"
                        onClick={() => handlePreviewTrack(track, index)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform ${
                          isThisPlaying ? 'bg-purple-500 text-white scale-105 shadow-md shadow-purple-500/40' : 'bg-neutral-800 hover:bg-purple-600 text-white'
                        }`}
                      >
                        {isThisPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                      </button>

                      {/* Track Title Input */}
                      <div className="min-w-0 flex-1">
                        <input 
                          type="text"
                          value={track.title}
                          onChange={(e) => handleUpdateTrack(track.id, 'title', e.target.value)}
                          className="w-full bg-transparent font-bold text-sm text-white focus:bg-neutral-900 px-2 py-1 rounded border border-transparent focus:border-purple-500 outline-none truncate"
                        />
                        <p className="text-[10px] text-neutral-500 font-mono truncate px-2">
                          Source: {track.directAudioUrl || track.audioUrl}
                        </p>
                      </div>
                    </div>

                    {/* Right: BPM, Key, Price & Delete */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <div className="flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded-lg border border-neutral-800 text-xs font-mono text-neutral-300">
                        <input 
                          type="number"
                          value={track.bpm}
                          onChange={(e) => handleUpdateTrack(track.id, 'bpm', parseInt(e.target.value) || 130)}
                          className="w-10 bg-transparent text-white focus:outline-none text-center font-bold"
                        />
                        <span className="text-neutral-500 text-[10px]">BPM</span>
                      </div>

                      <div className="flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded-lg border border-neutral-800 text-xs font-mono text-neutral-300">
                        <input 
                          type="text"
                          value={track.key}
                          onChange={(e) => handleUpdateTrack(track.id, 'key', e.target.value)}
                          className="w-14 bg-transparent text-white focus:outline-none text-center font-bold"
                        />
                      </div>

                      {/* Remove Track Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveTrack(track.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-900 transition-colors"
                        title="Remove track from pack"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 4: INCLUDED COMMERCIAL ASSETS */}
        <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800/80 space-y-2.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <ShieldCheck size={14} />
            Included in this Beat Pack Bundle:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-neutral-300">
            <span className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400 flex-shrink-0" />
              <span>Full Commercial License</span>
            </span>
            <span className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-1.5">
              <Disc size={13} className="text-purple-400 flex-shrink-0" />
              <span>WAV + MP3 Masters</span>
            </span>
            <span className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-1.5">
              <Archive size={13} className="text-cyan-400 flex-shrink-0" />
              <span>Direct ZIP Delivery</span>
            </span>
            <span className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-1.5">
              <Radio size={13} className="text-amber-400 flex-shrink-0" />
              <span>30s Snippet Player Mode</span>
            </span>
          </div>
        </div>

        {/* SECTION 5: BOTTOM ACTION BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-800/80">
          <div className="text-xs text-neutral-400 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
            <span>Audio array, preview sequence, and archive link will be stored automatically.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-sm font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting || packTracks.length === 0}
              className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Sparkles size={18} className="text-yellow-300" />
              <span>{isSubmitting ? 'Saving to Store...' : 'Publish Beat Pack Bundle'}</span>
            </button>
          </div>
        </div>

      </form>

      {/* DIRECT AUDIO URL MODAL */}
      {showDirectUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#12121a] border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <LinkIcon size={16} className="text-purple-400" />
                <span>Add Track via Direct Audio URL</span>
              </h3>
              <button 
                type="button"
                onClick={() => setShowDirectUrlModal(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDirectUrlTrack} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Audio URL (MP3, WAV, M4A) *
                </label>
                <input 
                  type="url"
                  value={newTrackDirectUrl}
                  onChange={(e) => setNewTrackDirectUrl(e.target.value)}
                  placeholder="https://archive.org/download/.../Beat.m4a"
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Track Title
                </label>
                <input 
                  type="text"
                  value={newTrackTitle}
                  onChange={(e) => setNewTrackTitle(e.target.value)}
                  placeholder="e.g. Midnight Heat 140BPM D Minor"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    BPM
                  </label>
                  <input 
                    type="number"
                    value={newTrackBpm}
                    onChange={(e) => setNewTrackBpm(parseInt(e.target.value) || 140)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Musical Key
                  </label>
                  <input 
                    type="text"
                    value={newTrackKey}
                    onChange={(e) => setNewTrackKey(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDirectUrlModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  Add Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STORE BEATS PICKER MODAL */}
      {showStorePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-[#12121a] border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">Select Beats from Store Library</h3>
                <p className="text-xs text-neutral-400">Add single beats into this bundle pack</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowStorePicker(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Search filter input */}
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input 
                type="text"
                value={storeSearchQuery}
                onChange={(e) => setStoreSearchQuery(e.target.value)}
                placeholder="Search beats by title or key..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {filteredStoreBeats.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  No matching beats found in library
                </div>
              ) : (
                filteredStoreBeats.map((beat) => {
                  const isAlreadyAdded = packTracks.some(t => t.id === beat.id || t.title === beat.title);

                  return (
                    <div 
                      key={beat.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isAlreadyAdded ? 'bg-neutral-900/50 border-neutral-800 opacity-60' : 'bg-neutral-900 border-neutral-800 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={beat.coverArtUrl || trapVol1Art} 
                          alt={beat.title} 
                          className="w-10 h-10 rounded-lg object-cover border border-neutral-800 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{sanitizeTitle(beat.title)}</h4>
                          <p className="text-xs text-neutral-400 font-mono">{beat.bpm} BPM • {beat.key || 'N/A'}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isAlreadyAdded}
                        onClick={() => handleAddStoreTrack(beat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isAlreadyAdded 
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow active:scale-95 cursor-pointer'
                        }`}
                      >
                        {isAlreadyAdded ? 'Added' : 'Add to Pack'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 border-t border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowStorePicker(false)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
