import React, { useState, useEffect } from 'react';
import { industryHub } from '../../lib/industryNetworkHub';
import { useStore } from '../../context/StoreContext';

export const IndustryNetworkView = () => {
  const { state } = useStore();
  const config = state.profile.marketingConfig;
  
  const vocalMixPrice = config?.defaultVocalMixPrice || 149.99;
  const stemMixPrice = config?.defaultStemMixPrice || 249.99;
  const execSessionPrice = config?.defaultExecutiveSessionPrice || 499.99;
  
  const handleServiceBooking = async (serviceName: string, price: number) => {
    const clientEmail = prompt(`Enter your email to secure your booking for "${serviceName}" ($${price}):`);
    
    if (!clientEmail) return;

    try {
      const response = await fetch('/api/services/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceTier: serviceName, price: price, clientEmail: clientEmail })
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`Success! Your booking for ${serviceName} has been locked in. Check your inbox for next steps.`);
      } else {
        alert(`Error: ${result.error || 'Could not complete booking.'}`);
      }
    } catch (err) {
      console.error('Booking connection error:', err);
      alert('Network error connecting to the Krypside engineering pipeline.');
    }
  };
  const [role, setRole] = useState('labels');
  const [name, setName] = useState('');
  const [tier, setTier] = useState('Verified Professional');
  const [speedRating, setSpeedRating] = useState('0.9s Ultra-Fast');
  const [stats, setStats] = useState(industryHub.getNetworkStats());
  const [nodes, setNodes] = useState<{labels: any[], curators: any[], managers: any[], engineers: any[]}>({ labels: [], curators: [], managers: [], engineers: [] });
  const [dspTrackTitle, setDspTrackTitle] = useState('');
  const [dspArtistName, setDspArtistName] = useState('');

  const handleGlobalReleaseDispatch = async () => {
    if (!dspTrackTitle || !dspArtistName) {
      alert('Please fill out both track title and artist details before dispatching.');
      return;
    }

    try {
      const response = await fetch('/api/distribution/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          trackTitle: dspTrackTitle, 
          artistInfo: dspArtistName, 
          dspPlatforms: ['Spotify', 'Apple Music', 'Tidal'] 
        })
      });

      if (response.ok) {
        alert(`Success! "${dspTrackTitle}" has been submitted for global DSP distribution.`);
        setDspTrackTitle('');
        setDspArtistName('');
      } else {
        alert('Error processing global release dispatch.');
      }
    } catch (err) {
      console.error('Distribution error:', err);
      alert('Network error connecting to distribution pipeline.');
    }
  };

  const refreshState = () => {
    setStats(industryHub.getNetworkStats());
    setNodes({...industryHub.activeNodes});
  };

  useEffect(() => {
    refreshState();
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    industryHub.registerIndustryUser({ role, name, tier, speedRating });
    setName('');
    refreshState();
  };

  return (
    <div className="text-white space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Professional Services Network
          </h2>
          <p className="text-neutral-400">Ultra-Fast Industry Hub - Sub-second routing.</p>
        </div>
        
        <div className="flex gap-4 text-center">
          <div className="bg-neutral-800 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{stats.totalLabels}</div>
            <div className="text-xs text-neutral-400 uppercase">Labels</div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{stats.totalManagers}</div>
            <div className="text-xs text-neutral-400 uppercase">Managers</div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{stats.totalEngineers}</div>
            <div className="text-xs text-neutral-400 uppercase">Engineers</div>
          </div>
          <div className="bg-neutral-800 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{stats.totalCurators}</div>
            <div className="text-xs text-neutral-400 uppercase">Curators</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleRegister} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-800 space-y-4">
          <h3 className="text-lg font-bold">Register Profile</h3>
          
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Role</label>
            <select 
              value={role} 
              onChange={e => setRole(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="labels">Label Rep</option>
              <option value="managers">Artist Manager</option>
              <option value="engineers">Audio Engineer</option>
              <option value="curators">Playlist Curator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">Name / Entity</label>
            <input 
              required
              placeholder="e.g. OVO Sound / MixedByAli"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Tier</label>
              <select 
                value={tier} 
                onChange={e => setTier(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Verified Professional">Verified Professional</option>
                <option value="Executive">Executive</option>
                <option value="Independent">Independent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Routing Speed</label>
              <select 
                value={speedRating} 
                onChange={e => setSpeedRating(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="0.9s Ultra-Fast">0.9s Ultra-Fast</option>
                <option value="0.5s Light-Speed">0.5s Light-Speed</option>
                <option value="Instant">Instant</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-bold py-3 rounded-lg"
          >
            Lock into Global Roster
          </button>
        </form>

        <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-800 space-y-4">
          <h3 className="text-lg font-bold flex items-center justify-between">
            Active Nodes
            <span className="text-xs bg-indigo-900/50 text-indigo-400 px-2 py-1 rounded-full">{industryHub.networkTier}</span>
          </h3>
          
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {Object.entries(nodes).flatMap(([catRole, roleNodes]) => 
              roleNodes.map((node: any) => (
                <div key={node.id} className="bg-neutral-900 rounded-lg p-3 border border-neutral-700 flex justify-between items-center">
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {node.name}
                      <span className="text-[10px] uppercase bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                        {catRole}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">{node.tier} • {node.speed}</div>
                  </div>
                  <div className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded-full">Online</div>
                </div>
              ))
            ).reverse()}
            
            {Object.values(nodes).every(arr => arr.length === 0) && (
              <div className="text-center py-8 text-neutral-500">
                Network roster is currently empty. Register above to join the hub.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Krypside Fully Interactive Services Hub */}
      <div className="bg-black border border-blue-900/40 rounded-2xl p-8 text-white max-w-4xl mx-auto shadow-2xl my-6">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase bg-blue-950 text-blue-400 border border-blue-800 px-3 py-1 rounded-full">Krypside Enterprise Infrastructure</span>
          <h2 className="text-3xl font-black text-white mt-3 tracking-wide">STUDIO SERVICES & ENGINEERING</h2>
          <p className="text-gray-400 text-sm mt-2">Secure exclusive production from the vault, then route your tracks straight to our elite partner engineers for industry-standard mixing and mastering.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Service Card 1 */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 flex flex-col justify-between hover:border-blue-500 transition">
            <div>
              <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-mono uppercase mb-2 inline-block">24-Hour Turnaround</span>
              <h3 className="text-lg font-bold text-blue-400 mb-2">Vocal Mix & Master</h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">Send your recorded vocals and wav stems to Pyrex Spinna's top-tier mix engineers for a radio-ready, polished finish.</p>
              <p className="text-xl font-black text-white mb-4">${vocalMixPrice}</p>
            </div>
            <button type="button" onClick={() => handleServiceBooking('Vocal Mix & Master', vocalMixPrice)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition text-sm cursor-pointer">Book Engineering</button>
          </div>

          {/* Service Card 2 */}
          <div className="bg-gray-950 border border-blue-600/50 rounded-xl p-6 flex flex-col justify-between shadow-lg shadow-blue-600/10">
            <div>
              <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-mono uppercase mb-2 inline-block">12-Hour Priority Turnaround</span>
              <h3 className="text-lg font-bold text-blue-400 mb-2">Full Track Polish (Stem Mix)</h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">Complete analog summing, vocal tuning, dynamic processing, and master bus finalization by Pyrex Spinna.</p>
              <p className="text-xl font-black text-white mb-4">${stemMixPrice}</p>
            </div>
            <button type="button" onClick={() => handleServiceBooking('Full Track Polish (Stem Mix)', stemMixPrice)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition text-sm cursor-pointer">Book Engineering</button>
          </div>

          {/* Service Card 3 */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 flex flex-col justify-between hover:border-blue-500 transition">
            <div>
              <span className="text-[10px] bg-purple-900/60 text-purple-300 border border-purple-700 px-2 py-0.5 rounded font-mono uppercase mb-2 inline-block">Instant / Same-Day Live</span>
              <h3 className="text-lg font-bold text-blue-400 mb-2">Custom Executive Session</h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">Direct collaboration workflow with Pyrex Spinna, instant turnaround, and dedicated engineering oversight from start to finish.</p>
              <p className="text-xl font-black text-white mb-4">${execSessionPrice}</p>
            </div>
            <button type="button" onClick={() => handleServiceBooking('Custom Executive Session', execSessionPrice)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition text-sm cursor-pointer">Book Engineering</button>
          </div>
        </div>

        {/* Global Distribution & DSP Push Section */}
        <div className="bg-gray-950 border border-blue-900/60 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Global DSP Distribution Dispatch</h3>
              <p className="text-xs text-gray-400">Push finished tracks featuring your beat directly to Spotify, Apple Music, and streaming networks.</p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full">Automated Active</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" value={dspTrackTitle} onChange={e => setDspTrackTitle(e.target.value)} placeholder="Track Title" className="bg-black border border-gray-800 rounded-lg p-3 text-white text-sm outline-none focus:border-blue-500" />
            <input type="text" value={dspArtistName} onChange={e => setDspArtistName(e.target.value)} placeholder="Artist Name & Email" className="bg-black border border-gray-800 rounded-lg p-3 text-white text-sm outline-none focus:border-blue-500" />
          </div>

          <button type="button" onClick={handleGlobalReleaseDispatch} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition text-sm uppercase tracking-wider cursor-pointer">
            Initialize Global DSP Release Push
          </button>
        </div>
      </div>
    </div>
  );
};
