// Replace with your actual Google Analytics Measurement ID (e.g., G-XXXXXXXXXX)
export const GA_MEASUREMENT_ID = localStorage.getItem('pyrex_ga_measurement_id') || 'G-YOUR_MEASUREMENT_ID_HERE';

export function initGoogleAnalytics() {
  if (typeof window === 'undefined') return;

  const currentId = localStorage.getItem('pyrex_ga_measurement_id') || GA_MEASUREMENT_ID;
  if (!currentId || currentId === 'G-YOUR_MEASUREMENT_ID_HERE') return;

  // Prevent duplicate script injection
  if (document.getElementById('ga-script')) return;

  // Inject the global gtag.js script
  const script = document.createElement('script');
  script.id = 'ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${currentId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  // @ts-ignore
  function gtag() {
    // @ts-ignore
    window.dataLayer.push(arguments);
  }
  // @ts-ignore
  window.gtag = gtag;
  // @ts-ignore
  gtag('js', new Date());
  // @ts-ignore
  gtag('config', currentId, {
    send_page_view: true
  });
}

// Track real custom actions (Beat Plays, Downloads, Purchases)
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  // @ts-ignore
  if (typeof window.gtag === 'function') {
    // @ts-ignore
    window.gtag('event', eventName, eventParams);
  } else {
    console.warn('Google Analytics not initialized yet.');
  }
}

// Aliases for compatibility
export const initGA = initGoogleAnalytics;
export const trackAnalyticsEvent = trackEvent;
export const trackPageView = (path: string) => {
  trackEvent('page_view', { page_path: path });
};
export const trackBeatPlay = (beatTitle: string, bpm: number = 128) => {
  trackEvent('play_beat', { track_title: beatTitle, bpm });
};
export const trackBeatDownload = (beatTitle: string, fileType: string = 'wav') => {
  trackEvent('download_track', { track_title: beatTitle, file_type: fileType });
};
export const trackPurchase = (amount: number, licenseType: string = 'Exclusive') => {
  trackEvent('purchase_license', { license_type: licenseType, value: amount });
};
