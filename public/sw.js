const cacheName = 'v5';

const cacheAssets = [
    '/offline',
    '/',
    '/manifest.json',
    '/dashboard',
    '/enquiry',
    '/newuser',
    '/newuser/teacher',
    '/classes',
    '/classroom',
    '/users',
    '/login',
    '/teachers',
    '/user-edit',
    '/teacher-edit',
    '/add-blog',
    '/articles',
    '/articles-detail',
    '/add-library',
    '/view-books',
    '/issued-books',
    '/book-edit',
    '/gallery',
    '/add-result',
    '/view-result',
    '/collectfees',
    '/fees-invoice',

    '/css/main.min.css',
    '/css/roboto.woff2',
    '/css/robotobold.woff2',
    '/script/script.js',

    '/img/favicon.png',
    '/img/wave3.svg',
    '/img/sprite.svg',
    '/img/preloader.gif',
    '/img/gvnlogo.jpg',
    '/img/classgif.gif',

    '/img/homebanner.png',
    '/img/no-message.png',
    '/img/underconstruction.png',

    '/img/manifest/icon-192x192.png',
    '/img/manifest/icon-384x384.png',
    '/img/manifest/icon-512x512.png'
]

// Call install event
self.addEventListener('install', (event) => {
    // prevents the waiting, meaning the service worker activates
    // as soon as it's finished installing
    // NOTE: don't use this if you don't want your sw to control pages
    // that were loaded with an older version
    self.skipWaiting();

    event.waitUntil((async () => {
        try {
            // self.cacheName and self.contentToCache are imported via a script
            const cache = await caches.open(cacheName);
            const total = cacheAssets.length;
            let installed = 0;

            await Promise.all(cacheAssets.map(async (url) => {
                let controller;

                try {
                    controller = new AbortController();
                    const { signal } = controller;
                    // the cache option set to reload will force the browser to
                    // request any of these resources via the network,
                    // which avoids caching older files again
                    const req = new Request(url, { cache: 'reload' });
                    const res = await fetch(req, { signal });

                    if (res && res.status === 200) {
                        await cache.put(req, res.clone());
                        installed += 1;
                    } else {
                        console.info(`unable to fetch ${url} (${res.status})`);
                    }
                } catch (e) {
                    console.info(`unable to fetch ${url}, ${e.message}`);
                    // abort request in any case
                    controller.abort();
                }
            }));

            if (installed === total) {
                console.info(`application successfully installed (${installed}/${total} files added in cache)`);
            } else {
                console.info(`application partially installed (${installed}/${total} files added in cache)`);
            }
        } catch (e) {
            console.error(`unable to install application, ${e.message}`);
        }
    })());
});

// Activate event
self.addEventListener('activate', e => {
    console.log('Service Worker: Activated');

    //Remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
})

//Call fetch event
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');

    e.respondWith(
        caches.match(e.request, { ignoreSearch: true }).then(cacheRes => {
            return cacheRes || fetch(e.request)
        }).catch(() => caches.match('/offline'))
    )
})