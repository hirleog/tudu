// ==========================
//   MENSAGEM PARA CLIENTE
// ==========================
self.addEventListener("message", (event) => {
  console.log("[SW] Mensagem recebida do cliente:", event.data);

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ==========================
//   INSTALAÇÃO DO SERVICE WORKER
// ==========================
self.addEventListener("install", (event) => {
  console.log("[SW] Service Worker instalado");
  self.skipWaiting(); // Ativa imediatamente
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker ativado - assumindo controle");
  event.waitUntil(self.clients.claim()); // Toma controle de todas as abas
});

// ==========================
//   RECEBIMENTO DO PUSH
// ==========================
self.addEventListener("push", (event) => {
  console.log("[SW] Push recebido:", event);

  if (!event.data) {
    console.log("[SW] Push sem payload");
    return;
  }

  let data;
  try {
    data = event.data.json();
    console.log("[SW] Payload recebido:", data);
  } catch (error) {
    console.error("[SW] Erro ao parsear payload:", error);
    // Fallback para payload texto simples
    data = {
      title: "Tudü",
      body: event.data.text() || "Nova notificação",
      url: "https://use-tudu.com.br",
    };
  }

  const notificationUrl =
    data.url || data.data?.url || "https://use-tudu.com.br";

  // ✅ DETECÇÃO DE PLATAFORMA MAIS PRECISA
  const userAgent = navigator.userAgent || self.clientUserAgent || "";
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  const isOpera = /Opera Mini|OPiOS/.test(userAgent);

  console.log(
    "[SW] Plataforma detectada - iOS:",
    isIOS,
    "Safari:",
    isSafari,
    "Opera:",
    isOpera
  );

  // 🔥 CONFIGURAÇÃO BASE PARA TODAS AS PLATAFORMAS
  const baseOptions = {
    body: data.body || "Nova notificação",
    icon: data.icon || "/assets/icons/icon-192x192.png",
    badge: data.badge || "/assets/icons/badge-72x72.png",
    tag: data.tag || "tudu-push-" + Date.now(),
    renotify: true,
    data: {
      url: notificationUrl,
      cardId: data.data?.cardId,
      categoria: data.data?.categoria,
      timestamp: new Date().toISOString(),
      platform: isIOS ? "ios" : isSafari ? "safari" : "android",
    },
  };

  let finalOptions = { ...baseOptions };

  // ✅ CONFIGURAÇÕES ESPECÍFICAS POR PLATAFORMA
  if (isIOS || isSafari) {
    // 🍎 CONFIGURAÇÕES iOS/SAFARI (MAIS RESTRITAS)
    console.log("[SW] Aplicando configurações iOS/Safari");

    // iOS/Safari ignoram muitas opções, manter mínimo
    finalOptions = {
      ...baseOptions,
      // iOS pode suportar actions básicas, testar
      actions: data.actions || [
        {
          action: "open",
          title: "Abrir",
        },
      ],
    };
  } else {
    // 🤖 CONFIGURAÇÕES ANDROID/DESKTOP (COMPLETAS)
    console.log("[SW] Aplicando configurações Android/Desktop");

    finalOptions = {
      ...baseOptions,
      requireInteraction: true,
      vibrate: [300, 100, 400, 100, 400],
      sound: data.sound || "/assets/sounds/notification.mp3",
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
      data: {
        ...baseOptions.data,
        isHeadsUp: true,
        supportsActions: true,
      },
    };
  }

  // 🎯 CONFIGURAÇÕES ESPECIAIS PARA OPERA MINI
  if (isOpera) {
    console.log("[SW] Aplicando configurações Opera Mini");
    // Opera Mini tem limitações extremas
    finalOptions.actions = undefined;
    finalOptions.vibrate = undefined;
    finalOptions.requireInteraction = false;
  }

  console.log("[SW] Opções finais da notificação:", finalOptions);

  // 🔥 MOSTRA A NOTIFICAÇÃO COM FALLBACK
  event.waitUntil(
    self.registration
      .showNotification(data.title || "Tudü", finalOptions)
      .then(() => {
        console.log(`[SW] ✅ Notificação exibida com sucesso!`);

        // ✅ ENVIAR CONFIRMAÇÃO PARA O CLIENTE (opcional)
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "NOTIFICATION_DISPLAYED",
              payload: data,
              timestamp: new Date().toISOString(),
            });
          });
        });
      })
      .catch((error) => {
        console.error("[SW] ❌ Erro ao exibir notificação:", error);

        // 🆘 FALLBACK: Tentar com opções mínimas
        const fallbackOptions = {
          body: data.body,
          icon: "/assets/icons/icon-192x192.png",
          data: { url: notificationUrl },
        };

        return self.registration.showNotification(
          data.title || "Tudü",
          fallbackOptions
        );
      })
  );
});

// ==========================
//   CLICK NA NOTIFICAÇÃO
// ==========================
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] 🔔 Notification clicada:", event);

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
  } else if (!action) {
    // Click direto na notificação (iOS/Safari)
    if (data.cardId) {
      urlToOpen = `/tudu-professional/card-details/${data.cardId}`;
    } else {
      urlToOpen = "/tudu-professional/home";
    }
  }

  console.log("[SW] Navegando para:", urlToOpen);

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        console.log("[SW] Abas abertas encontradas:", clientList.length);

        // 🔍 Tenta focar em aba existente
        for (const client of clientList) {
          if (client.url.includes("use-tudu.com.br") && "focus" in client) {
            console.log("[SW] Focando aba existente:", client.url);

            // Enviar comando de navegação
            client.postMessage({
              type: "NAVIGATE_TO",
              url: urlToOpen,
              timestamp: new Date().toISOString(),
            });

            return client.focus();
          }
        }

        // 🆕 Se não encontrou aba, abre nova
        console.log("[SW] Abrindo nova aba:", urlToOpen);
        if (clients.openWindow) {
          const fullUrl = self.location.origin + urlToOpen;
          console.log("[SW] URL completa:", fullUrl);
          return clients.openWindow(fullUrl);
        }
      })
      .catch((error) => {
        console.error("[SW] ❌ Erro ao abrir URL:", error);
        // Fallback absoluto
        return clients.openWindow("https://use-tudu.com.br");
      })
  );
});

// ==========================
//   FECHAR NOTIFICAÇÃO
// ==========================
self.addEventListener("notificationclose", (event) => {
  console.log("[SW] Notification fechada:", event.notification);

  // 📊 Analytics: registrar fechamento de notificação
  const data = event.notification.data || {};
  console.log(
    "[SW] Notificação fechada - Duração:",
    new Date() - new Date(data.timestamp)
  );
});

// ==========================
//   BACKGROUND SYNC (FUTURO)
// ==========================
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync:", event.tag);

  if (event.tag === "notification-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implementar sync de notificações pendentes
  console.log("[SW] Executando background sync...");
}
