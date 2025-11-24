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

  console.log("[SW] Payload recebido:", data);

  const notificationUrl =
    data.url || data.data?.url || "https://use-tudu.com.br";

  // 🔥 CONFIGURAÇÃO PARA HEADS-UP NOTIFICATIONS
  const options = {
    body: data.body,
    icon: data.icon || "assets/icons/icon-192x192.png",
    badge: data.badge || "assets/icons/badge-72x72.png",

    // ✅ CONFIGURAÇÕES PARA HEADS-UP (APARECER COMO POPUP)
    requireInteraction: true, // Mantém na tela até interação
    tag: data.tag || "tudu-push-" + Date.now(), // Tag única para não agrupar
    renotify: true,

    // ✅ VIBRAÇÃO (Android)
    vibrate: [300, 100, 400, 100, 400], // Padrão longo para chamar atenção

    // ✅ SOM (se suportado)
    sound: data.sound || "/assets/sounds/notification.mp3",

    // ✅ AÇÕES RÁPIDAS
    actions: [
      {
        action: "open",
        title: "📱 Abrir App",
        icon: "/assets/icons/open-72x72.png",
      },
      {
        action: "view_card",
        title: "👀 Ver Pedido",
        icon: "/assets/icons/eye-72x72.png",
      },
    ],

    // ✅ DADOS PARA NAVEGAÇÃO
    data: {
      url: notificationUrl,
      cardId: data.data?.cardId,
      categoria: data.data?.categoria,
      isHeadsUp: true, // Flag para identificar que é heads-up
      timestamp: new Date().toISOString(),
    },

    // ✅ CONFIGURAÇÕES ESPECÍFICAS ANDROID
    // Alguns browsers Android precisam destas configurações extras
    android: {
      icon: data.icon || "assets/icons/icon-192x192.png",
      badge: data.badge || "assets/icons/badge-72x72.png",
      channelId: "tudu-heads-up", // Canal de notificação específico
      vibrate: [300, 100, 400, 100, 400],
    },

    // ✅ CONFIGURAÇÕES ESPECÍFICAS IOS (se aplicável)
    ios: {
      sound: data.sound || "default",
      badge: 1,
    },
  };

  console.log("[SW] Opções da notificação (HEADS-UP):", options);

  // 🔥 MOSTRA A NOTIFICAÇÃO COMO HEADS-UP
  event.waitUntil(
    self.registration
      .showNotification(data.title, options)
      .then(() => {
        console.log("[SW] Heads-up notification exibida com sucesso!");
      })
      .catch((error) => {
        console.error("[SW] Erro ao exibir heads-up:", error);
      })
  );
});

// ==========================
//   CLICK NA NOTIFICAÇÃO HEADS-UP
// ==========================
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Heads-up notification clicada:", event);

  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};

  console.log("[SW] Ação executada:", action);
  console.log("[SW] Dados da notificação:", data);

  notification.close();

  let urlToOpen = data.url || "https://use-tudu.com.br";

  // ✅ TRATA DIFERENTES AÇÕES
  if (action === "view_card" && data.cardId) {
    urlToOpen = `/tudu-professional/card-details/${data.cardId}`;
  } else if (action === "open") {
    urlToOpen = "/tudu-professional/home";
  }

  console.log("[SW] URL final que será aberta:", urlToOpen);

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        console.log("[SW] Abas abertas encontradas:", clientList.length);

        // Tenta focar em aba existente
        for (const client of clientList) {
          if (client.url.includes("use-tudu.com.br") && "focus" in client) {
            console.log("[SW] Focando aba existente");

            // Se a aba já está na URL correta, só foca
            if (client.url.includes(urlToOpen)) {
              return client.focus();
            } else {
              // Se não está, navega para a URL e foca
              client.postMessage({
                type: "NAVIGATE_TO",
                url: urlToOpen,
              });
              return client.focus();
            }
          }
        }

        // Se não encontrou aba, abre nova
        console.log("[SW] Abrindo nova aba com URL:", urlToOpen);
        if (clients.openWindow) {
          return clients.openWindow(self.location.origin + urlToOpen);
        }
      })
      .catch((error) => {
        console.error("[SW] Erro ao abrir URL:", error);
        return clients.openWindow("https://use-tudu.com.br");
      })
  );
});

// ==========================
//   FECHAR NOTIFICAÇÃO
// ==========================
self.addEventListener("notificationclose", (event) => {
  console.log("[SW] Heads-up notification fechada:", event.notification);
  // Aqui você pode registrar analytics, etc.
});
