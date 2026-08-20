import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Settings, 
  CheckCircle2, 
  Globe, 
  ExternalLink, 
  ArrowRight, 
  Disc, 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter, 
  Upload, 
  Image as ImageIcon, 
  Camera, 
  Trash2,
  Check,
  Sparkles,
  Sliders,
  Radio,
  Cpu
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PayPalContainer } from './PayPalContainer';

interface ProducerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'edit';
}

export default function ProducerProfileModal({
  isOpen,
  onClose,
  initialTab = 'profile'
}: ProducerProfileModalProps) {
  const { state, updateProfile, incrementAnalytics } = useStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'edit'>(initialTab);
  
  const [displayName, setDisplayName] = useState('Pyrex Spinna');
  const [titleBadge, setTitleBadge] = useState('Verified Executive Producer');
  const [bioDescription, setBioDescription] = useState('Specializing in aggressive 808 patterns, dark ambient trap melodies, and cinematic sound design for charting recording artists and media sync licensing.');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('@pyrexxspinna');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [twitterLink, setTwitterLink] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('pyrexxspinna@gmail.com');
  const [location, setLocation] = useState('Atlanta / Worldwide');
  const [daws, setDaws] = useState('FL Studio 21 Signature & Ableton 12');
  const [synths, setSynths] = useState('Dave Smith Prophet-6, Moog Sub 37');
  const [monitoring, setMonitoring] = useState('Yamaha HS8 + Focal Alpha 65 EVO');
  const [processing, setProcessing] = useState('Universal Audio Apollo x6, SSL Fusion');

  const [isSaved, setIsSaved] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [userAvailableTokens, setUserAvailableTokens] = useState(1);
  const [isReloaded, setIsReloaded] = useState(false);
  const [contractCheck, setContractCheck] = useState(false);
  const [contractSig, setContractSig] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  useEffect(() => {
    const savedName = localStorage.getItem('PYREX_DISPLAY_NAME');
    const savedBio = localStorage.getItem('PYREX_BIO');
    const savedImg = localStorage.getItem('PYREX_IMAGE_URL');
    const savedBanner = localStorage.getItem('PYREX_BANNER_URL');
    const savedFacebook = localStorage.getItem('PYREX_FACEBOOK');
    const savedInstagram = localStorage.getItem('PYREX_INSTAGRAM');
    const savedYoutube = localStorage.getItem('PYREX_YOUTUBE');
    const savedTwitter = localStorage.getItem('PYREX_TWITTER');
    const savedPaypal = localStorage.getItem('PYREX_PERSONAL_PAYPAL');
    
    const savedSettings = localStorage.getItem('pyrexx_profile_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.displayName) setDisplayName(parsed.displayName);
        if (parsed.title) setTitleBadge(parsed.title);
        if (parsed.bio) setBioDescription(parsed.bio);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.daws) setDaws(parsed.daws);
        if (parsed.synths) setSynths(parsed.synths);
        if (parsed.monitoring) setMonitoring(parsed.monitoring);
        if (parsed.processing) setProcessing(parsed.processing);
        if (parsed.payoutAddress) setPaypalEmail(parsed.payoutAddress);
        if (parsed.instagram) setInstagramLink(parsed.instagram);
      } catch (e) {}
    }

    if (savedName) setDisplayName(savedName);
    else if (state.profile.name) setDisplayName(state.profile.name);

    if (savedBio) setBioDescription(savedBio);
    else if (state.profile.bio) setBioDescription(state.profile.bio);

    if (savedImg) setProfileImageUrl(savedImg);
    else if (state.profile.avatarUrl) setProfileImageUrl(state.profile.avatarUrl);

    if (savedBanner) setBannerImageUrl(savedBanner);
    else if (state.profile.bannerUrl) setBannerImageUrl(state.profile.bannerUrl);

    if (savedFacebook) setFacebookLink(savedFacebook);
    if (savedInstagram) setInstagramLink(savedInstagram);
    if (savedYoutube) setYoutubeLink(savedYoutube);
    if (savedTwitter) setTwitterLink(savedTwitter);
    if (savedPaypal) setPaypalEmail(savedPaypal);
    else if (state.profile.paypalEmail) setPaypalEmail(state.profile.paypalEmail);
  }, [state.profile, isOpen]);

  if (!isOpen) return null;

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setProfileImageUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setBannerImageUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileDataPersistence = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (paypalEmail && !emailRegex.test(paypalEmail)) {
      alert("Please enter a valid PayPal email address.");
      return;
    }

    try {
      localStorage.setItem('PYREX_DISPLAY_NAME', displayName);
      localStorage.setItem('PYREX_BIO', bioDescription);
      localStorage.setItem('PYREX_IMAGE_URL', profileImageUrl);
      localStorage.setItem('PYREX_BANNER_URL', bannerImageUrl);
      localStorage.setItem('PYREX_FACEBOOK', facebookLink.trim());
      localStorage.setItem('PYREX_INSTAGRAM', instagramLink.trim());
      localStorage.setItem('PYREX_YOUTUBE', youtubeLink.trim());
      localStorage.setItem('PYREX_TWITTER', twitterLink.trim());
      localStorage.setItem('PYREX_PERSONAL_PAYPAL', paypalEmail.trim());
      
      const fullSettings = {
        displayName,
        title: titleBadge,
        bio: bioDescription,
        location,
        daws,
        synths,
        monitoring,
        processing,
        email: paypalEmail.trim(),
        instagram: instagramLink.trim(),
        payoutAddress: paypalEmail.trim()
      };
      localStorage.setItem('pyrexx_profile_settings', JSON.stringify(fullSettings));

      await updateProfile({
        name: displayName,
        bio: bioDescription,
        avatarUrl: profileImageUrl,
        bannerUrl: bannerImageUrl,
        paypalEmail: paypalEmail.trim()
      });

      setIsSaved(true);
      window.dispatchEvent(new Event('PYREX_PROFILE_UPDATE'));
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile. The image might be too large. Please try a smaller image.");
    }
  };

  const getCleanHref = (url: string) => {
    if (!url) return '#';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const handleDirectSubmit = () => {
    const signatureText = contractSig.trim();
    if (!contractCheck || signatureText.length < 3) {
      alert("You must check the agreement box and type your legal signature to authorize production.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!clientEmail || !emailRegex.test(clientEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    const requestData = {
      legalSignature: signatureText,
      agreementTimestamp: new Date().toISOString(),
      clientEmail: clientEmail
    };

    console.log("📨 Executed Legal Package Saved to Studio Database:", requestData);
    incrementAnalytics('totalShares'); 

    setIsSubmitted(true);
    setIsRequestSent(true);
    setUserAvailableTokens(0);
    setIsReloaded(false);
  };

  return (
    <div 
      id="producer-profile-modal" 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#0f0c1b] border border-purple-800/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto text-white animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/40 bg-purple-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
              PY
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-none">
                {displayName || 'Pyrex Spinna'}
              </h2>
              <span className="text-[11px] text-purple-300/70">{titleBadge}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Modal Tabs */}
            <div className="flex bg-black/50 p-1 rounded-xl border border-purple-800/40">
              <button
                id="modal-tab-profile-btn"
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-purple-300/70 hover:text-white'
                }`}
              >
                <User size={13} />
                <span>My Profile Home Page</span>
              </button>
              <button
                id="modal-tab-edit-btn"
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'edit'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-purple-300/70 hover:text-white'
                }`}
              >
                <Settings size={13} />
                <span>Edit Profile Settings</span>
              </button>
            </div>

            {/* Close X button */}
            <button
              id="close-profile-modal-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-purple-300 hover:text-white hover:bg-purple-900/50 transition-all ml-1 cursor-pointer"
              title="Close Modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6 custom-scrollbar">
          
          {/* ================= VIEW 1: MY PROFILE HOME PAGE ================= */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Profile Card Banner */}
              <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-gradient-to-r from-purple-950 via-[#190d2e] to-black shadow-xl">
                {/* Banner image or graphic */}
                <div 
                  className="h-36 sm:h-44 w-full bg-cover bg-center relative"
                  style={{
                    backgroundImage: bannerImageUrl 
                      ? `url("${bannerImageUrl}")` 
                      : 'linear-gradient(135deg, #4338ca 0%, #1e1b4b 50%, #0b0716 100%)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c1b] via-transparent to-black/30" />
                </div>

                {/* Avatar & Title Bar */}
                <div className="p-6 pt-0 relative -mt-14 flex flex-col sm:flex-row items-center sm:items-end gap-5">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-zinc-900 border-4 border-[#0f0c1b] overflow-hidden shadow-2xl shrink-0 flex items-center justify-center">
                    {profileImageUrl ? (
                      <img 
                        src={profileImageUrl} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                    ) : (
                      <span className="text-3xl font-extrabold text-purple-400">
                        {displayName.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                    <span className="absolute bottom-1 right-1 bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full border border-black shadow">
                      VERIFIED
                    </span>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 bg-purple-600/30 border border-purple-400/30 text-purple-200 text-xs font-bold px-3 py-1 rounded-full mb-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>{titleBadge}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {displayName}
                    </h1>
                    <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-2xl">
                      {bioDescription}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('edit')}
                      className="bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/40 text-purple-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Settings size={13} />
                      <span>Edit Settings</span>
                    </button>
                  </div>
                </div>

                {/* Location & Catalog Meta */}
                <div className="px-6 pb-6 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold text-purple-200">
                  <span className="bg-black/40 px-3 py-1.5 rounded-lg border border-purple-500/20">📍 {location}</span>
                  <span className="bg-black/40 px-3 py-1.5 rounded-lg border border-purple-500/20">🎹 {daws}</span>
                  <span className="bg-black/40 px-3 py-1.5 rounded-lg border border-purple-500/20">🔥 24h Instant Audio Distribution</span>
                </div>
              </div>

              {/* Grid: Studio Hardware Setup & Social Media Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Studio Rig */}
                <div className="bg-[#140f24] border border-purple-500/20 rounded-2xl p-5 shadow-lg">
                  <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2 mb-3.5">
                    <Cpu size={16} className="text-purple-400" />
                    <span>Studio Gear & Sound Engine</span>
                  </h3>
                  <ul className="text-xs space-y-2 text-purple-200/80">
                    <li className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-lg border border-purple-500/10">
                      <span className="font-semibold text-purple-300">Primary DAWs</span>
                      <span className="truncate max-w-[200px] text-right">{daws}</span>
                    </li>
                    <li className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-lg border border-purple-500/10">
                      <span className="font-semibold text-purple-300">Hardware Synths</span>
                      <span className="truncate max-w-[200px] text-right">{synths}</span>
                    </li>
                    <li className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-lg border border-purple-500/10">
                      <span className="font-semibold text-purple-300">Monitors</span>
                      <span className="truncate max-w-[200px] text-right">{monitoring}</span>
                    </li>
                    <li className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-lg border border-purple-500/10">
                      <span className="font-semibold text-purple-300">Processing Gear</span>
                      <span className="truncate max-w-[200px] text-right">{processing}</span>
                    </li>
                  </ul>
                </div>

                {/* Social Media Channels */}
                <div className="bg-[#140f24] border border-purple-500/20 rounded-2xl p-5 shadow-lg">
                  <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2 mb-3.5">
                    <Globe size={16} className="text-purple-400" />
                    <span>Social Media & Contact Channels</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Instagram */}
                    <div className="bg-black/40 border border-purple-500/10 rounded-xl p-2.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <Instagram size={16} className="text-[#E4405F]" />
                        <span className="text-[10px] font-bold text-purple-400">INSTAGRAM</span>
                      </div>
                      <span className="text-xs text-white font-medium truncate mt-1">{instagramLink || '@pyrexxspinna'}</span>
                    </div>

                    {/* YouTube */}
                    <div className="bg-black/40 border border-purple-500/10 rounded-xl p-2.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <Youtube size={16} className="text-[#FF0000]" />
                        <span className="text-[10px] font-bold text-purple-400">YOUTUBE</span>
                      </div>
                      <span className="text-xs text-white font-medium truncate mt-1">{youtubeLink || 'Pyrex Beats'}</span>
                    </div>

                    {/* Twitter / X */}
                    <div className="bg-black/40 border border-purple-500/10 rounded-xl p-2.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <Twitter size={16} className="text-[#1DA1F2]" />
                        <span className="text-[10px] font-bold text-purple-400">TWITTER / X</span>
                      </div>
                      <span className="text-xs text-white font-medium truncate mt-1">{twitterLink || '@pyrexx'}</span>
                    </div>

                    {/* Facebook */}
                    <div className="bg-black/40 border border-purple-500/10 rounded-xl p-2.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <Facebook size={16} className="text-[#1877F2]" />
                        <span className="text-[10px] font-bold text-purple-400">FACEBOOK</span>
                      </div>
                      <span className="text-xs text-white font-medium truncate mt-1">{facebookLink || 'Official Pyrex'}</span>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-purple-500/10 flex items-center justify-between text-xs">
                    <span className="text-purple-300/70">Payout Email:</span>
                    <span className="text-emerald-400 font-mono font-bold truncate">{paypalEmail}</span>
                  </div>
                </div>

              </div>

              {/* Booking & Collaborations Section */}
              <div className="bg-gradient-to-r from-[#140f24] to-[#1e1338] border border-purple-500/30 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>💼</span>
                    <span>Custom Beat Arrangements & Booking</span>
                  </h4>
                  <p className="text-xs text-purple-300/70 mt-1 max-w-lg">
                    Order exclusive custom compositions, mixing revisions, or vocal stem tailoring directly from the executive producer.
                  </p>
                </div>
                <button
                  id="modal-booking-btn"
                  onClick={() => setBookingModalOpen(true)}
                  className="bg-[#FFC439] hover:bg-[#ffb712] active:scale-95 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg cursor-pointer"
                >
                  Contact for Booking
                </button>
              </div>

            </div>
          )}

          {/* ================= VIEW 2: EDIT PROFILE SETTINGS ================= */}
          {activeTab === 'edit' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {isSaved && (
                <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2 shadow-lg">
                  <Check size={16} className="text-emerald-400" />
                  <span>Profile and studio settings saved successfully!</span>
                </div>
              )}

              <form onSubmit={handleProfileDataPersistence} className="space-y-5">
                
                {/* General Alias & Title */}
                <div className="bg-[#140f24] border border-purple-500/20 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <User size={15} />
                    <span>Producer Identity & Bio</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-purple-300 mb-1">Display Name</label>
                      <input 
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-300 mb-1">Title Badge</label>
                      <input 
                        type="text" 
                        value={titleBadge}
                        onChange={(e) => setTitleBadge(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-300 mb-1">Producer Biography / Sound Ethos</label>
                    <textarea 
                      rows={3}
                      value={bioDescription}
                      onChange={(e) => setBioDescription(e.target.value)}
                      className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-purple-300 mb-1">Location</label>
                      <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-300 mb-1">PayPal / Stripe Payout Email</label>
                      <input 
                        type="email" 
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400 font-mono"
                        placeholder="producer@gmail.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Studio Hardware Specs */}
                <div className="bg-[#140f24] border border-purple-500/20 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <Cpu size={15} />
                    <span>Studio Gear & Synthesizers</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-purple-300 mb-1">Primary DAWs</label>
                      <input 
                        type="text" 
                        value={daws}
                        onChange={(e) => setDaws(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-300 mb-1">Hardware Synths</label>
                      <input 
                        type="text" 
                        value={synths}
                        onChange={(e) => setSynths(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-300 mb-1">Studio Monitors</label>
                      <input 
                        type="text" 
                        value={monitoring}
                        onChange={(e) => setMonitoring(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-300 mb-1">Processing Gear</label>
                      <input 
                        type="text" 
                        value={processing}
                        onChange={(e) => setProcessing(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Imagery & Media Uploads */}
                <div className="bg-[#140f24] border border-purple-500/20 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <ImageIcon size={15} />
                    <span>Profile & Banner Artwork</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Avatar Upload */}
                    <div className="bg-black/40 p-3.5 rounded-xl border border-purple-500/10">
                      <label className="block text-xs font-semibold text-purple-300 mb-2">Avatar Picture</label>
                      <label className="flex items-center justify-center gap-2 w-full py-2 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 rounded-xl text-xs font-bold cursor-pointer transition-all">
                        <Camera size={14} className="text-purple-400" />
                        <span>Upload Avatar File</span>
                        <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="hidden" />
                      </label>
                      <input 
                        type="text"
                        placeholder="Or Image URL..."
                        value={profileImageUrl}
                        onChange={(e) => setProfileImageUrl(e.target.value)}
                        className="w-full mt-2 bg-black/60 border border-purple-500/20 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    {/* Banner Upload */}
                    <div className="bg-black/40 p-3.5 rounded-xl border border-purple-500/10">
                      <label className="block text-xs font-semibold text-purple-300 mb-2">Banner Artwork</label>
                      <label className="flex items-center justify-center gap-2 w-full py-2 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 rounded-xl text-xs font-bold cursor-pointer transition-all">
                        <Upload size={14} className="text-purple-400" />
                        <span>Upload Banner File</span>
                        <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                      </label>
                      <input 
                        type="text"
                        placeholder="Or Banner URL..."
                        value={bannerImageUrl}
                        onChange={(e) => setBannerImageUrl(e.target.value)}
                        className="w-full mt-2 bg-black/60 border border-purple-500/20 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-[#140f24] border border-purple-500/20 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <Globe size={15} />
                    <span>Social Media Handles</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-purple-300 mb-1">Instagram URL or @handle</label>
                      <input 
                        type="text" 
                        value={instagramLink}
                        onChange={(e) => setInstagramLink(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                        placeholder="@pyrexxspinna"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-300 mb-1">YouTube Channel URL</label>
                      <input 
                        type="text" 
                        value={youtubeLink}
                        onChange={(e) => setYoutubeLink(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                        placeholder="youtube.com/@pyrexx"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-300 mb-1">Twitter / X URL</label>
                      <input 
                        type="text" 
                        value={twitterLink}
                        onChange={(e) => setTwitterLink(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                        placeholder="twitter.com/pyrexx"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-300 mb-1">Facebook URL</label>
                      <input 
                        type="text" 
                        value={facebookLink}
                        onChange={(e) => setFacebookLink(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                        placeholder="facebook.com/pyrexx"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-between pt-2">
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 active:scale-95 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg cursor-pointer"
                  >
                    💾 Save Profile Settings
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="text-xs text-purple-400 hover:text-white font-semibold cursor-pointer"
                  >
                    Cancel & Return to Profile View
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </div>

      {/* Booking Funnel Modal (Child) */}
      {bookingModalOpen && (
        <div id="booking-modal-overlay" className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg">
          <div className="relative w-full max-w-md bg-[#161224] border-2 border-[#FFC439] rounded-2xl p-6 text-white shadow-2xl">
            <button 
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-3 right-3 text-rose-400 hover:text-rose-300 text-xl font-bold p-1 cursor-pointer"
            >
              &times;
            </button>

            {bookingStep === 1 && (
              <div className="space-y-4">
                <div className="bg-[#191922] p-4 rounded-xl border border-purple-500/20">
                  <h4 className="text-sm font-bold text-rose-400">⚠️ 0 REQUEST TOKENS REMAINING</h4>
                  <p className="text-xs text-purple-300/70 mt-1">Acquire an arrangement slot to book custom studio time.</p>
                </div>
                <div className="bg-black/50 p-4 rounded-xl border border-purple-500/10 flex justify-between items-center text-sm">
                  <span className="text-purple-300">Custom Production Slot</span>
                  <span className="text-emerald-400 font-bold font-mono">$69.55</span>
                </div>
                <PayPalContainer 
                  onSuccess={(details) => {
                    setUserAvailableTokens(1);
                    setIsReloaded(true);
                    setBookingStep(2);
                  }}
                  onError={(err) => {
                    console.error("PayPal Processing Halted: ", err);
                    alert("Payment service unavailable.");
                  }}
                />
              </div>
            )}

            {bookingStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-emerald-400">🔓 Custom Request Channel Active</h3>
                {isSubmitted ? (
                  <div className="text-center py-6">
                    <p className="text-sm font-bold text-emerald-300">Your custom project request has been logged!</p>
                    <button 
                      onClick={() => {
                        setIsSubmitted(false);
                        setBookingModalOpen(false);
                        setBookingStep(1);
                      }}
                      className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-purple-300 mb-1">Your Email</label>
                      <input 
                        type="email" 
                        value={clientEmail} 
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/30 rounded-lg px-3 py-1.5 text-xs text-white"
                        placeholder="client@gmail.com"
                        required 
                      />
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg border border-purple-500/20 text-[11px] font-mono text-purple-200/80">
                      <strong>Mandatory Terms:</strong> All custom audio tracks are non-exclusive unless buyout is executed. Leaking results in project termination.
                    </div>
                    <label className="flex items-center gap-2 text-xs text-purple-200 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={contractCheck} 
                        onChange={(e) => setContractCheck(e.target.checked)} 
                      />
                      <span>I agree to the producer terms and privacy restrictions.</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Type Full Legal Name to Sign" 
                      value={contractSig} 
                      onChange={(e) => setContractSig(e.target.value)}
                      className="w-full bg-black/60 border border-purple-500/30 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <button 
                      type="button" 
                      onClick={handleDirectSubmit}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg cursor-pointer"
                    >
                      Authorize & Submit Request
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
