import React, { useState } from 'react';
import { X, Save, Music, DollarSign, Type, FileText, ShieldCheck, Zap } from 'lucide-react';
import { Beat } from '../types';

interface BeatEditModalProps {
  beat: Beat;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Beat>) => Promise<void>;
}

export default function BeatEditModal({ beat, onClose, onSave }: BeatEditModalProps) {
  const [formData, setFormData] = useState({
    title: beat.title || '',
    producer: beat.producer || '',
    price: beat.price !== undefined && beat.price !== "" ? beat.price : 0,
    bpm: beat.bpm || 0,
    key: beat.key || '',
    isPermanent: beat.isPermanent ?? false,
    isAIFree: beat.isAIFree ?? true,
    energyLevel: beat.energyLevel || 'Medium',
    camelotCode: beat.camelotCode || '',
    freeDownloadEnabled: beat.freeDownload?.enabled ?? false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(beat.id, {
        ...formData,
        price: Number(formData.price),
        bpm: Number(formData.bpm),
        freeDownload: { enabled: formData.freeDownloadEnabled, requirement: 'social', protection: 'tagged' }
      });
      onClose();
    } catch (error) {
      console.error("Failed to update beat:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Music size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Beat Details</h2>
              <p className="text-xs text-neutral-400">Update track information permanently</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-white transition-colors hover:bg-neutral-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <Type size={12} className="text-indigo-400" /> Beat Title
              </label>
              <input 
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                placeholder="Enter beat title..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Producer */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  <FileText size={12} className="text-indigo-400" /> Producer
                </label>
                <input 
                  type="text"
                  value={formData.producer}
                  onChange={(e) => setFormData(prev => ({ ...prev, producer: e.target.value }))}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  placeholder="Krypside"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  <DollarSign size={12} className="text-indigo-400" /> Basic Price ($)
                </label>
                <input 
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-mono"
                  placeholder="29.99"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* BPM */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  🎹 BPM
                </label>
                <input 
                  type="number"
                  value={formData.bpm}
                  onChange={(e) => setFormData(prev => ({ ...prev, bpm: Number(e.target.value) }))}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-mono"
                  placeholder="140"
                />
              </div>

              {/* Key */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  🎵 Musical Key
                </label>
                <input 
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  placeholder="C Minor"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Camelot */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  🎡 Camelot Code
                </label>
                <input 
                  type="text"
                  value={formData.camelotCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, camelotCode: e.target.value }))}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-mono"
                  placeholder="8A"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Energy Level */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  <Zap size={12} className="text-indigo-400" /> Energy Level
                </label>
                <select 
                  value={formData.energyLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, energyLevel: e.target.value as any }))}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none"
                >
                  <option value="Low">Low (Chill)</option>
                  <option value="Medium">Medium (Steady)</option>
                  <option value="High">High (Hype)</option>
                </select>
              </div>

              {/* Free Download Toggle */}
              <div className="flex flex-col justify-end">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                   🔓 Social Unlock
                </label>
                <div className="flex items-center justify-between p-3 bg-black border border-neutral-800 rounded-xl h-[46px]">
                  <span className="text-[10px] text-neutral-500 font-bold">Free Download</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.freeDownloadEnabled} 
                      onChange={(e) => setFormData(prev => ({ ...prev, freeDownloadEnabled: e.target.checked }))} 
                    />
                    <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* AI-Free Toggle */}
              <div className="flex flex-col justify-end">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  <ShieldCheck size={12} className="text-emerald-400" /> AI-Free Verified
                </label>
                <div className="flex items-center justify-between p-3 bg-black border border-neutral-800 rounded-xl h-[46px]">
                  <span className="text-[10px] text-neutral-500 font-bold">Verified Human</span>
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

            {/* Permanent Toggle */}
            <div className="flex items-center justify-between p-4 bg-black/40 border border-neutral-800 rounded-xl mt-2">
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  Permanent on Audio Player
                </p>
                <p className="text-[10px] text-neutral-500 mt-0.5">Ensures assets remain persistent across redeployments.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.isPermanent} 
                  onChange={(e) => setFormData(prev => ({ ...prev, isPermanent: e.target.checked }))} 
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-bold transition-all active:scale-95 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-xl font-bold transition-all active:scale-95 text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Save size={16} />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
