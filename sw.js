// Service Worker for DrivingPro PWA
const CACHE_NAME = 'drivingpro-v1.5.2';
const STATIC_CACHE = 'drivingpro-static-v1.5.0';
const DYNAMIC_CACHE = 'drivingpro-dynamic-v1.5.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    // Add icon paths when icons are available
    // '/icons/icon-192x192.png',
    // '/icons/icon-512x512.png',
    // '/icons/apple-touch-icon.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Pre-caching static assets');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Installation failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }
    
    // Handle different types of requests
    if (request.method === 'GET') {
        event.respondWith(handleGetRequest(request));
    }
});

// Handle GET requests with cache-first strategy
async function handleGetRequest(request) {
    const url = new URL(request.url);
    
    try {
        // For navigation requests (HTML pages)
        if (request.mode === 'navigate') {
            return await handleNavigationRequest(request);
        }
        
        // For static assets (CSS, JS, images)
        if (isStaticAsset(url.pathname)) {
            return await handleStaticAssetRequest(request);
        }
        
        // For API requests or other dynamic content
        return await handleDynamicRequest(request);
        
    } catch (error) {
        console.error('Service Worker: Fetch failed', error);
        return await handleOfflineFallback(request);
    }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Fall back to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fall back to main page
        return await caches.match('/index.html');
    }
}

// Handle static asset requests
async function handleStaticAssetRequest(request) {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        // Try network and cache the response
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Return offline fallback if available
        return await handleOfflineFallback(request);
    }
}

// Handle dynamic requests (API calls, etc.)
async function handleDynamicRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        // Cache successful GET responses
        if (networkResponse.ok && request.method === 'GET') {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Fall back to cache for GET requests
        if (request.method === 'GET') {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                return cachedResponse;
            }
        }
        
        throw error;
    }
}

// Handle offline fallback
async function handleOfflineFallback(request) {
    // For navigation requests, return the main page
    if (request.mode === 'navigate') {
        const mainPage = await caches.match('/index.html');
        if (mainPage) {
            return mainPage;
        }
    }
    
    // For images, return a placeholder (you can add this later)
    if (request.destination === 'image') {
        // Return cached placeholder image or create a simple SVG response
        return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Offline</text></svg>',
            {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-cache'
                }
            }
        );
    }
    
    // Default fallback
    return new Response('Content not available offline', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}

// Utility function to check if a path is a static asset
function isStaticAsset(pathname) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2'];
    return staticExtensions.some(ext => pathname.endsWith(ext));
}

// Handle background sync (for future features)
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Background sync function
async function doBackgroundSync() {
    try {
        // Here you would sync data when the connection is restored
        console.log('Service Worker: Performing background sync');
        
        // Example: sync user progress, test results, etc.
        // await syncUserData();
        
    } catch (error) {
        console.error('Service Worker: Background sync failed', error);
    }
}

// Handle push notifications (for future features)
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: data.data,
        actions: [
            {
                action: 'open',
                title: 'Open App',
                icon: '/icons/action-open.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icons/action-close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Handle periodic background sync (for future features)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'daily-sync') {
        event.waitUntil(performDailySync());
    }
});

async function performDailySync() {
    try {
        console.log('Service Worker: Performing daily sync');
        // Sync daily progress, update content, etc.
    } catch (error) {
        console.error('Service Worker: Daily sync failed', error);
    }
}

// Cache management utilities
async function cleanupOldCaches() {
    const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE];
    const cacheNames = await caches.keys();
    
    return Promise.all(
        cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
                console.log('Service Worker: Deleting old cache', cacheName);
                return caches.delete(cacheName);
            }
        })
    );
}

// Message handling for communication with main app
self.addEventListener('message', (event) => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_NAME });
            break;
            
        case 'CLEAN_CACHE':
            event.waitUntil(cleanupOldCaches());
            break;
            
        default:
            console.log('Service Worker: Unknown message type', type);
    }
}); 