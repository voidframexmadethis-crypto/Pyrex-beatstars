import { useState } from 'react';
import { generateFileHash } from '../utils/audioEngine'; // from your utils

interface BeatUploadState {
  title: string;
  bpm: string;
  musicalKey: string;
  audioFile: File | null;
  stemFile: File | null;
  coverArtFile: File | null;
  coverArtPreview: string | null;
}

export function useBeatUploader(existingHashes: string[]) {
  const [uploadState, setUploadState] = useState<BeatUploadState>({
    title: '',
    bpm: '',
    musicalKey: '',
    audioFile: null,
    stemFile: null,
    coverArtFile: null,
    coverArtPreview: null,
  });

  const [uploadedHashes, setUploadedHashes] = useState<string[]>(existingHashes);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle Cover Art Selection & Persistent Preview
  const handleCoverArtSelect = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setUploadState(prev => ({
      ...prev,
      coverArtFile: file,
      coverArtPreview: previewUrl // Keeps artwork visible in UI state
    }));
  };

  // Handle Beat Submission with Strict Deduplication & Art Retention
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!uploadState.audioFile) {
      setErrorMsg('Primary audio file is required.');
      return;
    }

    try {
      // 1. Generate SHA-256 Hash to check for duplicates
      const fileHash = await generateFileHash(uploadState.audioFile);

      if (uploadedHashes.includes(fileHash)) {
        setErrorMsg('Duplicate Upload Detected: This exact audio file has already been uploaded.');
        return;
      }

      // 2. Build payload preserving cover art and metadata
      const formData = new FormData();
      formData.append('title', uploadState.title);
      formData.append('bpm', uploadState.bpm);
      formData.append('musicalKey', uploadState.musicalKey);
      formData.append('audioFile', uploadState.audioFile);
      if (uploadState.stemFile) formData.append('stemFile', uploadState.stemFile);
      if (uploadState.coverArtFile) {
        formData.append('coverArt', uploadState.coverArtFile); // Preserves artwork in payload
      }
      formData.append('fileHash', fileHash);

      // Simulate backend deployment push
      console.log('Uploading payload with artwork and metadata...', Object.fromEntries(formData));

      // 3. Register hash locally to block subsequent duplicates
      setUploadedHashes(prev => [...prev, fileHash]);
      setSuccessMsg('Beat uploaded successfully with artwork secured!');

    } catch (error) {
      console.error('Upload processing error:', error);
      setErrorMsg('Failed to process upload. Please check network and try again.');
    }
  };

  return {
    uploadState,
    setUploadState,
    handleCoverArtSelect,
    handleUploadSubmit,
    errorMsg,
    successMsg
  };
}
