import React, { useState } from 'react';

const PlaqueCustomizer = () => {
  const [formData, setFormData] = useState({
    artistName: '',
    releaseTitle: '',
    milestoneType: 'Gold Certified (500K Streams)',
    frameStyle: 'Midnight Blue & Black',
    verificationSourceUrl: '',
    buyerEmail: '',
    shippingAddress: {
      street: '',
      city: '',
      zip: '',
      country: ''
    },
    price: 199.99
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const response = await fetch('/api/plaques/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, customerShippingAddress: formData.shippingAddress }),
      });
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="bg-black border border-blue-900/40 rounded-xl p-6 text-white max-w-2xl mx-auto shadow-2xl">
      <h3 className="text-2xl font-black mb-2 text-blue-500">Krypside Certified Plaque Studio</h3>
      <p className="text-gray-400 text-sm mb-6">Commemorate your independent milestones with custom-engineered, heavy-duty display frames.</p>
      
      {status === 'success' ? (
        <div className="text-center p-8 bg-blue-900/20 rounded-lg">
          <h4 className="text-xl font-bold text-blue-400">Order Submitted!</h4>
          <p>We've received your plaque order. Check your email for confirmation.</p>
          <button onClick={() => setStatus('idle')} className="mt-4 text-blue-400 hover:underline">Submit another?</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Artist / Producer Name</label>
              <input type="text" required value={formData.artistName} onChange={e => setFormData({...formData, artistName: e.target.value})} placeholder="e.g., Voidframe" className="w-full bg-gray-950 border border-gray-800 rounded p-3 text-white focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Release Title</label>
              <input type="text" required value={formData.releaseTitle} onChange={e => setFormData({...formData, releaseTitle: e.target.value})} placeholder="e.g., Midnight Tapes Vol. 1" className="w-full bg-gray-950 border border-gray-800 rounded p-3 text-white focus:border-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Your Email</label>
            <input type="email" required value={formData.buyerEmail} onChange={e => setFormData({...formData, buyerEmail: e.target.value})} placeholder="e.g., artist@example.com" className="w-full bg-gray-950 border border-gray-800 rounded p-3 text-white focus:border-blue-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Milestone Tier</label>
              <select value={formData.milestoneType} onChange={e => setFormData({...formData, milestoneType: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded p-3 text-white focus:border-blue-500 outline-none">
                <option>Gold Certified (500K Streams)</option>
                <option>Platinum Certified (1M+ Streams)</option>
                <option>Diamond Certified (10M+ Streams)</option>
                <option>Independent Milestone Edition</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Frame Finish</label>
              <select value={formData.frameStyle} onChange={e => setFormData({...formData, frameStyle: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded p-3 text-white focus:border-blue-500 outline-none">
                <option>Midnight Blue & Black</option>
                <option>Matte Carbon Fiber</option>
                <option>Brushed Metallic Steel</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Streaming Proof Link</label>
            <input type="url" required value={formData.verificationSourceUrl} onChange={e => setFormData({...formData, verificationSourceUrl: e.target.value})} placeholder="https://..." className="w-full bg-gray-950 border border-gray-800 rounded p-3 text-white focus:border-blue-500 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-400 mb-1">Shipping Address</label>
            <input type="text" required value={formData.shippingAddress.street} onChange={e => setFormData({...formData, shippingAddress: {...formData.shippingAddress, street: e.target.value}})} placeholder="Street Address" className="w-full bg-gray-950 border border-gray-800 rounded p-3 text-white focus:border-blue-500 outline-none" />
            <div className="grid grid-cols-3 gap-2">
              <input type="text" required value={formData.shippingAddress.city} onChange={e => setFormData({...formData, shippingAddress: {...formData.shippingAddress, city: e.target.value}})} placeholder="City" className="w-full bg-gray-950 border border-gray-800 rounded p-3 text-white focus:border-blue-500 outline-none" />
              <input type="text" required value={formData.shippingAddress.zip} onChange={e => setFormData({...formData, shippingAddress: {...formData.shippingAddress, zip: e.target.value}})} placeholder="Zip" className="w-full bg-gray-950 border border-gray-800 rounded p-3 text-white focus:border-blue-500 outline-none" />
              <input type="text" required value={formData.shippingAddress.country} onChange={e => setFormData({...formData, shippingAddress: {...formData.shippingAddress, country: e.target.value}})} placeholder="Country" className="w-full bg-gray-950 border border-gray-800 rounded p-3 text-white focus:border-blue-500 outline-none" />
            </div>
          </div>

          <button type="submit" disabled={status === 'submitting'} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-blue-600/20 disabled:opacity-50">
            {status === 'submitting' ? 'Processing...' : 'Submit Plaque Order & Generate Proof'}
          </button>
          
          {status === 'error' && <p className="text-red-500 text-center text-sm">Failed to submit. Please try again.</p>}
        </form>
      )}
    </div>
  );
};

export default PlaqueCustomizer;
