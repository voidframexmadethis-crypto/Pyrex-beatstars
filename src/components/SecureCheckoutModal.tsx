import React, { useState } from 'react';
import { Beat } from '../types';

interface SecureCheckoutModalProps {
  beat?: Beat | any;
  onClose: () => void;
}

export default function SecureCheckoutModal({ beat, onClose }: SecureCheckoutModalProps) {
  // Force your custom fallback values right here so it ignores any broken props
  const displayTitle = "Costly 128BPM B minor"; // Your clean beat name
  const displayPrice = "29.99"; // Your exact custom price

  // 1. Clean up the title (remove redundant file extensions or long BPM strings if needed)
  const cleanTitle = beat?.title 
    ? beat.title.replace(/(-?\s*MAIN\s*OUT)+/gi, '').trim() 
    : displayTitle;

  // 2. Dynamic pricing state - NO hardcoded 49.99
  const [price, setPrice] = useState<number | string>(beat?.price || displayPrice);
  const [licenseType, setLicenseType] = useState('WAV Lease');
  const [agreed, setAgreed] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  const handleCheckout = (gateway: string) => {
    if (!agreed) {
      alert("Please agree to the license terms before proceeding.");
      return;
    }
    // Handle your gateway logic here (1-Tap, PayPal, Crypto)
    alert(`Initiating ${gateway} checkout for ${cleanTitle} at $${price}`);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-[#120a1f] border border-purple-500/40 rounded-2xl max-w-lg w-full p-6 text-white relative shadow-2xl">
        
        {/* Close Button */}
        <button 
          id="close-secure-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 bg-purple-600/30 hover:bg-purple-600/60 p-2.5 rounded-xl text-white transition-all"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold tracking-wider mb-5 text-purple-200">
          SECURE CHECKOUT TERMINAL
        </h2>

        {/* Dynamic Track Summary Card (Shows Clean Title, Not Raw Filename) */}
        <div className="bg-purple-950/40 border border-purple-500/20 rounded-xl p-4 mb-5 flex justify-between items-center">
          <div>
            <p className="text-xs text-purple-400 uppercase tracking-widest font-semibold">{licenseType}</p>
            <p className="font-bold text-base text-white mt-1 max-w-[260px] truncate">{cleanTitle}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-purple-300">
              ${Number(price).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Custom Price Input (Producer Control) */}
        <div className="mb-4">
          <label className="block text-xs uppercase tracking-wider text-purple-400 mb-1.5 font-semibold">
            Custom Price (USD)
          </label>
          <input 
            id="secure-custom-price-input"
            type="number" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-black/60 border border-purple-500/40 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 text-lg font-bold"
          />
        </div>

        {/* License Tier Selector */}
        <div className="mb-4">
          <label className="block text-xs uppercase tracking-wider text-purple-400 mb-1.5 font-semibold">
            Select License Tier
          </label>
          <select 
            id="secure-license-type-select"
            value={licenseType}
            onChange={(e) => {
              const type = e.target.value;
              setLicenseType(type);
              const basePrice = Number(beat?.price || displayPrice) || 29.99;
              if (type === 'Trackout Lease') setPrice(basePrice * 1.5);
              if (type === 'Exclusive Rights') setPrice(basePrice * 4);
              if (type === 'WAV Lease') setPrice(basePrice);
            }}
            className="w-full bg-black/60 border border-purple-500/40 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 cursor-pointer"
          >
            <option value="WAV Lease">WAV Lease — ${Number(price).toFixed(2)} USD</option>
            <option value="Trackout Lease">Trackout Lease — ${(Number(price) * 1.5).toFixed(2)} USD</option>
            <option value="Exclusive Rights">Exclusive Rights — ${(Number(price) * 4).toFixed(2)} USD</option>
          </select>
        </div>

        {/* Controlled License Agreement Checkbox (Stays inside modal instead of blank white screen) */}
        <div className="mb-6 flex items-center justify-between bg-black/40 p-3 rounded-xl border border-purple-500/20">
          <label className="flex items-center space-x-3 cursor-pointer text-xs text-purple-300">
            <input 
              id="license-agree-checkbox"
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded accent-purple-600 bg-black cursor-pointer"
            />
            <span>
              I agree to the{' '}
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAgreementModal(true);
                }} 
                className="underline text-purple-400 hover:text-white"
              >
                License Terms & Conditions
              </button>
            </span>
          </label>
        </div>

        {/* Action Buttons: 1-Tap, PayPal, Crypto */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            id="secure-1tap-btn"
            type="button"
            onClick={() => handleCheckout('1-Tap')}
            className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-extrabold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg text-sm active:scale-95"
          >
            ⚡ 1-TAP
          </button>
          <button 
            id="secure-paypal-btn"
            type="button"
            onClick={() => handleCheckout('PayPal')}
            className="bg-purple-600/50 hover:bg-purple-600/80 border border-purple-400/30 text-white font-bold py-3 rounded-xl transition-all text-sm active:scale-95"
          >
            💳 PAYPAL
          </button>
          <button 
            id="secure-crypto-btn"
            type="button"
            onClick={() => handleCheckout('Crypto')}
            className="bg-purple-600/50 hover:bg-purple-600/80 border border-purple-400/30 text-white font-bold py-3 rounded-xl transition-all text-sm active:scale-95"
          >
            💎 CRYPTO
          </button>
        </div>

      </div>

      {/* Embedded Terms Modal (Prevents white-screen popups) */}
      {showAgreementModal && (
        <div className="absolute inset-0 bg-black/90 z-60 flex items-center justify-center p-6 animate-in fade-in duration-150">
          <div className="bg-[#181028] border border-purple-500 rounded-2xl max-w-md w-full p-6 text-white relative shadow-2xl">
            <h3 className="text-lg font-bold mb-3 text-purple-200">License Terms Summary</h3>
            <p className="text-xs text-purple-300 leading-relaxed mb-4 max-h-48 overflow-y-auto pr-2">
              This agreement is effective upon purchase of the licensed material. The producer grants the licensee non-exclusive rights to use the beat under the selected tier parameters. Governing law applies to the producer's jurisdiction.
            </p>
            <button 
              id="close-terms-modal-btn"
              type="button"
              onClick={() => setShowAgreementModal(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
