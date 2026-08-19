import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight, X } from 'lucide-react';
import { FlashSaleAnnouncement } from '../types';

interface FlashSaleBannerProps {
  announcement?: FlashSaleAnnouncement | any;
  sale?: FlashSaleAnnouncement;
  onSelectSale?: (sale: FlashSaleAnnouncement) => void;
}

export const FlashSaleBanner = ({ announcement, sale, onSelectSale }: FlashSaleBannerProps) => {
  const [activeAnnouncement, setActiveAnnouncement] = useState<FlashSaleAnnouncement | any>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isExpired: false });
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const active = announcement || sale;
    if (active) {
      setActiveAnnouncement(active);
      return;
    }

    // Check localStorage for admin created flash sale
    try {
      const saved = localStorage.getItem('pyrex_active_flash_sale');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isActive) {
          setActiveAnnouncement(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse active flash sale:', e);
    }

    // Default sample active sale
    const defaultSale: FlashSaleAnnouncement = {
      id: 'flash-sale-live-1',
      title: 'LIMITED TIME FLASH SALE',
      message: 'Get 50% OFF Exclusive Beat Packs & Trap Master Leases!',
      targetId: 'pack-trap-vol1',
      targetType: 'pack',
      discountPrice: 49.99,
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      isActive: true
    };
    setActiveAnnouncement(defaultSale);
  }, [announcement, sale]);

  useEffect(() => {
    if (!activeAnnouncement || !activeAnnouncement.expiresAt) return;

    const targetTime = new Date(activeAnnouncement.expiresAt).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isExpired: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAnnouncement?.expiresAt]);

  if (!activeAnnouncement || !activeAnnouncement.isActive || timeLeft.isExpired || isDismissed) {
    return null; // Hide banner automatically when expired or dismissed
  }

  return (
    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white p-3 text-center border-b border-purple-500/30 flex flex-wrap items-center justify-center gap-4 relative z-40 shadow-lg text-xs sm:text-sm">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 bg-amber-500 text-black px-2 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider animate-pulse">
          <Flame size={12} className="fill-black" />
          Flash Sale
        </span>
        <span className="font-bold text-purple-300">🔥 {activeAnnouncement.title}:</span>
        <span className="text-neutral-200">{activeAnnouncement.message}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-black/40 px-3 py-1 rounded font-mono text-xs sm:text-sm text-yellow-400 border border-yellow-500/20 flex items-center gap-1.5">
          <Clock size={13} className="text-amber-400" />
          <span>
            Ends in: {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
          </span>
        </div>

        {onSelectSale && activeAnnouncement.discountPrice && (
          <button
            onClick={() => onSelectSale(activeAnnouncement)}
            className="bg-amber-400 hover:bg-amber-300 text-black font-black px-3 py-1 rounded-lg flex items-center gap-1 transition-all active:scale-95 shadow-md cursor-pointer text-xs"
          >
            <span>Claim ${activeAnnouncement.discountPrice.toFixed(2)}</span>
            <ArrowRight size={12} />
          </button>
        )}

        <button
          onClick={() => setIsDismissed(true)}
          className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
          title="Close Flash Sale"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default FlashSaleBanner;
