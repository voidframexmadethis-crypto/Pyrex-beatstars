
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Info, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Beat, PublishingMetadata } from '../types';
import { validateSplits } from '../utils/musicMetadata';

interface PublishingModalProps {
  beat: Beat;
  onClose: () => void;
  onSave: (metadata: PublishingMetadata) => Promise<void>;
}

export default function PublishingModal({ beat, onClose, onSave }: PublishingModalProps) {
  const [formData, setFormData] = useState<PublishingMetadata>(beat.publishing || {
    ipiNumber: '',
    proName: 'None',
    writerSplit: 50,
    publisherSplit: 50,
    isRegistered: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateSplits(formData.writerSplit, formData.publisherSplit)) {
      setError('Total splits must equal 100%.');
      return;
    }

    if (formData.proName !== 'None' && !formData.ipiNumber) {
      setError('IPI Number is required when a PRO is selected.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError('Failed to update publishing details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Publishing Administration</h3>
              <p className="text-xs text-zinc-400">Manage PRO & Royalty Splits</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">PRO Affiliation</label>
              <select
                value={formData.proName}
                onChange={(e) => setFormData({ ...formData, proName: e.target.value as any })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="None">None / Independent</option>
                <option value="ASCAP">ASCAP</option>
                <option value="BMI">BMI</option>
                <option value="PRS">PRS</option>
                <option value="SESAC">SESAC</option>
                <option value="SOCAN">SOCAN</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">IPI / CAE Number</label>
              <input
                type="text"
                placeholder="000.00.00.00"
                value={formData.ipiNumber}
                onChange={(e) => setFormData({ ...formData, ipiNumber: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-600 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">Royalty Split Allocation</label>
              <span className={`text-xs font-bold ${validateSplits(formData.writerSplit, formData.publisherSplit) ? 'text-green-400' : 'text-red-400'}`}>
                Total: {Number(formData.writerSplit) + Number(formData.publisherSplit)}%
              </span>
            </div>
            
            <div className="space-y-6 bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Writer Split</span>
                  <span className="text-white font-mono">{formData.writerSplit}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.writerSplit}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setFormData({ ...formData, writerSplit: val, publisherSplit: 100 - val });
                  }}
                  className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Publisher Split</span>
                  <span className="text-white font-mono">{formData.publisherSplit}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.publisherSplit}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setFormData({ ...formData, publisherSplit: val, writerSplit: 100 - val });
                  }}
                  className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl flex gap-3">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              Registering this track will generate permanent ISRC/ISWC codes and prepare the metadata for global DSP distribution via DDEX standards.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !validateSplits(formData.writerSplit, formData.publisherSplit)}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Register Track
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
