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

  // ✅ DETECÇÃO DE PLATAFORMA
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  console.log("[SW] Plataforma detectada:", isIOS ? "iOS" : "Android/Desktop");

  // 🔥 CONFIGURAÇÃO UNIVERSAL + ESPECÍFICA iOS
  const options = {
    body: data.body,
    icon: data.icon || "assets/icons/icon-192x192.png",
    badge: data.badge || "assets/icons/badge-72x72.png",

    // ✅ CONFIGURAÇÕES CROSS-PLATFORM
    tag: data.tag || "tudu-push-" + Date.now(),
    renotify: true,

    // ✅ DADOS PARA NAVEGAÇÃO
    data: {
      url: notificationUrl,
      cardId: data.data?.cardId,
      categoria: data.data?.categoria,
      timestamp: new Date().toISOString(),
    },
  };

  // ✅ CONFIGURAÇÕES ESPECÍFICAS ANDROID/DESKTOP
  if (!isIOS) {
    // Android/Desktop suportam mais features
    options.requireInteraction = true; // Mantém na tela até interação
    options.vibrate = [300, 100, 400, 100, 400]; // Vibração
    options.sound = data.sound || "/assets/sounds/notification.mp3";

    // Ações rápidas (Android/Desktop)
    options.actions = [
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
    ];

    // Flag adicional para Android/Desktop
    options.data.isHeadsUp = true;
  } else {
    // ✅ CONFIGURAÇÕES ESPECÍFICAS iOS
    console.log("[SW] Aplicando configurações específicas para iOS");
    // iOS tem limitações: não suporta vibrate, requireInteraction, actions customizadas
    // Manter configurações mínimas e compatíveis
  }

  console.log("[SW] Opções da notificação:", options);

  // 🔥 MOSTRA A NOTIFICAÇÃO
  event.waitUntil(
    self.registration
      .showNotification(data.title, options)
      .then(() => {
        console.log(
          `[SW] Notificação exibida com sucesso para ${
            isIOS ? "iOS" : "Android/Desktop"
          }!`
        );
      })
      .catch((error) => {
        console.error("[SW] Erro ao exibir notificação:", error);
      })
  );
});

// ==========================
//   CLICK NA NOTIFICAÇÃO
// ==========================
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicada:", event);

  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};

  console.log("[SW] Ação executada:", action);
  console.log("[SW] Dados da notificação:", data);

  notification.close();

  let urlToOpen = data.url || "https://use-tudu.com.br";

  // ✅ TRATA DIFERENTES AÇÕES (Android/Desktop)
  if (action === "view_card" && data.cardId) {
    urlToOpen = `/tudu-professional/card-details/${data.cardId}`;
  } else if (action === "open") {
    urlToOpen = "/tudu-professional/home";
  }
  // No iOS, action geralmente é undefined (click direto)

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
  console.log("[SW] Notification fechada:", event.notification);
  // Aqui você pode registrar analytics, etc.
});

// ==========================
//   INSTALAÇÃO DO SERVICE WORKER
// ==========================
self.addEventListener("install", (event) => {
  console.log("[SW] Service Worker instalado");
  self.skipWaiting(); // Ativa imediatamente
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker ativado");
  return self.clients.claim(); // Toma controle de todas as abas
});
