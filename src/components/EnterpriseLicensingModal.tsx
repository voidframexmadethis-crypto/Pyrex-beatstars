import React from 'react';

export function EnterpriseLicensingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-gray-950 border border-blue-900/50 rounded-2xl p-6 max-w-lg w-full text-white shadow-2xl space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-blue-400 tracking-wide">ENTERPRISE LICENSING GATEWAY</h3>
            <p className="text-xs text-gray-400 mt-1">Direct clearance for major labels, sync placement, and exclusive buyouts.</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white font-mono text-sm px-2.5 py-1 bg-gray-900 rounded-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {[
            { title: 'Standard Lease', price: '$49', desc: 'Untagged MP3 & WAV for streaming and independent releases.' },
            { title: 'Unlimited Rights', price: '$199', desc: 'Full stems included for commercial distribution and video.' },
            { title: 'Exclusive Buyout', price: '$999+', desc: 'Complete ownership transfer, removed from catalog forever.' }
          ].map((tier, idx) => (
            <div 
              key={idx} 
              className="bg-black border border-gray-800 hover:border-blue-500/50 p-4 rounded-xl flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="pr-4">
                <h5 className="font-bold text-sm text-white group-hover:text-blue-400 transition">{tier.title}</h5>
                <p className="text-xs text-gray-400 mt-0.5">{tier.desc}</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition whitespace-nowrap">
                {tier.price}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
