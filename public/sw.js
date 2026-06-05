// Service worker for Avexon Admin Panel & Client app
const CACHE_NAME = "avexon-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-512.png"
];

// Install Event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Listener for basic offline fallback
self.addEventListener("fetch", (e) => {
  // Only handle standard GET requests
  if (e.request.method !== "GET" || e.request.url.includes("/api/")) {
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        // Cache newly fetched valid asset
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Quietly fail or return fallback if completely offline
        return caches.match("/");
      });
    })
  );
});

// Push Notification handler
self.addEventListener("push", (event) => {
  let data = { title: "নতুন অর্ডার!", body: "একটি নতুন অর্ডার সফলভাবে রিসিভড হয়েছে।" };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "নতুন অর্ডার!", body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: "/icon-512.png",
    badge: "/icon-512.png",
    vibrate: [200, 100, 200],
    data: {
      url: "/?mode=standalone"
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click behavior
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/") && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow("/?mode=standalone");
      }
    })
  );
});
