// Service Worker for QA Engineering Playbook
const CACHE_NAME = 'qa-playbook-v2.6';
const RUNTIME_CACHE = 'qa-playbook-runtime';

// Files to cache immediately on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/modules.html',
    '/learning-paths.html',
    '/playground.html',
    '/templates.html',
    '/labs.html',
    '/resources.html',
    '/glossary.html',
    '/progress.html',
    '/certificates.html',
    '/styles.css',
    '/app.js',
    '/nav.js',
    '/quizzes.js',
    '/manifest.json',
    '/favicon.svg'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Precaching files');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('[SW] Skip waiting');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[SW] Claiming clients');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Skip chrome-extension and other non-http(s) requests
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached version and update cache in background
                event.waitUntil(updateCache(event.request));
                return cachedResponse;
            }

            // Not in cache, fetch from network
            return fetch(event.request).then((response) => {
                // Don't cache non-successful responses
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }

                // Clone the response
                const responseToCache = response.clone();

                // Cache the fetched response
                caches.open(RUNTIME_CACHE).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(() => {
                // Network failed, return offline page if available
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});

// Update cache in background
async function updateCache(request) {
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
    } catch (error) {
        // Silently fail - we're already serving from cache
        console.log('[SW] Background update failed:', error);
    }
}

// Listen for messages from the client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(RUNTIME_CACHE).then((cache) => {
                return cache.addAll(event.data.urls);
            })
        );
    }
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'sync-progress') {
        event.waitUntil(syncProgress());
    }
});

async function syncProgress() {
    // This would sync progress data when back online
    // For this implementation, we're using localStorage which works offline
    console.log('[SW] Progress data synced');
}

console.log('[SW] Service worker loaded');
