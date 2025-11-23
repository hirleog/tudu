// ==========================
//   RECEBIMENTO DO PUSH
// ==========================
self.addEventListener("push", (event) => {
  console.log("[SW] Push recebido:", event);

  if (!event.data) {
    console.log("[SW] Push sem payload");
    return;
  }

  const data = event.data.json();

  const options = {
    body: data.body,
    icon: data.icon || "assets/icons/icon-192x192.png",
    badge: data.badge || "assets/icons/badge-72x72.png",
    vibrate: data.vibrate || [200, 100, 200],
    requireInteraction: data.requireInteraction ?? true, // Mantém a notificação presa até interação
    data: {
      url: data.url,
    },

    // ANDROID HEADS-UP PUSH 🔥🔥🔥
    // Deixa como push prioridade máxima, igual Instagram
    tag: "tudu-push",
    renotify: true,
    actions: [
      {
        action: "open",
        title: "Abrir",
      },
    ],
  };

  // Alguns devices Android exigem explicitamente o channelId
  if (data.channelId) {
    options.channelId = data.channelId;
  }

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// ==========================
//   CLICK NA NOTIFICAÇÃO
// ==========================
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notificação clicada:", event.notification);
  event.notification.close();

  // Abre ou foca aba já aberta
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientsList) => {
        for (const client of clientsList) {
          if (client.url === event.notification.data.url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
  );
});
