import React, { useState } from 'react';
import { FlashSaleAnnouncement } from '../types';

interface AdminAnnouncementPanelProps {
  onSaveAnnouncement: (announcement: FlashSaleAnnouncement) => void;
}

export const AdminAnnouncementPanel = ({ onSaveAnnouncement }: AdminAnnouncementPanelProps) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetId, setTargetId] = useState('');
  const [targetType, setTargetType] = useState<'beat' | 'pack'>('beat');
  const [discountPrice, setDiscountPrice] = useState(0);
  const [expiresAt, setExpiresAt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnnouncement: FlashSaleAnnouncement = {
      id: Date.now().toString(),
      title,
      message,
      targetId,
      targetType,
      discountPrice,
      expiresAt,
      isActive: true,
    };
    onSaveAnnouncement(newAnnouncement);
    // Reset form
    setTitle('');
    setMessage('');
    setExpiresAt('');
  };

  return (
    <form onSubmit={handleSubmit} className="admin-announcement-form bg-neutral-900 p-6 rounded-lg text-white">
      <h3 className="text-xl font-bold mb-4">Create Flash Sale Announcement</h3>
      
      <div className="mb-4">
        <label className="block text-sm mb-1 text-neutral-300 font-semibold">Sale Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="e.g., 24-Hour Beat Flash Sale!" 
          className="w-full p-2.5 bg-neutral-800 rounded border border-neutral-700 text-sm text-white outline-none focus:border-purple-500 transition-colors"
          required 
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1 text-neutral-300 font-semibold">Announcement Message</label>
        <textarea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Get this exclusive loop package for half off right now..." 
          className="w-full p-2.5 bg-neutral-800 rounded border border-neutral-700 text-sm text-white outline-none focus:border-purple-500 transition-colors h-24"
          required 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1 text-neutral-300 font-semibold">Target Type</label>
          <select 
            value={targetType} 
            onChange={(e) => setTargetType(e.target.value as 'beat' | 'pack')}
            className="w-full p-2.5 bg-neutral-800 rounded border border-neutral-700 text-sm text-white outline-none focus:border-purple-500 transition-colors"
          >
            <option value="beat">Single Beat</option>
            <option value="pack">Beat Pack / Mini Pack</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1 text-neutral-300 font-semibold">Target ID / Name</label>
          <input 
            type="text" 
            value={targetId} 
            onChange={(e) => setTargetId(e.target.value)} 
            placeholder="Enter Beat/Pack ID" 
            className="w-full p-2.5 bg-neutral-800 rounded border border-neutral-700 text-sm text-white outline-none focus:border-purple-500 transition-colors"
            required 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1 text-neutral-300 font-semibold">Discount Price ($)</label>
          <input 
            type="number" 
            value={discountPrice} 
            onChange={(e) => setDiscountPrice(Number(e.target.value))} 
            className="w-full p-2.5 bg-neutral-800 rounded border border-neutral-700 text-sm text-white outline-none focus:border-purple-500 transition-colors"
            required 
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-neutral-300 font-semibold">Expiration Date & Time</label>
          <input 
            type="datetime-local" 
            value={expiresAt} 
            onChange={(e) => setExpiresAt(e.target.value)} 
            className="w-full p-2.5 bg-neutral-800 rounded border border-neutral-700 text-sm text-white outline-none focus:border-purple-500 transition-colors"
            required 
          />
        </div>
      </div>

      <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-[0.99] cursor-pointer">
        Publish Flash Sale Banner
      </button>
    </form>
  );
};
