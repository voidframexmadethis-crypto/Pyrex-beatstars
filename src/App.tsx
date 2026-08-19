import React, { useEffect, useRef, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import { AnalyticsTracker } from './components/AnalyticsTracker';
import NavigationRestorer from './components/NavigationRestorer';
import { ErrorBoundary } from './components/ErrorBoundary';
import SEO from './components/SEO';
import Layout from './components/Layout';
import { StoreCrashShield } from './components/StoreCrashShield';
import { performCacheBuster, clearEverything } from './utils/cacheBuster';
import { useAppAnalytics } from './hooks/useAppAnalytics';
import Uploader from './pages/Uploader';
import './LayoutShell.css';

// A resilient lazy loader that recovers if a chunk fails to load due to deployment updates or network hiccups
const safeLazy = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  pageName: string
): React.LazyExoticComponent<T> => {
  return lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      console.warn(`[SafeLazy] Dynamic import failed for page: ${pageName}. Automatically healing...`, error);
      if (typeof window !== 'undefined') {
        // Force complete cache wipe if a lazy chunk fails, it's likely a stale deployment
        await clearEverything();
      }
      throw error;
    }
  });
};

// Lazy-loaded pages with custom chunk splitting and auto-healing for optimal performance and safety
const Home = safeLazy(() => import('./pages/Home'), 'Home');
const Feed = safeLazy(() => import('./pages/Feed'), 'Feed');
const Videos = safeLazy(() => import('./pages/Videos'), 'Videos');
const Player = safeLazy(() => import('./pages/Player'), 'Player');
const Storefront = safeLazy(() => import('./pages/Storefront'), 'Storefront');
const BeatPacks = safeLazy(() => import('./pages/BeatPacks'), 'BeatPacks');
const Admin = safeLazy(() => import('./pages/Admin'), 'Admin');
const AdminPortal = safeLazy(() => import('./pages/AdminPortal'), 'AdminPortal');
const EnterpriseMusicPlatform = safeLazy(() => import('./pages/Enterprise'), 'Enterprise');
const PyrexSpinnaStore = safeLazy(() => import('./components/PyrexSpinnaStore'), 'PyrexSpinnaStore');
const ARPitchPortal = safeLazy(() => import('./pages/ARPitchPortal'), 'ARPitchPortal');
const SonicSearchPage = safeLazy(() => import('./pages/SonicSearchPage'), 'SonicSearchPage');
const OfflineSimulator = safeLazy(() => import('./components/OfflineSimulator'), 'OfflineSimulator');
const VaultPage = safeLazy(() => import('./pages/VaultPage'), 'VaultPage');

// Elegant, domain-appropriate page loading indicator
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-neutral-400 gap-4" id="page-loader-fallback">
    <div className="relative flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      <div className="absolute w-6 h-6 border-2 border-indigo-500/20 border-b-indigo-500 rounded-full animate-spin [animation-direction:reverse]" />
    </div>
    <span className="text-xs font-mono tracking-widest uppercase text-neutral-500 animate-pulse">
      Syncing Audio Catalog...
    </span>
  </div>
);

class GlobalErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("GLOBAL ERROR CAUGHT:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center p-6 text-center bg-black" id="global-error-screen">
          <div 
            className="max-w-md w-full p-8 text-center flex flex-col items-center justify-center"
            style={{
              background: 'rgba(11, 12, 16, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              borderRadius: '16px',
              color: '#ffffff'
            }}
          >
            <h1 className="text-3xl font-bold mb-4" style={{ color: '#ffffff' }}>Something went wrong.</h1>
            <p className="mb-8 text-sm" style={{ color: '#9ca3af' }}>The application encountered an unexpected error. We've been notified.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 font-bold transition-all hover:opacity-90 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #9333ea, #c084fc)',
                color: '#ffffff',
                borderRadius: '10px',
                border: 'none',
                boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
                cursor: 'pointer'
              }}
            >
              Return to Safety
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const PYREX_STREAM_VARIABLES = {
  previewAudio: '',
  musicAssets: ['/beats/123.m4a', '/beats/456.m4a']
};

import AppRouter from './components/AppRouter';

