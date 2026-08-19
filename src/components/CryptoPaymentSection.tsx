import React from 'react';

interface CryptoPaymentSectionProps {
  address: string;
}

export const CryptoPaymentSection: React.FC<CryptoPaymentSectionProps> = ({ address }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    alert('Address copied to clipboard!');
  };

  return (
    <div className="text-center p-5">
      <h3 className="text-white font-bold mb-2">Pay with Crypto</h3>
      <p className="text-neutral-400 text-sm mb-4">Scan the QR code or copy the address below to send your payment.</p>
      
      {/* QR Code Placeholder - User to provide actual image */}
      <div className="w-36 h-36 bg-neutral-800 mx-auto mb-4 flex items-center justify-center text-xs text-neutral-500 border border-neutral-700">
        QR CODE PLACEHOLDER
      </div>
      
      <div className="bg-white/5 p-3 rounded-lg font-mono text-sm text-neutral-300 break-all mb-4 border border-white/10">
        {address}
      </div>
      
      <button 
        onClick={copyToClipboard}
        className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg cursor-pointer transition-colors text-sm font-bold"
      >
        Copy Address
      </button>
    </div>
  );
};
