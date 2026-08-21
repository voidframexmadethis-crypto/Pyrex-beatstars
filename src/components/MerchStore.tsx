import React from 'react';
import { getSafeKey } from '../lib/utils';

// 1. The Cargo: Our Print-on-Demand Dummy Data
const merchLoot = [
  { id: 'merch-001', name: 'PyrexSpinna Heavyweight Hoodie', price: 45.00, type: 'Apparel' },
  { id: 'merch-002', name: 'Trap Master Exclusive Tee', price: 25.00, type: 'Apparel' },
  { id: 'merch-003', name: 'Producer Pirate Dad Hat', price: 20.00, type: 'Accessories' }
];

export default function MerchStore() {
  return (
    <div className="merch-deck p-6 bg-gray-900 rounded-xl mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">🔥 EXCLUSIVE MERCH DROP</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {merchLoot && merchLoot.map((item, index) => (
          // 🛡️ Error-proof key locked in!
          <div key={getSafeKey(item, index, 'merch')} className="merch-card bg-gray-800 p-4 rounded-lg border border-purple-500 hover:border-purple-300 transition-all">
            
            {/* Image Placeholder - We will put your custom mockup designs here */}
            <div className="h-48 bg-gray-700 rounded mb-4 flex items-center justify-center">
              <span className="text-4xl">👕</span>
            </div>
            
            <h3 className="text-lg font-bold text-white">{item.name}</h3>
            <p className="text-purple-400 font-semibold">${item.price.toFixed(2)}</p>
            
            <button className="mt-4 w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded">
              ADD TO CART
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
