import React, { useState } from 'react';
import { BeatPackData } from '../types';

export function BundleBuilderModal({ isOpen, onClose, allPacks }: { isOpen: boolean, onClose: () => void, allPacks: BeatPackData[] }) {
  const [selected, setSelected] = useState<BeatPackData[]>([]);

  if (!isOpen) return null;

  const toggleSelect = (pack: BeatPackData) => {
    if (selected.find(p => p.id === pack.id)) {
      setSelected(selected.filter(p => p.id !== pack.id));
    } else {
      if (selected.length >= 6) {
        alert("You can select a maximum of 6 packs!");
        return;
      }
      setSelected([...selected, pack]);
    }
  };

  const handleBundleCheckout = () => {
    if (selected.length < 5) {
      alert("Please select at least 5 packs to unlock the Big Bundle deal.");
      return;
    }
    // Pass selected array to your crypto checkout handler
    console.log("Checking out bundle:", selected);
    alert(`Bundle locked with ${selected.length} packs! Proceeding to crypto payment.`);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#121212', color: '#fff', padding: '30px', borderRadius: '14px', width: '90%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto', border: '1px solid #333' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '22px' }}>Custom Big Bundle Pack</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>
        
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px' }}>Select 5 to 6 packs from your catalog below to combine into a discounted mega bundle:</p>

        {/* List of available packs to check */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {allPacks.map(pack => {
            const isChecked = selected.some(p => p.id === pack.id);
            return (
              <div 
                key={pack.id} 
                onClick={() => toggleSelect(pack)}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  background: isChecked ? '#1f1b2c' : '#1a1a1a', 
                  border: `1px solid ${isChecked ? '#7928CA' : '#333'}`, 
                  borderRadius: '8px', 
                  cursor: 'pointer' 
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{pack.title}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{'Beat Pack'}</div>
                </div>
                <input type="checkbox" checked={isChecked} readOnly style={{ width: '18px', height: '18px', accentColor: '#7928CA' }} />
              </div>
            );
          })}
        </div>

        {/* Footer Summary & Action */}
        <div style={{ borderTop: '1px solid #333', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#aaa' }}>Selected: <strong style={{ color: '#fff' }}>{selected.length} / 6</strong></div>
            <div style={{ fontSize: '12px', color: selected.length >= 5 ? '#4ade80' : '#f87171' }}>
              {selected.length < 5 ? `Pick ${5 - selected.length} more packs` : 'Bundle Unlocked!'}
            </div>
          </div>
          <button 
            onClick={handleBundleCheckout}
            style={{ 
              background: selected.length >= 5 ? '#fff' : '#333', 
              color: selected.length >= 5 ? '#000' : '#777', 
              border: 'none', 
              padding: '12px 20px', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: selected.length >= 5 ? 'pointer' : 'not-allowed' 
            }}
          >
            Checkout Bundle
          </button>
        </div>

      </div>
    </div>
  );
}
