// pwa-debug.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PwaDebugService {
  debugPWA(): void {
    const checks = {
      '🌐 URL': window.location.href,
      '📱 User Agent': navigator.userAgent,
      '🔧 Service Worker': !!navigator.serviceWorker,
      '📡 Service Worker Controller': !!navigator.serviceWorker?.controller,
      '🎯 Display Mode': this.getDisplayMode(),
      '📋 Manifest': !!document.querySelector('link[rel="manifest"]'),
      '🎨 Theme Color':
        document
          .querySelector('meta[name="theme-color"]')
          ?.getAttribute('content') || 'Não definido',
      '📲 Standalone': window.matchMedia('(display-mode: standalone)').matches,
      '📦 BeforeInstallPrompt': 'beforeinstallprompt' in window,
      '🔔 Notification Permission': Notification.permission,
    };

    console.table(checks);

    // Verificar manifest
    const manifestLink = document.querySelector(
      'link[rel="manifest"]'
    ) as HTMLLinkElement;
    if (manifestLink) {
      fetch(manifestLink.href)
        .then((response) => response.json())
        .then((manifest) => {
          console.log('📄 Manifest carregado:', manifest);
        })
        .catch((error) => {
          console.error('❌ Erro ao carregar manifest:', error);
        });
    }

    // Verificar service worker
    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          console.log('⚙️ Service Worker registrado:', registration);
          console.log('📁 Scope:', registration.scope);
          console.log('🔄 Waiting:', registration.waiting);
          console.log('🎯 Active:', registration.active);
        } else {
          console.log('❌ Nenhum Service Worker registrado');
        }
      });
    }
  }

  private getDisplayMode(): string {
    if (window.matchMedia('(display-mode: standalone)').matches)
      return 'standalone';
    if (window.matchMedia('(display-mode: fullscreen)').matches)
      return 'fullscreen';
    if (window.matchMedia('(display-mode: minimal-ui)').matches)
      return 'minimal-ui';
    return 'browser';
  }
}
