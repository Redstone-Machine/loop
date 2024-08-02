// Befintlig caching och fetch-hantering
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/main-page',
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Ny logik för att hantera push-notifikationer
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Du har ett nytt meddelande!',
    icon: data.icon || '/default-icon.png',
    badge: data.badge || '/default-badge.png',
    data: data.url || '/'
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Nytt meddelande', options)
  );
});

// Hantera klick på notifikationen
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});



self.addEventListener('notificationclick', function(event) {
  // Extract the chatId from the notification data
  const chatId = event.notification.data.chatId;

  console.log('chatId inside notification:', chatId);

  // Close the notification
  event.notification.close();

  // Focus or open the PWA and navigate to the correct chat
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Check if there is already a window/tab open with the PWA
      for (let client of windowClients) {
        if (client.url.includes(`/chat/${chatId}`) && 'focus' in client) {
          return client.focus();
        }
      }

      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(`/chat/${chatId}`);
      }
    })
  );
});
