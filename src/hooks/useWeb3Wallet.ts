import { useState, useEffect } from 'react';

export function useWeb3Wallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(() => {
    return localStorage.getItem('KRYPSIDE_WEB3_WALLET') || null;
  });
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const handleWalletChange = () => {
      setWalletAddress(localStorage.getItem('KRYPSIDE_WEB3_WALLET') || null);
    };
    window.addEventListener('KRYPSIDE_WALLET_UPDATE', handleWalletChange);
    return () => window.removeEventListener('KRYPSIDE_WALLET_UPDATE', handleWalletChange);
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const ethereum = (window as any).ethereum;
      if (ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          localStorage.setItem('KRYPSIDE_WEB3_WALLET', accounts[0]);
          setWalletAddress(accounts[0]);
          window.dispatchEvent(new Event('KRYPSIDE_WALLET_UPDATE'));
          return accounts[0];
        }
      } else {
        // High-fidelity demo fallback simulator for preview environment
        await new Promise((resolve) => setTimeout(resolve, 800));
        const demoWallet = '0x71C9f2b8E52A478D9b6f1234cDeF67890aB1234c';
        localStorage.setItem('KRYPSIDE_WEB3_WALLET', demoWallet);
        setWalletAddress(demoWallet);
        window.dispatchEvent(new Event('KRYPSIDE_WALLET_UPDATE'));
        return demoWallet;
      }
    } catch (err: any) {
      if (err?.message !== 'No Web3 wallet detected.') {
        console.error('Wallet connection error:', err);
      }
      // If user rejects in extension, just return null silently instead of throwing uncaught error
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('KRYPSIDE_WEB3_WALLET');
    setWalletAddress(null);
    window.dispatchEvent(new Event('KRYPSIDE_WALLET_UPDATE'));
  };

  return {
    walletAddress,
    isConnecting,
    connectWallet,
    disconnectWallet,
    isConnected: !!walletAddress,
  };
}
