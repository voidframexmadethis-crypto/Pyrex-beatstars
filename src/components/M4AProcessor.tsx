import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { Beat } from '../types';

export default function M4AProcessor() {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [details, setDetails] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { addBeat } = useStore();
  const { playTrack } = useAudioPlayer();

  function handleSuccessfulUpload(newAudioUrl: string, file: File) {
    const trackTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const currentFingerprint = `${file.name.toLowerCase().trim()}_${file.size}`;
    const newTrack: Beat = {
      id: Date.now().toString(),
      title: trackTitle,
      audioUrl: newAudioUrl,
      bpm: 140,
      key: "G#",
      producer: "Local Upload",
      price: 0,
      coverArtUrl: '',
      visibility: 'Private',
      trackType: 'Beat',
      fileName: file.name,
      fileSize: file.size,
      fileFingerprint: currentFingerprint,
      licenses: {
        mp3Lease: { enabled: false, price: 0 },
        wavLease: { enabled: false, price: 0 },
        premiumLease: { enabled: false, price: 0 },
        unlimitedLease: { enabled: false, price: 0 },
        exclusive: { enabled: false, price: 0 },
      },
      isLocal: true,
      createdAt: new Date().toISOString()
    };

    addBeat(newTrack);
    playTrack(newTrack);
  }

  useEffect(() => {
    return () => {
      if (blobUrl && blobUrl.startsWith('blob:')) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handleError = () => {
      const err = audioEl.error;
      if (!err) return;
      switch (err.code) {
        case err.MEDIA_ERR_ABORTED:
          console.error("Audio playback aborted by the user.");
          break;
        case err.MEDIA_ERR_NETWORK:
          console.error("Network error while loading audio stream.");
          break;
        case err.MEDIA_ERR_DECODE:
          console.error("Audio decoding failed. The .m4a file might be corrupt or using an unsupported codec (e.g. ALAC).");
          break;
        case err.MEDIA_ERR_SRC_NOT_SUPPORTED:
          console.error("Audio format or MIME type not supported by this browser.");
          break;
        default:
          console.error("Unknown media error occurred:", err);
      }
    };

    audioEl.addEventListener('error', handleError);
    return () => audioEl.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    if (blobUrl && audioRef.current) {
      audioRef.current.load();
    }
  }, [blobUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.m4a')) {
      alert('Please select a valid .m4a audio file.');
      return;
    }

    try {
      console.log("Uploading to Internet Archive...");

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-beat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const { url } = await response.json();

      console.log("Permanent URL generated:", url);
      setBlobUrl(url);

      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setDetails(
        `File: ${file.name} | Size: ${fileSizeMB} MB | Storage: ${url}`
      );

      handleSuccessfulUpload(url, file);

    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to upload the .m4a file.');
    }
  };

  return (
    <div className="mt-8 p-4 bg-zinc-900 border border-zinc-700 rounded-none text-blue-400 font-mono">
      <h3 className="text-white font-bold mb-4 uppercase tracking-widest">M4A Binary Processor</h3>
      <input 
        id="m4a-input"
        type="file" 
        onChange={handleFileChange} 
        accept=".m4a,audio/mp4,audio/x-m4a"
        className="block w-full text-xs text-blue-300 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-900 file:text-white hover:file:bg-blue-800"
      />
      
      {blobUrl && (
        <audio 
          id="store-player" 
          ref={audioRef} 
          src={blobUrl} 
          controls 
          preload="metadata" 
          crossOrigin="anonymous" 
          className="w-full mt-4" 
          onPlay={(e) => {
            if ((window as any).activeAudio && (window as any).activeAudio !== e.currentTarget) {
              (window as any).activeAudio.pause();
              (window as any).activeAudio.currentTime = 0;
            }
            (window as any).activeAudio = e.currentTarget;
          }}
        />
      )}
      
      {details && (
        <div className="mt-4 text-[10px] sm:text-xs text-gray-500 break-words">
          {details}
        </div>
      )}
    </div>
  );
}
