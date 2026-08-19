import React, { useState } from 'react';
import CustomPlayer from './CustomPlayer'; // Your boulevard audio player component

export default function PublicStorefront({ beats }: { beats: any[] }) {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      {/* Store Header */}
      <div className="max-w-4xl mx-auto mb-10 flex justify-between items-center border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
            TRAP STOREFRONT
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Exclusive High-Definition Audio • Direct Independent Access</p>
        </div>
        <div className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-red-500 font-bold">
          🔴 Live Stream Mode
        </div>
      </div>

      {/* Beat Player Grid */}
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {beats.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-xl">
            Feed empty. Waiting for the first banger... 🔴
          </div>
        ) : (
          beats.map((beat, index) => <CustomPlayer key={index} beat={beat} />)
        )}
      </div>
    </div>
  );
}
