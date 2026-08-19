import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beat } from '../types';
import { useStore } from '../context/StoreContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Beat;
}

export default function ShareModal({ isOpen, onClose, track }: ShareModalProps) {
  const { incrementAnalytics, updateBeat } = useStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !track) return null;

  // Since we use HashRouter, we point to /#/beat/:id
  const shareUrl = `${window.location.origin}/#/beat/${encodeURIComponent(track.id)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const trackTitle = track.title || 'Track Title';
  const trackProducer = track.producer || 'Pyrex Spinna';

  // Social URLs
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this incredible beat: "${trackTitle}" by ${trackProducer} 🎧🔥`)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const tumblrUrl = `https://www.tumblr.com/widgets/share/tool?posttype=link&url=${encodeURIComponent(shareUrl)}&caption=${encodeURIComponent(`Check out "${trackTitle}" by ${trackProducer}!`)}`;

  // Handle Share Click for stats tracking
  const handleShareClick = (platform: string) => {
    // Increment share analytics in database/store
    updateBeat(track.id, { shares: (track.shares || 0) + 1 });
    incrementAnalytics('totalShares');
  };

  const handleInstagramClick = async () => {
    handleShareClick('instagram');
    const shareText = `Check out "${trackTitle}" by ${trackProducer}! 🎧🔥`;
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      if (navigator.share) {
        try {
          await navigator.share({
            title: trackTitle,
            text: shareText,
            url: shareUrl,
          });
          return;
        } catch (err) {
          // fallback
        }
      }
      window.open('https://www.instagram.com/create/select/?source_url=' + encodeURIComponent(shareUrl), '_blank');
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      window.open('https://www.instagram.com/create/select/?source_url=' + encodeURIComponent(shareUrl), '_blank');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
        {/* Click outside to close */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="krypside-share-modal relative z-10" 
          style={{ 
            width: '100%',
            maxWidth: '450px', 
            background: '#121212', 
            border: '1px solid #222', 
            borderRadius: '12px', 
            padding: '24px', 
            color: '#fff', 
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
            boxSizing: 'border-box', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)' 
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#fff' }}>Share Track</h2>
          </div>

          {/* Description */}
          <p style={{ fontSize: '13px', color: '#888', margin: '0 0 20px 0', lineHeight: 1.4 }}>
              Share <span id="shareTrackTitle" style={{ color: '#fff', fontWeight: 600 }}>{trackTitle}</span> with your fans across your favorite social channels:
          </p>

          {/* Social Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {/* Twitter */}
              <a 
                id="shareTwitter" 
                href={twitterUrl} 
                onClick={() => handleShareClick('twitter')}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(29, 161, 242, 0.1)', border: '1px solid rgba(29, 161, 242, 0.2)', borderRadius: '8px', padding: '12px', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 600, transition: 'background 0.2s' }} 
                className="hover:bg-[rgba(29,161,242,0.2)]"
              >
                  <span style={{ fontSize: '16px' }}>🐦</span> Twitter / X
              </a>

              {/* Facebook */}
              <a 
                id="shareFacebook" 
                href={facebookUrl} 
                onClick={() => handleShareClick('facebook')}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(24, 119, 242, 0.1)', border: '1px solid rgba(24, 119, 242, 0.2)', borderRadius: '8px', padding: '12px', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 600, transition: 'background 0.2s' }} 
                className="hover:bg-[rgba(24,119,242,0.2)]"
              >
                  <span style={{ fontSize: '16px' }}>📘</span> Facebook
              </a>

              {/* Instagram */}
              <button 
                id="shareInstagram" 
                onClick={handleInstagramClick}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(228, 64, 95, 0.1)', border: '1px solid rgba(228, 64, 95, 0.2)', borderRadius: '8px', padding: '12px', color: '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600, transition: 'background 0.2s', width: '100%' }} 
                className="hover:bg-[rgba(228,64,95,0.2)]"
              >
                  <span style={{ fontSize: '16px' }}>📸</span> Instagram
              </button>

              {/* Tumblr */}
              <a 
                id="shareTumblr" 
                href={tumblrUrl} 
                onClick={() => handleShareClick('tumblr')}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(53, 70, 92, 0.15)', border: '1px solid rgba(53, 70, 92, 0.3)', borderRadius: '8px', padding: '12px', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 600, transition: 'background 0.2s' }} 
                className="hover:bg-[rgba(53,70,92,0.25)]"
              >
                  <span style={{ fontSize: '16px' }}>📌</span> Tumblr
              </a>
          </div>

          {/* Copy Link Section */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input 
                id="shareLinkInput" 
                type="text" 
                readOnly 
                value={shareUrl} 
                style={{ flexGrow: 1, background: '#070707', border: '1px solid #222', borderRadius: '8px', padding: '10px 12px', color: '#aaa', fontFamily: 'monospace', fontSize: '11px', outline: 'none' }} 
              />
              <button 
                id="shareCopyBtn" 
                onClick={handleCopy}
                style={{ background: '#9333ea', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s', whiteSpace: 'nowrap' }} 
                className="hover:bg-[#a855f7]"
              >
                  {copied ? 'COPIED!' : 'COPY'}
              </button>
          </div>

          {/* Close Button */}
          <button 
            id="shareCloseBtn" 
            onClick={onClose}
            style={{ width: '100%', background: '#1e1e1e', color: '#ccc', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }} 
            className="hover:bg-[#2a2a2a] hover:text-white"
          >
              CLOSE
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
