importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCuDIAv7S36Ms-ZbQty4vb5MY5KsUn9G4g",
  authDomain: "r-ll-3712e.firebaseapp.com",
  projectId: "r-ll-3712e",
  storageBucket: "r-ll-3712e.firebasestorage.app",
  messagingSenderId: "953944176195",
  appId: "1:953944176195:web:e450772e6151cac27706f6"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || "R&L";

  const options = {
    body: payload?.notification?.body || "You have a new reminder.",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    data: payload?.data || {}
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) return client.focus();
        }

        if (clients.openWindow) {
          return clients.openWindow("./");
        }
      })
  );
});
