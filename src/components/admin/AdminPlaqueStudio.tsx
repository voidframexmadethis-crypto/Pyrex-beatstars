import React, { useState } from 'react';

export const AdminPlaqueStudio = () => {
  const [plaqueArtist, setPlaqueArtist] = useState('');
  const [plaqueRelease, setPlaqueRelease] = useState('');
  const [plaqueTier, setPlaqueTier] = useState('Independent Kickoff (100 Streams)');
  const [plaqueFinish, setPlaqueFinish] = useState('Midnight Blue & Black Metallic');
  const [plaqueProof, setPlaqueProof] = useState('');
  const [plaqueAddress, setPlaqueAddress] = useState('');

  const handleAdminPlaqueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Plaque requisition successfully transmitted from secure admin node to manufacturing group.");
  };

  return (
    <div className="admin-plaque-container bg-black border border-blue-900/60 rounded-2xl p-8 text-white max-w-4xl mx-auto shadow-2xl my-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-900 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase bg-blue-950 text-blue-400 border border-blue-800 px-3 py-1 rounded-full">Restricted Access • Producer Only</span>
          <h2 className="text-2xl font-black text-white mt-2 tracking-wide">Krypside Certified Plaque Studio</h2>
        </div>
        <span className="text-xs font-mono text-gray-500">Node: Admin-Authorized</span>
      </div>

      <p className="text-gray-400 text-sm mb-6">Manage and submit custom milestone display frame orders directly to manufacturing intake. Locked exclusively to owner session.</p>

      <form className="space-y-4" onSubmit={handleAdminPlaqueSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Artist / Producer Name</label>
            <input type="text" value={plaqueArtist} onChange={(e) => setPlaqueArtist(e.target.value)} placeholder="e.g., Krypside" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Release Title</label>
            <input type="text" value={plaqueRelease} onChange={(e) => setPlaqueRelease(e.target.value)} placeholder="e.g., Midnight Tapes Vol. 1" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none text-sm" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Milestone Tier</label>
            <select value={plaqueTier} onChange={(e) => setPlaqueTier(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none text-sm">
              <option>Independent Kickoff (100 Streams)</option>
              <option>Standard Tier Certified (800 Streams)</option>
              <option>Growth Milestone Award (1,255 Streams)</option>
              <option>Gold Certified (100K Streams)</option>
              <option>Diamond Million-Stream Masterpiece</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Frame Finish</label>
            <select value={plaqueFinish} onChange={(e) => setPlaqueFinish(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none text-sm">
              <option>Midnight Blue & Black Metallic</option>
              <option>Matte Carbon Edition</option>
              <option>Platinum Brushed Steel</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Streaming Proof Link / Analytics Hash</label>
          <input type="url" value={plaqueProof} onChange={(e) => setPlaqueProof(e.target.value)} placeholder="https://..." className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none text-sm" required />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Secure Shipping Destination</label>
          <input type="text" value={plaqueAddress} onChange={(e) => setPlaqueAddress(e.target.value)} placeholder="Street Address, City, Zip, Country" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none text-sm" required />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/20 tracking-wide uppercase text-sm cursor-pointer mt-4">
          Transmit Order to Manufacturing Group
        </button>
      </form>
    </div>
  );
};
