import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Check, Download, Music, ShieldCheck, Instagram, Twitter, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { Beat } from '../types';
import { useStore } from '../context/StoreContext';
import { generateAndDownloadLicense } from '../utils/contractGenerator';

interface SocialUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  beat: Beat | null;
}

export const SocialUnlockModal: React.FC<SocialUnlockModalProps> = ({ isOpen, onClose, beat }) => {
  const { addSubscriber } = useStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'TIKTOK' | 'EMAIL' | null>(null);

  if (!isOpen || !beat) return null;

  const handleTikTokUnlock = () => {
    setSelectedAction('TIKTOK');
    setIsVerifying(true);
    
    // Open TikTok Profile
    window.open('https://www.tiktok.com/@pyrexspinna', '_blank');

    // Verification simulation
    setTimeout(() => {
      setIsVerifying(false);
      setIsUnlocked(true);
      setStep(2);
    }, 2000);
  };

  const handleEmailUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setSelectedAction('EMAIL');
    setIsVerifying(true);

    // Store email
    addSubscriber(email);

    // Verification simulation
    setTimeout(() => {
      setIsVerifying(false);
      setIsUnlocked(true);
      setStep(2);
    }, 1500);
  };

  const handleDownload = () => {
    if (!beat.audioUrl) return;
    
    const link = document.createElement('a');
    link.href = beat.audioUrl;
    link.download = `${beat.title} (Tagged Preview).m4a`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Generate and download license
    const userEmail = email || localStorage.getItem('PYREX_USER_EMAIL') || 'Valued Fan';
    generateAndDownloadLicense(beat.title, userEmail);
    
    // Success feedback then close
    setTimeout(() => {
      onClose();
      // Reset for next time
      setTimeout(() => {
        setStep(1);
        setIsUnlocked(false);
        setIsVerifying(false);
        setEmail('');
      }, 500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <Download className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Social Unlock Gate</h3>
              </div>
              <button 
                onClick={onClose}
                className="text-neutral-500 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Beat Info Card */}
              <div className="flex gap-4 items-center mb-6 bg-black/40 p-3 rounded-xl border border-neutral-800/50">
                <div className="w-16 h-16 bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 flex-shrink-0">
                  {beat.coverArtUrl ? (
                    <img src={beat.coverArtUrl} alt={beat.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <Music size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-base truncate">{beat.title}</h4>
                  <p className="text-neutral-500 text-xs uppercase font-bold tracking-tighter mt-0.5">by {beat.producer}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-black uppercase tracking-tighter">Tagged .m4a</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-black uppercase tracking-tighter">Free Pack</span>
                  </div>
                </div>
              </div>

              {step === 1 ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h5 className="text-xl font-black text-white uppercase tracking-tight">Step 1: Choose Action</h5>
                    <p className="text-neutral-400 text-xs mt-1 font-medium">Complete one action below to instantly unlock your free download.</p>
                  </div>

                  <div className="grid gap-3">
                    <button
                      onClick={handleTikTokUnlock}
                      disabled={isVerifying}
                      className="w-full group relative flex items-center justify-between p-4 bg-white hover:bg-neutral-100 text-black rounded-xl transition-all active:scale-[0.98] overflow-hidden"
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                          <Music className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Action 01</div>
                          <div className="text-sm font-black uppercase italic tracking-tighter">Follow on TikTok</div>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-800"></div></div>
                      <div className="relative flex justify-center"><span className="bg-neutral-900 px-4 text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">OR</span></div>
                    </div>

                    <form onSubmit={handleEmailUnlock} className="space-y-3">
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                          type="email"
                          placeholder="Enter Email for Free Beat Pack"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isVerifying || !email}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase italic tracking-tighter rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                      >
                        {isVerifying && selectedAction === 'EMAIL' ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <span>Join Mailing List & Unlock</span>
                            <Sparkles className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-bold uppercase tracking-widest pt-2">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Secure Verification • No Credit Card Required
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-4"
                >
                  <div className="relative inline-block">
                    <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                      <Check className="w-10 h-10" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-emerald-500 rounded-full"
                    />
                  </div>

                  <div>
                    <h5 className="text-2xl font-black text-white uppercase tracking-tight">Action Verified!</h5>
                    <p className="text-neutral-400 text-xs mt-1 font-medium">Your free tagged preview for <span className="text-white">"{beat.title}"</span> is now available.</p>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase italic tracking-tighter text-lg rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30 group"
                  >
                    <Download className="w-6 h-6 group-hover:bounce" />
                    Download Tagged .m4a Preview
                  </button>

                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                    Your beat pack will also be sent to your email (if provided).
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-black/60 text-center text-[9px] font-bold text-neutral-600 uppercase tracking-[0.2em] border-t border-neutral-800">
              Pyrex Spinna Enterprise • Secure Digital Asset Delivery
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
