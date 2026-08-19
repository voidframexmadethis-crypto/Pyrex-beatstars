import React, { useState } from 'react';
import { Share2, Copy, Twitter, Facebook, X as CloseIcon, Smartphone, Check, Youtube, UploadCloud } from 'lucide-react';
import { Beat } from '../types';
import { useAuth } from '../context/AuthContext';
import { PromoVideoGenerator } from './PromoVideoGenerator';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  beat: Beat | null;
}

export default function PromoModal({ isOpen, onClose, beat }: PromoModalProps) {
  const [copied, setCopied] = useState(false);
  const [isYoutubeLoading, setIsYoutubeLoading] = useState(false);
  const [youtubeSuccess, setYoutubeSuccess] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  const { youtubeToken, signInForYouTube } = useAuth();

  if (!isOpen || !beat) return null;

  const storeTrackLink = `${window.location.origin}/player/${beat.id}`;
  
  const caption = `🔥 NEW HEAT ALERT: "${beat.title}" 🎹 Produced by Pyrex spinna\nListen & Download M4A now: ${storeTrackLink}\n#BeatsForSale #ProducerCommunity #PyrexSpinna #HipHopBeats`;

  const encodedCaption = encodeURIComponent(caption);
  const encodedLink = encodeURIComponent(storeTrackLink);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `New Beat: ${beat.title}`,
          text: caption,
          url: storeTrackLink
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert("Native Web Share is not supported on this browser.");
    }
  };

  const handleYoutubePublish = async () => {
    try {
      setIsYoutubeLoading(true);
      let token = youtubeToken;
      if (!token) {
        token = await signInForYouTube();
        if (!token) {
          setIsYoutubeLoading(false);
          return;
        }
      }

      if (!videoFile) {
        alert("Please attach a video file first to publish to YouTube Shorts.");
        setIsYoutubeLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', `${beat.title} - Pyrex spinna (Type Beat 2026) #Shorts`);
      formData.append('description', `Listen and download full .m4a beat here: ${storeTrackLink}\n\n#typebeat #beats`);
      formData.append('token', token);

      const res = await fetch('/api/upload-to-youtube', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload to YouTube');
      }
      setYoutubeSuccess(true);
    } catch (error: any) {
      console.error(error);
      alert(`YouTube Upload Failed: ${error.message}`);
    } finally {
      setIsYoutubeLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111113] border border-[#222226] p-8 max-w-lg w-full rounded-2xl shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="bg-red-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Beat Published!</h2>
          <p className="text-gray-400">Your track is live. Launch your social campaign instantly.</p>
        </div>

        <div className="bg-[#151518] p-4 rounded-xl border border-[#222226] mb-6">
          <p className="text-gray-300 font-mono text-sm whitespace-pre-wrap">{caption}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 bg-[#222226] hover:bg-[#2a2a2e] text-white py-3 px-4 rounded-xl font-medium transition-colors"
          >
            {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Copied!' : 'Copy Caption & Link'}
          </button>
          
          <button
            onClick={handleWebShare}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white py-3 px-4 rounded-xl font-medium transition-colors"
          >
            <Smartphone className="w-5 h-5" />
            Native Share (Mobile)
          </button>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodedCaption}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1a91da] text-white py-3 px-4 rounded-xl font-medium transition-colors"
          >
            <Twitter className="w-5 h-5" />
            Share to X
          </a>
          
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white py-3 px-4 rounded-xl font-medium transition-colors"
          >
            <Facebook className="w-5 h-5" />
            Share to Facebook
          </a>
        </div>

        <div className="bg-[#151518] p-5 rounded-xl border border-red-900/40 mb-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Youtube className="w-6 h-6 text-red-500" />
            <h3 className="text-white font-bold">Free YouTube Shorts Publisher</h3>
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm text-gray-400">Attach generated video or clip to publish:</label>
            <input 
              type="file" 
              accept="video/*" 
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-500/10 file:text-red-500 hover:file:bg-red-500/20"
            />
          </div>

          <button
            onClick={handleYoutubePublish}
            disabled={isYoutubeLoading || youtubeSuccess}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${
              youtubeSuccess 
                ? 'bg-green-600 hover:bg-green-500 text-white' 
                : 'bg-red-600 hover:bg-red-500 text-white disabled:bg-gray-800 disabled:text-gray-500'
            }`}
          >
            {isYoutubeLoading ? (
              <span className="animate-spin">⏳</span>
            ) : youtubeSuccess ? (
              <Check className="w-5 h-5" />
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
            {isYoutubeLoading 
              ? 'Publishing to YouTube...' 
              : youtubeSuccess 
                ? 'Published Successfully!' 
                : 'Publish Short to YouTube'
            }
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-transparent hover:bg-[#1a1a1f] text-gray-400 hover:text-white py-3 px-4 rounded-xl font-medium transition-colors border border-[#222226]"
        >
          Done / Skip to Store
        </button>
      </div>
    </div>
  );
}
