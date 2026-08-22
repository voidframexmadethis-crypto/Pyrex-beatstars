import React from 'react';
import { Beat } from '../types';

interface LicensePricingSelectorProps {
  track: Beat;
}

export function LicensePricingSelector({ track }: LicensePricingSelectorProps) {
  // State for selected license tier (e.g., Basic, Premium, Unlimited)
  const [selectedLicense, setSelectedLicense] = React.useState('basic');

  // Dynamic pricing map pulled from the database track object
  // Mapping the request properties to the Beat interface structure
  const licensePrices: Record<string, number> = {
    basic: track.licenses?.mp3Lease?.price || track.priceMp3 || track.basicPrice || 29.00,
    wav: track.licenses?.wavLease?.price || track.priceWav || 49.00,
    trackout: track.licenses?.premiumLease?.price || 99.00,
    unlimited: track.licenses?.unlimitedLease?.price || 199.00
  };

  return (
    <div className="bg-[#16161c] p-4 rounded-xl border border-white/10 text-white">
      <h4 className="text-sm font-bold mb-3 text-gray-300">Select License Tier</h4>
      
      {/* License Options */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.keys(licensePrices).map((tier) => (
          <button
            key={tier}
            onClick={() => setSelectedLicense(tier)}
            className={`p-2 rounded-lg text-xs font-semibold uppercase border transition ${
              selectedLicense === tier 
                ? 'bg-purple-600 border-purple-500 text-white' 
                : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            {tier} — ${licensePrices[tier].toFixed(2)}
          </button>
        ))}
      </div>

      {/* Dynamic Checkout Button */}
      <button className="w-full bg-white text-black font-bold rounded-lg py-3 text-sm hover:bg-gray-200 transition">
        Buy Now — ${licensePrices[selectedLicense].toFixed(2)}
      </button>
    </div>
  );
}
