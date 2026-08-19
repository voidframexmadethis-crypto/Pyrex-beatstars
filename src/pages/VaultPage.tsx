import React, { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { SecretVault } from '../components/SecretVault';
import { ShieldAlert } from 'lucide-react';

export default function VaultPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useStore();

  // In a real app, you'd fetch this from a database
  // For this prototype, we'll look for vaults in a dedicated state property if it exists
  // Or fallback to a mocked vault if the ID matches a certain pattern for demo purposes
  
  const vault = useMemo(() => {
    // Check if vaults exist in store state
    const vaults = (state as any).vaults || [];
    const found = vaults.find((v: any) => v.id === id);
    
    if (found) return found;

    // Demo Fallback: If ID is 'demo-vault', provide a mock vault
    if (id === 'demo-vault') {
      return {
        id: 'demo-vault',
        clientName: 'Top Tier Artist',
        passcode: 'PYREX2026',
        beatIds: state.beats?.slice(0, 3).map(b => b.id) || [],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    }

    return null;
  }, [id, state]);

  if (!id) return <Navigate to="/" replace />;

  if (!vault) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <ShieldAlert className="text-red-500" size={40} />
        </div>
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Vault Not Found</h1>
        <p className="text-neutral-500 max-w-md mx-auto mb-8 font-medium">
          The private vault you are looking for does not exist or the access link has expired. 
          Please contact Pyrex Spinna for a new secure access key.
        </p>
        <a 
          href="/"
          className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-black text-white uppercase tracking-widest transition-all"
        >
          Return to Public Catalog
        </a>
      </div>
    );
  }

  return <SecretVault vaultData={vault} />;
}
