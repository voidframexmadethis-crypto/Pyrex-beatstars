import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, User, Mail, Target, DollarSign, CheckCircle2 } from 'lucide-react';

export const CustomRequestModal = ({ beatName, onClose }: { beatName: string; onClose: () => void }) => {
  const [artistName, setArtistName] = useState('');
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState('Exclusive Rights & Stems');
  const [budget, setBudget] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inquiryPayload = { 
      beatName, 
      artistName, 
      email, 
      requestType, 
      budget,
      submittedAt: new Date().toISOString() 
    };
    
    console.log("Inquiry Submitted:", inquiryPayload);
    
    // Simulate API call
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600" />
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Custom Rights Inquiry</h3>
                  <p className="text-neutral-400 text-sm font-medium">
                    Negotiate terms for <span className="text-purple-400 font-bold">{beatName}</span> directly with Pyrex Spinna.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                      <User size={12} className="text-purple-500" /> Artist / Producer Name
                    </label>
                    <input 
                      type="text" 
                      value={artistName} 
                      onChange={e => setArtistName(e.target.value)} 
                      required 
                      className="w-full p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all text-sm" 
                      placeholder="e.g. Metro Boomin"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                      <Mail size={12} className="text-purple-500" /> Email Address
                    </label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                      className="w-full p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all text-sm" 
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                      <Target size={12} className="text-purple-500" /> Inquiry Focus
                    </label>
                    <div className="relative">
                      <select 
                        value={requestType} 
                        onChange={e => setRequestType(e.target.value)} 
                        className="w-full p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all text-sm appearance-none cursor-pointer"
                      >
                        <option>Exclusive Rights & Stems</option>
                        <option>Custom Beat Arrangement</option>
                        <option>Major Label Placement Sync</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                      <DollarSign size={12} className="text-purple-500" /> Proposed Budget ($)
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={budget} 
                        onChange={e => setBudget(e.target.value)} 
                        placeholder="e.g. 500" 
                        className="w-full p-3.5 pl-8 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all text-sm" 
                      />
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 font-bold">$</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Send size={16} />
                    <span>Send Direct Inquiry</span>
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                  <CheckCircle2 className="text-emerald-500" size={40} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Inquiry Sent</h3>
                <p className="text-neutral-400 text-sm font-medium">
                  Your custom request has been securely transmitted. <br />
                  The producer will review and respond shortly.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="bg-neutral-950/50 p-4 border-t border-neutral-800 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-600">
            Pyrex Spinna Enterprise • Secure B2B Channel
          </p>
        </div>
      </motion.div>
    </div>
  );
};
