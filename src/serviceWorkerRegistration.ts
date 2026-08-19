export function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/sw.js';
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('[SW] Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('[SW] Service Worker registration failed:', error);
        });
    });
  } else if (process.env.NODE_ENV !== 'production' && 'serviceWorker' in navigator) {
    // In dev, we can still register it if we want to test
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
