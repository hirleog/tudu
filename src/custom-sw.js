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

  // 🔍 DEBUG: Log completo do payload recebido
  console.log("[SW] Payload recebido:", {
    title: data.title,
    url: data.url,
    dataUrl: data.data?.url,
    fullData: data,
  });

  // ✅ CORREÇÃO: Garante que a URL vem de múltiplas fontes possíveis
  const notificationUrl =
    data.url || data.data?.url || "https://use-tudu.com.br";

  console.log("[SW] URL que será usada:", notificationUrl);

  const options = {
    body: data.body,
    icon: data.icon || "assets/icons/icon-192x192.png",
    badge: data.badge || "assets/icons/badge-72x72.png",
    vibrate: data.vibrate || [200, 100, 200],
    requireInteraction: data.requireInteraction ?? true, // Mantém a notificação presa até interação
    data: {
      url: notificationUrl, // ✅ USA A URL CORRIGIDA
      originalData: data, // Para debug futuro
    },

    // ANDROID HEADS-UP PUSH 🔥🔥🔥
    // Deixa como push prioridade máxima, igual Instagram
    tag: data.tag || "tudu-push",
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

  console.log("[SW] Opções da notificação:", options);

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// ==========================
//   CLICK NA NOTIFICAÇÃO
// ==========================
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notificação clicada:", event.notification);

  // 🔍 DEBUG: Log dos dados da notificação
  console.log("[SW] Dados da notificação:", event.notification.data);

  const urlToOpen = event.notification.data?.url || "https://use-tudu.com.br";
  console.log("[SW] URL que será aberta:", urlToOpen);

  event.notification.close();

  // Abre ou foca aba já aberta
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientsList) => {
        console.log("[SW] Abas abertas encontradas:", clientsList.length);

        // Tenta focar em uma aba já aberta com a mesma URL
        for (const client of clientsList) {
          console.log("[SW] Verificando aba:", client.url);
          if (client.url.includes("use-tudu.com.br") && "focus" in client) {
            console.log("[SW] Focando aba existente:", client.url);
            return client.focus();
          }
        }

        // Se não encontrou, abre nova aba
        console.log("[SW] Abrindo nova aba com URL:", urlToOpen);
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
      .catch((error) => {
        console.error("[SW] Erro ao abrir URL:", error);
        // Fallback: abre a URL principal
        return clients.openWindow("https://use-tudu.com.br");
      })
  );
});

// ==========================
//   FALHA NO ENVIO DO PUSH (Opcional)
// ==========================
self.addEventListener("pushsubscriptionchange", (event) => {
  console.log("[SW] Subscription change:", event);
  // Aqui você pode recriar a subscription se expirar
});
