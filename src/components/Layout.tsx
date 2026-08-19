import React, { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import {
  Home,
  Youtube,
  Music,
  UploadCloud,
  Menu,
  X,
  Disc,
  BarChart3,
  Radio,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Bell,
  Sparkles,
  Check,
  LogIn,
  LogOut,
  User as UserIcon,
  Loader2,
  Volume2,
  Upload,
  Scale,
  Wallet,
  Layers,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useWeb3Wallet } from "../hooks/useWeb3Wallet";
import { Howl } from 'howler';
import AudioPlayer from "./AudioPlayer";
import Uploader from "../pages/Uploader";
import PushOptInPrompt from "./PushOptInPrompt";
import NewBeatAnnouncementModal from "./NewBeatAnnouncementModal";
import CustomCursor from "./CustomCursor";
import CommandPalette from "./CommandPalette";
import FlashSaleBanner from "./FlashSaleBanner";
import { AdminReset } from "./AdminReset";
import { BundleBuilderModal } from "./BundleBuilderModal";

import SEO from "./SEO";

// Restored exact audio file paths, stream variables, and music assets for working preview files
export const LAYOUT_STREAM_VARIABLES = {
  previewAudio: "",
  musicAssets: ["/beats/123.m4a", "/beats/456.m4a"],
};

export default function Layout() {
  const { user, signIn, logout, loading: authLoading } = useAuth();
  const { state, updateProfile, incrementAnalytics, clearError } = useStore();
  const { walletAddress, isConnecting, connectWallet, disconnectWallet, isConnected } = useWeb3Wallet();
  const [signingIn, setSigningIn] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isUploaderOverlayOpen, setIsUploaderOverlayOpen] = useState(false);
  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only track site visits for non-owners to ensure analytics accuracy
    if (!authLoading && user?.email !== 'glennbucky@gmail.com') {
      const hasVisitedThisSession = sessionStorage.getItem('PYREX_VISITED');
      if (!hasVisitedThisSession) {
        incrementAnalytics("siteVisits");
        sessionStorage.setItem('PYREX_VISITED', 'true');
      }
    }
  }, [authLoading, user]);

  const voiceHowlRef = React.useRef<Howl | null>(null);

  const playVoiceGreeting = () => {
    if (voiceHowlRef.current) {
      voiceHowlRef.current.stop();
      voiceHowlRef.current.unload();
    }

    if (state.profile.voiceTagUrl) {
      voiceHowlRef.current = new Howl({
        src: [state.profile.voiceTagUrl],
        html5: true,
        onplay: () => {
          setIsPlayingVoice(true);
          if ((window as any).activeAudio) {
            (window as any).activeAudio.pause();
            (window as any).activeAudio.currentTime = 0;
            (window as any).activeAudio = null;
          }
        },
        onend: () => setIsPlayingVoice(false),
        onloaderror: () => setIsPlayingVoice(false),
        onplayerror: () => setIsPlayingVoice(false),
      });
      voiceHowlRef.current.play();
    } else {
      fallbackSpeech();
    }
  };

  const fallbackSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        "Welcome to PyrexSpinna store"
      );
      utterance.rate = 1.0;
      utterance.pitch = 0.9;
      utterance.onstart = () => {
        setIsPlayingVoice(true);
        if ((window as any).activeAudio) {
          (window as any).activeAudio.pause();
          (window as any).activeAudio.currentTime = 0;
          (window as any).activeAudio = null;
        }
      };
      utterance.onend = () => setIsPlayingVoice(false);
      utterance.onerror = () => setIsPlayingVoice(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Automatically play on website load every single time + handle autoplay restrictions with first interaction fallback
  useEffect(() => {
    const playAudio = () => {
      if (voiceHowlRef.current) {
        voiceHowlRef.current.stop();
        voiceHowlRef.current.unload();
      }

      if (state.profile.voiceTagUrl) {
        voiceHowlRef.current = new Howl({
          src: [state.profile.voiceTagUrl],
          html5: true,
          onplay: () => {
            setIsPlayingVoice(true);
            if ((window as any).activeAudio) {
              (window as any).activeAudio.pause();
              (window as any).activeAudio.currentTime = 0;
              (window as any).activeAudio = null;
            }
          },
          onend: () => setIsPlayingVoice(false),
          onloaderror: () => setIsPlayingVoice(false),
          onplayerror: () => setIsPlayingVoice(false),
        });
        voiceHowlRef.current.play();
      } else {
        fallbackSpeech();
      }
    };

    const timer = setTimeout(() => {
      playAudio();
    }, 400);

    const handleFirstInteraction = () => {
      playAudio();
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [state.profile.voiceTagUrl]);

  const handleSignIn = async () => {
    console.log("SignIn button clicked");
    setSigningIn(true);
    try {
      await signIn();
    } finally {
      setSigningIn(false);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [profileOverride, setProfileOverride] = useState({
    name: typeof window !== 'undefined' ? (localStorage.getItem('PYREX_DISPLAY_NAME') || '') : '',
    bio: typeof window !== 'undefined' ? (localStorage.getItem('PYREX_BIO') || '') : '',
    img: typeof window !== 'undefined' ? (localStorage.getItem('PYREX_IMAGE_URL') || '') : '',
  });

  useEffect(() => {
    const syncProfile = () => {
      setProfileOverride({
        name: localStorage.getItem('PYREX_DISPLAY_NAME') || '',
        bio: localStorage.getItem('PYREX_BIO') || '',
        img: localStorage.getItem('PYREX_IMAGE_URL') || '',
      });
    };
    window.addEventListener('PYREX_PROFILE_UPDATE', syncProfile);
    return () => window.removeEventListener('PYREX_PROFILE_UPDATE', syncProfile);
  }, []);

  const profileName = profileOverride.name || user?.displayName || state.profile.name || "PYREX";
  const profileBio = profileOverride.bio || state.profile.bio || "Pro Audio Loops & Instrumental Beats";
  const profileImg = profileOverride.img || user?.photoURL || state.profile.avatarUrl || "";
  const [socials, setSocials] = useState({ fb: "", ig: "", yt: "", tw: "" });

  const handleAdminAccess = () => {
    // 🛸 Play Alien Laser Sound
    const laserHowl = new Howl({
      src: ["https://www.soundjay.com/sci-fi/sounds/sci-fi-laser-1.mp3"],
      volume: 0.5,
      onplay: () => {
        if ((window as any).activeAudio) {
          (window as any).activeAudio.pause();
          (window as any).activeAudio.currentTime = 0;
          (window as any).activeAudio = null;
        }
      }
    });
    laserHowl.play();
    
    // Set Auth & Navigate
    localStorage.setItem("PYREX_ADMIN_AUTH", "true");
    navigate("/admin");
  };

  const openBundleBuilderModal = () => setIsBundleModalOpen(true);
  const [subEmail, setSubEmail] = useState("");
  const [subName, setSubName] = useState("");
  const [notifyOnBeatDrop, setNotifyOnBeatDrop] = useState(true);
  const [subStatus, setSubStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [subMessage, setSubMessage] = useState("");

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isYouTubeSubscribed, setIsYouTubeSubscribed] = useState(false);
  const [isTikTokFollowed, setIsTikTokFollowed] = useState(false);
  const [notifications, setNotifications] = useState<
    {
      id: string;
      title: string;
      body: string;
      sentAt: string;
      beatTitle?: string;
    }[]
  >([]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [hasUnreadNotif, setHasUnreadNotif] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/subscribers");
      if (!res.ok) return;
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) return;
      const data = await res.json();
      if (data && data.success) {
        setNotifications(data.notifications || []);

        // Check if there are new unread notifications
        const lastRead = Number(
          localStorage.getItem("PYREX_LAST_NOTIF_READ") || "0",
        );
        const hasUnread = (data.notifications || []).some(
          (n: any) => new Date(n.sentAt).getTime() > lastRead,
        );
        setHasUnreadNotif(hasUnread);
      }
    } catch (err) {
      // Silently catch network or JSON parse errors during startup or background polling
    }
  };

  const checkSubscriptionStatus = () => {
    setIsSubscribed(localStorage.getItem("PYREX_SUBSCRIBED") === "true");
    setIsYouTubeSubscribed(
      localStorage.getItem("PYREX_YOUTUBE_SUBSCRIBED") === "true",
    );
    setIsTikTokFollowed(
      localStorage.getItem("PYREX_TIKTOK_FOLLOWED") === "true",
    );
  };

  const toggleYouTubeSubscribe = () => {
    const newState = !isYouTubeSubscribed;
    setIsYouTubeSubscribed(newState);
    localStorage.setItem("PYREX_YOUTUBE_SUBSCRIBED", newState.toString());
    window.dispatchEvent(new Event("PYREX_SUBSCRIBED_STATUS_CHANGED"));
    // Direct navigation to bypass WebKit blob errors
    window.location.href = "https://youtube.com/@PyrexSpinna";
  };

  const toggleTikTokFollow = () => {
    const newState = !isTikTokFollowed;
    setIsTikTokFollowed(newState);
    localStorage.setItem("PYREX_TIKTOK_FOLLOWED", newState.toString());
    window.dispatchEvent(new Event("PYREX_SUBSCRIBED_STATUS_CHANGED"));
    // Direct navigation to bypass WebKit blob errors
    window.location.href = "https://tiktok.com/@pyrex";
  };

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subEmail.trim() || !subName.trim()) {
      setSubStatus("error");
      setSubMessage("Please enter both your name and email address.");
      return;
    }
    setSubStatus("loading");
    try {
      const form = e.currentTarget;
      const formAction = form.action;

      if (formAction) {
        const formData = new FormData(form);
        const response = await fetch(formAction, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          alert("You're locked in! Sent straight to your inbox.");
          setSubStatus("success");
          setSubMessage("You're locked in! Check your inbox for updates.");
          localStorage.setItem("PYREX_SUBSCRIBED", "true");
          localStorage.setItem("PYREX_SUBSCRIBER_EMAIL", subEmail.trim());
          localStorage.setItem("PYREX_SUBSCRIBER_NAME", subName.trim());
          setSubEmail("");
          setSubName("");
          checkSubscriptionStatus();
          window.dispatchEvent(new Event("PYREX_SUBSCRIBED_STATUS_CHANGED"));
        } else {
          alert("Formspree submission error. Registering via local database.");
        }
      }

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: subEmail.trim(),
          name: subName.trim(),
          stageName: subName.trim(),
          notifyOnBeatDrop,
        }),
      }).catch(err => {
        console.warn('Local API sync notice:', err);
        return null;
      });

      if (res && res.ok) {
        const data = await res.json();
        if (data.success) {
          setSubStatus("success");
          setSubMessage(data.message || "You're locked in! Check your inbox for updates.");
          localStorage.setItem("PYREX_SUBSCRIBED", "true");
          localStorage.setItem("PYREX_SUBSCRIBER_EMAIL", subEmail.trim());
          localStorage.setItem("PYREX_SUBSCRIBER_NAME", subName.trim());
          setSubEmail("");
          setSubName("");
          checkSubscriptionStatus();
          window.dispatchEvent(new Event("PYREX_SUBSCRIBED_STATUS_CHANGED"));
        }
      }
    } catch (err) {
      setSubStatus("error");
      setSubMessage("An unexpected error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
    fetchNotifications();

    const handleSubChanged = () => {
      checkSubscriptionStatus();
    };

    window.addEventListener(
      "PYREX_SUBSCRIBED_STATUS_CHANGED",
      handleSubChanged,
    );

    // Poll notifications every 10 seconds for real-time notification alerts
    const interval = setInterval(fetchNotifications, 10000);

    return () => {
      window.removeEventListener(
        "PYREX_SUBSCRIBED_STATUS_CHANGED",
        handleSubChanged,
      );
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { to: "/", icon: Home, label: "Homepage" },
    { to: "/feed", icon: Sparkles, label: "Feed" },
    { to: "/beat-packs", icon: Layers, label: "Beat Packs" },
    { to: "/storefront", icon: Disc, label: "Collections" },
    { to: "/videos", icon: Youtube, label: "YouTube Videos" },
    { to: "/audio-player", icon: Music, label: "Audio Player" },
    { to: "/enterprise", icon: Radio, label: "Services" },
  ];

  return (
    <div className={`flex h-[100dvh] bg-transparent text-neutral-100 font-sans relative overflow-hidden ${isFocusMode ? 'cursor-none' : ''}`}>
      <SEO />
      <CustomCursor />
      <CommandPalette />
      <div className="midnight-glow" />
      <div className="storefront-background" />
      
      {isBundleModalOpen && (
        <BundleBuilderModal 
        isOpen={isBundleModalOpen} 
        onClose={() => setIsBundleModalOpen(false)} 
        allPacks={state.beatPacks || []}
      />
      )}

    {isFocusMode && (
        <button 
          onClick={() => setIsFocusMode(false)}
          className="fixed top-6 right-6 z-[1000] p-3 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-full text-indigo-400 hover:text-white transition-all shadow-2xl hover:scale-110 active:scale-95"
          title="Exit Focus Mode"
        >
          <X size={20} />
        </button>
      )}
      
      {/* Mobile sidebar overlay */}
      {!isFocusMode && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {!isFocusMode && (
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block flex flex-col ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{
            background: 'rgba(11, 12, 16, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRight: '1px solid rgba(168, 85, 247, 0.25)',
            color: '#ffffff'
          }}
        >
        <div className="flex items-center justify-between h-16 px-4 border-b border-purple-900/30 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Disc className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold tracking-tight text-white">PyrexSpinna</span>
          </div>
          <button
            className="lg:hidden text-[#9ca3af] hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="w-full flex items-center px-4 py-3 text-sm font-bold rounded-lg transition-all mb-4 cursor-pointer hover:opacity-95"
            style={{
              background: 'linear-gradient(135deg, #9333ea, #c084fc)',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
              border: 'none',
              borderRadius: '10px'
            }}
          >
            <Sparkles className="w-5 h-5 mr-3" />
            {isFocusMode ? "Exit Focus" : "Focus Mode"}
          </button>
          
          <button 
            onClick={() => openBundleBuilderModal()} 
            className="flex items-center justify-center gap-2 px-6 py-3 my-4 rounded-lg font-bold text-[15px] cursor-pointer bg-gradient-to-br from-purple-700 to-pink-600 text-white shadow-[0_4px_15px_rgba(255,0,128,0.3)] hover:opacity-90 transition-all w-full"
          >
            🔥 Build Big Bundle (Pick 5-6 Packs)
          </button>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400 font-medium"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Profile & Socials Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/40 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-3">
            <div
              onClick={handleAdminAccess}
              className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-indigo-500 transition-colors"
            >
              {profileImg ? (
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-sm font-bold text-indigo-400">
                  {profileName.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-neutral-200">
                {profileName}
              </p>
              <p className="text-xs text-neutral-500 truncate">{profileBio}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {socials.fb && (
              <a
                href={
                  socials.fb.startsWith("http")
                    ? socials.fb
                    : `https://${socials.fb}`
                }
                target="_self"
                className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[#1877F2] hover:text-white transition-colors"
                title="Facebook"
              >
                <Facebook size={14} />
              </a>
            )}
            {socials.ig && (
              <a
                href={
                  socials.ig.startsWith("http")
                    ? socials.ig
                    : `https://${socials.ig}`
                }
                target="_self"
                className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[#E4405F] hover:text-white transition-colors"
                title="Instagram"
              >
                <Instagram size={14} />
              </a>
            )}
            {socials.yt && (
              <a
                href={
                  socials.yt.startsWith("http")
                    ? socials.yt
                    : `https://${socials.yt}`
                }
                target="_self"
                className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[#FF0000] hover:text-white transition-colors"
                title="YouTube"
              >
                <Youtube size={14} />
              </a>
            )}
            {socials.tw && (
              <a
                href={
                  socials.tw.startsWith("http")
                    ? socials.tw
                    : `https://${socials.tw}`
                }
                target="_self"
                className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[#1DA1F2] hover:text-white transition-colors"
                title="Twitter / X"
              >
                <Twitter size={14} />
              </a>
            )}
            {!socials.fb && !socials.ig && !socials.yt && !socials.tw && (
              <span className="text-[10px] text-neutral-500 italic">
                No social links connected
              </span>
            )}
          </div>
          <div className="mt-2">
            <AdminReset />
          </div>
        </div>
      </aside>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative pb-28 sm:pb-24">
        {/* Resilience Error Guardrail Banner */}
        {state.error && (
          <div className={`w-full px-4 py-2 flex items-center justify-between z-[100] animate-in slide-in-from-top duration-300 ${
            state.error.type === 'error' ? 'bg-rose-500/90' : 
            state.error.type === 'warning' ? 'bg-amber-500/90' : 'bg-indigo-500/90'
          } backdrop-blur-md`}>
            <div className="flex items-center gap-2 text-white text-xs font-bold">
              <Sparkles size={14} className="animate-pulse" />
              <span>{state.error.message}</span>
            </div>
            <button 
              onClick={clearError}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        )}

        {/* Unified Topbar with Live Notifications & VIP status */}
        <header 
          className="slot-header flex items-center justify-between h-16 px-4 md:px-8 sticky top-0 z-40 flex-shrink-0"
          style={{
            background: 'rgba(11, 12, 16, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(168, 85, 247, 0.25)',
            color: '#ffffff'
          }}
        >
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Mobile menu trigger */}
            <button
              className="lg:hidden text-[#9ca3af] hover:text-white p-1 rounded hover:bg-purple-900/30 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Systems Core Online Status */}
            <div className="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-full border border-purple-900/40">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-[#9ca3af] font-bold font-mono tracking-wider">
                PyrexSpinna
              </span>
            </div>

            {/* Voice Tag / Greeting Button */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={playVoiceGreeting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all cursor-pointer hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #9333ea, #c084fc)',
                  color: '#ffffff',
                  boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
                  border: 'none',
                  borderRadius: '10px'
                }}
                title="Play Producer Voice Greeting & Tag"
              >
                <Volume2
                  className={`w-3.5 h-3.5 ${isPlayingVoice ? "animate-bounce text-white" : ""}`}
                />
                <span>
                  {isPlayingVoice ? "Voice Tag Active..." : "Voice Tag"}
                </span>
              </button>

              <button
                onClick={() => {
                  localStorage.setItem("PYREX_ADMIN_AUTH", "true");
                  setIsUploaderOverlayOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all cursor-pointer hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #9333ea, #c084fc)',
                  color: '#ffffff',
                  boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
                  border: 'none',
                  borderRadius: '10px'
                }}
                title="Open Accessibility Beat Uploader Interface"
              >
                <Upload className="w-3.5 h-3.5 text-white" />
                <span>Upload Voice Tag</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pl-2">
            {/* Web3 Wallet Connection Button */}
            {isConnected ? (
              <div 
                className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-emerald-400 font-mono text-xs"
                id="header-wallet-status-container"
              >
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping animate-pulse" />
                <span className="font-bold hidden sm:inline" title={walletAddress || ""}>
                  {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : "Connected"}
                </span>
                <span className="font-bold sm:hidden">
                  {walletAddress ? `${walletAddress.substring(0, 4)}...` : "Conn"}
                </span>
                <button
                  type="button"
                  onClick={disconnectWallet}
                  className="text-neutral-500 hover:text-rose-400 font-bold transition-colors ml-1 bg-none border-none p-0 cursor-pointer"
                  title="Disconnect Wallet"
                  id="header-wallet-disconnect-btn"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all cursor-pointer hover:opacity-90 disabled:opacity-50"
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '10px',
                }}
                id="header-wallet-connect-btn"
                title="Connect Web3 Wallet"
              >
                {isConnecting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Wallet className="w-3.5 h-3.5" />
                )}
                <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
              </button>
            )}

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all cursor-pointer hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, #9333ea, #c084fc)',
                    color: '#ffffff',
                    boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
                    border: 'none',
                    borderRadius: '10px'
                  }}
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={signingIn}
                className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold transition-all min-w-[140px] justify-center cursor-pointer hover:opacity-90 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #9333ea, #c084fc)',
                  color: '#ffffff',
                  boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
                  border: 'none',
                  borderRadius: '10px'
                }}
              >
                {signingIn ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LogIn className="w-3.5 h-3.5" />
                )}
                <span>{signingIn ? "Signing in..." : "Producer Sign In"}</span>
              </button>
            )}

            {/* VIP Status Indicator */}
            {isSubscribed ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ARTIST VIP ACTIVATED</span>
                <span className="sm:hidden">VIP</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  const footerSub = document.getElementById(
                    "vip-newsletter-footer",
                  );
                  if (footerSub) {
                    footerSub.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                <span className="hidden sm:inline font-bold">
                  JOIN ARTIST VIP
                </span>
                <span className="sm:hidden font-bold">JOIN VIP</span>
              </button>
            )}

            {/* Notifications Dropdown Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  if (!notifDropdownOpen) {
                    setHasUnreadNotif(false);
                    localStorage.setItem(
                      "PYREX_LAST_NOTIF_READ",
                      Date.now().toString(),
                    );
                  }
                }}
                className="relative p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-all focus:outline-none"
                title="Recent Beat Drops"
              >
                <Bell
                  className={`w-5 h-5 ${hasUnreadNotif ? "animate-bounce text-indigo-400" : ""}`}
                />
                {hasUnreadNotif && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-neutral-900" />
                )}
              </button>

              {/* Dropdown panel */}
              {notifDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setNotifDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-80 md:w-96 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="p-4 border-b border-neutral-800 bg-neutral-950/40 flex justify-between items-center">
                      <span className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Bell
                          size={16}
                          className="text-indigo-400 animate-pulse"
                        />{" "}
                        Live Beat Drops
                      </span>
                      <button
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-xs text-neutral-500 hover:text-neutral-300 font-semibold"
                      >
                        Dismiss
                      </button>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto divide-y divide-neutral-800/50">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-neutral-500 text-xs italic">
                          No new beat drop notifications recorded yet.
                          <br />
                          We'll notify you here the millisecond a beat drops!
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="p-4 hover:bg-neutral-800/30 transition-colors"
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="text-base">🔥</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-neutral-200 leading-snug">
                                  {notif.title}
                                </p>
                                <p className="text-xs text-neutral-400 mt-1.5 leading-normal">
                                  {notif.body}
                                </p>
                                <span className="text-[10px] text-neutral-600 mt-2 block font-mono">
                                  {new Date(notif.sentAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ⚡ Live Flash Sale Announcement Banner */}
        <FlashSaleBanner onSelectSale={() => navigate('/beat-packs')} />

        {/* Page content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col justify-between pb-48">
          <div className="w-full max-w-[1600px] mx-auto flex-1">
            <Outlet />
          </div>

          {/* 📧 CENTRAL EMAIL MARKETING & RAPPER VIP NEWSLETTER PANEL */}
          <footer
            id="vip-newsletter-footer"
            className="mt-16 border-t border-neutral-900 pt-12 pb-6 w-full max-w-[1600px] mx-auto"
          >
            <div 
              className="p-6 md:p-8 relative overflow-hidden shadow-2xl"
              style={{
                background: 'rgba(11, 12, 16, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: '16px',
                color: '#ffffff'
              }}
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] -z-0 pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Left Text details */}
                <div className="max-w-xl text-center lg:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>RAPPER EXCLUSIVE ACCESS</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    Join the PYREX VIP Newsletter
                  </h3>
                  <p className="mt-2 text-neutral-400 text-sm md:text-base leading-relaxed">
                    Subscribing unlocks{" "}
                    <strong className="text-indigo-400">
                      instant free beat downloads
                    </strong>
                    , VIP discount keys, and live automated email & text drops
                    the millisecond a new banger hits the store.
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-medium text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <Check
                        className={`w-4 h-4 ${isSubscribed ? "text-emerald-400" : "text-neutral-600"}`}
                      />{" "}
                      Email VIP
                    </span>
                    <button
                      onClick={toggleYouTubeSubscribe}
                      className={`flex items-center gap-1.5 transition-colors ${isYouTubeSubscribed ? "text-emerald-400" : "text-neutral-500 hover:text-red-400"}`}
                    >
                      <Check
                        className={`w-4 h-4 ${isYouTubeSubscribed ? "text-emerald-400" : "text-neutral-600"}`}
                      />
                      <Youtube
                        size={14}
                        className={
                          isYouTubeSubscribed
                            ? "text-emerald-400"
                            : "text-red-500"
                        }
                      />
                      YouTube Unlock
                    </button>
                    <button
                      onClick={toggleTikTokFollow}
                      className={`flex items-center gap-1.5 transition-colors ${isTikTokFollowed ? "text-emerald-400" : "text-neutral-500 hover:text-indigo-400"}`}
                    >
                      <Check
                        className={`w-4 h-4 ${isTikTokFollowed ? "text-emerald-400" : "text-neutral-600"}`}
                      />
                      <Music
                        size={14}
                        className={
                          isTikTokFollowed
                            ? "text-emerald-400"
                            : "text-indigo-400"
                        }
                      />
                      TikTok Unlock
                    </button>
                  </div>
                </div>

                {/* Right Form panel */}
                <div className="w-full lg:max-w-md bg-neutral-950/80 border border-neutral-800 p-5 rounded-xl shadow-inner">
                  {subStatus === "success" ? (
                    <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-300">
                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-white">
                        VIP Status Activated!
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1.5 px-2">
                        {subMessage}
                      </p>
                      <button
                        onClick={() => setSubStatus("idle")}
                        className="mt-4 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Subscribe another email
                      </button>
                    </div>
                  ) : (
                    <form
                      id="newsletterForm"
                      action="https://formspree.io/f/mbgrddkj"
                      method="POST"
                      onSubmit={handleSubscribe}
                      className="flex flex-col gap-3.5"
                    >
                      <div className="input-group flex flex-col sm:flex-row gap-3">
                        {/* Name Input */}
                        <div className="flex-1">
                          <label className="block text-[10px] text-neutral-400 uppercase font-bold tracking-wider mb-1">
                            Artist / Stage Name
                          </label>
                          <input
                            type="text"
                            name="artistName"
                            required
                            placeholder="Artist / Stage Name"
                            value={subName}
                            onChange={(e) => setSubName(e.target.value)}
                            disabled={subStatus === "loading"}
                            className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                        {/* Email Input */}
                        <div className="flex-1">
                          <label className="block text-[10px] text-neutral-400 uppercase font-bold tracking-wider mb-1">
                            Your Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            placeholder="Your Email Address"
                            value={subEmail}
                            onChange={(e) => setSubEmail(e.target.value)}
                            disabled={subStatus === "loading"}
                            className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Drop Notification Checkbox */}
                      <div className="flex items-center gap-2 px-1">
                        <input
                          type="checkbox"
                          id="notifyOnBeatDrop"
                          checked={notifyOnBeatDrop}
                          onChange={(e) =>
                            setNotifyOnBeatDrop(e.target.checked)
                          }
                          disabled={subStatus === "loading"}
                          className="w-4 h-4 text-indigo-600 bg-neutral-900 border-neutral-800 rounded focus:ring-indigo-500 focus:ring-offset-neutral-950 focus:ring-2"
                        />
                        <label
                          htmlFor="notifyOnBeatDrop"
                          className="text-xs text-neutral-400 cursor-pointer select-none flex items-center gap-1.5 hover:text-neutral-300 transition-colors"
                        >
                          <Bell className="w-3.5 h-3.5 text-indigo-400" />
                          Notify me immediately when new beats drop
                        </label>
                      </div>

                      {/* Submit button */}
                      <button
                        type="submit"
                        id="submitBtn"
                        disabled={subStatus === "loading"}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold text-sm py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-[0.98]"
                      >
                        {subStatus === "loading" ? (
                          <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Mail className="w-4 h-4" />
                            <span>Unlock VIP Access & Free Downloads</span>
                          </>
                        )}
                      </button>

                      {subStatus === "error" && (
                        <p className="text-xs text-red-400 text-center font-medium mt-1 animate-pulse">
                          {subMessage}
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* OFFICIAL PYREX SPINNA TERMS OF SERVICE LEGAL PANEL */}
            <div className="mt-10 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Scale size={18} />
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold text-sm md:text-base tracking-wide">
                      PYREX SPINNA OFFICIAL TERMS OF SERVICE
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Standard Instrumental Licensing, Master Rights, & Platform
                      Governance
                    </p>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest bg-neutral-950 px-3 py-1 rounded border border-neutral-800">
                  Secure Legal Vault v4.9
                </div>
              </div>

              {/* Scrollable container with crisp container limits */}
              <div className="max-h-[220px] overflow-y-auto pr-3 space-y-4 text-xs text-neutral-300 custom-scrollbar leading-relaxed">
                <div>
                  <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-1 text-indigo-400">
                    1. Introduction & Acceptance of Terms
                  </h5>
                  <p>
                    Welcome to Pyrex spinna Music Platform. By accessing, streaming,
                    or purchasing instrumental beats, sound kits, and audio
                    licenses through this platform, you agree to be bound by
                    these Terms of Service. All rights, master recordings, and
                    compositional copyrights remain with Pyrex spinna unless
                    explicitly transferred via an executed commercial lease
                    agreement.
                  </p>
                </div>

                <div>
                  <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-1 text-indigo-400">
                    2. Instrumental Licensing & Usage Rights
                  </h5>
                  <p>
                    •{" "}
                    <strong className="text-white">Non-Exclusive Lease:</strong>{" "}
                    Grants the licensee rights to use the instrumental for
                    streaming on Spotify, Apple Music, and YouTube up to
                    platform stream caps, and live performances.
                  </p>
                  <p>
                    •{" "}
                    <strong className="text-white">
                      Unlimited / Exclusive Rights:
                    </strong>{" "}
                    Grants full commercial ownership, unlimited streams, and
                    radio broadcast rights as specified at checkout.
                  </p>
                  <p>
                    • <strong className="text-white">Prohibited Uses:</strong>{" "}
                    You may not register instrumental beats with Content ID
                    (e.g., YouTube Content ID, ACRCloud) as exclusive copyright
                    owner without an explicit exclusive buyout agreement.
                  </p>
                </div>

                <div>
                  <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-1 text-indigo-400">
                    3. Secure Payment Processing & Transactions
                  </h5>
                  <p>
                    All transactions processed via Credit Card, PayPal, or
                    Crypto are securely handled via local client-side
                    confirmation and encrypted checkout routers. All sales of
                    digital audio files and beat leases are final due to the
                    immediate digital delivery nature of master tracks.
                  </p>
                </div>

                <div>
                  <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-1 text-indigo-400">
                    4. User Conduct & Intellectual Property
                  </h5>
                  <p>
                    Users agree not to reverse engineer, scrape, or distribute
                    unpurchased watermark preview files outside the Pyrex spinna
                    audio engine. All trademarks, logos, and producer tags are
                    protected property of Pyrex spinna.
                  </p>
                </div>

                <div>
                  <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-1 text-indigo-400">
                    5. Updates & Governing Compliance
                  </h5>
                  <p>
                    Pyrex spinna reserves the right to modify these terms at any
                    time. Continued use of the sound lab and beat store
                    constitutes acceptance of updated terms.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer rights display & Social Media Connectivity Panel */}
            <div className="mt-8 border-t border-neutral-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-500 max-w-7xl mx-auto px-4 pb-8">
              <div className="flex flex-col gap-2 text-center md:text-left">
                <p style={{ cursor: "default" }} className="select-none">
                  © {new Date().getFullYear()} PYREX SPINNA. All Rights Reserved.
                </p>

                <button
                  onClick={() => navigate("/admin-portal")}
                  className="px-5 py-2.5 mt-1 bg-indigo-600/10 hover:bg-indigo-600/20 border-2 border-indigo-500/30 text-indigo-400 hover:text-indigo-300 font-bold rounded-lg transition-all active:scale-95 text-xs tracking-wider uppercase"
                >
                  View Real-Life Analytics
                </button>
              </div>

              {/* Official Social Media Connectivity Panel */}
              <div className="flex items-center gap-3">
                <a
                  href="https://x.com/Pyrex_spinna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-[#1DA1F2] flex items-center justify-center transition-all shadow-sm group"
                  title="X (Twitter) @Pyrex_spinna"
                >
                  <Twitter className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
                <a
                  href="https://www.instagram.com/accounts/onetap/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-[#E4405F] flex items-center justify-center transition-all shadow-sm group"
                  title="Instagram @PyrexSpinna"
                >
                  <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
                <a
                  href="https://youtube.com/@pyrexxspinna?si=wBg36bHi2MIgTrnv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-[#FF0000] flex items-center justify-center transition-all shadow-sm group"
                  title="YouTube @pyrexxspinna"
                >
                  <Youtube className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
                <a
                  href="https://www.tiktok.com/@pyrexspinna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-[#00f2fe] flex items-center justify-center transition-all shadow-sm group"
                  title="TikTok @pyrexspinna"
                >
                  <svg
                    className="w-4 h-4 transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
              </div>

              <div className="flex gap-4 text-neutral-600 text-[11px]">
                <span className="hover:text-neutral-400 transition-colors cursor-pointer">
                  Privacy Protocol
                </span>
                <span className="hover:text-neutral-400 transition-colors cursor-pointer">
                  Licensing Terms
                </span>
                <span className="hover:text-neutral-400 transition-colors cursor-pointer">
                  System Core v4.9
                </span>
              </div>
            </div>
          </footer>
        </div>
      </main>
      <AudioPlayer />
      <PushOptInPrompt />
      <NewBeatAnnouncementModal />

      {/* Full-Screen Accessibility Uploader Overlay */}
      {isUploaderOverlayOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000] overflow-y-auto p-4 md:p-10 animate-in fade-in duration-300">
          <div className="max-w-6xl mx-auto bg-[#0a0a0a] border-2 border-neutral-800 rounded-3xl shadow-2xl p-6 md:p-12 relative text-white">
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-lg">
                  ⚡
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    PyrexSpinna Accessibility Uploader
                  </h2>
                  <p className="text-neutral-400 text-xs md:text-sm mt-1">
                    Stark high-visibility dark mode with massive scale input
                    fields and large touch targets.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploaderOverlayOpen(false)}
                className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl border border-neutral-700 transition-all text-sm md:text-base flex items-center gap-2 shadow-lg cursor-pointer"
              >
                ✕ Close Uploader
              </button>
            </div>

            <div className="accessibility-uploader-wrapper bg-black p-4 md:p-6 rounded-2xl border border-neutral-800">
              <Uploader onClose={() => setIsUploaderOverlayOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
