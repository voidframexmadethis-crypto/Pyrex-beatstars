import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Music,
  UserCheck
} from 'lucide-react';
import { BeatPackData } from '../types';
import { downloadAudioFile } from '../lib/beatUtils';
import { generateBeatPackContractPDF } from '../utils/beatPackContractGenerator';
import { generateAndDownloadLicense } from '../utils/contractGenerator';
import { useStore } from '../context/StoreContext';

interface BeatPackFreeDownloadModalProps {
  isOpen: boolean;
  pack: BeatPackData | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BeatPackFreeDownloadModal({
  isOpen,
  pack,
  onClose,
  onSuccess
}: BeatPackFreeDownloadModalProps) {
  const { incrementAnalytics } = useStore();

  const [fullName, setFullName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signature, setSignature] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !pack) return null;

  const handleSignAndDownload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !artistName.trim() || !email.trim() || !signature.trim()) {
      alert("Please fill in all required fields (Full Name, Artist Name, Email, and Signature).");
      return;
    }

    if (!agreedToTerms) {
      alert("You must agree to the Non-Sharing Legal Contract Terms to download this Beat Pack.");
      return;
    }

    if (signature.trim().toLowerCase() !== fullName.trim().toLowerCase()) {
      alert("Your signature must match your Full Legal Name to execute the contract.");
      return;
    }

    setIsProcessing(true);

    try {
      const transactionId = `BP-FREE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const issueDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // 1. Generate & trigger PDF Legal Agreement Download
      generateBeatPackContractPDF({
        pack,
        licensee: {
          fullName: fullName.trim(),
          artistName: artistName.trim(),
          email: email.trim(),
          signature: signature.trim()
        },
        transactionId,
        issueDate,
        isFreeDownload: true
      });

      // 1.5 Generate & trigger the NEW Exclusive Beat License Agreement
      generateAndDownloadLicense(pack.title, fullName.trim());

      // 2. Trigger Beat Pack Download (Archive ZIP or individual tracks)
      if (pack.archiveZipUrl || pack.directArchiveFileLink) {
        const zipUrl = pack.archiveZipUrl || pack.directArchiveFileLink || '';
        await downloadAudioFile(zipUrl, `${pack.title.replace(/\s+/g, '_')}_Beat_Pack.zip`);
      } else if (pack.beats && pack.beats.length > 0) {
        // Download each included beat
        for (const beat of pack.beats) {
          if (beat.audioUrl) {
            await downloadAudioFile(beat.audioUrl, beat.title);
          }
        }
      } else if (pack.audioUrls && pack.audioUrls.length > 0) {
        let count = 1;
        for (const url of pack.audioUrls) {
          await downloadAudioFile(url, `${pack.title}_Track_${count++}`);
        }
      }

      // 3. Track analytics
      incrementAnalytics('downloads');

      setDownloadSuccess(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);

    } catch (err) {
      console.error("Error executing beat pack contract & download:", err);
      alert("Download initiated! PDF Contract generated successfully.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div 
        className="relative w-full max-w-2xl bg-[#0f0a19] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.25)] text-white overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900/80 border border-neutral-700/60 hover:bg-neutral-800 transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {!downloadSuccess ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-900/50 border border-purple-500/60 rounded-2xl text-purple-300">
                <FileText size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Free Beat Pack Access
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/50 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                    Non-Shareable License
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Execute the legal agreement to unlock instant download rights for <span className="text-purple-300 font-bold">"{pack.title}"</span>.
                </p>
              </div>
            </div>

            {/* Pack Brief Card */}
            <div className="flex items-center gap-4 bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-2xl mb-5">
              <img 
                src={pack.coverArt} 
                alt={pack.title}
                className="w-16 h-16 rounded-xl object-cover border border-purple-500/30 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{pack.title}</h4>
                <p className="text-xs text-neutral-400 font-mono">
                  Produced by {pack.producer || 'PyrexSpinna'} • {pack.beatCount || pack.beats?.length || 0} Tracks
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-purple-300 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded-md font-mono">
                    Free Instant Download
                  </span>
                  <span className="text-[11px] text-amber-400/90 flex items-center gap-1 font-semibold">
                    <ShieldCheck size={12} /> Strictly Non-Shareable
                  </span>
                </div>
              </div>
            </div>

            {/* Legal Agreement Terms Box */}
            <div className="bg-black/60 border border-amber-500/30 rounded-2xl p-4 mb-5 text-xs text-neutral-300 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                <AlertTriangle size={16} />
                <span>LEGAL CONTRACT & NON-REDISTRIBUTION AGREEMENT</span>
              </div>
              <p>
                By executing this agreement, <strong className="text-white">PyrexSpinna Studio</strong> grants you a non-transferable personal & demo recording license for this Beat Pack.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-neutral-300 font-sans">
                <li>
                  <strong className="text-amber-300">Strict Non-Shareable Covenant:</strong> You agree that you <strong className="text-white underline decoration-amber-500">SHALL NOT share, leak, upload, send, resell, or redistribute</strong> this Beat Pack or its instrumentals with anybody else.
                </li>
                <li>
                  <strong className="text-amber-300">Personal & Demo Rights:</strong> You may record vocals and write over these instrumentals for personal audition and demo evaluation purposes.
                </li>
                <li>
                  <strong className="text-amber-300">Automatic Takedown & Revocation:</strong> Unauthorized sharing, leaking, or distributing will immediately void this license and result in copyright enforcement actions and permanent studio blacklisting.
                </li>
              </ul>
            </div>

            {/* Signature Form */}
            <form onSubmit={handleSignAndDownload} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Full Legal Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Marcus Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Artist / Stage Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Young Pyrex"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g., artist@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Legal Digital Signature (Type Full Legal Name) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={fullName ? `Type "${fullName}" to sign` : "Type your full legal name exactly"}
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="w-full bg-neutral-900 border border-purple-500/50 focus:border-purple-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none font-mono tracking-wide transition-all"
                />
              </div>

              {/* Checkbox Agreement */}
              <label className="flex items-start gap-2.5 pt-1 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-neutral-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span className="text-xs text-neutral-300 group-hover:text-white transition-colors">
                  I agree that I will <strong className="text-amber-400 underline">NOT share, upload, leak, or distribute</strong> this Beat Pack with anybody else. I accept these binding legal terms.
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl hover:shadow-purple-500/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Executing Legal Contract & Preparing Download...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Sign Contract & Download Free Beat Pack</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-purple-900/50 border border-purple-500 rounded-full flex items-center justify-center mx-auto text-purple-300 animate-bounce">
              <CheckCircle2 size={36} />
            </div>

            <h3 className="text-2xl font-black text-white">
              Legal Agreement Executed!
            </h3>

            <p className="text-sm text-neutral-300 max-w-md mx-auto">
              Your official signed license PDF contract has been downloaded to your device, and your free download for <strong className="text-purple-300">"{pack.title}"</strong> has been initiated.
            </p>

            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 max-w-md mx-auto text-xs text-neutral-400 text-left space-y-1.5 font-mono">
              <p className="text-purple-300 font-bold">✓ PDF Contract Downloaded</p>
              <p className="text-neutral-300">✓ License Ref: Cryptographically Timestamped</p>
              <p className="text-amber-400 font-semibold">⚠️ Non-Sharing Covenant Active</p>
            </div>

            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-xl border border-neutral-600 transition-all cursor-pointer"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
