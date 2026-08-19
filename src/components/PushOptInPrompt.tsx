import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Sparkles, Check, AlertTriangle } from 'lucide-react';

// Helper function to convert base64 public VAPID key to Uint8Array for PushManager subscribe
function urlBase64ToUint8Array(base64String: string) {
  if (!base64String || typeof base64String !== 'string') {
    return new Uint8Array(0);
  }
  try {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  } catch (err) {
    console.error("Failed to decode base64 VAPID key:", err);
    return new Uint8Array(0);
  }
}

export default function PushOptInPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check if push is supported and permissions are eligible
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications not supported in this browser.');
      return;
    }

    // Check if user has already granted/denied permission
    if (Notification.permission === 'granted') {
      // Re-register if needed, but don't show prompt
      return;
    }

    if (Notification.permission === 'denied') {
      return;
    }

    // Check if user dismissed prompt recently (wait 24 hours before asking again)
    const lastDismissed = localStorage.getItem('KRYPSIDE_PUSH_PROMPT_DISMISSED');
    if (lastDismissed) {
      const timeElapsed = Date.now() - parseInt(lastDismissed, 10);
      const oneDay = 24 * 60 * 60 * 1000;
      if (timeElapsed < oneDay) {
        return;
      }
    }

    // Check if we are on a mobile device or simulating
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // We show it for both mobile visitors (requested) and as a desktop option for premium UX
    // Let's delay the prompt slightly for a better user experience (3 seconds after page load)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('KRYPSIDE_PUSH_PROMPT_DISMISSED', Date.now().toString());
    setIsVisible(false);
  };

  const handleOptIn = async () => {
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      // 1. Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission was denied.');
      }

      // 2. Fetch VAPID public key from backend
      const vapidRes = await fetch('/api/push/vapid-public-key');
      if (!vapidRes.ok) {
        throw new Error('Failed to fetch VAPID server configuration.');
      }
      const vapidData = await vapidRes.json();
      if (!vapidData.success || !vapidData.publicKey) {
        throw new Error('VAPID public key not configured on server.');
      }

      // 3. Register/Get Service Worker registration
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registration ready:', registration);

      // 4. Ensure SW is active
      let activeRegistration = registration.active;
      if (!activeRegistration) {
        // Wait for it to become active if it's installing/waiting
        activeRegistration = await new Promise<ServiceWorker | null>((resolve) => {
          const sw = registration.installing || registration.waiting;
          if (sw) {
            sw.addEventListener('statechange', (e) => {
              if (sw.state === 'activated') {
                resolve(registration.active);
              }
            });
          } else {
            resolve(registration.active);
          }
        });
      }

      // 5. Subscribe to push manager
      const convertedVapidKey = urlBase64ToUint8Array(vapidData.publicKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      console.log('Subscribed to Push Manager successfully:', subscription);

      // 6. Send subscription to Express backend
      const saveRes = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription })
      });

      if (!saveRes.ok) {
        throw new Error('Failed to synchronize subscription with Krypside backend.');
      }

      const saveResult = await saveRes.json();
      if (!saveResult.success) {
        throw new Error(saveResult.error || 'Server rejected subscription details.');
      }

      setStatus('success');
      
      // Auto-close after 3 seconds on success
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);

    } catch (err: any) {
      console.error('Error enabling push notifications:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Push registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div id="push-optin-prompt-container" className="fixed bottom-0 left-0 right-0 z-50 p-4 md:bottom-6 md:right-6 md:left-auto md:max-w-md w-full">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-slate-950/85 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Background glowing orb */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

            {status === 'success' ? (
              <div className="flex flex-col items-center text-center py-4 animate-in zoom-in duration-300">
                <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mb-3">
                  <Check className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-lg font-bold text-white tracking-wide">ALERTS ENABLED!</h4>
                <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
                  You are now on the official VIP list. You will receive real-time push drop alerts the second new beats go live!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                      <Bell className="w-5 h-5 text-indigo-400 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">Krypside Live</span>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <h4 className="text-sm md:text-base font-extrabold text-white tracking-wide">
                        ACTIVATE BEAT DROP ALERTS
                      </h4>
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="p-1 text-neutral-400 hover:text-white rounded-full bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800 transition-all flex-shrink-0"
                    aria-label="Close notification opt-in prompt"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                  Rappers & Artists: Opt in to receive direct background notifications on your device as soon as a new lease or exclusive instrumental drops. Beat licensing slots fill up fast!
                </p>

                {status === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 flex items-start gap-2 text-[11px] text-red-400">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div className="leading-tight">
                      <strong>Failed to subscribe:</strong> {errorMessage || 'Please check browser settings and allow permissions.'}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2.5 mt-1">
                  <button
                    onClick={handleDismiss}
                    className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={handleOptIn}
                    className="flex-1 py-2 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 hover:shadow-indigo-500/30 transition-all duration-200 flex items-center justify-center gap-1.5"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Enabling...</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5" />
                        <span>Allow Alerts</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
