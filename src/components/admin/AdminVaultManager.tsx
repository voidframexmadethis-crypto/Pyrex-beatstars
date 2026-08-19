import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PrivateVault, Beat } from '../../types';
import { Lock, Plus, Trash2, Copy, ExternalLink, Calendar, User, Key, Search, Check, AlertCircle, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminVaultManager = () => {
  const { state, updateStore } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [selectedBeatIds, setSelectedBeatIds] = useState<string[]>([]);
  const [expiryDays, setExpiryDays] = useState(7);

  const vaults = (state as any).vaults || [];
  const beats = state.beats || [];

  const handleCreateVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !passcode || selectedBeatIds.length === 0) {
      alert("Please fill in all fields and select at least one beat.");
      return;
    }

    const newVault: PrivateVault = {
      id: `vault_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      clientName,
      passcode,
      beatIds: selectedBeatIds,
      expiresAt: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString()
    };

    updateStore({
      ...state,
      vaults: [newVault, ...vaults]
    } as any);

    // Reset Form
    setClientName('');
    setPasscode('');
    setSelectedBeatIds([]);
    setExpiryDays(7);
    setIsCreating(false);
  };

  const handleDeleteVault = (id: string) => {
    if (window.confirm("Are you sure you want to delete this vault? Access will be immediately revoked.")) {
      updateStore({
        ...state,
        vaults: vaults.filter((v: any) => v.id !== id)
      } as any);
    }
  };

  const copyVaultLink = (id: string) => {
    const link = `${window.location.origin}/#/vault/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredVaults = vaults.filter((v: any) => 
    v.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
            <Lock className="text-purple-500" />
            Private Client Vaults
          </h2>
          <p className="text-neutral-400 text-sm">Create and manage secure, passcode-protected unreleased beat selections for VIP clients.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
            isCreating ? 'bg-neutral-800 text-neutral-400' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20'
          }`}
        >
          {isCreating ? 'Cancel Creation' : <><Plus size={16} /> Create New Vault</>}
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreateVault} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                    <User size={14} /> Client Name
                  </label>
                  <input 
                    type="text" 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Metro Boomin"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                    <Key size={14} /> Security Passcode
                  </label>
                  <input 
                    type="text" 
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="e.g. VIP_2026"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
                    <Calendar size={14} /> Expiry Duration
                  </label>
                  <select 
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value={1}>1 Day</option>
                    <option value={3}>3 Days</option>
                    <option value={7}>1 Week</option>
                    <option value={14}>2 Weeks</option>
                    <option value={30}>1 Month</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
                  <Music size={14} /> Select Vault Beats ({selectedBeatIds.length})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {beats.map((beat) => (
                    <button
                      key={beat.id}
                      type="button"
                      onClick={() => {
                        setSelectedBeatIds(prev => 
                          prev.includes(beat.id) ? prev.filter(id => id !== beat.id) : [...prev, beat.id]
                        );
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        selectedBeatIds.includes(beat.id)
                        ? 'bg-purple-900/20 border-purple-500 text-white shadow-inner'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded bg-neutral-800 overflow-hidden flex-shrink-0">
                        <img src={beat.coverArtUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="text-xs font-bold truncate">{beat.title}</span>
                      {selectedBeatIds.includes(beat.id) && <Check size={14} className="ml-auto text-purple-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  className="px-8 py-4 bg-white hover:bg-neutral-200 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl active:scale-95"
                >
                  Generate Private Vault
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 flex items-center gap-3">
          <Search className="text-neutral-500" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client or vault ID..."
            className="bg-transparent border-none focus:outline-none text-sm text-white w-full placeholder:text-neutral-600"
          />
        </div>

        <div className="divide-y divide-neutral-800">
          {filteredVaults.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="mx-auto text-neutral-800 mb-4" size={48} />
              <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">No private vaults found</p>
            </div>
          ) : (
            filteredVaults.map((vault: any) => (
              <div key={vault.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-neutral-800/30 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{vault.clientName}</h3>
                    <span className="text-[10px] font-mono bg-neutral-800 px-2 py-0.5 rounded text-neutral-500 uppercase">ID: {vault.id}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <Music size={14} className="text-purple-500" />
                      <span>{vault.beatIds.length} Tracks</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Key size={14} className="text-indigo-500" />
                      <span className="font-mono text-white/80">{vault.passcode}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-amber-500" />
                      <span>Expires: {new Date(vault.expiresAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={() => copyVaultLink(vault.id)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                      copiedId === vault.id 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {copiedId === vault.id ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Link</>}
                  </button>
                  <a 
                    href={`#/vault/${vault.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                  >
                    <ExternalLink size={14} /> Preview
                  </a>
                  <button 
                    onClick={() => handleDeleteVault(vault.id)}
                    className="p-2.5 bg-neutral-900 hover:bg-red-900/20 text-neutral-600 hover:text-red-500 rounded-lg transition-all border border-neutral-800"
                    title="Delete Vault"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
