import React, { useState } from 'react';
import { StemsHubView } from './StemsHubView';
import { AnRPortalView } from './AnRPortalView';
import { PlaylistCuratorView, ManagerJoinView } from './AdditionalViews';
import { MarketplaceView } from './MarketplaceView';
import { IndustryNetworkView } from './IndustryNetworkView';

export const ServicesHub = () => {
  const [activeTab, setActiveTab] = useState('network_hub');

  const renderView = () => {
    switch (activeTab) {
      case 'marketplace': return <MarketplaceView />;
      case 'anr_portal': return <AnRPortalView />;
      case 'engineering': return <StemsHubView />;
      case 'playlist_curator': return <PlaylistCuratorView />;
      case 'manager_join': return <ManagerJoinView />;
      case 'network_hub': return <IndustryNetworkView />;
      default: return <IndustryNetworkView />;
    }
  };

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-2">
        {[
          { id: 'network_hub', label: 'Industry Network' },
          { id: 'marketplace', label: 'Beats Marketplace' },
          { id: 'anr_portal', label: 'A&R Room' },
          { id: 'engineering', label: 'Engineering Stems Hub' },
          { id: 'playlist_curator', label: 'Playlist Curator' },
          { id: 'manager_join', label: 'Manager Join' },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-bold ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
        {renderView()}
      </div>
    </div>
  );
};
