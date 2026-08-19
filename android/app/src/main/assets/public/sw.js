const CACHE_NAME = 'pyrex-spinna-v1-offline';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Offline fallback for audio files (optional, but good for UX)
const AUDIO_CACHE_NAME = 'pyrex-spinna-audio-cache';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching shell assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== AUDIO_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Special handling for audio files to cache them for offline playback
  const isAudioFile = url.pathname.match(/\.(mp3|wav|m4a|flac|aac|ogg|wma)$/i);
  
  if (isAudioFile) {
    // Bypass SW caching for Internet Archive to avoid CORS/loading issues
    if (url.hostname.includes('archive.org')) {
      return event.respondWith(fetch(event.request));
    }
    
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            // For audio, we need to handle range requests if present
            if (event.request.headers.get('range')) {
              return createRangeResponse(response, event.request);
            }
            return response;
          }
          
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Helper to handle Range requests for cached audio
  async function createRangeResponse(response, request) {
    const data = await response.arrayBuffer();
    const range = request.headers.get('range');
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : data.byteLength - 1;
    const chunk = data.slice(start, end + 1);
    
    return new Response(chunk, {
      status: 206,
      statusText: 'Partial Content',
      headers: new Headers({
        'Content-Range': `bytes ${start}-${end}/${data.byteLength}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunk.byteLength,
        'Content-Type': response.headers.get('Content-Type')
      })
    });
  }

  // Force network-first for API, JSON, and dynamic data
  if (url.pathname.startsWith('/api/') || url.pathname.endsWith('.json') || url.pathname.endsWith('.jsonld')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Generic Stale-While-Revalidate for other assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached, but fetch fresh in background
        fetch(event.request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse);
          });
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
