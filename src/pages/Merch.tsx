import React from 'react';
import MerchSection from '../components/MerchSection';

export default function Merch() {
  return (
    <div className="merch-page min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          OFFICIAL HARDWARE & GEAR
        </h1>
        <p className="text-gray-400 mt-2">Limited drops. Premium quality. Custom built for the culture.</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <MerchSection />
      </div>
    </div>
  );
}
