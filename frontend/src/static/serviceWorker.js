function log(...data) {
  console.log("SWv1.1", ...data);
}

log("SW Script executing");


const STATIC_CACHE_NAME = 'taskMaster-static-v0';

self.addEventListener('install', event => {
  log('install', event);
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      return cache.addAll([
          '/',
          '/offline',
          //CSS
          '/css/createTask.css',
          '/css/folder.css',
          '/css/group.css',
          '/css/login.css',
          '/css/main-style.css',
          '/css/modifyTask.css',
          '/css/registration.css',
          '/css/settings.css',
          '/css/styles.css',
          '/css/offline.css',
          '/js/fullcalendar/lib/main.css',
          //img
          '/img/cloud-slash.png',
          '/img/calendarFavicon.png',
          '/img/settingsPNG.png',
          '/img/alertFavicon.png',
          '/img/icon-192x192.png',
          '/img/icon-256x256.png',
          '/img/icon-384x384.png',
          '/img/icon-512x512.png',
          //Scripts
          '/js/fullcalendar/lib/main.js',
          '/js/common.js',
          '/js/createTask.js',
          '/js/folder.js',
          '/js/group.js',
          '/js/login.js',
          '/js/main-action.js',
          '/js/modifyTask.js',
          '/js/registration.js',
          '/js/settings.js',
          'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css',
          'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
        ]);
      })
    );
  });
  
  self.addEventListener('activate', event => {
    log('activate', event);
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName.startsWith('taskMaster-') && cacheName != STATIC_CACHE_NAME;
          }).map(cacheName => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    var requestUrl = new URL(event.request.url);
    //Treat API calls (to our API) differently
    if(requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api')) {
      //If we are here, we are intercepting a call to our API
      if(event.request.method === "GET") {
        //Only intercept (and cache) GET API requests
        event.respondWith(
          fetchAndCache(event.request)
        );
      }
    }
    else {
      //If we are here, this was not a call to our API
      event.respondWith(
        cacheFirst(event.request)
      );
    }
  
  });
  
  
  function cacheFirst(request) {
    return caches.match(request)
    .then(response => {
      //Return a response if we have one cached. Otherwise, get from the network
      return response || fetchAndCache(request);
    })
    .catch(error => {
      return caches.match('/offline');
    })
  }
  
  
  
  function fetchAndCache(request) {
    return fetch(request).then(response => {
      if(response.ok) {
        caches.open(STATIC_CACHE_NAME).then((cache) => {
          cache.put(request, response);
        });
      }
      return response.clone();
    });
  }
  
  
  
  self.addEventListener('message', event => {
    log('message', event.data);
    if(event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });