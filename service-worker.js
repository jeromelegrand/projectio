const dataCacheName = 'projetIoData-v1';
const cacheName = 'projetIo';
const filesToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    '/styles/inline.css',
    '/favicon.ico',
    '/bootstrap/bootstrap.min.css',
    '/bootstrap/jquery-3.3.1.slim.min.js',
    '/bootstrap/popper.min.js',
    '/bootstrap/bootstrap.min.js',
    '/bootstrap/fontawesome.js',
    '/jspdf.js',
    'https://use.fontawesome.com/releases/v5.0.10/js/all.js',
    '/node_modules/adler32cs/adler32cs.js',
    '/node_modules/cf-blob.js/Blob.js',
    '/node_modules/file-saver/FileSaver.js',
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

/* mise à jour des données */
self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);

});
