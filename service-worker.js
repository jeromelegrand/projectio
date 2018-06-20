const dataCacheName = 'projetIoData-v1';
const cacheName = 'projetIo';

// Fichiers disponibles hors-connexion
const filesToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    '/styles/inline.css',
    '/favicon.ico',
    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css',
    'https://use.fontawesome.com/releases/v5.0.10/js/all.js',
    '/node_modules/adler32cs/adler32cs.js',
    '/node_modules/cf-blob.js/Blob.js',
    '/node_modules/file-saver/FileSaver.js',
    'https://unpkg.com/jspdf@latest/dist/jspdf.min.js',
];

// Installation du Service Worker
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

// Activation du Service Worker
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// Mise à jour des donénes
self.addEventListener('fetch', function (e) {
    console.log('[Service Worker] Fetch', e.request.url);

    e.respondWith(
        caches.open(dataCacheName).then(function (cache) {
            return fetch(e.request).then(function (response) {
                cache.put(e.request.url, response.clone());
                return response;
            });
        })
    );
});