export default function App() {
  useAppAnalytics();
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const currentPlayBtn = useRef<HTMLElement | null>(null);

  useEffect(() => {
    performCacheBuster();
    let visitorId = localStorage.getItem('PYREX_VISITOR_ID');
    if (!visitorId) {
      visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('PYREX_VISITOR_ID', visitorId);
    }
    let sessionId = sessionStorage.getItem('PYREX_SESSION_ID');
    if (!sessionId) {
      sessionId = `s_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem('PYREX_SESSION_ID', sessionId);
    }
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId, sessionId })
    }).catch(err => console.error('Visit log error:', err));
  }, []);

  // Intercept all local link clicks and ensure they open in the same tab/container view
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Handle checkout button delegation
      if (target.matches('.checkout-btn')) {
        const beatId = (target as any).dataset.beatId;
        const price = (target as any).dataset.price;
        console.log('Triggering checkout for beat:', beatId, 'price:', price);
        window.dispatchEvent(new CustomEvent('trigger-checkout', { detail: { beatId, price } }));
      }

      const link = target.closest('a');
      if (link) {
        if (link.hostname === window.location.hostname) {
          link.setAttribute('target', '_self');
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return (
    <GlobalErrorBoundary>
      <div className="app-shell relative min-h-screen w-full overflow-x-hidden">
        <div className="relative z-10 min-h-screen flex flex-col bg-transparent">
          <AuthProvider>
            <StoreProvider>
              <StoreCrashShield>
                <AudioPlayerProvider>
                  <HashRouter>
                    <AnalyticsTracker />
                    <NavigationRestorer />
                    <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/router" element={<AppRouter />} />
                      <Route 
                        path="/" 
                        element={
                          <ErrorBoundary name="Main Layout">
                            <Layout />
                          </ErrorBoundary>
                        }
                      >
                        <Route 
                          index 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Home Page">
                                <Home />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="videos" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Videos Page">
                                <Videos />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="player" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Player Page">
                                <Player />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="player/:track" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Player Page (Track Detail)">
                                <Player />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="audio-player" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Audio Player Page">
                                <Player />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="audio-player/:track" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Audio Player Page (Track Detail)">
                                <Player />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="beat/:id" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Beat Page">
                                <Player />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="beats/:id" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Beats Page">
                                <Player />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="track/:id" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Track Page">
                                <Player />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="music/:id" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Music Page">
                                <Player />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="beats/:beatId" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Storefront (Selected Beat)">
                                <Storefront />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="storefront" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Storefront Page">
                                <Storefront />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="beat-packs" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Beat Packs Page">
                                <BeatPacks />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="beat-pack" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Beat Pack Page">
                                <BeatPacks />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="feed" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Feed Page">
                                <Feed />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="admin-portal" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Admin Portal Page">
                                <AdminPortal />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="upload" 
                          element={
                            <div className="slot-uploader">
                              <ErrorBoundary name="Uploader Page">
                                <Uploader />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="uploader" 
                          element={
                            <div className="slot-uploader">
                              <ErrorBoundary name="Uploader Page">
                                <Uploader />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="admin" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Admin Page">
                                <Admin />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="enterprise" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="Enterprise Platform">
                                <EnterpriseMusicPlatform />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="pyrex-store" 
                          element={
                            <div className="slot-catalog">
                              <ErrorBoundary name="PyrexSpinna Store">
                                <PyrexSpinnaStore />
                              </ErrorBoundary>
                            </div>
                          } 
                        />
                        <Route 
                          path="anr" 
                          element={
                            <ErrorBoundary name="A&R Portal">
                              <ARPitchPortal />
                            </ErrorBoundary>
                          } 
                        />
                        <Route 
                          path="sonic-match" 
                          element={
                            <ErrorBoundary name="Sonic Match">
                              <SonicSearchPage />
                            </ErrorBoundary>
                          } 
                        />
                        <Route 
                          path="offline-test" 
                          element={
                            <ErrorBoundary name="Offline Test">
                              <OfflineSimulator />
                            </ErrorBoundary>
                          } 
                        />
                        <Route 
                          path="vault/:id" 
                          element={
                            <ErrorBoundary name="Private Vault">
                              <VaultPage />
                            </ErrorBoundary>
                          } 
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Route>
                    </Routes>
                  </Suspense>
                </HashRouter>
              </AudioPlayerProvider>
            </StoreCrashShield>
          </StoreProvider>
          </AuthProvider>
        </div>
      </div>
    </GlobalErrorBoundary>
  );
}
