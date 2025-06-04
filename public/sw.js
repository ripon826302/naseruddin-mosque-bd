
const CACHE_NAME = 'mosque-management-v2';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Enhanced background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'mosque-data-sync') {
    event.waitUntil(syncMosqueData());
  }
});

// Enhanced sync function
function syncMosqueData() {
  return new Promise((resolve) => {
    // Get stored offline data
    const offlineData = localStorage.getItem('mosque-storage');
    
    if (offlineData) {
      // Send to Supabase when online
      fetch('/api/sync-mosque-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: offlineData
      }).then(() => {
        console.log('Mosque data synced successfully');
        resolve();
      }).catch((error) => {
        console.error('Sync failed:', error);
        resolve();
      });
    } else {
      resolve();
    }
  });
}

// Listen for messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
