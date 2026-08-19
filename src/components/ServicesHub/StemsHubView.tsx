import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const StemsHubView = () => {
  const { state } = useStore();
  const config = state.profile.marketingConfig;
  
  const vocalMixPrice = config?.defaultVocalMixPrice || 149.99;
  const stemMixPrice = config?.defaultStemMixPrice || 249.99;
  const execSessionPrice = config?.defaultExecutiveSessionPrice || 499.99;

  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="text-white space-y-8">
      {/* Krypside Industry Services & Engineering Hub */}
      <div className="bg-black border border-blue-900/40 rounded-2xl p-8 text-white max-w-4xl mx-auto shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase bg-blue-950 text-blue-400 border border-blue-800 px-3 py-1 rounded-full">Krypside Enterprise Infrastructure</span>
          <h2 className="text-3xl font-black text-white mt-3 tracking-wide">STUDIO SERVICES & ENGINEERING</h2>
          <p className="text-gray-400 text-sm mt-2">Secure exclusive production from the vault, then route your tracks straight to our elite partner engineers for industry-standard mixing and mastering.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Service Card 1 */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 flex flex-col justify-between hover:border-blue-500 transition">
            <div>
              <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-mono uppercase mb-2 inline-block">24-Hour Turnaround</span>
              <h3 className="text-lg font-bold text-blue-400 mb-2">Vocal Mix & Master</h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">Send your recorded vocals and wav stems to Pyrex Spinna's top-tier mix engineers for a radio-ready, polished finish.</p>
              <p className="text-xl font-black text-white mb-4">${vocalMixPrice}</p>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition text-sm">Book Engineering</button>
          </div>

          {/* Service Card 2 */}
          <div className="bg-gray-950 border border-blue-600/50 rounded-xl p-6 flex flex-col justify-between shadow-lg shadow-blue-600/10">
            <div>
              <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-mono uppercase mb-2 inline-block">12-Hour Priority Turnaround</span>
              <h3 className="text-lg font-bold text-blue-400 mb-2">Full Track Polish (Stem Mix)</h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">Complete analog summing, vocal tuning, dynamic processing, and master bus finalization by Pyrex Spinna.</p>
              <p className="text-xl font-black text-white mb-4">${stemMixPrice}</p>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition text-sm">Book Engineering</button>
          </div>

          {/* Service Card 3 */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 flex flex-col justify-between hover:border-blue-500 transition">
            <div>
              <span className="text-[10px] bg-purple-900/60 text-purple-300 border border-purple-700 px-2 py-0.5 rounded font-mono uppercase mb-2 inline-block">Instant / Same-Day Live</span>
              <h3 className="text-lg font-bold text-blue-400 mb-2">Custom Executive Session</h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">Direct collaboration workflow with Pyrex Spinna, instant turnaround, and dedicated engineering oversight from start to finish.</p>
              <p className="text-xl font-black text-white mb-4">${execSessionPrice}</p>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition text-sm">Book Engineering</button>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <h2 className="text-xl font-bold">Engineering Stems Upload</h2>
      <div className="border-2 border-dashed border-neutral-700 p-8 rounded-lg text-center cursor-pointer hover:border-indigo-500">
        <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} className="hidden" id="stem-upload" />
        <label htmlFor="stem-upload">Drag & Drop or Click to upload stems</label>
      </div>
      <div>{files.length} files selected</div>
    </div>
  );
};
